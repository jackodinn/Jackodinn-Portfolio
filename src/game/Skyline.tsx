import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  BoxGeometry,
  Color,
  InstancedMesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
} from 'three'
import { BOUNDS, NEON } from './layout'
import { createWindowTexture, seeded } from './textures'

interface Tower {
  x: number
  z: number
  w: number
  d: number
  h: number
}

/** Height classes share one texture repeat so windows keep a sane size. */
const CLASSES = [
  { min: 8, max: 16, ref: 12 },
  { min: 16, max: 28, ref: 22 },
  { min: 28, max: 46, ref: 36 },
]

function generateTowers(): Tower[] {
  const rand = seeded(1337)
  const towers: Tower[] = []
  const pad = 5
  for (let x = -78; x <= 78; x += 9) {
    for (let z = -80; z <= BOUNDS.maxZ + 2; z += 9) {
      const tx = x + (rand() - 0.5) * 3
      const tz = z + (rand() - 0.5) * 3
      const inside =
        Math.abs(tx) < BOUNDS.halfX + pad && tz > BOUNDS.minZ - pad && tz < BOUNDS.maxZ + pad
      if (inside || rand() < 0.12) continue
      // Taller further from the playable area.
      const dist = Math.max(Math.abs(tx) - BOUNDS.halfX, BOUNDS.minZ - tz, 0)
      const h = 8 + rand() * 14 + Math.min(dist, 40) * 0.6
      towers.push({ x: tx, z: tz, w: 5 + rand() * 3, d: 5 + rand() * 3, h: Math.min(h, 45) })
    }
  }
  return towers
}

const dummy = new Object3D()

function TowerClass({ towers, classIndex }: { towers: Tower[]; classIndex: number }) {
  const ref = useRef<InstancedMesh>(null)
  const { geometry, materials } = useMemo(() => {
    const geometry = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0)
    const windows = createWindowTexture(500 + classIndex, 8, 24)
    windows.repeat.set(1.3, CLASSES[classIndex].ref / 14.4)
    const side = new MeshStandardMaterial({
      color: '#0f0d18',
      roughness: 0.6,
      metalness: 0.5,
      emissive: '#ffffff',
      emissiveMap: windows,
      emissiveIntensity: 1.0,
    })
    const roof = new MeshStandardMaterial({ color: '#0a0912', roughness: 0.9 })
    return { geometry, materials: [side, side, roof, roof, side, side] }
  }, [classIndex])

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    towers.forEach((t, i) => {
      dummy.position.set(t.x, 0, t.z)
      dummy.scale.set(t.w, t.h, t.d)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [towers])

  if (towers.length === 0) return null
  return <instancedMesh ref={ref} args={[geometry, materials, towers.length]} receiveShadow />
}

/** Vertical holo-billboards on some towers, facing the city. */
function Billboards({ towers }: { towers: Tower[] }) {
  const ref = useRef<InstancedMesh>(null)
  const picks = useMemo(() => {
    const rand = seeded(99)
    const colors = Object.values(NEON)
    return towers
      .filter(() => rand() < 0.35)
      .map((t) => ({ t, color: colors[Math.floor(rand() * colors.length)], h: 3 + rand() * 6, y: 4 + rand() * 6 }))
  }, [towers])
  const geometry = useMemo(() => new PlaneGeometry(1, 1), [])
  const material = useMemo(() => new MeshBasicMaterial({ toneMapped: false }), [])

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const c = new Color()
    picks.forEach(({ t, color, h, y }, i) => {
      // Put the sign on the face pointing toward the city centre.
      const towardX = Math.abs(t.x) > BOUNDS.halfX
      const sx = towardX ? -Math.sign(t.x) : 0
      const sz = towardX ? 0 : 1
      dummy.position.set(t.x + (sx * t.w) / 2 + sx * 0.05, y + h / 2, t.z + (sz * t.d) / 2 + sz * 0.05)
      dummy.rotation.set(0, towardX ? (sx > 0 ? Math.PI / 2 : -Math.PI / 2) : 0, 0)
      dummy.scale.set(1.2, h, 1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, c.set(color).multiplyScalar(2.2))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [picks])

  if (picks.length === 0) return null
  return <instancedMesh ref={ref} args={[geometry, material, picks.length]} />
}

/** Background skyscrapers surrounding the playable district. */
export function Skyline() {
  const towers = useMemo(() => generateTowers(), [])
  const byClass = useMemo(
    () => CLASSES.map((c) => towers.filter((t) => t.h >= c.min && (t.h < c.max || c === CLASSES[CLASSES.length - 1]))),
    [towers],
  )
  return (
    <>
      {byClass.map((list, i) => (
        <TowerClass key={i} towers={list} classIndex={i} />
      ))}
      <Billboards towers={towers} />
    </>
  )
}
