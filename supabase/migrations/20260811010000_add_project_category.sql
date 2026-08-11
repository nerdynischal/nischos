alter table public.projects add column if not exists category text;

update public.projects
set category = type
where category is null
  and type is not null;

-- Keep the legacy type column for backwards compatibility. The application
-- reads category first and only falls back to type during the migration window.
