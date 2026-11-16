import { create } from 'zustand'
import { loadSkin, saveSkin, SKINS, type SkinId } from '../game/avatar'
import type { Landmark } from '../game/layout'

interface GameState {
  /** Landmark the player is currently standing next to. */
  nearby: Landmark | null
  /** Landmark whose info panel is open (movement is paused while set). */
  activePanel: Landmark | null
  /** Click/tap-to-move destination on the ground: [x, z]. */
  moveTarget: [number, number] | null
  /** Current avatar outfit. */
  skin: SkinId

  setNearby: (landmark: Landmark | null) => void
  clearNearby: (id: string) => void
  openPanel: (landmark: Landmark) => void
  closePanel: () => void
  setMoveTarget: (target: [number, number] | null) => void
  nextSkin: () => void
}

export const useGameStore = create<GameState>()((set) => ({
  nearby: null,
  activePanel: null,
  moveTarget: null,
  skin: loadSkin(),

  setNearby: (nearby) => set({ nearby }),
  clearNearby: (id) => set((s) => (s.nearby?.id === id ? { nearby: null } : s)),
  openPanel: (activePanel) => set({ activePanel, moveTarget: null }),
  closePanel: () => set({ activePanel: null }),
  setMoveTarget: (moveTarget) => set({ moveTarget }),
  nextSkin: () =>
    set((s) => {
      const i = SKINS.findIndex((k) => k.id === s.skin)
      const skin = SKINS[(i + 1) % SKINS.length].id
      saveSkin(skin)
      return { skin }
    }),
}))
