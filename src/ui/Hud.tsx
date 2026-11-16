import { useEffect } from 'react'
import { portfolio } from '../data/portfolio'
import { SKINS } from '../game/avatar'
import { useGameStore } from '../store/useGameStore'
import { InfoPanel } from './InfoPanel'

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export function Hud() {
  const nearby = useGameStore((s) => s.nearby)
  const activePanel = useGameStore((s) => s.activePanel)
  const openPanel = useGameStore((s) => s.openPanel)
  const closePanel = useGameStore((s) => s.closePanel)
  const skin = useGameStore((s) => s.skin)
  const nextSkin = useGameStore((s) => s.nextSkin)
  const skinLabel = SKINS.find((k) => k.id === skin)?.label

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { nearby, activePanel } = useGameStore.getState()
      if (activePanel && e.key === 'Escape') closePanel()
      else if (!activePanel && nearby && (e.code === 'KeyE' || e.key === 'Enter')) openPanel(nearby)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openPanel, closePanel])

  return (
    <div className="hud">
      <header className="hud-top">
        <div className="hud-title">
          <strong>{portfolio.profile.name}</strong>
          <span>{portfolio.profile.role}</span>
        </div>
        <div className="hud-actions">
          <button className="button" onClick={nextSkin} title="Change outfit">
            Outfit: {skinLabel}
          </button>
          <a className="button" href="#/classic">
            Classic view
          </a>
        </div>
      </header>

      {nearby && !activePanel && (
        <button className="interact-prompt" onClick={() => openPanel(nearby)}>
          {isTouch ? 'Tap' : <kbd>E</kbd>} Enter <strong>{nearby.label}</strong>
        </button>
      )}

      <p className="hud-help">
        {isTouch ? 'Tap the ground to walk' : 'WASD / arrows or click to walk · E to interact'}
      </p>

      {activePanel && <InfoPanel landmark={activePanel} onClose={closePanel} />}
    </div>
  )
}
