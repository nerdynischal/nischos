import { useCallback, useEffect, useRef, useState } from 'react'
import type { FocusEvent, PointerEvent } from 'react'
import {
  calculateDockMagnification,
  calculateDockSurfaceTransform,
} from './dockMagnification'

type DockTooltip = {
  label: string
  source: 'keyboard' | 'pointer'
}

const ITEM_SELECTOR = '.dock-item'

export function useDockMagnification() {
  const dockRef = useRef<HTMLElement>(null)
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const pointerXRef = useRef(0)
  const frameRef = useRef<number | null>(null)
  const tooltipKeyRef = useRef<string | null>(null)
  const [tooltip, setTooltip] = useState<DockTooltip | null>(null)

  const setActiveTooltip = useCallback(
    (item: HTMLButtonElement, left: number, source: DockTooltip['source']) => {
      tooltipRef.current?.style.setProperty('left', `${left}px`)
      const id = item.dataset.dockId
      const label = item.dataset.dockLabel
      const key = `${source}:${id}`

      if (!id || !label || tooltipKeyRef.current === key) return
      tooltipKeyRef.current = key
      setTooltip({ label, source })
    },
    [],
  )

  const clearTooltip = useCallback(() => {
    tooltipKeyRef.current = null
    setTooltip(null)
  }, [])

  const resetItems = useCallback(() => {
    const dock = dockRef.current
    if (!dock) return

    dock.querySelectorAll<HTMLElement>(ITEM_SELECTOR).forEach((item) => {
      item.style.setProperty('--dock-scale', '1')
      item.style.setProperty('--dock-shift', '0px')
    })
    dock.querySelectorAll<HTMLElement>('.dock-separator').forEach((separator) => {
      separator.style.setProperty('--dock-separator-shift', '0px')
    })
    const background = dock.querySelector<HTMLElement>('.dock-background')
    if (background) background.style.transform = 'translate3d(0, 0, 0) scaleX(1)'
  }, [])

  const updateMagnification = useCallback(() => {
    frameRef.current = null
    const dock = dockRef.current
    if (!dock) return

    const items = Array.from(dock.querySelectorAll<HTMLButtonElement>(ITEM_SELECTOR))
    if (items.length === 0) return

    const geometries = items.map((item) => ({
      center: item.offsetLeft + item.offsetWidth / 2,
      width: item.offsetWidth,
    }))
    const shouldMagnify =
      window.matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const transforms = shouldMagnify
      ? calculateDockMagnification(geometries, pointerXRef.current)
      : geometries.map(() => ({ scale: 1, translation: 0 }))

    items.forEach((item, index) => {
      item.style.setProperty('--dock-scale', transforms[index].scale.toFixed(4))
      item.style.setProperty('--dock-shift', `${transforms[index].translation.toFixed(2)}px`)
    })

    const nearestIndex = geometries.reduce((nearest, geometry, index) => {
      const nearestDistance = Math.abs(pointerXRef.current - geometries[nearest].center)
      const distance = Math.abs(pointerXRef.current - geometry.center)
      return distance < nearestDistance ? index : nearest
    }, 0)
    const surfaceTransform = calculateDockSurfaceTransform(
      geometries,
      transforms,
      dock.offsetWidth,
    )
    const background = dock.querySelector<HTMLElement>('.dock-background')
    if (background) {
      background.style.transform =
        `translate3d(${surfaceTransform.translation.toFixed(2)}px, 0, 0) ` +
        `scaleX(${surfaceTransform.scaleX.toFixed(4)})`
    }

    dock.querySelectorAll<HTMLElement>('.dock-separator').forEach((separator) => {
      const separatorCenter = separator.offsetLeft + separator.offsetWidth / 2
      let leftIndex = -1
      let rightIndex = -1

      geometries.forEach(({ center }, index) => {
        if (center < separatorCenter) leftIndex = index
        if (rightIndex === -1 && center > separatorCenter) rightIndex = index
      })

      const nearbyShifts = [leftIndex, rightIndex]
        .filter((index) => index >= 0)
        .map((index) => transforms[index].translation)
      const shift = nearbyShifts.length > 0
        ? nearbyShifts.reduce((sum, value) => sum + value, 0) / nearbyShifts.length
        : 0
      separator.style.setProperty('--dock-separator-shift', `${shift.toFixed(2)}px`)
    })

    const activeCenter = geometries[nearestIndex].center + transforms[nearestIndex].translation
    setActiveTooltip(items[nearestIndex], activeCenter, 'pointer')
  }, [setActiveTooltip])

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return
    pointerXRef.current = event.clientX - event.currentTarget.getBoundingClientRect().left

    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(updateMagnification)
    }
  }, [updateMagnification])

  const handlePointerLeave = useCallback(() => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    frameRef.current = null
    resetItems()
    clearTooltip()
  }, [clearTooltip, resetItems])

  const handleItemFocus = useCallback((event: FocusEvent<HTMLButtonElement>) => {
    if (!event.currentTarget.matches(':focus-visible')) return
    const item = event.currentTarget
    setActiveTooltip(item, item.offsetLeft + item.offsetWidth / 2, 'keyboard')
  }, [setActiveTooltip])

  const handleItemBlur = useCallback(() => {
    clearTooltip()
  }, [clearTooltip])

  useEffect(() => {
    const handleWindowMove = (event: Event) => {
      const dock = dockRef.current
      const target = event.target
      if (
        !dock ||
        (target instanceof Node && dock.contains(target)) ||
        tooltipKeyRef.current === null
      ) return
      handlePointerLeave()
    }

    window.addEventListener('pointermove', handleWindowMove)

    return () => {
      window.removeEventListener('pointermove', handleWindowMove)
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
    }
  }, [handlePointerLeave])

  return {
    dockRef,
    tooltipRef,
    tooltip,
    handlePointerMove,
    handlePointerLeave,
    handleItemFocus,
    handleItemBlur,
  }
}
