// The editor draws scenes as DOM/SVG/three. Only videos/minyak-air/composition/Fx.tsx pulls Skia in
// (SkiaCanvas + 2D shader components), and a Skia canvas cannot run inside the Player page here.
// Both Skia packages therefore resolve to this no-op: those effects simply do not draw in the editor.
// Render is untouched: engine/full-visual/render.mjs imports @remotion/skia/enable itself.
import React from "react";

const Null: React.FC<{ children?: React.ReactNode }> = () => null;

export const SkiaCanvas = Null;
export const BlurMask = Null;
export const Circle = Null;
export const Group = Null;
export const Oval = Null;
export const Rect = Null;
export const Shader = Null;
export const Path = Null;
export const RoundedRect = Null;
export const DashPathEffect = Null;
export const LinearGradient = Null;
export const RadialGradient = Null;
export const ImageShader = Null;
export const Mask = Null;
export const Paint = Null;
export const Points = Null;
export const Line = Null;

export const PathOp = { Union: 0, Difference: 1, Intersect: 2, XOR: 3, ReverseDifference: 4 } as const;
export const TileMode = { Clamp: 0, Repeat: 1, Mirror: 2, Decal: 3 } as const;
export const BlendMode = { SrcOver: 0, Screen: 1, Plus: 2, Multiply: 3 } as const;

// Fx.tsx compiles its shaders at module scope; Make has to answer or importing the module throws.
export const Skia = {
  RuntimeEffect: { Make: (_src: string) => ({}) },
  Image: { MakeImageFromView: async () => null },
};

export const LoadSkia = async () => undefined;
export const enableSkia = (config: unknown) => config;
export default {};
