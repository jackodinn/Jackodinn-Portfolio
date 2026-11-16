import type { ThreeEvent } from '@react-three/fiber'
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import { useMemo } from 'react'
import { useGameStore } from '../store/useGameStore'
import { Building } from './Building'
import { landmarks, WORLD_SIZE } from './layout'

/** Deterministic pseudo-random so tree placement is stable between reloads. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

function isClear(x: number, z: number) {
  // Keep the square, the road, and building plots free of trees.
  if (Math.abs(x) < 4 || (Math.abs(x) < 16 && z > -18 && z < 40)) return false
  return landmarks.every((l) => Math.hypot(l.position[0] - x, l.position[1] - z) > 7)
}

function Trees() {
  const trees = useMemo(() => {
    const rand = seeded(42)
    const out: [number, number, number][] = []
    const half = WORLD_SIZE / 2 - 3
    while (out.length < 70) {
      const x = (rand() * 2 - 1) * half
      const z = (rand() * 2 - 1) * half
      if (isClear(x, z)) out.push([x, z, 0.8 + rand() * 0.6])
    }
    return out
  }, [])

  return (
    <>
      {trees.map(([x, z, s], i) => (
        <RigidBody key={i} type="fixed" colliders={false} position={[x, 0, z]}>
          <CylinderCollider args={[1.5 * s, 0.35 * s]} position={[0, 1.5 * s, 0]} />
          <mesh castShadow position={[0, 0.6 * s, 0]}>
            <cylinderGeometry args={[0.2 * s, 0.3 * s, 1.2 * s, 6]} />
            <meshStandardMaterial color="#7f5539" />
          </mesh>
          <mesh castShadow position={[0, 2 * s, 0]}>
            <coneGeometry args={[1.2 * s, 2.6 * s, 7]} />
            <meshStandardMaterial color="#588157" />
          </mesh>
        </RigidBody>
      ))}
    </>
  )
}

function MoveMarker() {
  const target = useGameStore((s) => s.moveTarget)
  if (!target) return null
  return (
    <mesh position={[target[0], 0.03, target[1]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.35, 0.5, 32]} />
      <meshBasicMaterial color="#f2cc8f" />
    </mesh>
  )
}

export function World() {
  const setMoveTarget = useGameStore((s) => s.setMoveTarget)
  const half = WORLD_SIZE / 2

  const onGroundClick = (e: ThreeEvent<PointerEvent>) => {
    if (useGameStore.getState().activePanel) return
    setMoveTarget([e.point.x, e.point.z])
  }

  return (
    <>
      {/* Ground */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[half, 0.5, half]} position={[0, -0.5, 0]} />
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} onPointerDown={onGroundClick}>
          <planeGeometry args={[WORLD_SIZE, WORLD_SIZE]} />
          <meshStandardMaterial color="#a3b18a" />
        </mesh>
      </RigidBody>

      {/* Town square + south road (visual only) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2]}>
        <circleGeometry args={[9, 48]} />
        <meshStandardMaterial color="#e9d8a6" />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 18]}>
        <planeGeometry args={[4, 34]} />
        <meshStandardMaterial color="#e9d8a6" />
      </mesh>

      {/* Invisible world boundary */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[half, 3, 0.5]} position={[0, 3, -half]} />
        <CuboidCollider args={[half, 3, 0.5]} position={[0, 3, half]} />
        <CuboidCollider args={[0.5, 3, half]} position={[-half, 3, 0]} />
        <CuboidCollider args={[0.5, 3, half]} position={[half, 3, 0]} />
      </RigidBody>

      {landmarks.map((l) => (
        <Building key={l.id} landmark={l} />
      ))}
      <Trees />
      <MoveMarker />
    </>
  )
}
