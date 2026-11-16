import { lazy, Suspense, useEffect } from 'react'
import { useHashRoute } from './hooks/useHashRoute'
import { ClassicView } from './ui/ClassicView'

// The 3D bundle (three, R3F, Rapier) only loads when the game is shown,
// so the classic view stays fast.
const Game = lazy(() => import('./game/Game').then((m) => ({ default: m.Game })))

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

const canPlay = supportsWebGL()

export default function App() {
  const route = useHashRoute()
  const showGame = canPlay && route === 'game'

  useEffect(() => {
    document.body.classList.toggle('is-game', showGame)
  }, [showGame])

  if (!showGame) return <ClassicView canPlay={canPlay} />
  return (
    <Suspense fallback={<div className="boot">Loading world…</div>}>
      <Game />
    </Suspense>
  )
}
