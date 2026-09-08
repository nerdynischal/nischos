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
  'contact',
  'Contact',
  'Contact',
  'Get in touch',
  '',
  '[
    {"label": "Email", "value": "test@example.test"},
    {"label": "LinkedIn", "value": "linkedin.com", "href": "https://www.linkedin.com/"},
    {"label": "GitHub", "value": "github.com", "href": "https://github.com/"}
  ]'::jsonb,
  array[]::text[],
  40
)
on conflict (id) do update set
  label = excluded.label,
  display_title = excluded.display_title,
  display_subtitle = excluded.display_subtitle,
  body = excluded.body,
  details = excluded.details,
  items = excluded.items,
  sort_order = excluded.sort_order;
