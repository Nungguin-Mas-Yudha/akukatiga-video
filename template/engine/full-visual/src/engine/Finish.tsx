// The finish: the reel graded as one film. Over the stage and the ground, under the caption, so the words stay
// exactly the ink the theme says. Opt-in through reel.json theme.finish; a reel without it renders as before.
// Order as in the look bible: split-tone, lift the blacks, vignette, grain. Plain CSS and one SVG filter, no
// canvas: highlights tinted by multiply, shadows by screen, the edges darkened by a radial gradient, and a
// fractal-noise grain re-seeded every frame, so it moves like film and renders the same every time.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useReel } from "./context";

export type FinishConfig = {
  /** edge darkening, 0.25-0.3 = the corners lose 25-30 % */
  vignette?: number;
  /** grain amplitude, 0.015 = about +-1.5 % */
  grain?: number;
  /** shadows warmed toward one colour, highlights toward another; amount 0-1 (default 0.5) */
  splitTone?: { shadows: string; highlights: string; amount?: number };
  /** black is lifted to this level of 255 (10-11 on the reference) */
  blackLift?: number;
};

export const Finish: React.FC = () => {
  const { theme } = useReel();
  const f = useCurrentFrame();
  const c = theme.finish;
  if (!c) return null;
  const tone = c.splitTone;
  const amt = tone?.amount ?? 0.5;
  const lift = Math.round(c.blackLift ?? 0);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {tone && <AbsoluteFill style={{ background: tone.highlights, mixBlendMode: "multiply", opacity: amt }} />}
      {tone && <AbsoluteFill style={{ background: tone.shadows, mixBlendMode: "screen", opacity: amt }} />}
      {lift > 0 && <AbsoluteFill style={{ background: `rgb(${lift},${lift},${lift})`, mixBlendMode: "screen" }} />}
      {c.vignette ? (
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 62% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,${(c.vignette * 0.55).toFixed(3)}) 80%, rgba(0,0,0,${c.vignette.toFixed(3)}) 100%)` }} />
      ) : null}
      {c.grain ? (
        <svg width="100%" height="100%" style={{ position: "absolute", left: 0, top: 0, mixBlendMode: "overlay", opacity: Math.min(1, c.grain * GRAIN_GAIN) }}>
          <filter id="finish-grain" x="0" y="0" width="100%" height="100%">
            {/* a new seed every frame, from the frame: film grain that never repeats and never differs between renders */}
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={1} seed={(Math.floor(f) * 37 + 11) % 997} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#finish-grain)" />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

// fractal noise at this frequency spreads about +-0.1 around mid grey, and overlay doubles a deviation: this gain
// turns the configured amplitude into the layer's opacity (measured on a flat mid-grey still)
const GRAIN_GAIN = 5;

/** bloom on a hot thing (a fireball, an emissive, a filament): a glow in its own colour, only as strong as the event.
 *  Spread onto the element's style: style={{ filter: bloom("#FFB347", burst(f, cue("menyala"))) }} */
export function bloom(color: string, k: number, radius = 28): string | undefined {
  if (k <= 0.01) return undefined;
  const a = Math.min(1, k);
  const hex = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `drop-shadow(0 0 ${(radius * 0.3).toFixed(1)}px ${color}${hex(a)}) drop-shadow(0 0 ${radius.toFixed(1)}px ${color}${hex(a * 0.7)})`;
}
