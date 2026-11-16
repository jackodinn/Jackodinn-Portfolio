import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, type CSSProperties } from 'react'
import { MeshStandardMaterial } from 'three'
import { useGameStore } from '../store/useGameStore'
import type { Landmark } from './layout'
import { createWindowTexture, neonMaterial } from './textures'

/** How far from the walls the "press E" zone reaches. */
const INTERACT_MARGIN = 2.2

function hash(id: string) {
  let h = 7
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 100000
  return h + 1
}

/**
 * Cyberpunk storefront for a landmark: dark tower with lit windows, neon
 * corner strips and sign, a glowing door facing the avenue (+z), a coloured
 * light spill, a floating holo-label, and a sensor zone that marks the
 * landmark as "nearby" when the player walks up to it.
 */
export function Building({ landmark }: { landmark: Landmark }) {
  const { setNearby, clearNearby, setMoveTarget } = useGameStore.getState()
  const nearby = useGameStore((s) => s.nearby?.id === landmark.id)
  const [x, z] = landmark.position
  const [w, h, d] = landmark.size

  const materials = useMemo(() => {
    const windows = createWindowTexture(hash(landmark.id), 8, 24)
    windows.repeat.set(w / 4.8, h / 14.4)
    const side = new MeshStandardMaterial({
      color: '#14111f',
      roughness: 0.55,
      metalness: 0.5,
      emissive: '#ffffff',
      emissiveMap: windows,
      emissiveIntensity: 1.1,
    })
    const roof = new MeshStandardMaterial({ color: '#0d0b16', roughness: 0.8, metalness: 0.3 })
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z
    return [side, side, roof, roof, side, side]
  }, [landmark.id, w, h])

  const neon = useMemo(() => neonMaterial(landmark.neon, 2.5), [landmark.neon])
  const neonBright = useMemo(() => neonMaterial(landmark.neon, 6), [landmark.neon])
  const sign = nearby ? neonBright : neon

  const walkHere = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    // Walk to just outside the front door.
    setMoveTarget([x, z + d / 2 + 1.2])
  }

  const front = d / 2

  return (
    <group position={[x, 0, z]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[w / 2, h / 2, d / 2]} position={[0, h / 2, 0]} />
        <mesh castShadow receiveShadow position={[0, h / 2, 0]} material={materials} onPointerDown={walkHere}>
          <boxGeometry args={[w, h, d]} />
        </mesh>
      </RigidBody>

      {/* Neon corner strips + roof rim */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(side * w) / 2, h / 2, front]} material={neon}>
          <boxGeometry args={[0.08, h, 0.08]} />
        </mesh>
      ))}
      <mesh position={[0, h, front]} material={neon}>
        <boxGeometry args={[w, 0.08, 0.08]} />
      </mesh>

      {/* Storefront: glowing door, awning, sign */}
      <mesh position={[0, 1.1, front + 0.01]} material={sign}>
        <planeGeometry args={[1.3, 2.2]} />
      </mesh>
      <mesh position={[0, 2.5, front + 0.45]} castShadow>
        <boxGeometry args={[Math.min(w - 1, 4), 0.1, 0.9]} />
        <meshStandardMaterial color="#1d1930" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.2, front + 0.08]} material={sign}>
        <boxGeometry args={[Math.min(w - 1.2, 3.6), 0.45, 0.06]} />
      </mesh>

      {/* Colour spill onto the street */}
      <pointLight position={[0, 2.4, front + 2]} color={landmark.neon} intensity={nearby ? 22 : 12} distance={11} decay={2} />

      <CuboidCollider
        sensor
        args={[w / 2 + INTERACT_MARGIN, 1.5, d / 2 + INTERACT_MARGIN]}
        position={[0, 1.5, 0]}
        onIntersectionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === 'player') setNearby(landmark)
        }}
        onIntersectionExit={({ other }) => {
          if (other.rigidBodyObject?.name === 'player') clearNearby(landmark.id)
        }}
      />

      <Html position={[0, 4.4, front + 0.6]} center distanceFactor={18} zIndexRange={[10, 0]}>
        <div
          className={`world-label${nearby ? ' world-label--active' : ''}`}
          style={{ '--neon': landmark.neon } as CSSProperties}
        >
          {landmark.label}
        </div>
      </Html>
    </group>
  )
}
