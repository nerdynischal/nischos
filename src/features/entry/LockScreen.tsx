import type { ClockValue } from '../../hooks/useClock'
import { resolveAssetUrl } from '../../lib/assetUrl'
import { LockScreenWaterRipple } from './LockScreenWaterRipple'

type LockScreenProps = {
  dateTime: ClockValue
  isLoading: boolean
  isExiting: boolean
  onEnter: () => void
}

export function LockScreen({
  dateTime,
  isLoading,
  isExiting,
  onEnter,
}: LockScreenProps) {
  const shortTime = dateTime.time.slice(0, 5).replace(/^0/, '')

  return (
    <main
      className="lock-screen"
      aria-label="nischalOS login"
      aria-hidden={isExiting || undefined}
      data-exiting={isExiting || undefined}
      inert={isExiting}
    >
      <LockScreenWaterRipple isInteractive={!isLoading && !isExiting} />

      <header className="lock-screen-clock">
        <p>{dateTime.lockScreenDate}</p>
        <time dateTime={shortTime}>{shortTime}</time>
      </header>

      <section className="lock-screen-profile-region" aria-label="nischalOS profile">
        <button
          type="button"
          className="lock-screen-profile"
          aria-label="Unlock nischalOS"
          aria-busy={isLoading || undefined}
          data-loading={isLoading || undefined}
          autoFocus
          disabled={isLoading || isExiting}
          onClick={onEnter}
        >
          <span className="lock-screen-avatar" aria-hidden="true">
            <img src={resolveAssetUrl('/about-icon.png')} alt="" />
          </span>
          <span className="lock-screen-name">nischalOS</span>
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
