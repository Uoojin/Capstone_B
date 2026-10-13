-- Run in the SQL Editor as the project owner. This does not insert/delete data.
-- Inspect actual policies and constraints before applying the guarded change below.
select policyname, roles, cmd, permissive, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'guestbook_entries';

select conname, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid = to_regclass('public.guestbook_entries');

select id, public, file_size_limit, allowed_mime_types
from storage.buckets where id = 'guestbook-images';

select policyname, roles, cmd, permissive, qual, with_check
from pg_policies where schemaname = 'storage' and tablename = 'objects';

-- Only relax the two name lower bounds of the existing known INSERT policy.
-- Keep its roles, upper bounds, image checks, color checks and all other conditions.
begin;
do $$
declare
  condition text;
  to_check text := 'char_length(to_name) >= 1';
  from_check text := 'char_length(from_name) >= 1';
begin
  select with_check into condition from pg_policies
  where schemaname = 'public' and tablename = 'guestbook_entries'
    and policyname = 'Public can insert guestbook entries' and cmd = 'INSERT';

  if condition is null then
    raise exception 'Expected INSERT policy not found. Inspect the actual policy; no changes applied.';
  end if;

  if position(to_check in condition) = 0 or position(from_check in condition) = 0 then
    raise exception 'Policy differs or already allows optional names. Inspect the output above; no changes applied.';
  end if;

  condition := replace(condition, to_check,
    'char_length(to_name) >= (case when type = ''photo'' then 0 else 1 end)');
  condition := replace(condition, from_check,
    'char_length(from_name) >= (case when type = ''photo'' then 0 else 1 end)');

  execute format('alter policy %I on public.guestbook_entries with check (%s)',
    'Public can insert guestbook entries', condition);
end $$;
commit;

-- Empty strings remain text, not NULL. Message-only entries still require names.
-- If an existing CHECK constraint or restrictive policy also requires nonempty
-- photo fields, review that specific definition instead of disabling RLS.
