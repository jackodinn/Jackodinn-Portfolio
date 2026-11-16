import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import { Vector3, type Group } from 'three'
import { useGameStore } from '../store/useGameStore'
import type { Controls } from './controls'
import { SPAWN } from './layout'

const SPEED = 6
/** MOBA-style angled top-down camera, relative to the player. */
const CAMERA_OFFSET = new Vector3(0, 20, 15)
const ARRIVE_DISTANCE = 0.25

const direction = new Vector3()
const cameraGoal = new Vector3()
const lookAt = new Vector3()

/** Shortest-path interpolation between two angles (radians). */
function lerpAngle(from: number, to: number, t: number) {
  const delta = ((((to - from) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI
  return from + delta * t
}

/**
 * Placeholder hero: a capsule with a "visor" showing facing direction.
 * Swap the <group> contents for a rigged glTF character later.
 */
export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const model = useRef<Group>(null)
  const [, getKeys] = useKeyboardControls<Controls>()

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

    if (model.current && moving) {
      const target = Math.atan2(direction.x, direction.z)
      model.current.rotation.y = lerpAngle(model.current.rotation.y, target, 1 - Math.exp(-12 * delta))
    }

    // Smooth camera follow.
    cameraGoal.set(pos.x, pos.y, pos.z).add(CAMERA_OFFSET)
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
      <CapsuleCollider args={[0.5, 0.5]} />
      <group ref={model}>
        <mesh castShadow position={[0, 0, 0]}>
          <capsuleGeometry args={[0.5, 1, 8, 16]} />
          <meshStandardMaterial color="#f4f1de" />
        </mesh>
        <mesh castShadow position={[0, 0.35, 0.38]}>
          <boxGeometry args={[0.6, 0.22, 0.3]} />
          <meshStandardMaterial color="#3d405b" />
        </mesh>
      </group>
    </RigidBody>
  )
}
