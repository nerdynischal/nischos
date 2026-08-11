const MAX_RENDER_PIXEL_COUNT = 2_000_000
const MAX_RENDER_PIXEL_RATIO = 1.25
const MIN_RENDER_PIXEL_RATIO = 0.6

export function calculateWaterRipplePixelRatio(
  width: number,
  height: number,
  devicePixelRatio: number,
) {
  const safeDevicePixelRatio =
    Number.isFinite(devicePixelRatio) && devicePixelRatio > 0
      ? devicePixelRatio
      : 1
  const preferredRatio = Math.min(safeDevicePixelRatio, MAX_RENDER_PIXEL_RATIO)
  const pixelBudgetRatio = Math.sqrt(
    MAX_RENDER_PIXEL_COUNT / Math.max(1, width * height),
  )

  return Math.min(
    preferredRatio,
    Math.max(MIN_RENDER_PIXEL_RATIO, pixelBudgetRatio),
  )
}
