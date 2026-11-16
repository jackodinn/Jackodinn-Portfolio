import { MeshReflectorMaterial } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import { useMemo } from 'react'
import { useGameStore } from '../store/useGameStore'
import { Building } from './Building'
import { AVENUE, BOUNDS, landmarks, NEON } from './layout'
import { Rain } from './Rain'
import { Skyline } from './Skyline'
import { LOW_POWER } from './quality'
import { neonMaterial } from './textures'

const GROUND_SIZE = 260
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** Wet, reflective asphalt — reflects all the neon. */
function Ground() {
  const setMoveTarget = useGameStore((s) => s.setMoveTarget)
  const onGroundClick = (e: ThreeEvent<PointerEvent>) => {
    if (useGameStore.getState().activePanel) return
    setMoveTarget([
      clamp(e.point.x, -BOUNDS.halfX + 1, BOUNDS.halfX - 1),
      clamp(e.point.z, BOUNDS.minZ + 1, BOUNDS.maxZ - 1),
    ])
  }
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[GROUND_SIZE / 2, 0.5, GROUND_SIZE / 2]} position={[0, -0.5, 0]} />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} onPointerDown={onGroundClick}>
        <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
        {LOW_POWER ? (
          <meshStandardMaterial color="#0b0a12" metalness={0.7} roughness={0.35} />
        ) : (
          <MeshReflectorMaterial
            resolution={512}
            blur={[300, 80]}
            mixBlur={1}
            mixStrength={18}
            mixContrast={1}
            roughness={0.9}
            depthScale={0.8}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.2}
            color="#0b0a12"
            metalness={0.6}
            mirror={0}
          />
        )}
      </mesh>
    </RigidBody>
  )
}

/** Plaza emblem, avenue with neon kerbs and lane dashes, district border. */
function Streets() {
  const cyan = useMemo(() => neonMaterial(NEON.cyan, 2.2), [])
  const magenta = useMemo(() => neonMaterial(NEON.magenta, 2.2), [])
  const dash = useMemo(() => neonMaterial(NEON.yellow, 1.6), [])
  const avenueLength = AVENUE.endZ - AVENUE.startZ
  const avenueMid = (AVENUE.startZ + AVENUE.endZ) / 2
  const dashes = useMemo(() => {
    const out: number[] = []
    for (let z = AVENUE.startZ + 1; z < AVENUE.endZ; z += 3) out.push(z)
    return out
  }, [])
  const borderW = BOUNDS.halfX * 2
  const borderD = BOUNDS.maxZ - BOUNDS.minZ
  const borderMidZ = (BOUNDS.maxZ + BOUNDS.minZ) / 2

  return (
    <group position={[0, 0.02, 0]}>
      {/* Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial color="#14121f" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2]} material={magenta}>
        <ringGeometry args={[8.8, 9, 96]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -2]} material={cyan}>
        <ringGeometry args={[3.4, 3.55, 64]} />
      </mesh>

      {/* Avenue */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, avenueMid]} receiveShadow>
        <planeGeometry args={[6, avenueLength]} />
        <meshStandardMaterial color="#100e19" metalness={0.6} roughness={0.4} />
      </mesh>
      {[-3, 3].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, avenueMid]} material={cyan}>
          <planeGeometry args={[0.12, avenueLength]} />
        </mesh>
      ))}
      {dashes.map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, z]} material={dash}>
          <planeGeometry args={[0.12, 1.2]} />
        </mesh>
      ))}

      {/* District border (matches the invisible walls) */}
      {[
        { pos: [0, borderMidZ - borderD / 2] as const, size: [borderW, 0.1] as const },
        { pos: [0, borderMidZ + borderD / 2] as const, size: [borderW, 0.1] as const },
        { pos: [-BOUNDS.halfX, borderMidZ] as const, size: [0.1, borderD] as const },
        { pos: [BOUNDS.halfX, borderMidZ] as const, size: [0.1, borderD] as const },
      ].map(({ pos, size }, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[pos[0], 0.01, pos[1]]} material={magenta}>
          <planeGeometry args={[size[0], size[1]]} />
        </mesh>
      ))}
    </group>
  )
}

/** Street lamps along the avenue. */
function Lamps() {
  const head = useMemo(() => neonMaterial('#bfefff', 3), [])
  const spots = useMemo(() => {
    const out: [number, number][] = []
    for (let z = AVENUE.startZ + 4; z < AVENUE.endZ - 2; z += 9) out.push([-4, z], [4, z])
    out.push([-6, -9], [6, -9], [-6, 5], [6, 5])
    return out
  }, [])
  return (
    <>
      {spots.map(([x, z]) => (
        <RigidBody key={`${x},${z}`} type="fixed" colliders={false} position={[x, 0, z]}>
          <CylinderCollider args={[2, 0.15]} position={[0, 2, 0]} />
          <mesh castShadow position={[0, 2, 0]}>
            <cylinderGeometry args={[0.07, 0.1, 4, 8]} />
            <meshStandardMaterial color="#2a2638" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[x > 0 ? -0.35 : 0.35, 4, 0]} material={head}>
            <boxGeometry args={[0.8, 0.08, 0.2]} />
          </mesh>
        </RigidBody>
      ))}
    </>
  )
}

function MoveMarker() {
  const target = useGameStore((s) => s.moveTarget)
  const material = useMemo(() => neonMaterial(NEON.cyan, 3), [])
  if (!target) return null
  return (
    <mesh position={[target[0], 0.05, target[1]]} rotation={[-Math.PI / 2, 0, 0]} material={material}>
      <ringGeometry args={[0.35, 0.45, 32]} />
    </mesh>
  )
}

function Boundary() {
  const { halfX, minZ, maxZ } = BOUNDS
  const midZ = (minZ + maxZ) / 2
  const halfZ = (maxZ - minZ) / 2
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[halfX, 3, 0.5]} position={[0, 3, minZ - 0.5]} />
      <CuboidCollider args={[halfX, 3, 0.5]} position={[0, 3, maxZ + 0.5]} />
      <CuboidCollider args={[0.5, 3, halfZ]} position={[-halfX - 0.5, 3, midZ]} />
      <CuboidCollider args={[0.5, 3, halfZ]} position={[halfX + 0.5, 3, midZ]} />
    </RigidBody>
  )
}

export function World() {
  return (
    <>
      <Ground />
      <Streets />
      <Boundary />
      {landmarks.map((l) => (
        <Building key={l.id} landmark={l} />
      ))}
      <Lamps />
      <Skyline />
      <Rain />
      <MoveMarker />
    </>
  )
}
