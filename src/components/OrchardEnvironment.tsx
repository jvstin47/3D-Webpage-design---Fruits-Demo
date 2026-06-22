import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Sparkles, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const USE_GLB_MODELS = false;

const TreeGLB: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const { scene } = useGLTF('/models/tree.glb');
  const clone = useMemo(() => {
    const c = scene.clone();
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);
  return <primitive object={clone} position={position} />;
};

function createGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  for (let i = 0; i < 256; i+=2) {
    for (let j = 0; j < 256; j+=2) {
      const g = 80 + Math.random() * 40;
      ctx.fillStyle = `rgb(${g}, ${g + 60}, ${g + 10})`;
      ctx.fillRect(i, j, 2, 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(20, 20);
  return tex;
}

export const OrchardEnvironment: React.FC = () => {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const awningRef = useRef<THREE.Group>(null);
  const treesRef = useRef<THREE.Group>(null);
  
  const grassTex = useMemo(() => createGrassTexture(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (awningRef.current) {
      awningRef.current.position.y = Math.sin(time * 2) * 0.03;
      awningRef.current.rotation.x = Math.sin(time * 1.5) * 0.02;
    }
    if (treesRef.current) {
      treesRef.current.children.forEach((tree, i) => {
        const offset = i * 1.5;
        tree.rotation.z = Math.sin(time * 0.8 + offset) * 0.03;
        tree.rotation.x = Math.sin(time * 1.1 + offset) * 0.02;
      });
    }
  });

  return (
    <>
      <Environment preset="sunset" background={false} blur={0.8} />
      
      {/* Brightened ambient lighting */}
      <ambientLight intensity={1.2} color="#ffffff" />
      
      {/* Main sun with 4K shadow maps and softer intensity */}
      <directionalLight 
        ref={sunRef}
        castShadow
        position={[35, 15, -20]} 
        intensity={2.5} 
        color="#fff0cc" 
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.001}
      />
      
      {/* Stronger fill light */}
      <directionalLight position={[-15, 10, 15]} intensity={1.5} color="#b3d4ff" />
      <hemisphereLight args={['#ffffff', '#aaddff', 1.5]} />

      {/* Atmospheric Particles */}
      <Sparkles count={250} scale={40} size={2} speed={0.2} opacity={0.3} color="#ffe0b2" />
      {/* Floating leaves */}
      <Sparkles count={50} scale={40} size={4} speed={0.1} opacity={0.6} color="#4a7a3a" position={[0, 5, -10]} />

      {/* Textured Terrain replacing flat grass */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshPhysicalMaterial 
          map={grassTex}
          roughness={0.9} 
          metalness={0.0} 
        />
      </mesh>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.47, 0]}>
        <planeGeometry args={[20, 24]} />
        <meshStandardMaterial color="#c2b29e" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Tent Awning & Poles */}
      <group position={[0, -1.5, -2]}>
        {[[-8, 8], [8, 8], [-8, -4], [8, -4]].map(([x, z], i) => (
          <mesh castShadow receiveShadow key={`pole-${i}`} position={[x, 3.5, z]}>
            <cylinderGeometry args={[0.15, 0.15, 7, 16]} />
            <meshPhysicalMaterial color="#8b6541" roughness={0.8} clearcoat={0.1} />
          </mesh>
        ))}
        <group position={[0, 7.2, 2]}>
          <group ref={awningRef}>
            <mesh castShadow receiveShadow rotation={[1.6, 0, 0]}>
              <planeGeometry args={[17, 13, 32, 32]} />
              <meshPhysicalMaterial color="#f4efe1" roughness={0.9} metalness={0.1} side={THREE.DoubleSide} />
            </mesh>
            {Array.from({ length: 9 }).map((_, i) => (
              <mesh castShadow receiveShadow key={`stripe-${i}`} position={[-7.2 + i * 1.8, 0.02, 0]} rotation={[1.6, 0, 0]}>
                <planeGeometry args={[0.9, 13, 8, 32]} />
                <meshPhysicalMaterial color="#2d4a22" roughness={0.9} metalness={0.1} side={THREE.DoubleSide} />
              </mesh>
            ))}
            <mesh castShadow receiveShadow position={[0, -0.6, 6.45]} rotation={[-0.3, 0, 0]}>
              <planeGeometry args={[17, 1.2, 32, 4]} />
              <meshPhysicalMaterial color="#f4efe1" roughness={0.9} metalness={0.1} side={THREE.DoubleSide} />
            </mesh>
            {Array.from({ length: 9 }).map((_, i) => (
              <mesh castShadow receiveShadow key={`flap-stripe-${i}`} position={[-7.2 + i * 1.8, -0.59, 6.46]} rotation={[-0.3, 0, 0]}>
                <planeGeometry args={[0.9, 1.2, 8, 4]} />
                <meshPhysicalMaterial color="#2d4a22" roughness={0.9} metalness={0.1} side={THREE.DoubleSide} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Environmental Props: Lanterns on front poles */}
        <group position={[-8, 6, 8]}>
          <mesh castShadow position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.2, 0.15, 0.6, 8]} />
            <meshStandardMaterial color="#222" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.15, 0.1, 0.4, 8]} />
            <meshStandardMaterial emissive="#ffaa44" emissiveIntensity={2} color="#fff" />
          </mesh>
        </group>
        <group position={[8, 6, 8]}>
          <mesh castShadow position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.2, 0.15, 0.6, 8]} />
            <meshStandardMaterial color="#222" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.15, 0.1, 0.4, 8]} />
            <meshStandardMaterial emissive="#ffaa44" emissiveIntensity={2} color="#fff" />
          </mesh>
        </group>

        {/* Display Tables for Fruits */}
        <group position={[0, 0, 2]}>
          <mesh castShadow receiveShadow position={[-3.5, 0.75, 0]}>
            <boxGeometry args={[6, 1.5, 3]} />
            <meshPhysicalMaterial color="#8b6541" roughness={0.9} />
          </mesh>
          <mesh castShadow receiveShadow position={[-3.5, 1.55, 0]}>
            <boxGeometry args={[6.5, 0.1, 3.5]} />
            <meshPhysicalMaterial color="#a67c52" roughness={0.8} />
          </mesh>
          <mesh castShadow receiveShadow position={[3.5, 0.75, 0]}>
            <boxGeometry args={[6, 1.5, 3]} />
            <meshPhysicalMaterial color="#8b6541" roughness={0.9} />
          </mesh>
          <mesh castShadow receiveShadow position={[3.5, 1.55, 0]}>
            <boxGeometry args={[6.5, 0.1, 3.5]} />
            <meshPhysicalMaterial color="#a67c52" roughness={0.8} />
          </mesh>

          {/* Environmental Props: Crates and Barrels near tables */}
          <mesh castShadow receiveShadow position={[-7.5, 0.5, 0]}>
            <boxGeometry args={[1.5, 1, 1.5]} />
            <meshStandardMaterial color="#a67c52" roughness={0.9} />
          </mesh>
          <mesh castShadow receiveShadow position={[-7.5, 1.25, 0]}>
            <boxGeometry args={[1.2, 0.5, 1.2]} />
            <meshStandardMaterial color="#c29f6b" roughness={0.9} />
          </mesh>
          <mesh castShadow receiveShadow position={[7.5, 0.6, 1]}>
            <cylinderGeometry args={[0.6, 0.6, 1.2, 16]} />
            <meshStandardMaterial color="#8b6541" roughness={0.8} />
          </mesh>
          <mesh castShadow receiveShadow position={[6.5, 0.4, -1]}>
            <cylinderGeometry args={[0.8, 0.6, 0.8, 16]} />
            <meshStandardMaterial color="#a67c52" roughness={0.9} />
          </mesh>
        </group>
      </group>

      <group position={[0, -1.5, 12]}>
        <mesh castShadow receiveShadow position={[-3.5, 2.5, 0]}>
          <boxGeometry args={[0.6, 5, 0.6]} />
          <meshPhysicalMaterial color="#8b6541" roughness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[3.5, 2.5, 0]}>
          <boxGeometry args={[0.6, 5, 0.6]} />
          <meshPhysicalMaterial color="#8b6541" roughness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 5, 0]}>
          <boxGeometry args={[8, 0.5, 0.6]} />
          <meshPhysicalMaterial color="#8b6541" roughness={0.9} />
        </mesh>
      </group>

      {/* Trees — variety with different sizes */}
      <group ref={treesRef}>
        {[
          { pos: [-12, -1.5, -10], trunkH: 3.5, canopyR: 2.2, canopyColor: '#5c8a41' },
          { pos: [12, -1.5, -8], trunkH: 3, canopyR: 1.8, canopyColor: '#6da34d' },
          { pos: [-14, -1.5, 1], trunkH: 4, canopyR: 2.5, canopyColor: '#4f7836' },
          { pos: [14, -1.5, 2], trunkH: 3.2, canopyR: 2, canopyColor: '#609144' },
          { pos: [-9, -1.5, -14], trunkH: 2.8, canopyR: 1.6, canopyColor: '#6da34d' },
          { pos: [9, -1.5, -13], trunkH: 3.6, canopyR: 2.1, canopyColor: '#5c8a41' },
        ].map((tree, i) => (
          <React.Fragment key={`tree-${i}`}>
            {USE_GLB_MODELS ? (
              <React.Suspense fallback={null}>
                <TreeGLB position={tree.pos as [number, number, number]} />
              </React.Suspense>
            ) : (
              <group position={tree.pos as [number, number, number]}>
                <mesh castShadow receiveShadow position={[0, tree.trunkH / 2, 0]}>
                  <cylinderGeometry args={[0.25, 0.4, tree.trunkH, 12]} />
                  <meshStandardMaterial color="#8b6541" roughness={0.9} />
                </mesh>
                <mesh castShadow receiveShadow position={[0, tree.trunkH + tree.canopyR * 0.6, 0]}>
                  <icosahedronGeometry args={[tree.canopyR, 2]} />
                  <meshStandardMaterial color={tree.canopyColor} roughness={0.9} />
                </mesh>
                <mesh castShadow receiveShadow position={[tree.canopyR * 0.4, tree.trunkH + tree.canopyR * 0.3, tree.canopyR * 0.3]}>
                  <icosahedronGeometry args={[tree.canopyR * 0.6, 2]} />
                  <meshStandardMaterial color={tree.canopyColor} roughness={0.9} />
                </mesh>
              </group>
            )}
          </React.Fragment>
        ))}
      </group>
    </>
  );
};
