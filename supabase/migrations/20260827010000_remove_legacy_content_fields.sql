-- Values from these columns are preserved in
-- supabase/archive/20260827_legacy_content_fields.json.

alter table public.projects
  drop column if exists description,
  drop column if exists icon_label,
  drop column if exists stack;

alter table public.blog_posts
  drop column if exists cover_image,
  drop column if exists excerpt,
  drop column if exists size;
