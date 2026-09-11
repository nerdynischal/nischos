import { Profiler, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src/App'
import { ThemeProvider } from '../src/theme/ThemeProvider'
import '../src/index.css'

declare const __PROFILE_VARIANT__: string

const results = document.querySelector<HTMLPreElement>('#profile-results')!
let recording = false
let dragging = false
let frame = 0
let previousFrame = 0
let samples: number[] = []
let commits = 0
let reactMs = 0
let dragCount = 0
let longTasks: number[] = []

const supportsLongTasks = PerformanceObserver.supportedEntryTypes.includes('longtask')
if (supportsLongTasks) {
  new PerformanceObserver((list) => {
    if (recording) longTasks.push(...list.getEntries().map((entry) => entry.duration))
  }).observe({ type: 'longtask', buffered: false })
}

function sample(now: number) {
  if (!dragging) return
  if (previousFrame) samples.push(now - previousFrame)
  previousFrame = now
  frame = requestAnimationFrame(sample)
}

function finishDrag() {
  cancelAnimationFrame(frame)
  dragging = false
  previousFrame = 0
}

document.addEventListener('pointerdown', (event) => {
  const target = event.target as HTMLElement
  if (!recording || !target.closest('.window-titlebar') || target.closest('button')) return
  dragging = true
  dragCount += 1
  previousFrame = 0
  frame = requestAnimationFrame(sample)
}, true)

for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  // Include the release commit, which React flushes after its event handler.
  document.addEventListener(event, () => {
    if (dragging) setTimeout(finishDrag, 0)
  })
}

document.querySelector('#profile-start')!.addEventListener('click', () => {
  finishDrag()
  samples = []
  longTasks = []
  commits = 0
  reactMs = 0
  dragCount = 0
  recording = true
  results.textContent = 'Recording. Drag the same window back and forth, then stop.'
})

document.querySelector('#profile-stop')!.addEventListener('click', () => {
  finishDrag()
  recording = false
  const sorted = [...samples].sort((a, b) => a - b)
  const rounded = (value: number) => Number(value.toFixed(2))
  results.textContent = JSON.stringify({
    variant: __PROFILE_VARIANT__,
    mode: 'React development profiling; identical content and instrumentation',
    visibility: document.visibilityState,
    viewport: [innerWidth, innerHeight],
    openWindows: document.querySelectorAll('.window').length,
    mountedImages: document.querySelectorAll('.window img').length,
    dragCount,
    frameSamples: samples.length,
    medianFrameMs: rounded(sorted[Math.floor(sorted.length * 0.5)] ?? 0),
    p95FrameMs: rounded(sorted[Math.floor(sorted.length * 0.95)] ?? 0),
    maxFrameMs: rounded(sorted.at(-1) ?? 0),
    framesOver25Ms: samples.filter((ms) => ms > 25).length,
    reactCommitsDuringDrags: commits,
    reactRenderMsDuringDrags: rounded(reactMs),
    longTasks: supportsLongTasks ? longTasks.map(rounded) : 'Not supported by this browser',
  }, null, 2)
})

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <Profiler id="desktop" onRender={(_id, _phase, actualDuration) => {
      if (recording && dragging) { commits += 1; reactMs += actualDuration }
    }}>
      <ThemeProvider><App /></ThemeProvider>
    </Profiler>
  </StrictMode>,
)
