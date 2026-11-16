import { portfolio } from '../data/portfolio'

/** What a landmark opens when the player interacts with it. */
export type LandmarkKind = 'about' | 'skills' | 'contact' | 'experience' | 'project'

export interface Landmark {
  id: string
  kind: LandmarkKind
  label: string
  /** Building centre on the ground plane: [x, z]. */
  position: [number, number]
  /** Building footprint and height: [width, height, depth]. */
  size: [number, number, number]
  color: string
  /** Set for kind === 'project'. */
  projectId?: string
}

/**
 * World layout — WHERE things are. Content lives in data/portfolio.ts.
 *
 * Town square around the spawn point, with a road heading south
 * lined with one building per project.
 */
const core: Landmark[] = [
  { id: 'about', kind: 'about', label: 'Home — About me', position: [0, -12], size: [6, 4, 5], color: '#e07a5f' },
  { id: 'skills', kind: 'skills', label: 'Skill Shrine', position: [-13, -4], size: [5, 5, 5], color: '#81b29a' },
  { id: 'experience', kind: 'experience', label: 'Quest Log Hall', position: [13, -4], size: [5, 4, 6], color: '#a78bfa' },
  { id: 'contact', kind: 'contact', label: 'Post Office', position: [0, 34], size: [5, 3.5, 4], color: '#3d85c6' },
]

const projects: Landmark[] = portfolio.projects.map((project, i) => ({
  id: `project:${project.id}`,
  kind: 'project',
  label: project.title,
  projectId: project.id,
  // Alternate sides of the southern road, spaced every 8 units.
  position: [i % 2 === 0 ? -8 : 8, 8 + i * 8],
  size: [5, 3 + (i % 3), 5],
  color: '#f2cc8f',
}))

export const landmarks: Landmark[] = [...core, ...projects]

export const SPAWN: [number, number, number] = [0, 1, 0]
export const WORLD_SIZE = 90
