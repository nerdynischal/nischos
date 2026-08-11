export type DockItemGeometry = {
  center: number
  width: number
}

export type DockItemTransform = {
  scale: number
  translation: number
}

export type DockSurfaceTransform = {
  scaleX: number
  translation: number
}

const DEFAULT_RADIUS = 132
const DEFAULT_MAX_SCALE = 1.42

function cosineInfluence(distance: number, radius: number) {
  const normalized = Math.max(0, 1 - distance / radius)
  return (1 - Math.cos(normalized * Math.PI)) / 2
}

export function calculateDockMagnification(
  items: DockItemGeometry[],
  pointerX: number,
  radius = DEFAULT_RADIUS,
  maxScale = DEFAULT_MAX_SCALE,
): DockItemTransform[] {
  const scales = items.map(({ center }) => {
    const influence = cosineInfluence(Math.abs(pointerX - center), radius)
    return 1 + (maxScale - 1) * influence
  })
  const expansions = items.map((item, index) => (item.width * (scales[index] - 1)) / 2)
  const totalExpansion = expansions.reduce((sum, expansion) => sum + expansion, 0)
  let leftExpansion = 0

  return items.map((_item, itemIndex) => {
    const rightExpansion = totalExpansion - leftExpansion - expansions[itemIndex]
    const translation = leftExpansion - rightExpansion
    leftExpansion += expansions[itemIndex]

    return {
      scale: scales[itemIndex],
      translation,
    }
  })
}

export function calculateDockSurfaceTransform(
  items: DockItemGeometry[],
  transforms: DockItemTransform[],
  dockWidth: number,
): DockSurfaceTransform {
  if (items.length === 0 || items.length !== transforms.length || dockWidth <= 0) {
    return { scaleX: 1, translation: 0 }
  }

  const firstItem = items[0]
  const firstTransform = transforms[0]
  const lastItem = items[items.length - 1]
  const lastTransform = transforms[transforms.length - 1]
  const leftExtension = Math.max(
    0,
    (firstItem.width * (firstTransform.scale - 1)) / 2 - firstTransform.translation,
  )
  const rightExtension = Math.max(
    0,
    (lastItem.width * (lastTransform.scale - 1)) / 2 + lastTransform.translation,
  )

  return {
    scaleX: (dockWidth + leftExtension + rightExtension) / dockWidth,
    translation: (rightExtension - leftExtension) / 2,
  }
}

export function findNearestDockItemIndex(items: DockItemGeometry[], pointerX: number) {
  if (items.length === 0) return -1

  return items.reduce((nearest, item, index) => {
    const nearestDistance = Math.abs(pointerX - items[nearest].center)
    const distance = Math.abs(pointerX - item.center)
    return distance < nearestDistance ? index : nearest
  }, 0)
}

export function calculateDockSeparatorTranslation(
  items: DockItemGeometry[],
  transforms: DockItemTransform[],
  separatorCenter: number,
) {
  if (items.length !== transforms.length) return 0

  let leftIndex = -1
  let rightIndex = -1

  items.forEach(({ center }, index) => {
    if (center < separatorCenter) leftIndex = index
    if (rightIndex === -1 && center > separatorCenter) rightIndex = index
  })

  const nearbyTranslations = [leftIndex, rightIndex]
    .filter((index) => index >= 0)
    .map((index) => transforms[index].translation)

  return nearbyTranslations.length > 0
    ? nearbyTranslations.reduce((sum, value) => sum + value, 0) / nearbyTranslations.length
    : 0
}
