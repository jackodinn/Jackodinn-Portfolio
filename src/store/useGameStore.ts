import { create } from 'zustand'
import type { Landmark } from '../game/layout'

interface GameState {
  /** Landmark the player is currently standing next to. */
  nearby: Landmark | null
  /** Landmark whose info panel is open (movement is paused while set). */
  activePanel: Landmark | null
  /** Click/tap-to-move destination on the ground: [x, z]. */
  moveTarget: [number, number] | null

  setNearby: (landmark: Landmark | null) => void
  clearNearby: (id: string) => void
  openPanel: (landmark: Landmark) => void
  closePanel: () => void
  setMoveTarget: (target: [number, number] | null) => void
}

export const useGameStore = create<GameState>()((set) => ({
  nearby: null,
  activePanel: null,
  moveTarget: null,

  setNearby: (nearby) => set({ nearby }),
  clearNearby: (id) => set((s) => (s.nearby?.id === id ? { nearby: null } : s)),
  openPanel: (activePanel) => set({ activePanel, moveTarget: null }),
  closePanel: () => set({ activePanel: null }),
  setMoveTarget: (moveTarget) => set({ moveTarget }),
}))
