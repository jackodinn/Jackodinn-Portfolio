/**
 * Player avatar: Kenney "Animated Characters" (CC0) — one rigged model,
 * many skins. Files live in public/models/.
 *
 * To use your own avatar later, export a rigged glTF with clips named
 * "Idle" and "Run" and point CHARACTER_URL at it.
 */
export const CHARACTER_URL = 'models/character.glb'

export const SKINS = [
  { id: 'cyborgFemaleA', label: 'Cyborg' },
  { id: 'skaterMaleA', label: 'Skater (M)' },
  { id: 'skaterFemaleA', label: 'Skater (F)' },
  { id: 'criminalMaleA', label: 'Boss' },
  { id: 'survivorMaleB', label: 'Survivor (M)' },
  { id: 'survivorFemaleA', label: 'Survivor (F)' },
  { id: 'humanMaleA', label: 'Casual (M)' },
  { id: 'humanFemaleA', label: 'Casual (F)' },
] as const

export type SkinId = (typeof SKINS)[number]['id']

/** Default outfit — change this to pick the look visitors see first. */
export const DEFAULT_SKIN: SkinId = 'cyborgFemaleA'

export const skinUrl = (id: SkinId) => `models/skins/${id}.webp`

const STORAGE_KEY = 'portfolio.skin'

export function loadSkin(): SkinId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (SKINS.some((s) => s.id === saved)) return saved as SkinId
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_SKIN
}

export function saveSkin(id: SkinId) {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* storage unavailable */
  }
}
