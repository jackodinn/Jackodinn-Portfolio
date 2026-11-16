import { useAnimations, useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { Box3, MeshStandardMaterial, SRGBColorSpace, type Group, type Mesh, type SkinnedMesh } from 'three'
import { clone } from 'three/addons/utils/SkeletonUtils.js'
import { useGameStore } from '../store/useGameStore'
import { CHARACTER_URL, skinUrl } from './avatar'

const HEIGHT = 1.9
const RUN_THRESHOLD = 0.5
/** Movement speed at which the Run clip plays at normal speed. */
const RUN_REFERENCE_SPEED = 6

interface Props {
  /** Current horizontal speed in units/second, written by the Player. */
  speed: RefObject<number>
  /** Y offset so the feet sit at the bottom of the physics capsule. */
  footY: number
}

/** Rigged, animated human avatar with swappable skins. */
export function Character({ speed, footY }: Props) {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF(CHARACTER_URL)
  const skin = useGameStore((s) => s.skin)
  const texture = useTexture(skinUrl(skin), (t) => {
    t.colorSpace = SRGBColorSpace
  })

  // Clone so the cached glTF is never mutated; normalize to HEIGHT metres.
  const { model, scale, offsetY } = useMemo(() => {
    const model = clone(scene)
    // A fresh clone has stale bone matrices; update them before measuring
    // the skinned bounds, or the size comes out wildly wrong.
    model.updateMatrixWorld(true)
    model.traverse((o) => {
      const skinned = o as SkinnedMesh
      if (skinned.isSkinnedMesh) {
        skinned.skeleton.update()
        skinned.computeBoundingBox()
      }
    })
    const box = new Box3().setFromObject(model)
    const scale = HEIGHT / (box.max.y - box.min.y)
    return { model, scale, offsetY: -box.min.y * scale }
  }, [scene])

  const material = useMemo(
    () => new MeshStandardMaterial({ map: texture, roughness: 0.75, metalness: 0.05 }),
    [texture],
  )

  useEffect(() => {
    model.traverse((o) => {
      const mesh = o as Mesh
      if (mesh.isMesh) {
        mesh.material = material
        mesh.castShadow = true
        mesh.frustumCulled = false // skinned bounds don't follow animation
      }
    })
  }, [model, material])

  const { actions } = useAnimations(animations, group)
  const current = useRef<string | null>(null)

  useFrame(() => {
    const v = speed.current ?? 0
    const next = v > RUN_THRESHOLD ? 'Run' : 'Idle'
    if (next !== current.current) {
      const prev = current.current ? actions[current.current] : null
      const action = actions[next]
      action?.reset().fadeIn(0.2).play()
      prev?.fadeOut(0.2)
      current.current = next
    }
    const run = actions.Run
    if (run && next === 'Run') run.timeScale = Math.max(0.6, v / RUN_REFERENCE_SPEED)
  })

  return (
    <group ref={group} position={[0, footY + offsetY, 0]} scale={scale}>
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload(CHARACTER_URL)
useTexture.preload(skinUrl(useGameStore.getState().skin))
