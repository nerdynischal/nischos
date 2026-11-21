import { useContext, useEffect, useRef, useState } from 'react'
import type { SettingsSection } from '../../content/types'
import { WindowTitleContext } from '../../windows/WindowTitleContext'

/** Owns About's list/detail navigation, focus restoration and window title. */
export function useSettingsNavigation(section: SettingsSection | undefined, onChangeSection: (id: string) => void) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const [valueNavigation, setValueNavigation] = useState(false)
  const valueFocus = useRef<string | null>(null)
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const [hasMobileNavigation, setHasMobileNavigation] = useState(false)
  const setMobileTitle = useContext(WindowTitleContext)
  const containerRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const pendingFocus = useRef<'detail' | 'list' | null>(null)

  const value = section?.id === 'values' && selectedValue && section.items.includes(selectedValue)
    ? selectedValue
    : null

  useEffect(() => {
    if (!valueFocus.current) return
    const target = value
      ? containerRef.current?.querySelector<HTMLButtonElement>(window.matchMedia('(max-width: 760px)').matches ? '.settings-mobile-back' : '.values-back')
      : Array.from(containerRef.current?.querySelectorAll<HTMLButtonElement>('[data-value]') ?? []).find((button) => button.dataset.value === valueFocus.current)
    target?.focus({ preventScroll: true })
    const detail = containerRef.current?.querySelector('.settings-detail')
    if (detail) detail.scrollTop = 0
    valueFocus.current = null
  }, [value])

  function returnToValues() {
    valueFocus.current = value
    setSelectedValue(null)
  }

  useEffect(() => {
    setMobileTitle?.(showMobileDetail ? value ?? section?.label ?? null : null)
    return () => setMobileTitle?.(null)
  }, [setMobileTitle, showMobileDetail, section?.label, value])

  useEffect(() => {
    if (pendingFocus.current === 'detail') {
      const detail = containerRef.current?.querySelector('.settings-detail')
      if (detail) detail.scrollTop = 0
      backRef.current?.focus({ preventScroll: true })
    } else if (pendingFocus.current === 'list') {
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('[data-section-id]')
      Array.from(buttons ?? []).find((button) => button.dataset.sectionId === section?.id)?.focus({ preventScroll: true })
    }
    pendingFocus.current = null
  }, [showMobileDetail, section?.id])

  function selectSection(id: string) {
    setSelectedValue(null)
    setValueNavigation(false)
    onChangeSection(id)
    if (window.matchMedia('(max-width: 760px)').matches) {
      setHasMobileNavigation(true)
      pendingFocus.current = 'detail'
      setShowMobileDetail(true)
    }
  }

  function selectValue(item: string) {
    valueFocus.current = item
    setValueNavigation(true)
    setSelectedValue(item)
  }

  function goBack() {
    if (value) {
      returnToValues()
      return
    }
    pendingFocus.current = 'list'
    setShowMobileDetail(false)
  }

  return {
    containerRef, backRef, value, valueNavigation, showMobileDetail,
    hasMobileNavigation, selectSection, selectValue, goBack, returnToValues,
  }
}
