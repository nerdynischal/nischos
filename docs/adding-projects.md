# Adding a project

The project generator keeps the checked-in fallback and live Supabase record
based on the same answers.

## Recommended workflow

From the nischOS repository, run:

```bash
npm run project:add -- "/full/path/to/project"
```

The command inspects the target project's `package.json`, README, `index.html`,
Git remote, and common media locations. Press Enter to accept a detected value,
enter a replacement, or enter `-` to remove an optional default.

It creates:

- `content/projects/<project-id>.json`, the validated local fallback manifest.
- `supabase/migrations/<timestamp>_add_<project-id>_project.sql`, an idempotent
  insert/update for the live database.
- Local media under `public/project-media/<project-id>` when filesystem images
  are selected during the prompts.

The generated files never overwrite existing manifests, migrations, or media.

## What is detected

- Name and description from `package.json`, HTML metadata, or the README.
- Project story from the README's first prose paragraph.
- Source repository from `package.json` or the Git `origin` remote.
- A probable GitHub Pages URL when the source is a GitHub repository.
- An icon from common `public` and `src/assets` filenames.
- Screenshots placed in `screenshots`, `public/screenshots`, or
  `docs/screenshots` inside the project.

Every detected value remains editable. Project type, AI model, icon tone, and
placement are confirmed explicitly because they cannot be inferred reliably.

## Validate and publish

After reviewing the generated manifest and SQL:

```bash
npm run check
```

Then:

1. Run the generated migration in the Supabase SQL editor.
2. Commit the manifest, migration, and any copied media.
3. Push to `master` and wait for the GitHub Pages workflow to finish.
4. Open the live site and confirm the project metadata, artwork, placement, and
   Supabase connection indicator.

The dock supports five projects. When it is full, a new project is created as a
desktop-only item unless an existing project's `dockOrder` is removed first.

## Other modes

Run the guided workflow without inspecting another repository:

```bash
npm run project:add
```

Use an existing manifest-shaped JSON file or preview without writing:

```bash
npm run project:add -- --from ./project.json
npm run project:add -- --from ./project.json --dry-run
```
