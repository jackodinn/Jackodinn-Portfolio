/**
 * Lighter rendering for phones / low-end machines: no mirror reflections,
 * less rain, lower resolution.
 */
export const LOW_POWER =
  typeof window !== 'undefined' &&
  (window.matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency ?? 8) <= 4)
