import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useGameStore } from '../store/useGameStore'
import type { Landmark } from './layout'

/** How far from the walls the "press E" zone reaches. */
const INTERACT_MARGIN = 2.2

/**
 * Placeholder building for a landmark: a solid block with a roof, a door
 * facing the player's side (+z), a floating label, and a sensor zone that
 * marks the landmark as "nearby" when the player walks up to it.
 */
export function Building({ landmark }: { landmark: Landmark }) {
  const { setNearby, clearNearby, setMoveTarget } = useGameStore.getState()
  const nearby = useGameStore((s) => s.nearby?.id === landmark.id)
  const [x, z] = landmark.position
  const [w, h, d] = landmark.size

  const walkHere = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    // Walk to just outside the front door.
    setMoveTarget([x, z + d / 2 + 1.2])
  }

  return (
    <group position={[x, 0, z]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[w / 2, h / 2, d / 2]} position={[0, h / 2, 0]} />
        <mesh castShadow receiveShadow position={[0, h / 2, 0]} onPointerDown={walkHere}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={landmark.color} emissive={landmark.color} emissiveIntensity={nearby ? 0.25 : 0} />
        </mesh>
        <mesh castShadow position={[0, h + 0.8, 0]} rotation={[0, Math.PI / 4, 0]} onPointerDown={walkHere}>
          <coneGeometry args={[Math.max(w, d) * 0.8, 1.6, 4]} />
          <meshStandardMaterial color="#3d405b" />
        </mesh>
        <mesh position={[0, 0.9, d / 2 + 0.01]}>
          <planeGeometry args={[1.1, 1.8]} />
          <meshStandardMaterial color="#5c3d2e" />
        </mesh>
      </RigidBody>

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

      <Html position={[0, h + 2.2, 0]} center distanceFactor={18} zIndexRange={[10, 0]}>
        <div className={`world-label${nearby ? ' world-label--active' : ''}`}>{landmark.label}</div>
      </Html>
    </group>
  )
}
