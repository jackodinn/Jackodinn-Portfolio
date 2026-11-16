import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { BufferAttribute, BufferGeometry, type LineSegments } from 'three'
import { LOW_POWER } from './quality'
import { seeded } from './textures'

const COUNT = LOW_POWER ? 500 : 1400
const AREA = 50
const TOP = 26
const LENGTH = 0.7
const FALL_SPEED = 28

/** Light rain that follows the camera's focus point. */
export function Rain() {
  const lines = useRef<LineSegments>(null)

  const { geometry, offsets } = useMemo(() => {
    const rand = seeded(7)
    const positions = new Float32Array(COUNT * 6)
    const offsets = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      offsets[i * 3] = (rand() - 0.5) * AREA
      offsets[i * 3 + 1] = rand() * TOP
      offsets[i * 3 + 2] = (rand() - 0.5) * AREA
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    return { geometry, offsets }
  }, [])

  useFrame((state, delta) => {
    const mesh = lines.current
    if (!mesh) return
    // Centre on the point the camera looks at (camera sits south of it).
    const cx = state.camera.position.x
    const cz = state.camera.position.z - 12
    const pos = geometry.attributes.position as BufferAttribute
    const arr = pos.array as Float32Array
    const fall = Math.min(delta, 0.05) * FALL_SPEED
    for (let i = 0; i < COUNT; i++) {
      let y = offsets[i * 3 + 1] - fall
      if (y < 0) y += TOP
      offsets[i * 3 + 1] = y
      const x = cx + offsets[i * 3]
      const z = cz + offsets[i * 3 + 2]
      arr[i * 6] = x
      arr[i * 6 + 1] = y
      arr[i * 6 + 2] = z
      arr[i * 6 + 3] = x + 0.08
      arr[i * 6 + 4] = y + LENGTH
      arr[i * 6 + 5] = z
    }
    pos.needsUpdate = true
  })

  return (
    <lineSegments ref={lines} geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial color="#9ec9ff" transparent opacity={0.28} depthWrite={false} />
    </lineSegments>
  )
}
