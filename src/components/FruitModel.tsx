import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import type { Fruit } from '../data/fruits';

interface FruitModelProps {
  fruit: Fruit;
}

const fruitShapes: Record<string, { scale: [number, number, number]; segments: number; hasStem: boolean; hasLeaf: boolean }> = {
  apple:      { scale: [1, 0.9, 1], segments: 32, hasStem: true, hasLeaf: true },
  orange:     { scale: [1, 1, 1], segments: 32, hasStem: false, hasLeaf: true },
  lemon:      { scale: [0.7, 1.1, 0.7], segments: 32, hasStem: false, hasLeaf: true },
  mango:      { scale: [0.75, 1.15, 0.65], segments: 32, hasStem: true, hasLeaf: true },
  banana:     { scale: [0.35, 1.4, 0.35], segments: 16, hasStem: true, hasLeaf: false },
  grapes:     { scale: [0.9, 1.2, 0.9], segments: 24, hasStem: true, hasLeaf: true },
};

const USE_GLB_MODELS = false;

const GLBFruit: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  return <primitive object={scene.clone()} scale={[0.4, 0.4, 0.4]} />;
};

function createGradientTexture(colorStops: { stop: number; color: string }[]) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const context = canvas.getContext('2d')!;
  const gradient = context.createLinearGradient(0, 0, 0, 256);
  colorStops.forEach(({ stop, color }) => gradient.addColorStop(stop, color));
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const FruitModel: React.FC<FruitModelProps> = ({ fruit }) => {
  const groupRef = useRef<THREE.Group>(null);
  const fruitRef = useRef<THREE.Group>(null);

  const { 
    selectedFruitId, 
    hoveredFruitId, 
    setSelectedFruitId, 
    setHoveredFruitId, 
    setCameraTarget, 
    setCameraPosition, 
    setIsCameraTransitioning 
  } = useStore();

  const isSelected = selectedFruitId === fruit.id;
  const isHovered = hoveredFruitId === fruit.id;
  const isActive = isSelected || isHovered;
  const isOtherActive = (selectedFruitId || hoveredFruitId) && !isActive;

  const shape = fruitShapes[fruit.id] || { scale: [1, 1, 1], segments: 32, hasStem: true, hasLeaf: false };
  const seed = useMemo(() => fruit.position[0] * 3.7 + fruit.position[2] * 2.1, [fruit.position]);

  const customTextures = useMemo(() => {
    if (fruit.id === 'apple') return createGradientTexture([{stop: 0, color: '#f1c40f'}, {stop: 0.5, color: '#e74c3c'}, {stop: 1, color: '#8b0000'}]);
    if (fruit.id === 'mango') return createGradientTexture([{stop: 0, color: '#27ae60'}, {stop: 0.5, color: '#f39c12'}, {stop: 1, color: '#e74c3c'}]);
    return null;
  }, [fruit.id]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (isSelected) {
      setSelectedFruitId(null);
      setCameraPosition([0, 2, 8]);
      setCameraTarget([0, 1, 0]);
    } else {
      setSelectedFruitId(fruit.id);
      const [fx, fy, fz] = fruit.position;
      setCameraPosition([fx + 1.2, fy + 1.2, fz + 3.0]);
      setCameraTarget([fx, fy, fz]);
    }
    setIsCameraTransitioning(true);
  };

  useFrame((state) => {
    if (fruitRef.current) {
      fruitRef.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 1.2 + seed) * 0.12;
      fruitRef.current.rotation.y += isActive ? 0.025 : 0.003;
    }
  });

  const baseScale = isActive ? 1.15 : 1;
  const displayOpacity = isOtherActive ? 0.3 : 1.0;

  const renderFruitGeometry = () => {
    if (fruit.id === 'banana') {
      return (
        <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 6]}>
          <torusGeometry args={[0.5, 0.15, 12, 24, Math.PI / 1.5]} />
          <meshPhysicalMaterial 
            color={fruit.color} roughness={0.4} clearcoat={0.3} 
            transparent opacity={displayOpacity}
            emissive={isActive ? fruit.color : '#000'} emissiveIntensity={isActive ? 0.2 : 0}
          />
          <mesh position={[-0.45, -0.2, 0]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshStandardMaterial color="#2c3e50" roughness={0.9} transparent opacity={displayOpacity} />
          </mesh>
          <mesh position={[0.45, 0.2, 0]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshStandardMaterial color="#2c3e50" roughness={0.9} transparent opacity={displayOpacity} />
          </mesh>
        </mesh>
      );
    }
    if (fruit.id === 'grapes') {
      return (
        <group position={[0, -0.2, 0]}>
          {Array.from({ length: 14 }).map((_, i) => {
            const shadeOffset = Math.sin(i * 123.4) * 20;
            return (
              <mesh castShadow receiveShadow key={i} position={[(Math.random() - 0.5) * 0.4, Math.random() * 0.6, (Math.random() - 0.5) * 0.4]}>
                <sphereGeometry args={[0.18, 12, 12]} />
                <meshPhysicalMaterial 
                  color={`hsl(282, 44%, ${40 + shadeOffset}%)`} 
                  roughness={0.2} clearcoat={0.5} 
                  transparent opacity={displayOpacity}
                  emissive={isActive ? fruit.color : '#000'} emissiveIntensity={isActive ? 0.2 : 0}
                />
              </mesh>
            );
          })}
        </group>
      );
    }

    return (
      <mesh castShadow receiveShadow scale={shape.scale as [number, number, number]}>
        <sphereGeometry args={[0.4, shape.segments, shape.segments]} />
        <meshPhysicalMaterial
          color={customTextures ? undefined : fruit.color}
          map={customTextures}
          roughness={fruit.id === 'orange' ? 0.6 : 0.35}
          bumpScale={fruit.id === 'orange' ? 0.02 : 0}
          metalness={0.02}
          clearcoat={fruit.id === 'orange' ? 0.1 : 0.4}
          clearcoatRoughness={0.2}
          transparent
          opacity={displayOpacity}
          emissive={isActive ? fruit.color : '#000'}
          emissiveIntensity={isActive ? 0.2 : 0}
        />
      </mesh>
    );
  };

  const renderBase = () => {
    if (fruit.id === 'banana') {
      return (
        <group position={[0, -0.4, 0]}>
          <mesh castShadow receiveShadow position={[0, 0.4, -0.2]}>
            <cylinderGeometry args={[0.06, 0.06, 1.8, 8]} />
            <meshStandardMaterial color="#5c4033" roughness={0.9} transparent opacity={displayOpacity} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 1.2, -0.05]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
            <meshStandardMaterial color="#3e2723" roughness={0.9} transparent opacity={displayOpacity} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, -0.5, -0.2]}>
            <cylinderGeometry args={[0.4, 0.5, 0.1, 16]} />
            <meshStandardMaterial color="#5c4033" roughness={0.9} transparent opacity={displayOpacity} />
          </mesh>
        </group>
      );
    }
    if (fruit.id === 'grapes') {
      return (
        <group position={[0, -0.5, 0]}>
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <cylinderGeometry args={[0.7, 0.5, 0.5, 16]} />
            <meshStandardMaterial color="#d4a373" roughness={1} wireframe={false} transparent opacity={displayOpacity} />
          </mesh>
        </group>
      );
    }
    if (['apple', 'orange', 'lemon'].includes(fruit.id)) {
      return (
        <group position={[0, -0.6, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.5, 1.4]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.9} transparent opacity={displayOpacity} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[1.2, 0.5, 1.2]} />
            <meshStandardMaterial color="#3d2314" roughness={1} transparent opacity={displayOpacity} />
          </mesh>
        </group>
      );
    }
    return (
      <group position={[0, -0.55, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.85, 0.1, 32]} />
          <meshStandardMaterial color="#6b4423" roughness={0.8} transparent opacity={displayOpacity} />
        </mesh>
      </group>
    );
  };

  return (
    <group ref={groupRef} position={fruit.position}>
      {renderBase()}

      {isActive && (
        <>
          <SpotLight position={[0, 3, 1]} angle={0.6} penumbra={1} intensity={6} color="#fff8e7" castShadow={false} />
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1.2, 32, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </>
      )}

      <group
        ref={fruitRef}
        scale={[baseScale, baseScale, baseScale]}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredFruitId(fruit.id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHoveredFruitId(null); document.body.style.cursor = 'auto'; }}
        onClick={handleClick}
      >
        {USE_GLB_MODELS && fruit.modelPath ? (
          <React.Suspense fallback={renderFruitGeometry()}>
            <GLBFruit modelPath={fruit.modelPath} />
          </React.Suspense>
        ) : (
          <>
            {renderFruitGeometry()}
            {shape.hasStem && (
              <mesh castShadow receiveShadow position={[0, 0.45, 0]} rotation={[0, 0, 0.2]}>
                <cylinderGeometry args={[0.02, 0.03, 0.15, 6]} />
                <meshStandardMaterial color="#4e342e" roughness={0.8} transparent opacity={displayOpacity} />
              </mesh>
            )}
            {shape.hasLeaf && (
              <mesh castShadow receiveShadow position={[0.1, 0.45, 0]} rotation={[0.3, 0, -0.5]}>
                <sphereGeometry args={[0.12, 12, 12]} />
                <meshStandardMaterial color="#388e3c" roughness={0.5} transparent opacity={displayOpacity} />
              </mesh>
            )}
          </>
        )}
      </group>
    </group>
  );
};
