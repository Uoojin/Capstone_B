-- Run inspect.sql first. Any incompatible existing schema stops this transaction.
begin;

do $$
declare
  incompatible_columns text;
begin
  if to_regclass('public.guestbook_entries') is not null then
    select string_agg(expected.name, ', ') into incompatible_columns
    from (values
      ('id', 'uuid'), ('type', 'text'), ('to_name', 'text'),
      ('from_name', 'text'), ('message', 'text'), ('frame_color', 'text'),
      ('image_path', 'text'), ('image_url', 'text'), ('qr_image_path', 'text'),
      ('created_at', 'timestamp with time zone')
    ) as expected(name, data_type)
    left join information_schema.columns actual
      on actual.table_schema = 'public'
      and actual.table_name = 'guestbook_entries'
      and actual.column_name = expected.name
    where actual.data_type is distinct from expected.data_type;

    if incompatible_columns is not null then
      raise exception 'Existing guestbook_entries has missing/incompatible columns: %. No changes applied. Inspect the existing schema before migrating.', incompatible_columns;
    end if;
  end if;

  if exists (
    select 1 from storage.buckets where id = 'guestbook-images'
      and (public is distinct from true
        or file_size_limit is distinct from 8388608::bigint
        or allowed_mime_types is null
        or not (allowed_mime_types @> array['image/png', 'image/jpeg', 'image/webp']::text[])
        or not (allowed_mime_types <@ array['image/png', 'image/jpeg', 'image/webp']::text[]))
  ) then
    raise exception 'Existing guestbook-images bucket has different settings. No changes applied. Inspect it before changing public access or upload limits.';
  end if;
end $$;

create table if not exists public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('photo', 'message')),
  to_name text not null check (char_length(to_name) <= 40),
  from_name text not null check (char_length(from_name) <= 40),
  message text not null,
  frame_color text not null,
  image_path text,
  image_url text,
  qr_image_path text,
  created_at timestamptz not null default now(),
  constraint guestbook_message_length check (
    (type = 'photo' and char_length(message) <= 50)
    or
    (type = 'message' and char_length(message) between 10 and 250)
  )
);

alter table public.guestbook_entries enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert on public.guestbook_entries to anon, authenticated;

do $$
begin
if not exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'guestbook_entries' and policyname = 'Public can read guestbook entries') then
create policy "Public can read guestbook entries"
on public.guestbook_entries
for select
to anon, authenticated
using (true);
end if;

if not exists (select 1 from pg_policies where schemaname = 'public'
  and tablename = 'guestbook_entries' and policyname = 'Public can insert guestbook entries') then
create policy "Public can insert guestbook entries"
on public.guestbook_entries
for insert
to anon, authenticated
with check (
  type in ('photo', 'message')
  and char_length(to_name) between 1 and 40
  and char_length(from_name) between 1 and 40
  and frame_color ~ '^#[0-9a-fA-F]{6}$'
  and (
    (type = 'message' and char_length(message) between 10 and 250
      and image_path is null and image_url is null and qr_image_path is null)
    or (type = 'photo' and char_length(message) <= 50
      and image_path like 'polaroids/%'
      and image_url is not null and qr_image_path = image_path)
  )
);
end if;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'guestbook-images',
  'guestbook-images',
  true,
  8388608,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

do $$
begin
if not exists (select 1 from pg_policies where schemaname = 'storage'
  and tablename = 'objects' and policyname = 'Public can read guestbook images') then
create policy "Public can read guestbook images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'guestbook-images');
end if;

if not exists (select 1 from pg_policies where schemaname = 'storage'
  and tablename = 'objects' and policyname = 'Public can upload guestbook images') then
create policy "Public can upload guestbook images"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'guestbook-images'
  and (storage.foldername(name))[1] in ('polaroids')
);
end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'guestbook_entries'
  ) then
    alter publication supabase_realtime add table public.guestbook_entries;
  end if;
end $$;

notify pgrst, 'reload schema';
commit;
