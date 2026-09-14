import { responsiveImage } from '../../lib/responsiveImage'

export function ProfilePortrait({ className = '' }: { className?: string }) {
  return (
    <div className={`avatar-orbit ${className}`} aria-hidden="true">
      <img
        className="about-portrait"
        {...responsiveImage('/about-icon.png', '120px')}
        alt=""
      />
    </div>
  )
}
