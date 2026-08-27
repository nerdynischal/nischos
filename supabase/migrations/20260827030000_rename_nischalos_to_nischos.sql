-- Rename the portfolio brand in live content after the application rename.

update public.projects
set post_id = 'welcome-to-nischos'
where post_id = 'welcome-to-nischalos';

update public.blog_posts
set id = 'welcome-to-nischos'
where id = 'welcome-to-nischalos';

update public.blog_posts
set
  title = replace(title, 'nischalOS', 'nischOS'),
  content_markdown = replace(content_markdown, 'nischalOS', 'nischOS')
where title like '%nischalOS%'
   or content_markdown like '%nischalOS%';

update public.settings_sections
set details = replace(details::text, 'nischalOS', 'nischOS')::jsonb
where details::text like '%nischalOS%';
