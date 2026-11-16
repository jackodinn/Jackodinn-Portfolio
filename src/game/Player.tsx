import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useEffect, useRef } from 'react'
import { Vector3, type Group } from 'three'
import { useGameStore } from '../store/useGameStore'
import { Character } from './Character'
import type { Controls } from './controls'
import { NEON, SPAWN } from './layout'

const SPEED = 6
/** MOBA-style angled top-down camera, relative to the player. */
const CAMERA_OFFSET = new Vector3(0, 15, 11.5)
/** Mouse-wheel / pinch zoom range, as a multiple of CAMERA_OFFSET. */
const ZOOM_MIN = 0.6
const ZOOM_MAX = 1.6
const ARRIVE_DISTANCE = 0.25
/** Physics capsule: half-height of the cylinder part + radius. */
const CAPSULE_HALF = 0.55
const CAPSULE_RADIUS = 0.4
const FOOT_Y = -(CAPSULE_HALF + CAPSULE_RADIUS)

const direction = new Vector3()
const cameraGoal = new Vector3()
const lookAt = new Vector3()

/** Shortest-path interpolation between two angles (radians). */
function lerpAngle(from: number, to: number, t: number) {
  const delta = ((((to - from) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI
  return from + delta * t
}

/** The player: physics capsule + animated character + follow camera. */
export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const model = useRef<Group>(null)
  const speed = useRef(0)
  // Portrait screens (phones) start zoomed out so more of the city fits.
  const zoom = useRef(window.innerWidth < window.innerHeight ? 1.4 : 1)
  const [, getKeys] = useKeyboardControls<Controls>()

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (useGameStore.getState().activePanel) return
      zoom.current = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom.current * Math.exp(e.deltaY * 0.001)))
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  useFrame((state, delta) => {
    const rb = body.current
    if (!rb) return
    const { activePanel, moveTarget, setMoveTarget } = useGameStore.getState()
    const pos = rb.translation()

    direction.set(0, 0, 0)
    if (!activePanel) {
      const keys = getKeys()
      direction.set(
        Number(keys.right) - Number(keys.left),
        0,
        Number(keys.backward) - Number(keys.forward),
      )
      if (direction.lengthSq() > 0) {
        // Keyboard input cancels click-to-move.
        if (moveTarget) setMoveTarget(null)
      } else if (moveTarget) {
        direction.set(moveTarget[0] - pos.x, 0, moveTarget[1] - pos.z)
        if (direction.length() < ARRIVE_DISTANCE) {
          direction.set(0, 0, 0)
          setMoveTarget(null)
        }
      }
    }

    const moving = direction.lengthSq() > 0
    if (moving) direction.normalize().multiplyScalar(SPEED)
    const { y } = rb.linvel()
    rb.setLinvel({ x: direction.x, y, z: direction.z }, true)
    speed.current = moving ? SPEED : 0

    if (model.current && moving) {
      const target = Math.atan2(direction.x, direction.z)
      model.current.rotation.y = lerpAngle(model.current.rotation.y, target, 1 - Math.exp(-12 * delta))
    }

    // Smooth camera follow.
    cameraGoal.copy(CAMERA_OFFSET).multiplyScalar(zoom.current).add(pos)
    state.camera.position.lerp(cameraGoal, 1 - Math.exp(-5 * delta))
    lookAt.set(pos.x, pos.y, pos.z)
    state.camera.lookAt(lookAt)
  })

  return (
    <RigidBody
      ref={body}
      name="player"
      colliders={false}
      position={SPAWN}
      enabledRotations={[false, false, false]}
      linearDamping={0.5}
    >
      <CapsuleCollider args={[CAPSULE_HALF, CAPSULE_RADIUS]} />
      <group ref={model}>
        <Character speed={speed} footY={FOOT_Y} />
      </group>
      {/* Soft key light so the avatar reads against the night city */}
      <pointLight position={[0, 2.2, 1.6]} color="#cfe6ff" intensity={9} distance={7} decay={2} />
      {/* Neon ground ring under the player */}
      <mesh position={[0, FOOT_Y + 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.65, 40]} />
        <meshBasicMaterial color={NEON.cyan} toneMapped={false} transparent opacity={0.7} />
      </mesh>
    </RigidBody>
  )
}
