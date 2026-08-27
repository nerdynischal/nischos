update public.projects
set screenshots = array_replace(
  screenshots,
  '/project-media/still/still-preview.png',
  '/project-media/still/still-preview.webp'
)
where id = 'still'
  and screenshots @> array['/project-media/still/still-preview.png']::text[];
