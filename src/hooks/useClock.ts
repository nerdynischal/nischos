import { useEffect, useState } from 'react'

const weekdayFormatter = new Intl.DateTimeFormat('en-GB', { weekday: 'short' })
const monthFormatter = new Intl.DateTimeFormat('en-GB', { month: 'short' })

export function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  const weekday = weekdayFormatter.format(now)
  const day = now.getDate().toString().padStart(2, '0')
  const month = monthFormatter.format(now)
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')

  return {
    date: `${weekday} ${day} ${month}`,
    time: `${hours}:${minutes}:${seconds}`,
  }
}
