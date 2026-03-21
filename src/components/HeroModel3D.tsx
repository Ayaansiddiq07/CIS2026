import { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import type { Mesh } from 'three';

function FloatingPlane() {
  const meshRef = useRef<Mesh>(null);
  const texture = useLoader(TextureLoader, '/0c0468f7-d6eb-4bc0-acff-4ade9507ab1d-removebg-preview.png');

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Smooth float using sine wave — entirely in GPU/WebGL, zero CSS involvement
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.08;
      // Very subtle rotation for a living feel
      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.015;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2.4, 2.4]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.1} />
    </mesh>
  );
}

export default function HeroModel3D() {
  return (
    <div className="w-[180px] sm:w-[260px] lg:w-[360px] xl:w-[420px] aspect-square">
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <FloatingPlane />
      </Canvas>
    </div>
  );
}
