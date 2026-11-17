// The camera a scene's stage is seen through. It never stops: a slow drift from noise is always on, a few px and a
// fraction of a degree, so no frame is ever dead still. On top of it the moves a scene cues, in 60 fps frames:
//   push   scale +5-12 % over 0.6 s, power2.out, ending on a word (at = endsOn(word, 36)); long and slow across a
//          sentence (dur = the sentence, by 0.15) it is the reference's slow push
//   dolly  the pull-back reveal: starts close (1 + by) and backs out to 1 over 1-2 s, power3.out
//   dive   scale x3.5 toward a point in 0.75 s, power2.in, then a transition carries it ("in: iris" / "in: zoom")
//   whip   a fast pan of dx/dy px in 0.25 s
// Fast moves (dive, whip) get real motion blur from <CameraMotionBlur> while they are fast, and only then.
// The camera frames the stage only: the caption is another layer and never moves.
import React, { useContext } from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { SceneContext } from "./context";
import { ease, prog } from "./moves";

type Pt = { x?: number; y?: number }; // the stage point the move is about (default the stage centre, 540,985)
export type Shot =
  | ({ move: "push"; at: number; dur?: number; by?: number; curve?: (t: number) => number } & Pt)
  | ({ move: "dolly"; at: number; dur?: number; by?: number } & Pt)
  | ({ move: "dive"; at: number; dur?: number; to?: number } & Pt)
  | { move: "whip"; at: number; dur?: number; dx?: number; dy?: number };

type M = [number, number, number, number, number, number]; // 2D affine, as CSS matrix(a, b, c, d, e, f)
const mul = (p: M, q: M): M => [
  p[0] * q[0] + p[2] * q[1], p[1] * q[0] + p[3] * q[1],
  p[0] * q[2] + p[2] * q[3], p[1] * q[2] + p[3] * q[3],
  p[0] * q[4] + p[2] * q[5] + p[4], p[1] * q[4] + p[3] * q[5] + p[5],
];
const about = (s: number, x: number, y: number, rad = 0): M => {
  const c = Math.cos(rad) * s, n = Math.sin(rad) * s;
  return [c, n, -n, c, x - c * x + n * y, y - n * x - c * y];
};
const apply = (m: M, x: number, y: number) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

const CX = 540, CY = 985;
const FAST: Shot["move"][] = ["dive", "whip"];

/** the camera at frame f, as one matrix: the drift, then each cued move in order */
export function cameraAt(f: number, shots: Shot[], drift = 1, seed = "camera"): M {
  const t = f / 60;
  let m: M = [1, 0, 0, 1, 0, 0];
  if (drift > 0) {
    const dx = 6 * drift * noise2D(seed, t * 0.3, 0.5);
    const dy = 6 * drift * noise2D(seed, 3.7, t * 0.3);
    const rot = ((0.22 * drift * Math.PI) / 180) * noise2D(seed, t * 0.2, 9.1);
    m = mul([1, 0, 0, 1, dx, dy], about(1 + 0.006 * drift, CX, CY, rot));
  }
  for (const s of shots) {
    if (s.move === "whip") {
      const p = prog(f, s.at, s.dur ?? 15, ease.inOut);
      m = mul(m, [1, 0, 0, 1, (s.dx ?? 0) * p, (s.dy ?? 0) * p]);
      continue;
    }
    const x = s.x ?? CX, y = s.y ?? CY;
    let k = 1;
    if (s.move === "push") k = 1 + (s.by ?? 0.08) * prog(f, s.at, s.dur ?? 36, s.curve ?? Easing.out(Easing.quad));
    if (s.move === "dolly") k = 1 + (s.by ?? 0.35) * (1 - prog(f, s.at, s.dur ?? 90, ease.out));
    if (s.move === "dive") k = 1 + ((s.to ?? 3.5) - 1) * prog(f, s.at, s.dur ?? 45, Easing.in(Easing.quad));
    m = mul(m, about(k, x, y));
  }
  return m;
}

/** how far the stage band's corners travel in one frame, in px */
const speed = (f: number, shots: Shot[], drift: number, seed: string) => {
  const a = cameraAt(f, shots, drift, seed), b = cameraAt(f - 1, shots, drift, seed);
  return Math.max(...[[90, 520], [990, 520], [90, 1450], [990, 1450]].map(([x, y]) => {
    const [ax, ay] = apply(a, x, y), [bx, by] = apply(b, x, y);
    return Math.hypot(ax - bx, ay - by);
  }));
};

const Lens: React.FC<{ shots: Shot[]; drift: number; seed: string; children: React.ReactNode }> = ({ shots, drift, seed, children }) => {
  const f = useCurrentFrame(); // inside <CameraMotionBlur> this is the sample's own (fractional) frame
  const m = cameraAt(f, shots, drift, seed);
  return <AbsoluteFill style={{ transformOrigin: "0 0", transform: `matrix(${m.map((v) => v.toFixed(5)).join(",")})` }}>{children}</AbsoluteFill>;
};

type Props = {
  shots?: Shot[];
  /** drift strength; 1 = about 6 px and 0.2 degree, 0 = a locked-off camera (only for a deliberate hold) */
  drift?: number;
  /** motion blur on the fast moves. Turn it off around a <Stage3D>: the blur renders its children six times */
  blur?: boolean;
  children: React.ReactNode;
};

export const Camera: React.FC<Props> = ({ shots = [], drift = 1, blur = true, children }) => {
  const f = useCurrentFrame();
  const seed = useContext(SceneContext)?.id ?? "camera";
  const fast = blur && shots.some((s) => FAST.includes(s.move) && f >= s.at && f <= s.at + (s.dur ?? 45)) && speed(f, shots, drift, seed) > 8;
  const lens = <Lens shots={shots} drift={drift} seed={seed}>{children}</Lens>;
  return fast ? <CameraMotionBlur shutterAngle={180} samples={6}>{lens}</CameraMotionBlur> : lens;
};
