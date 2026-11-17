// One flat ground with a faint 60 px grid (it gives motion blur something to smear). The ground belongs to the
// scene; between two scenes of different ground it cross-fades linearly over 6 frames, centred in the silence.
import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { useReel } from "./context";
import type { GroundName } from "../theme";

export const FADE = 6;

/** 0 = dark, 1 = light, at this frame */
export function useLightness(): number {
  const { tl } = useReel();
  const f = useCurrentFrame();
  const val = (g: GroundName) => (g === "light" ? 1 : 0);
  let k = val(tl.scenes[0].ground);
  for (let i = 1; i < tl.scenes.length; i++) {
    const s = tl.scenes[i];
    if (f < s.mid - FADE / 2) break;
    k = interpolate(f, [s.mid - FADE / 2, s.mid + FADE / 2], [val(tl.scenes[i - 1].ground), val(s.ground)], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  return k;
}

const grid = (c: string, p: number): React.CSSProperties => ({
  backgroundImage: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`,
  backgroundSize: `${p}px ${p}px`,
  backgroundPosition: `${p / 2}px ${p / 3}px`,
});

export const Ground: React.FC = () => {
  const { theme } = useReel();
  const k = useLightness();
  const { dark, light } = theme.grounds;
  const p = theme.gridPitch;
  return (
    <AbsoluteFill style={{ backgroundColor: interpolateColors(k, [0, 1], [dark.bg, light.bg]) }}>
      <AbsoluteFill style={{ ...grid(dark.grid, p), opacity: 1 - k }} />
      <AbsoluteFill style={{ ...grid(light.grid, p), opacity: k }} />
    </AbsoluteFill>
  );
};

/** one scene's own ground, painted inside the scene while a designed transition carries it: an iris or a zoom
 *  has to take its ground with it, the shared cross-fade above cannot be in two places at once */
export const GroundFill: React.FC<{ name: GroundName }> = ({ name }) => {
  const { theme } = useReel();
  const g = theme.grounds[name];
  return <AbsoluteFill style={{ backgroundColor: g.bg, ...grid(g.grid, theme.gridPitch) }} />;
};
