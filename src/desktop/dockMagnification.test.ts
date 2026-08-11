import { describe, expect, it } from 'vitest'
import {
  calculateDockMagnification,
  calculateDockSeparatorTranslation,
  calculateDockSurfaceTransform,
  findNearestDockItemIndex,
} from './dockMagnification'

const items = [
  { center: 25, width: 50 },
  { center: 84, width: 50 },
  { center: 143, width: 50 },
]

const fiveItems = Array.from({ length: 5 }, (_, index) => ({
  center: 25 + index * 59,
  width: 50,
}))

function getSurfaceExtensions(scaleX: number, translation: number, dockWidth: number) {
  const totalExtension = dockWidth * (scaleX - 1)
  return {
    left: totalExtension / 2 - translation,
    right: totalExtension / 2 + translation,
  }
}

describe('calculateDockMagnification', () => {
  it('magnifies the item under the pointer most and tapers its neighbours', () => {
    const transforms = calculateDockMagnification(items, 84)

    expect(transforms[1].scale).toBeCloseTo(1.42)
    expect(transforms[0].scale).toBeGreaterThan(1)
    expect(transforms[0].scale).toBeLessThan(transforms[1].scale)
    expect(transforms[2].scale).toBeCloseTo(transforms[0].scale)
  })

  it('pushes surrounding items away from the magnified item', () => {
    const transforms = calculateDockMagnification(items, 84)

    expect(transforms[0].translation).toBeLessThan(0)
    expect(transforms[1].translation).toBeCloseTo(0)
    expect(transforms[2].translation).toBeGreaterThan(0)
  })

  it('leaves items outside the influence radius at rest', () => {
    const transforms = calculateDockMagnification(items, 400)

    expect(transforms).toEqual([
      { scale: 1, translation: 0 },
      { scale: 1, translation: 0 },
      { scale: 1, translation: 0 },
    ])
  })

  it('keeps the dock surface still when its items are at rest', () => {
    const surface = calculateDockSurfaceTransform(
      items,
      items.map(() => ({ scale: 1, translation: 0 })),
      220,
    )

    expect(surface).toEqual({ scaleX: 1, translation: 0 })
  })

  it('keeps both edge icons inside when the left edge is magnified', () => {
    const dockWidth = 312
    const transforms = calculateDockMagnification(fiveItems, fiveItems[0].center)
    const surface = calculateDockSurfaceTransform(fiveItems, transforms, dockWidth)
    const extensions = getSurfaceExtensions(surface.scaleX, surface.translation, dockWidth)
    const firstTransform = transforms[0]
    const lastTransform = transforms[transforms.length - 1]
    const requiredLeft =
      (fiveItems[0].width * (firstTransform.scale - 1)) / 2 - firstTransform.translation
    const requiredRight =
      (fiveItems[4].width * (lastTransform.scale - 1)) / 2 + lastTransform.translation

    expect(extensions.left).toBeCloseTo(requiredLeft)
    expect(extensions.right).toBeCloseTo(requiredRight)
    expect(extensions.right).toBeGreaterThan(0)
  })

  it('extends symmetrically from the middle icon', () => {
    const transforms = calculateDockMagnification(fiveItems, fiveItems[2].center)
    const surface = calculateDockSurfaceTransform(fiveItems, transforms, 312)

    expect(surface.scaleX).toBeGreaterThan(1)
    expect(surface.translation).toBeCloseTo(0)
  })
})

describe('dock item helpers', () => {
  it('finds the item nearest to the pointer', () => {
    expect(findNearestDockItemIndex(items, 88)).toBe(1)
    expect(findNearestDockItemIndex([], 88)).toBe(-1)
  })

  it('centres a separator between the translations on either side', () => {
    const transforms = [
      { scale: 1, translation: -12 },
      { scale: 1.2, translation: -4 },
      { scale: 1.2, translation: 8 },
    ]

    expect(calculateDockSeparatorTranslation(items, transforms, 112)).toBe(2)
    expect(calculateDockSeparatorTranslation(items, transforms.slice(1), 112)).toBe(0)
  })
})
