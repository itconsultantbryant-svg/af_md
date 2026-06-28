"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

function Shape({
  position,
  geometry,
  speed,
}: {
  position: [number, number, number];
  geometry: "icosahedron" | "octahedron";
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * speed;
    ref.current.rotation.y += delta * speed * 0.7;
  });

  return (
    <mesh ref={ref} position={position}>
      {geometry === "icosahedron" ? (
        <icosahedronGeometry args={[0.8, 0]} />
      ) : (
        <octahedronGeometry args={[0.6, 0]} />
      )}
      <meshBasicMaterial color="#D4A017" wireframe transparent opacity={0.3} />
      <Edges color="#D4A017" threshold={15} />
    </mesh>
  );
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ alpha: true }}>
        <Shape position={[-2, 1, 0]} geometry="icosahedron" speed={0.3} />
        <Shape position={[2, -1, -1]} geometry="octahedron" speed={0.4} />
        <Shape position={[0, 2, -2]} geometry="icosahedron" speed={0.2} />
        <Shape position={[-1.5, -2, 0]} geometry="octahedron" speed={0.35} />
        <Shape position={[1.5, 0.5, -1]} geometry="icosahedron" speed={0.25} />
      </Canvas>
    </div>
  );
}
