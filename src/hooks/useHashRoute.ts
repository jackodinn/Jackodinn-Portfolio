import { useSyncExternalStore } from 'react'

export type Route = 'game' | 'classic'

function read(): Route {
  return window.location.hash.startsWith('#/classic') ? 'classic' : 'game'
}

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

/**
 * Minimal hash router: `#/` is the game, `#/classic` the classic view.
 * Hash routes work on GitHub Pages without any server rewrites.
 */
export function useHashRoute(): Route {
  return useSyncExternalStore(subscribe, read, () => 'game')
}
