import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import type { Mesh, Texture } from 'three';

function FloatingPlane() {
  const meshRef = useRef<Mesh>(null);
  const texture = useLoader(TextureLoader, '/0c0468f7-d6eb-4bc0-acff-4ade9507ab1d-removebg-preview.png');

  // Calculate aspect ratio from actual image dimensions
  const img = (texture as Texture).image as HTMLImageElement;
  const aspect = img ? (img.width / img.height) : 1;
  
  // Base size — fits comfortably inside the container without expanding
  const height = 1.6;
  const width = height * aspect;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Smooth float using sine wave — entirely in GPU/WebGL, zero CSS involvement
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.06;
      // Very subtle rotation for a living feel
      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.012;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.1} />
    </mesh>
  );
}

export default function HeroModel3D() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Small delay to prevent flash
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 2.2], fov: 45 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      dpr={[1, 2]}
    >
      <FloatingPlane />
    </Canvas>
  );
}
