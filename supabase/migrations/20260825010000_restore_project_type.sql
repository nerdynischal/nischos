alter table public.projects add column if not exists type text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'category'
  ) then
    execute 'update public.projects set type = category where type is null and category is not null';
  end if;
end;
$$;

alter table public.projects drop column if exists category;
