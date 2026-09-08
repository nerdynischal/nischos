insert into public.settings_sections (
  id,
  label,
  display_title,
  body,
  details,
  items,
  sort_order
) values (
  'hobbies',
  'Hobbies',
  'Hobbies',
  '',
  '[
    {"label": "Currently exploring", "value": "AI tools & Front End Development"},
    {"label": "Currently reading", "value": "Building a Second Brain by Tiago Forte"},
    {"label": "Currently listening", "value": "Dive Club, How to be a Better Human"},
    {"label": "Currently playing", "value": "Dunk City Dynasty, PES"}
  ]'::jsonb,
  array[]::text[],
  20
)
on conflict (id) do update set
  label = excluded.label,
  display_title = excluded.display_title,
  body = excluded.body,
  details = excluded.details,
  items = excluded.items,
  sort_order = excluded.sort_order;
