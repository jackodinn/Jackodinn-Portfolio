import { KeyboardControls, Loader, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { Physics } from '@react-three/rapier'
import { Suspense, useState } from 'react'
import { Hud } from '../ui/Hud'
import { keyMap } from './controls'
import { Player } from './Player'
import { LOW_POWER } from './quality'
import { World } from './World'

const NIGHT = '#07060d'

const MAX_DPR = LOW_POWER ? 1.25 : 1.75

export function Game() {
  // Drop resolution if the device can't keep up, raise it again if it can.
  const [dpr, setDpr] = useState(MAX_DPR)
  return (
    <KeyboardControls map={keyMap}>
      <div className="game">
        <Canvas shadows="percentage" camera={{ fov: 40, position: [0, 21, 17] }} dpr={dpr}>
          <PerformanceMonitor
            onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))}
            onIncline={() => setDpr((d) => Math.min(MAX_DPR, d + 0.25))}
          />
          <color attach="background" args={[NIGHT]} />
          <fog attach="fog" args={[NIGHT, 35, 95]} />

          <hemisphereLight args={['#5b4bb7', '#0a0816', 0.7]} />
          <directionalLight
            castShadow
            color="#9db8ff"
            position={[-18, 30, 12]}
            intensity={0.9}
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0005}
            shadow-camera-left={-45}
            shadow-camera-right={45}
            shadow-camera-top={70}
            shadow-camera-bottom={-70}
          />

          <Suspense fallback={null}>
            <Physics>
              <World />
              <Player />
            </Physics>
          </Suspense>

          <EffectComposer multisampling={LOW_POWER ? 0 : 4}>
            <Bloom mipmapBlur intensity={1.1} luminanceThreshold={1} luminanceSmoothing={0.15} />
            <Vignette offset={0.25} darkness={0.75} />
          </EffectComposer>
        </Canvas>
        <Hud />
        <Loader containerStyles={{ background: NIGHT }} />
      </div>
    </KeyboardControls>
  )
}
