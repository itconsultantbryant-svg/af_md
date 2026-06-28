"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMediaQuery } from "@/lib/hooks/useWindowSize";

function Particles({ count }: { count: number }) {
  const mesh = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.001;

      const isGold = Math.random() < 0.6;
      colors[i * 3] = isGold ? 0.83 : 0.29;
      colors[i * 3 + 1] = isGold ? 0.63 : 0.56;
      colors[i * 3 + 2] = isGold ? 0.09 : 0.85;
    }

    return { positions, velocities, colors };
  }, [count]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      pos[ix] += velocities[ix];
      pos[ix + 1] += velocities[ix + 1];
      pos[ix + 2] += velocities[ix + 2];

      const dx = pos[ix] - mouse.current.x * 10;
      const dy = pos[ix + 1] - mouse.current.y * 10;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 1.5) {
        const force = (1.5 - dist) * 0.02;
        pos[ix] += (dx / dist) * force;
        pos[ix + 1] += (dy / dist) * force;
      }

      for (let j = 0; j < 3; j++) {
        if (Math.abs(pos[ix + j]) > 10) velocities[ix + j] *= -1;
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

export function ParticleField({
  particleCount,
  className = "absolute inset-0",
}: {
  particleCount?: number;
  className?: string;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const count = particleCount ?? (isMobile ? 600 : 2000);

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Particles count={count} />
      </Canvas>
    </div>
  );
}
