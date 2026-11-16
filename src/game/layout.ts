import { portfolio } from '../data/portfolio'

/** What a landmark opens when the player interacts with it. */
export type LandmarkKind = 'about' | 'skills' | 'contact' | 'experience' | 'project'

export interface Landmark {
  id: string
  kind: LandmarkKind
  label: string
  /** Building centre on the ground plane: [x, z]. Door faces +z (south). */
  position: [number, number]
  /** Building footprint and height: [width, height, depth]. */
  size: [number, number, number]
  /** Neon accent colour. */
  neon: string
  /** Set for kind === 'project'. */
  projectId?: string
}

export const NEON = {
  cyan: '#00f0ff',
  magenta: '#ff2bd6',
  violet: '#9d4dff',
  yellow: '#f9f871',
  orange: '#ff7a1a',
  lime: '#5dff8a',
}

/**
 * World layout — WHERE things are. Content lives in data/portfolio.ts.
 *
 * A neon plaza around the spawn point, with an avenue heading south
 * lined with one storefront per project.
 */
const core: Landmark[] = [
  { id: 'about', kind: 'about', label: 'Apartment · About me', position: [0, -14], size: [7, 8, 5], neon: NEON.magenta },
  { id: 'skills', kind: 'skills', label: 'Cyberdeck Lab · Skills', position: [-14, -4], size: [6, 6, 5], neon: NEON.cyan },
  { id: 'experience', kind: 'experience', label: 'Data Archive · Experience', position: [14, -4], size: [6, 7, 5], neon: NEON.violet },
]

const projectNeons = [NEON.cyan, NEON.orange, NEON.magenta, NEON.lime]

const projects: Landmark[] = portfolio.projects.map((project, i) => ({
  id: `project:${project.id}`,
  kind: 'project',
  label: project.title,
  projectId: project.id,
  // Alternate sides of the southern avenue, spaced every 9 units.
  position: [i % 2 === 0 ? -9 : 9, 10 + i * 9],
  size: [6, 5 + (i % 3) * 1.5, 5],
  neon: projectNeons[i % projectNeons.length],
}))

/** The avenue grows with the number of projects; the Comms Tower caps it. */
const avenueEnd = 10 + Math.max(0, projects.length - 1) * 9
const contact: Landmark = {
  id: 'contact',
  kind: 'contact',
  label: 'Comms Tower · Contact',
  position: [0, avenueEnd + 12],
  size: [6, 9, 5],
  neon: NEON.yellow,
}

export const landmarks: Landmark[] = [...core, ...projects, contact]

export const SPAWN: [number, number, number] = [0, 1, 2]
/** Walkable area half-extents: x in [-HALF_X, HALF_X], z in [MIN_Z, MAX_Z]. */
export const BOUNDS = { halfX: 26, minZ: -22, maxZ: avenueEnd + 20 }
/** Length of the avenue strip from the plaza to the Comms Tower. */
export const AVENUE = { startZ: 6, endZ: avenueEnd + 10 }
