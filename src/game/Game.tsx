import { KeyboardControls, Loader } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Suspense } from 'react'
import { Hud } from '../ui/Hud'
import { keyMap } from './controls'
import { Player } from './Player'
import { World } from './World'

export function Game() {
  return (
    <KeyboardControls map={keyMap}>
      <div className="game">
        <Canvas shadows="percentage" camera={{ fov: 40, position: [0, 21, 15] }} dpr={[1, 2]}>
          <color attach="background" args={['#bde0fe']} />
          <fog attach="fog" args={['#bde0fe', 40, 95]} />
          <hemisphereLight args={['#ffffff', '#a3b18a', 0.9]} />
          <directionalLight
            castShadow
            position={[15, 25, 10]}
            intensity={1.6}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          <Suspense fallback={null}>
            <Physics>
              <World />
              <Player />
            </Physics>
          </Suspense>
        </Canvas>
        <Hud />
        <Loader />
      </div>
    </KeyboardControls>
  )
}
