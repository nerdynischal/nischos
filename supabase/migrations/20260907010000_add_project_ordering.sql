alter table public.projects add column if not exists sort_order integer;
alter table public.projects add column if not exists dock_order integer;

update public.projects
set sort_order = case id
  when 'workout-board' then 10
  when 'still' then 20
  when 'keyform' then 30
  when 'my-toolkit' then 40
  when 'maneki-neko-catalog' then 50
  else 1000
end
where sort_order is null;

update public.projects
set dock_order = case id
  when 'workout-board' then 10
  when 'still' then 20
  when 'keyform' then 30
  when 'my-toolkit' then 40
  when 'maneki-neko-catalog' then 50
end
where dock_order is null
  and id in (
    'workout-board',
    'still',
    'keyform',
    'my-toolkit',
    'maneki-neko-catalog'
  );

alter table public.projects
  alter column sort_order set default 1000,
  alter column sort_order set not null;

alter table public.projects
  drop constraint if exists projects_sort_order_nonnegative,
  add constraint projects_sort_order_nonnegative check (sort_order >= 0),
  drop constraint if exists projects_dock_order_nonnegative,
  add constraint projects_dock_order_nonnegative check (
    dock_order is null or dock_order >= 0
  );

create index if not exists projects_sort_order_idx
  on public.projects (sort_order, id);

create index if not exists projects_dock_order_idx
  on public.projects (dock_order, id)
  where dock_order is not null;
