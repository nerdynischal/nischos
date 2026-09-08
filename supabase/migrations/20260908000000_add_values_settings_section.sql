insert into public.settings_sections (
  id,
  label,
  display_title,
  display_subtitle,
  body,
  details,
  items,
  sort_order
) values (
  'values',
  'Values',
  'Values',
  'Design Principles',
  '',
  '[]'::jsonb,
  array[
    'Design with intention',
    'Design with integrity',
    'Design with curiosity',
    'Design with simplicity',
    'Design with empathy'
  ],
  10
)
on conflict (id) do update set
  label = excluded.label,
  display_title = excluded.display_title,
  display_subtitle = excluded.display_subtitle,
  body = excluded.body,
  details = excluded.details,
  items = excluded.items,
  sort_order = excluded.sort_order;
