import React, { useRef, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette, ToneMapping, DepthOfField } from '@react-three/postprocessing';
import { useStore } from '../store/useStore';
import { fruits } from '../data/fruits';
import { OrchardEnvironment } from './OrchardEnvironment';
import { FruitModel } from './FruitModel';

const CameraController = () => {
  const { cameraPosition, cameraTarget, isCameraTransitioning, setIsCameraTransitioning } = useStore();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (isCameraTransitioning) {
      camera.position.lerp(new THREE.Vector3(...cameraPosition), 4 * delta);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(new THREE.Vector3(...cameraTarget), 4 * delta);
      }
      if (camera.position.distanceTo(new THREE.Vector3(...cameraPosition)) < 0.1) {
        setIsCameraTransitioning(false);
      }
    } else {
      // Continuous slow camera drift when idle
      if (controlsRef.current) {
        const time = state.clock.getElapsedTime();
        camera.position.x += Math.sin(time * 0.2) * 0.003;
        camera.position.y += Math.sin(time * 0.15) * 0.002;
        
        // Slight lookAt drift
        controlsRef.current.target.x += Math.sin(time * 0.3) * 0.001;
        controlsRef.current.target.y += Math.sin(time * 0.2) * 0.001;
      }
    }
    
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping
      dampingFactor={0.05}
      minDistance={2}
      maxDistance={30}
      maxPolarAngle={Math.PI / 2.05}
    />
  );
};

const FocusEffect = () => {
  const { selectedFruitId } = useStore();
  const { camera } = useThree();
  const targetDistance = useRef(15); // Default focus distance

  useFrame(() => {
    if (selectedFruitId) {
      const selectedFruit = fruits.find(f => f.id === selectedFruitId);
      if (selectedFruit) {
        const dist = camera.position.distanceTo(new THREE.Vector3(...selectedFruit.position));
        targetDistance.current = THREE.MathUtils.lerp(targetDistance.current, dist, 0.1);
      }
    } else {
      targetDistance.current = THREE.MathUtils.lerp(targetDistance.current, 15, 0.05);
    }
  });

  return (
    <DepthOfField 
      focusDistance={0.01}
      focalLength={0.02}
      bokehScale={2}
      height={480}
    />
  );
};

export const Experience: React.FC = () => {
  const { setSelectedFruitId, setCameraPosition, setCameraTarget, setIsCameraTransitioning } = useStore();

  const handlePointerMissed = () => {
    setSelectedFruitId(null);
    setCameraPosition([0, 5, 20]);
    setCameraTarget([0, 0, 0]);
    setIsCameraTransitioning(true);
  };

  // Handle WebGL context loss/restore
  const onCreated = useCallback((state: any) => {
    const canvas = state.gl.domElement;

    canvas.addEventListener('webglcontextlost', (e: Event) => {
      e.preventDefault();
      console.warn('WebGL context lost — will attempt to restore');
    });

    canvas.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored');
    });
    
    // Enable high quality shadows
    state.gl.shadowMap.enabled = true;
    state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas
        shadows
        camera={{ position: [0, 5, 20], fov: 45 }}
        onPointerMissed={handlePointerMissed}
        onCreated={onCreated}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#ffaa77']} />
        <fog attach="fog" args={['#ffaa77', 15, 50]} />

        <OrchardEnvironment />

        {fruits.map((fruit) => (
          <FruitModel key={fruit.id} fruit={fruit} />
        ))}

        <CameraController />

        {/* AAA Post Processing */}
        <EffectComposer multisampling={4}>
          <FocusEffect />
          <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.4} />
          <Vignette eskil={false} offset={0.1} darkness={0.9} />
          <ToneMapping adaptive={true} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
