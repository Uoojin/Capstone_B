-- Read only. Run before and after guestbook.sql in the SQL Editor.
select table_schema, table_name
from information_schema.tables
where table_schema = 'public' and table_type = 'BASE TABLE'
order by table_name;

select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'guestbook_entries'
order by ordinal_position;

select conname, pg_get_constraintdef(oid) as definition
from pg_constraint where conrelid = to_regclass('public.guestbook_entries');

select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets where id = 'guestbook-images';

select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where (schemaname = 'public' and tablename = 'guestbook_entries')
   or (schemaname = 'storage' and tablename = 'objects')
order by schemaname, tablename, policyname;

select grantee, privilege_type from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'guestbook_entries'
  and grantee in ('anon', 'authenticated')
order by grantee, privilege_type;

select relrowsecurity from pg_class
where oid = to_regclass('public.guestbook_entries');

select pubname, schemaname, tablename from pg_publication_tables
where pubname = 'supabase_realtime' and tablename = 'guestbook_entries';
