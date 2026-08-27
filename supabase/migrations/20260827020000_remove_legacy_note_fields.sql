-- Values from these columns are preserved in
-- supabase/archive/20260827_legacy_note_fields.json.

update public.blog_posts
set content_markdown = coalesce(
  nullif(btrim(content_markdown), ''),
  array_to_string(content, E'\n\n'),
  ''
)
where content_markdown is null
   or btrim(content_markdown) = '';

alter table public.blog_posts
  alter column content_markdown set default '',
  alter column content_markdown set not null,
  drop column if exists filename,
  drop column if exists cover_tone,
  drop column if exists content;
