"use client";

// The hero's 3D scene: three things I've made, floating. The Chess It Up logo
// (the chef pawn with his spatula), a play button (the YouTube channel) and a
// waveform (the voice assistant). Hover one to see what it is, click to jump to it. The whole
// group leans toward the cursor and lifts away as the hero scrolls out.
// Shapes are built in code (no model files); reflections come from in-scene
// Lightformers (no HDR download).

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, Outlines, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

export type ThingId = "chess" | "youtube" | "voice";

interface SceneProps {
  scroll: { p: number };   // 0..1, how far the hero has scrolled away
  running: boolean;        // false once the hero is off screen
  still: boolean;          // prefers-reduced-motion
  onHover: (id: ThingId | null) => void;
  onPick: (id: ThingId) => void;
}

// [radius, height] profiles, turned around the Y axis
const BODY: [number, number][] = [
  [0, 0.42], [0.84, 0.42], [0.87, 0.5], [0.8, 0.61], [0.62, 0.8], [0.45, 1.06], [0.34, 1.35], [0.27, 1.6], [0, 1.6],
];
const NECK: [number, number][] = [[0, 0], [0.26, 0], [0.3, 0.15], [0.41, 0.42], [0, 0.42]];
const CROWN: [number, number][] = [[0, 0.62], [0.45, 0.62], [0.5, 0.8], [0.6, 1], [0.56, 1.14], [0, 1.2]];
const lathe = (p: [number, number][]) => new THREE.LatheGeometry(p.map(([x, y]) => new THREE.Vector2(x, y)), 64);

const BARS = [0.55, 1, 0.7, 1.15, 0.6];

const damp = (dt: number, speed: number) => 1 - Math.exp(-dt * speed);

/** One hoverable, clickable object: pops in on load, floats, grows on hover. */
function Thing({ id, position, delay, still, onHover, onPick, children }: {
  id: ThingId; position: [number, number, number]; delay: number; children: React.ReactNode;
} & Pick<SceneProps, "still" | "onHover" | "onPick">) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const target = useMemo(() => new THREE.Vector3(), []);

  useLayoutEffect(() => {
    if (still) return;
    const t = gsap.fromTo(outer.current!.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1.2, delay, ease: "back.out(1.7)" });
    return () => { t.kill(); };
  }, [still, delay]);

  useFrame((_, dt) => {
    const s = hovered.current ? 1.14 : 1;
    inner.current!.scale.lerp(target.set(s, s, s), damp(dt, 10));
  });

  const hover = (on: boolean) => {
    hovered.current = on;
    onHover(on ? id : null);
    document.body.style.cursor = on ? "pointer" : "";
  };

  return (
    <group ref={outer} position={position}>
      <Float speed={still ? 0 : 2} rotationIntensity={0.5} floatIntensity={0.9}>
        <group
          ref={inner}
          onPointerOver={(e) => { e.stopPropagation(); hover(true); }}
          onPointerOut={() => hover(false)}
          onClick={(e) => { e.stopPropagation(); onPick(id); }}
        >
          {children}
        </group>
      </Float>
    </group>
  );
}

/** The Chess It Up logo: a teal pawn in a chef's hat, holding a spatula. */
function ChefPawn({ still }: { still: boolean }) {
  const body = useMemo(() => lathe(BODY), []);
  const neck = useMemo(() => lathe(NECK), []);
  const crown = useMemo(() => lathe(CROWN), []);
  const ref = useRef<THREE.Group>(null);
  // sways instead of spinning, so the hat and spatula stay readable
  useFrame(({ clock }) => { if (!still) ref.current!.rotation.y = Math.sin(clock.elapsedTime * 0.6) * 0.55; });

  const line = <Outlines thickness={0.035} color="#0b0d22" />;
  const teal = <meshPhysicalMaterial color="#00c0c4" roughness={0.22} clearcoat={1} clearcoatRoughness={0.1} />;
  const white = <meshPhysicalMaterial color="#ffffff" roughness={0.5} />;

  return (
    <group ref={ref} position={[0, -1.4, 0]} scale={0.9}>
      {/* the two bars under the pawn */}
      {[0.11, 0.3].map((y) => (
        <mesh key={y} position={[0, y, 0]}><cylinderGeometry args={[0.95, 0.95, 0.13, 64]} />{teal}{line}</mesh>
      ))}
      <mesh geometry={body}>{teal}{line}</mesh>
      <mesh position={[0, 1.67, 0]}><cylinderGeometry args={[0.5, 0.5, 0.12, 64]} />{teal}{line}</mesh>

      {/* head and hat, tipped to one side like the logo */}
      <group position={[0, 1.73, 0]} rotation={[0, 0, -0.22]}>
        <mesh geometry={neck}>{teal}{line}</mesh>
        <mesh position={[0, 0.52, 0]}><cylinderGeometry args={[0.45, 0.43, 0.2, 64]} />{white}{line}</mesh>
        <mesh position={[0, 0.64, 0]}>
          <cylinderGeometry args={[0.465, 0.465, 0.035, 64]} />
          <meshBasicMaterial color="#0b0d22" />
        </mesh>
        <mesh geometry={crown}>{white}{line}</mesh>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2 + 0.3;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.36, 1.12, Math.sin(a) * 0.36]}>
              <sphereGeometry args={[0.28, 32, 32]} />{white}{line}
            </mesh>
          );
        })}
        <mesh position={[0, 1.26, 0]}><sphereGeometry args={[0.34, 32, 32]} />{white}{line}</mesh>
      </group>

      {/* spatula */}
      <group position={[-0.98, 1.3, 0.3]} rotation={[0, 0, 0.62]}>
        <mesh><cylinderGeometry args={[0.035, 0.035, 1.3, 16]} /><meshBasicMaterial color="#0b0d22" /></mesh>
        <mesh position={[0, -0.52, 0]}>
          <capsuleGeometry args={[0.075, 0.42, 8, 20]} />
          <meshPhysicalMaterial color="#d2121a" roughness={0.3} clearcoat={1} />{line}
        </mesh>
        <RoundedBox args={[0.58, 0.5, 0.06]} radius={0.03} smoothness={4} position={[0, 0.88, 0]}>
          <meshPhysicalMaterial color="#b9bcc4" roughness={0.35} metalness={0.4} />{line}
        </RoundedBox>
        {[-0.15, 0, 0.15].map((x) => (
          <mesh key={x} position={[x, 0.88, 0]}>
            <boxGeometry args={[0.07, 0.3, 0.075]} />
            <meshBasicMaterial color="#0b0d22" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function PlayButton() {
  const triangle = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.26, -0.34); s.lineTo(0.4, 0); s.lineTo(-0.26, 0.34); s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3 });
  }, []);
  return (
    <group rotation={[0.15, -0.45, 0.08]}>
      <RoundedBox args={[1.9, 1.35, 0.5]} radius={0.3} smoothness={6}>
        <meshPhysicalMaterial color="#ff3d2e" roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} />
      </RoundedBox>
      <mesh geometry={triangle} position={[0, 0, 0.25]}>
        <meshPhysicalMaterial color="#f4f1e8" roughness={0.3} />
      </mesh>
    </group>
  );
}

function Waveform({ still }: { still: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (still) return;
    ref.current!.children.forEach((bar, i) => {
      bar.scale.y = BARS[i] * (0.65 + 0.35 * Math.sin(clock.elapsedTime * 3.2 + i * 1.1));
    });
  });
  return (
    <group ref={ref} rotation={[0, 0.35, 0]}>
      {BARS.map((h, i) => (
        <mesh key={i} position={[(i - 2) * 0.36, 0, 0]} scale={[1, h, 1]}>
          <capsuleGeometry args={[0.12, 1, 8, 20]} />
          <meshPhysicalMaterial color="#ffd84a" roughness={0.25} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
}

/** Places the group for the screen shape, leans it toward the cursor, lifts it on scroll. */
function Rig({ scroll, still, children }: { scroll: { p: number }; still: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const portrait = viewport.aspect < 1;
  const x = portrait ? 0 : viewport.width * 0.23;
  const y = portrait ? viewport.height * 0.2 : -0.1;
  const scale = portrait ? Math.min(0.62, viewport.width / 5.4) : Math.min(1, viewport.width / 10);

  useFrame((state, dt) => {
    const g = ref.current!;
    const k = damp(dt, 4);
    const px = still ? 0 : state.pointer.x, py = still ? 0 : state.pointer.y;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, px * 0.3 + scroll.p * 0.9, k);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -py * 0.18, k);
    g.position.y = y + scroll.p * viewport.height * 0.55;
  });

  return <group ref={ref} position={[x, y, 0]} scale={scale}>{children}</group>;
}

export default function HeroScene({ scroll, running, still, onHover, onPick }: SceneProps) {
  const thing = { still, onHover, onPick };
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0, 0, 10] }}
      gl={{ alpha: true, antialias: true }}
      frameloop={running ? "always" : "never"}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <pointLight position={[-5, -2, 3]} intensity={40} color="#ffd84a" />
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 5, -4]} scale={[10, 3, 1]} color="#ffffff" />
        <Lightformer intensity={2} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} color="#8f98ff" />
        <Lightformer intensity={2} position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#ffffff" />
      </Environment>
      <Rig scroll={scroll} still={still}>
        <Thing id="chess" position={[0.3, -0.2, 0]} delay={0.5} {...thing}><ChefPawn still={still} /></Thing>
        <Thing id="youtube" position={[-1.75, 1.35, -0.6]} delay={0.7} {...thing}><PlayButton /></Thing>
        <Thing id="voice" position={[1.9, 1.2, -0.4]} delay={0.9} {...thing}><Waveform still={still} /></Thing>
      </Rig>
    </Canvas>
  );
}
