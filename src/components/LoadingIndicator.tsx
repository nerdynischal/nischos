import { useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'

export function LoadingIndicator({ label, inset = false }: { label: string; inset?: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 180)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className={`loading-indicator${inset ? ' loading-indicator--inset' : ''}`} role="status">
      {visible ? (
        <>
          <LoaderCircle className="loading-indicator-icon" size={16} aria-hidden="true" />
          <span>{label}</span>
        </>
      ) : null}
    </div>
  )
}
