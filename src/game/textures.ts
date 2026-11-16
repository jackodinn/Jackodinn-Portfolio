import { CanvasTexture, Color, MeshBasicMaterial, RepeatWrapping, SRGBColorSpace } from 'three'

/** Deterministic pseudo-random so the city looks the same on every load. */
export function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

const WINDOW_COLORS = ['#ffd27a', '#7af3ff', '#ff7ae6', '#b9a7ff', '#ffffff']

/**
 * Procedural skyscraper facade: a grid of lit / unlit windows.
 * Used as an emissive map so windows glow (and bloom) at night.
 */
export function createWindowTexture(seed: number, cols = 8, rows = 24) {
  const cell = 16
  const canvas = document.createElement('canvas')
  canvas.width = cols * cell
  canvas.height = rows * cell
  const ctx = canvas.getContext('2d')!
  const rand = seeded(seed)

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (rand() < 0.42) continue
      const color = WINDOW_COLORS[Math.floor(rand() * WINDOW_COLORS.length)]
      ctx.globalAlpha = 0.25 + rand() * 0.75
      ctx.fillStyle = color
      ctx.fillRect(x * cell + 3, y * cell + 4, cell - 6, cell - 7)
    }
  }
  ctx.globalAlpha = 1

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.anisotropy = 4
  return texture
}

/** Unlit material bright enough (> 1) to trigger bloom. */
export function neonMaterial(color: string, strength = 3) {
  return new MeshBasicMaterial({ color: new Color(color).multiplyScalar(strength), toneMapped: false })
}
