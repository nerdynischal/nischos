import { useClock } from '../../hooks/useClock'
import { responsiveImage } from '../../lib/responsiveImage'
import { LockScreenWaterRipple } from './LockScreenWaterRipple'

type LockScreenProps = {
  isLoading: boolean
  isExiting: boolean
  onExitComplete: () => void
  onEnter: () => void
}

export function LockScreen({
  isLoading,
  isExiting,
  onEnter,
  onExitComplete,
}: LockScreenProps) {
  const dateTime = useClock()
  const shortTime = dateTime.time.slice(0, 5).replace(/^0/, '')

  return (
    <main
      className="lock-screen"
      aria-label="nischOS login"
      aria-hidden={isExiting || undefined}
      data-loading={isLoading || undefined}
      onTransitionEnd={(event) => {
        if (isExiting && event.target === event.currentTarget && event.propertyName === 'opacity') {
          onExitComplete()
        }
      }}
      data-exiting={isExiting || undefined}
      inert={isExiting}
    >
      <LockScreenWaterRipple isInteractive={!isLoading && !isExiting} />

      <header className="lock-screen-clock">
        <p>{dateTime.lockScreenDate}</p>
        <time dateTime={shortTime}>{shortTime}</time>
      </header>

      <section className="lock-screen-profile-region" aria-label="nischOS profile">
        <button
          type="button"
          className="lock-screen-profile"
          aria-label="Unlock nischOS"
          aria-busy={isLoading || undefined}
          data-loading={isLoading || undefined}
          autoFocus
          disabled={isLoading || isExiting}
          onClick={onEnter}
        >
          <span className="lock-screen-avatar" aria-hidden="true">
            <img {...responsiveImage('/about-icon.png', '144px')} alt="" />
          </span>
          <span className="lock-screen-name">nischOS</span>
          <span className="lock-screen-hint">Click to Unlock</span>
        </button>
        <div
          className="lock-screen-progress"
          data-active={isLoading || undefined}
          role={isLoading ? 'progressbar' : undefined}
          aria-label={isLoading ? 'Loading desktop' : undefined}
          aria-hidden={isLoading ? undefined : true}
        >
          <span className="lock-screen-progress-value" />
        </div>
      </section>
    </main>
  )
}
