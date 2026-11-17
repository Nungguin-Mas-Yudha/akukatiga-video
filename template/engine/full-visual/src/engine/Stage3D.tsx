// Real 3D on the stage band (y 520-1450, full width): one hero object per chapter, lit like the look bible says.
// The rig is fixed: a warm key from upper left, a thin cool rim from back right, a low warm fill, a little ambient,
// and a studio environment built from light panels (no HDRI download; pass `hdri` for a file in assets/) so metal
// has something to reflect. A contact shadow grounds the object. No depth of field by default.
// Everything moves from the frame: the scene computes `view` and the objects' transforms from its cues. Never
// useFrame for animation and never Math.random: a frame has to render the same every time.
import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useAsset } from "./context";

type V3 = [number, number, number];
/** the 3D camera: where it stands, what it looks at, its lens. Animate it by computing it from cues each frame */
export type View = { position: V3; target?: V3; fov?: number };

const Rig: React.FC<{ view: View }> = ({ view }) => {
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => {
    // runs on every render (every frame), before @remotion/three advances the scene
    camera.position.set(...view.position);
    if (view.fov && camera instanceof THREE.PerspectiveCamera && camera.fov !== view.fov) {
      camera.fov = view.fov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(...(view.target ?? [0, 0, 0]));
  });
  return null;
};

const Hdri: React.FC<{ file: string; intensity: number }> = ({ file, intensity }) => <Environment files={useAsset(file)} environmentIntensity={intensity} />;

type Props = {
  view?: View;
  /** the contact shadow on the floor plane; false for an object floating in the dark */
  shadow?: false | { y?: number; opacity?: number; blur?: number; scale?: number };
  /** multiplies the whole rig: 1 = the look bible's balance */
  light?: number;
  /** an .hdr in the reel's assets/ instead of the built-in light panels */
  hdri?: string;
  top?: number;
  height?: number;
  children: React.ReactNode;
};

export const Stage3D: React.FC<Props> = ({ view = { position: [0, 0.6, 7], target: [0, 0, 0], fov: 32 }, shadow = {}, light = 1, hdri, top = 520, height = 930, children }) => (
  <div style={{ position: "absolute", left: 0, top, width: 1080, height }}>
    <ThreeCanvas width={1080} height={height} camera={{ position: view.position, fov: view.fov ?? 32, near: 0.1, far: 100 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}>
      <Rig view={view} />
      {/* key ~4000 K from upper left 45 degrees, rim cool and thin from back right, fill low and warm */}
      <directionalLight position={[-4, 5, 4]} intensity={2.6 * light} color="#FFD6A8" />
      <directionalLight position={[4.5, 2.5, -5]} intensity={2.2 * light} color="#A9CDFF" />
      <directionalLight position={[0.5, -2.5, 4]} intensity={0.35 * light} color="#FFB98A" />
      <ambientLight intensity={0.16 * light} color="#FFE8D0" />
      {hdri ? (
        <Hdri file={hdri} intensity={0.65 * light} />
      ) : (
        <Environment resolution={256} frames={1} environmentIntensity={0.65 * light}>
          <Lightformer form="rect" intensity={3} color="#FFD9B0" position={[-4, 4, 3]} scale={[5, 3, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={2} color="#B7D3FF" position={[5, 1, -4]} scale={[1.2, 6, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={0.5} color="#FFC9A0" position={[0, -3, 4]} scale={[8, 2, 1]} target={[0, 0, 0]} />
        </Environment>
      )}
      {shadow && <ContactShadows position={[0, shadow.y ?? -1.2, 0]} opacity={shadow.opacity ?? 0.6} blur={shadow.blur ?? 2.6} scale={shadow.scale ?? 12} far={4} resolution={512} color="#140A04" />}
      {children}
    </ThreeCanvas>
  </div>
);

type Mat = Partial<THREE.MeshPhysicalMaterialParameters>;
const PRESETS = {
  metal: { metalness: 1, roughness: 0.25, color: "#B9B9BE" },
  brushedAluminium: { metalness: 1, roughness: 0.35, anisotropy: 0.6, color: "#C9CCD1" },
  plastic: { metalness: 0, roughness: 0.45, clearcoat: 0.3, color: "#F1EEE8" },
  glass: { metalness: 0, roughness: 0.05, transmission: 1, ior: 1.5, thickness: 0.5, color: "#FFFFFF" },
  copper: { metalness: 1, roughness: 0.3, color: "#C8743E" },
  rubber: { metalness: 0, roughness: 0.85, sheen: 0.3, color: "#1E1E20" },
  emissive: { metalness: 0, roughness: 0.5, color: "#2A1A10", emissive: "#FF8A2A", emissiveIntensity: 0 },
} satisfies Record<string, Mat>;
export type MaterialName = keyof typeof PRESETS;

/** the look bible's MeshPhysicalMaterial settings: <meshPhysicalMaterial {...material("copper")} />.
 *  `glow` (0-1, from burst() on a cue) lights an emissive only while its event lasts */
export function material(name: MaterialName, o: Mat & { glow?: number } = {}): Mat {
  const { glow, ...rest } = o;
  return { ...PRESETS[name], ...(glow !== undefined ? { emissiveIntensity: 4 * glow } : {}), ...rest };
}

/** a .glb from the reel's assets/ folder, cloned so it can be placed more than once; `override` re-skins every mesh
 *  with one material preset. Loads without the Draco decoder (that one is fetched from a CDN). */
export const Model: React.FC<{ file: string; override?: Mat } & Omit<React.ComponentProps<"group">, "children">> = ({ file, override, ...group }) => {
  const { scene } = useGLTF(useAsset(file), false);
  const obj = useMemo(() => {
    const c = scene.clone(true);
    if (override) c.traverse((o) => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = new THREE.MeshPhysicalMaterial(override); });
    return c;
  }, [scene, override]);
  return (
    <group {...(group as object)}>
      <primitive object={obj} />
    </group>
  );
};
