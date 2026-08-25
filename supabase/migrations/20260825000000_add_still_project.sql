insert into public.projects (
  id,
  title,
  subtitle,
  icon_tone,
  thumbnail,
  type,
  model,
  story,
  screenshots,
  demo_url,
  source_url
) values (
  'still',
  'Still',
  'A private, local-first visual library for websites worth remembering.',
  'coral',
  '/project-media/still/icon.png',
  'desktop app',
  'GPT-5.6 Sol',
  'Still captures full-page website screenshots, extracts useful metadata, and organises everything into a searchable personal collection stored entirely on the Mac.',
  array[
    '/project-media/still/still-preview.png'
  ],
  null,
  null
)
on conflict (id) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  icon_tone = excluded.icon_tone,
  thumbnail = excluded.thumbnail,
  type = excluded.type,
  model = excluded.model,
  story = excluded.story,
  screenshots = excluded.screenshots,
  demo_url = excluded.demo_url,
  source_url = excluded.source_url;
