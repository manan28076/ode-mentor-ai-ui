import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

// Diff-line data: mirrors what a real review diff looks like.
// Colors pull from the app's own --primary (mint/teal, additions) and
// --destructive (deletions) tokens rather than a generic accent.
const LINES = [
  { text: "+ const score = analyze(code);", type: "add" as const },
  { text: "- return null;", type: "del" as const },
  { text: "+ if (!token) throw new AuthError();", type: "add" as const },
  { text: "+ export function reviewDiff(pr) {", type: "add" as const },
  { text: "- console.log(debug);", type: "del" as const },
  { text: "+ await gemini.review(chunk);", type: "add" as const },
];

const ADD_COLOR = "#5FE0C4"; // matches --primary (mint/teal)
const DEL_COLOR = "#E2604A"; // matches --destructive
const PANEL_COLOR = "#1c1f24";

function DiffPanel({
  position,
  rotation,
  line,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  line: (typeof LINES)[number];
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const speed = useMemo(() => 0.3 + Math.random() * 0.3, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + offset;
    ref.current.position.y = position[1] + Math.sin(t) * 0.15;
    ref.current.rotation.z = rotation[2] + Math.sin(t * 0.6) * 0.03;
  });

  const barColor = line.type === "add" ? ADD_COLOR : DEL_COLOR;

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[3.4, 0.5, 0.08]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={PANEL_COLOR} roughness={0.5} metalness={0.15} />
      </RoundedBox>
      {/* diff indicator bar */}
      <mesh position={[-1.62, 0, 0.05]}>
        <boxGeometry args={[0.06, 0.5, 0.02]} />
        <meshStandardMaterial color={barColor} emissive={barColor} emissiveIntensity={0.6} />
      </mesh>
      <Text
        position={[-1.4, 0, 0.06]}
        fontSize={0.15}
        color={line.type === "add" ? ADD_COLOR : "#c9cdd3"}
        anchorX="left"
        anchorY="middle"
        maxWidth={3}
      >
        {line.text}
      </Text>
    </group>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    group.current.rotation.y = pointer.x * 0.2 + Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    group.current.rotation.x = -pointer.y * 0.08;
  });

  return (
    <group ref={group}>
      <Float speed={1} rotationIntensity={0} floatIntensity={0}>
        {LINES.map((line, i) => {
          const depth = i * -0.55;
          const xOffset = i % 2 === 0 ? -0.35 : 0.35;
          return (
            <DiffPanel
              key={i}
              line={line}
              position={[xOffset, (LINES.length / 2 - i) * 0.62, depth]}
              rotation={[0, 0.15, 0]}
              scale={1 - i * 0.03}
            />
          );
        })}
      </Float>
      <ambientLight intensity={0.9} />
      <pointLight position={[3, 3, 3]} intensity={45} color={ADD_COLOR} />
      <pointLight position={[-3, -2, 2]} intensity={25} color={DEL_COLOR} />
    </group>
  );
}

export function AuthScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}