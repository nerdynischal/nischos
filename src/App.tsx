import { useEffect, useRef, useState } from 'react'
import './styles/app.css'
import { DesktopExperience } from './desktop/DesktopExperience'
import { LockScreen } from './features/entry/LockScreen'
import {
  hasEntrySession,
  markEntrySessionEntered,
} from './features/entry/entrySession'

// Safety net for browsers that suppress transitionend (for example, hidden tabs).
const ENTRY_EXIT_FALLBACK_MS = 1000
const ENTRY_LOAD_MS = 300

type EntryState = 'locked' | 'loading' | 'unlocking' | 'entered'

function getInitialEntryState(): EntryState {
  return hasEntrySession() ? 'entered' : 'locked'
}

function App() {
  const [entryState, setEntryState] = useState<EntryState>(getInitialEntryState)
  const entryTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (entryState !== 'loading') return

    // Schedule after the desktop has committed, then allow a painted frame
    // before revealing it, even when mounting took longer than expected.
    let frameId: number | null = null
    const timer = window.setTimeout(() => {
      frameId = window.requestAnimationFrame(() => {
        frameId = window.requestAnimationFrame(() => {
          markEntrySessionEntered()
          setEntryState('unlocking')
        })
      })
    }, ENTRY_LOAD_MS)
    return () => {
      window.clearTimeout(timer)
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [entryState])

  useEffect(() => {
    if (entryState !== 'unlocking') return
    entryTimerRef.current = window.setTimeout(() => {
      setEntryState('entered')
    }, ENTRY_EXIT_FALLBACK_MS)
    return () => {
      if (entryTimerRef.current !== null) window.clearTimeout(entryTimerRef.current)
      entryTimerRef.current = null
    }
  }, [entryState])

  function enterDesktop() {
    if (entryState !== 'locked') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      markEntrySessionEntered()
      setEntryState('entered')
      return
    }

    setEntryState('loading')

  }

  const isUnlocking = entryState === 'unlocking'
  const isDesktopMounted = entryState !== 'locked'

  return (
    <>
      {isDesktopMounted ? (
        <DesktopExperience isEntering={isUnlocking} isPreparing={entryState === 'loading'} />
      ) : null}

      {entryState !== 'entered' ? (
        <LockScreen
          isLoading={entryState === 'loading'}
          isExiting={isUnlocking}
          onEnter={enterDesktop}
          onExitComplete={() => setEntryState('entered')}
        />
      ) : null}
    </>
  )
}

export default App
