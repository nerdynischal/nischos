# Desktop optimisation measurements — 10 September 2026

## Method

Measured the actual desktop in the Codex in-app browser at 1280 × 720, with
seven open windows and 64 mounted images: Selected Work, Auto Gmail, Donor Hub,
Vocal Email, Freeguides, Notes, and About. Auto Gmail was the frontmost window.
Each run used twelve alternating horizontal title-bar drags, moving the pointer
between (300, 70) and (550, 70). Both versions used the same content, CSS, browser,
and instrumentation. Both pages reported `document.visibilityState = visible`.

The baseline substitutes only `useDesktopWindows.ts` from commit `edfcd04`;
everything else is the current working tree. This isolates the change from
per-pointer React state updates to animation-frame painting and a release commit.
The original hook was read into a temporary file; no baseline source was restored
over the working tree. There were three runs per version, with interleaved order:
baseline, current, current, baseline, baseline, current.

React's development Profiler measures commits and render duration during each
gesture, including the release commit. A separate requestAnimationFrame sampler
measures frame callback intervals during the gesture. The observer also records
long tasks during the measurement session where supported.

## Results

| Version | Run | Frame samples | Median frame interval | p95 frame interval | Max frame interval | React commits during drags | React render time |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Baseline | 1 | 117 | 16.7 ms | 17.6 ms | 17.8 ms | 97 | 633.8 ms |
| Baseline | 2 | 113 | 16.7 ms | 17.6 ms | 17.8 ms | 96 | 563.2 ms |
| Baseline | 3 | 116 | 16.7 ms | 17.5 ms | 17.7 ms | 97 | 598.4 ms |
| Current | 1 | 96 | 16.7 ms | 17.7 ms | 17.7 ms | 15 | 261.8 ms |
| Current | 2 | 97 | 16.7 ms | 17.6 ms | 17.7 ms | 14 | 245.3 ms |
| Current | 3 | 96 | 16.7 ms | 17.6 ms | 17.7 ms | 14 | 236.9 ms |

Across the three runs, median React render time decreased from **598.4 ms to
245.3 ms (59.0%)**, and median commits decreased from **97 to 14 (85.6%)**.
No sampled frame interval exceeded 25 ms and no long-task entries were recorded.
The current version still commits the final position on release; occasional
clock updates can also commit during a gesture.

Both versions remained near a 16.7 ms frame interval on this machine. The result
is lower measured React work, not an observed frame-rate improvement. Profiler
durations exclude browser layout, paint, compositing, and GPU work. These are
development-mode measurements with React StrictMode and profiling overhead, not
production benchmarks or predictions for slower devices. Automated gesture
timing and frame sample counts varied slightly; frame callback intervals are a
responsiveness proxy rather than a compositor trace.

## Reproducing

Start the current version:

```sh
npm run dev -- --config scripts/profile-vite.config.ts --port 5174 --strictPort
```

For the historical drag comparison, copy the hook to a temporary file and start
a second server. The baseline config uses that source only when compiling the
window hook; it does not modify application files:

```sh
git show edfcd04:src/hooks/useDesktopWindows.ts > /tmp/nischos-baseline-hook.ts
PROFILE_BASELINE_HOOK=/tmp/nischos-baseline-hook.ts npm run dev -- --config scripts/profile-vite.config.ts --port 5175 --strictPort
```

Open `/scripts/profile-desktop.html` on each server, unlock, open the workload
above, and let the readers and visible images load. Focus Auto Gmail, select
**Start measurement**, perform the twelve drags, and select **Stop measurement**.
The panel displays JSON metrics. Keep viewport, workload, theme, and device
consistent. The harness and baseline substitution are excluded from the normal
production entry point.

## Remaining optimisation work completed

- Remote note lists now exclude `content_markdown`. Only the selected note's body
  is fetched; successful bodies are cached for five minutes with a 50-note limit.
  Concurrent requests share a promise. Failed requests can be retried and use a
  matching local fallback when available. The query and selection behaviour have
  automated regression tests, including late responses and empty bodies.
- Removed `public/folder-icon-v1.png` (985,285 bytes). The active folder artwork
  is version 2. The removed version had no runtime or content references; its only
  code mention was the media generator's exclusion. Other local artwork has
  references, and all generated variants are referenced by the current manifest.
  Full-size case-study sources remain available for zooming.
