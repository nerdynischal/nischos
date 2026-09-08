update public.settings_sections
set
  display_subtitle = 'Current interests',
  details = '[
    {"label": "Exploring", "value": "AI tools & Front End Development"},
    {"label": "Reading", "value": "Building a Second Brain by Tiago Forte"},
    {"label": "Listening", "value": "Dive Club, How to be a Better Human"},
    {"label": "Playing", "value": "Dunk City Dynasty, PES"}
  ]'::jsonb
where id = 'hobbies';
