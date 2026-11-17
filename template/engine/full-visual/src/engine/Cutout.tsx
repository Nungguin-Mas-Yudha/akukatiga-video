// An object on the stage as a transparent PNG (a product, an organ, a machine part), on its own layer over a plate:
// the 2.5D cut-out. A soft contact shadow under it, an optional rim light, and states: several images of the same
// object at the same framing (closed, see-through, exploded) that cross-dissolve on a cue, so the change of state
// happens to the object already on screen. Position and scale are plain props: move it with the kit's verbs.
import React from "react";
import { Img } from "remotion";
import { useAsset } from "./context";
import { prog, ease } from "./moves";

export type CutoutState = { src: string; at: number; dur?: number };

type Props = {
  /** the first image, a file in the reel's assets/ folder */
  src: string;
  /** later images of the same object at the same framing, each fading in from `at` over `dur` frames (default 10) */
  states?: CutoutState[];
  /** the current frame (from useScene) */
  f: number;
  /** centre of the object and its drawn width in px; height follows the image */
  cx: number;
  cy: number;
  w: number;
  rotate?: number;
  opacity?: number;
  /** soft contact shadow: its offset below the centre (px) and strength 0-1; 0 hides it */
  shadowY?: number;
  shadow?: number;
  /** a thin warm rim light on the edge away from the key light, 0-1 */
  rim?: number;
  style?: React.CSSProperties;
};

export const Cutout: React.FC<Props> = ({ src, states = [], f, cx, cy, w, rotate = 0, opacity = 1, shadowY, shadow = 0.5, rim = 0, style }) => {
  const layers = [{ src, at: -Infinity, dur: 1 }, ...states];
  const urls = layers.map((l) => useAsset(l.src)); // eslint-disable-line react-hooks/rules-of-hooks -- fixed-length list per scene
  const sy = shadowY ?? w * 0.42;
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: cy, width: w, transform: `translateY(-50%) rotate(${rotate}deg)`, opacity, ...style }}>
      {shadow > 0 && (
        <div style={{ position: "absolute", left: w * 0.12, width: w * 0.76, top: `calc(50% + ${sy}px)`, height: w * 0.1, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,0.75), rgba(0,0,0,0))", opacity: shadow, filter: "blur(6px)" }} />
      )}
      {layers.map((l, i) => {
        // each state fades in over the previous one; the last one that has arrived is fully opaque
        const k = i === 0 ? 1 : prog(f, l.at, l.dur ?? 10, ease.inOut);
        if (k <= 0) return null;
        return (
          <Img key={l.src} src={urls[i]} style={{
            position: i === 0 ? "relative" : "absolute", left: 0, top: 0, width: w, display: "block", opacity: k,
            filter: rim > 0 ? `drop-shadow(-2px -2px 0 rgba(255,214,160,${(0.55 * rim).toFixed(2)})) drop-shadow(0 18px 28px rgba(0,0,0,0.45))` : "drop-shadow(0 18px 28px rgba(0,0,0,0.45))",
          }} />
        );
      })}
    </div>
  );
};
