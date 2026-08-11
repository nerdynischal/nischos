import { useEffect, useRef, useState } from 'react'
import './styles/app.css'
import { DesktopExperience } from './desktop/DesktopExperience'
import { LockScreen } from './features/entry/LockScreen'
import {
  hasEntrySession,
  markEntrySessionEntered,
} from './features/entry/entrySession'
import { useClock } from './hooks/useClock'

const ENTRY_EXIT_MS = 360
const ENTRY_LOAD_MS = 1200

type EntryState = 'locked' | 'loading' | 'unlocking' | 'entered'

function getInitialEntryState(): EntryState {
  return hasEntrySession() ? 'entered' : 'locked'
}

function App() {
  const [entryState, setEntryState] = useState<EntryState>(getInitialEntryState)
  const entryTimerRef = useRef<number | null>(null)
  const dateTime = useClock()

  useEffect(() => {
    return () => {
      if (entryTimerRef.current !== null) {
        window.clearTimeout(entryTimerRef.current)
      }
    }
  }, [])

  function enterDesktop() {
    if (entryState !== 'locked') return

    setEntryState('loading')
    entryTimerRef.current = window.setTimeout(() => {
      markEntrySessionEntered()
      setEntryState('unlocking')
      entryTimerRef.current = window.setTimeout(() => {
        setEntryState('entered')
        entryTimerRef.current = null
      }, ENTRY_EXIT_MS)
    }, ENTRY_LOAD_MS)
  }

  const isUnlocking = entryState === 'unlocking'
  const isDesktopMounted = isUnlocking || entryState === 'entered'

  return (
    <>
      {isDesktopMounted ? (
        <DesktopExperience dateTime={dateTime} isEntering={isUnlocking} />
      ) : null}

      {entryState !== 'entered' ? (
        <LockScreen
          dateTime={dateTime}
          isLoading={entryState === 'loading'}
          isExiting={isUnlocking}
          onEnter={enterDesktop}
        />
      ) : null}
    </>
  )
}

export default App
