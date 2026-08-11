alter table public.projects add column if not exists model text;

update public.projects
set model = case id
  when 'keyform' then 'GPT-5.6 Sol'
  when 'my-toolkit' then 'GPT-5.5'
  when 'maneki-neko-catalog' then 'GPT-5.5'
  else model
end
where id in ('keyform', 'my-toolkit', 'maneki-neko-catalog');
