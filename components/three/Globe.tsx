"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

const cities = [
  { name: "Monrovia", country: "Liberia", lat: 6.3, lng: -10.8, hq: true },
  { name: "Lagos", country: "Nigeria", lat: 6.5, lng: 3.4 },
  { name: "Accra", country: "Ghana", lat: 5.6, lng: -0.2 },
  { name: "Nairobi", country: "Kenya", lat: -1.3, lng: 36.8 },
  { name: "Addis Ababa", country: "Ethiopia", lat: 9.0, lng: 38.7 },
  { name: "Abidjan", country: "Côte d'Ivoire", lat: 5.3, lng: -4.0 },
  { name: "London", country: "UK", lat: 51.5, lng: -0.1 },
  { name: "Washington DC", country: "USA", lat: 38.9, lng: -77.0 },
  { name: "Brussels", country: "Belgium", lat: 50.8, lng: 4.4 },
];

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function GlobeMesh() {
  const globeRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const { gl } = useThree();

  const cityPositions = useMemo(
    () => cities.map((c) => latLngToVector3(c.lat, c.lng, 2.02)),
    []
  );

  const connectionPairs = useMemo(() => {
    const pairs: [THREE.Vector3, THREE.Vector3][] = [];
    const hq = cityPositions[0];
    for (let i = 1; i < cityPositions.length; i++) {
      pairs.push([hq, cityPositions[i]]);
    }
    return pairs;
  }, [cityPositions]);

  useFrame(() => {
    if (globeRef.current && !paused) {
      globeRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group>
      <mesh
        ref={globeRef}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#0a1628"
          roughness={0.8}
          metalness={0.2}
          emissive="#1a3c6e"
          emissiveIntensity={0.15}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.05, 64, 64]} />
        <meshBasicMaterial
          color="#4a90d9"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {connectionPairs.map(([a, b], i) => {
        const mid = a
          .clone()
          .add(b)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(2.5);
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        const points = curve.getPoints(50);
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={points.length}
                array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#D4A017" transparent opacity={0.4} />
          </line>
        );
      })}

      {cities.map((city, i) => (
        <group key={city.name} position={cityPositions[i]}>
          <mesh
            onPointerEnter={() => {
              setHovered(i);
              gl.domElement.style.cursor = "pointer";
            }}
            onPointerLeave={() => {
              setHovered(null);
              gl.domElement.style.cursor = "auto";
            }}
          >
            <sphereGeometry args={[city.hq ? 0.06 : 0.04, 16, 16]} />
            <meshBasicMaterial color="#D4A017" />
          </mesh>
          {hovered === i && (
            <Html distanceFactor={8}>
              <div className="bg-brand-darker/90 border border-brand-gold/30 rounded-lg px-3 py-2 text-xs whitespace-nowrap pointer-events-none">
                <span className="text-brand-gold font-semibold">{city.name}</span>
                <span className="text-brand-muted ml-1">{city.country}</span>
              </div>
            </Html>
          )}
        </group>
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </group>
  );
}

export function GlobeScene() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#4a90d9" />
        <Suspense fallback={null}>
          <GlobeMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default GlobeScene;
