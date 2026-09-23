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

After reviewing the generated manifest and SQL, inspect each screenshot and add
its [authored alternative](#screenshot-alternatives). The generator does not write
these descriptions; the regression suite checks coverage for published manifests.
For remote raster images, run `npm run media:sync` to refresh the checked-in
originals and mirror mapping before validation. Then run:

```bash
npm run check
```

Then:

1. Run the generated migration in the Supabase SQL editor.
2. Commit the manifest, migration, screenshot descriptions and any copied media,
   including the remote mirror mapping and originals when refreshed.
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

## Screenshot alternatives

Before publishing screenshots, inspect each image and add an entry to
`content/screenshot-alternatives.json`, keyed by its exact manifest URL or path.
Describe the task, state or design choice the image demonstrates; do not turn its
filename into prose. Each distinct image needs its own description. Known remote
URLs automatically share descriptions with the local mirrors listed in
`content/remote-media.json`; carousel order does not affect the mapping.

When changing an image at an existing URL, review its description too. New remote
assets without a reviewed entry use the project’s purpose as a fallback, which
must not replace this editorial review. Archive images and zoomable covers keep
their descriptions alongside their case-study content in
`src/content/legacyProjects.ts`. Decorative icons and repeated listing thumbnails
retain empty alternatives.

See [Accessibility: status and verification](accessibility.md) for the current
image-review scope and remaining manual checks.

## Related Notes content

Use logical Markdown headings: a leading title matching the note title is omitted, and remaining
level-one headings render as level two beneath the reader title. Avoid skipping
levels in authored content.
