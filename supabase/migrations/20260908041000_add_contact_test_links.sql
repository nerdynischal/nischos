update public.settings_sections
set details = '[
  {"label": "Email", "value": "test@example.test"},
  {"label": "LinkedIn", "value": "linkedin.com", "href": "https://www.linkedin.com/"},
  {"label": "GitHub", "value": "github.com", "href": "https://github.com/"}
]'::jsonb
where id = 'contact';
