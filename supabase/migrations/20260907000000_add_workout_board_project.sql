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
  'workout-board',
  'Workout Board',
  'A focused, local-first planner for a single training session.',
  'mint',
  '/project-media/workout-board/icon.svg',
  'Fitness',
  'GPT-5.6 Sol',
  'Workout Board keeps exercises, individual sets, reps, and weights together in one focused session view. Progress saves automatically in the browser, while a built-in countdown timer and stopwatch keep rest periods close at hand without requiring an account.',
  array[
    '/project-media/workout-board/workout-board-session.png',
    '/project-media/workout-board/workout-board-overview.png'
  ],
  'https://nerdynischal.github.io/workout-board/',
  'https://github.com/nerdynischal/workout-board'
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
