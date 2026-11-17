// A real photo on the stage: an archive picture, an aerial, the Sun. Graded to the reel (warmer, less saturated,
// a soft vignette, a little noise) by @remotion/effects on the GPU, drawn on a frame with a cast shadow, and always
// moving: a slow Ken Burns across its scene. The honesty label says what it is ("Foto arsip", "Ilustrasi").
import React, { useContext } from "react";
import { Easing, Img, useCurrentFrame } from "remotion";
import { colorCorrection, type ColorCorrectionParams } from "@remotion/effects/color-correction";
import { vignette as vignetteFx } from "@remotion/effects/vignette";
import { noise as noiseFx } from "@remotion/effects/noise";
import { SceneContext, useAsset, useReel } from "./context";
import { prog } from "./moves";
import { LEAD } from "./Stage";

/** the default grade: toward the warm, low-saturation archive look of the reference */
export const ARCHIVE: ColorCorrectionParams = { temperature: 0.28, saturation: 0.72, contrast: 1.08, blacks: 0.04, highlights: -0.08 };

type Props = {
  /** a file in the reel's assets/ folder */
  src: string;
  /** the box on the stage, in px; default the whole stage band (0, 520, 1080 x 930) */
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  /** the photo's width / height. With it the crop keeps `focus` in the box; without it the crop is centred */
  ratio?: number;
  /** the point of the photo (0-1) the crop and the Ken Burns centre on */
  focus?: [number, number];
  /** Ken Burns: scale `from` to `to` between frames `at` and `at + dur`, drifting `pan` px. Default across the scene */
  at?: number;
  dur?: number;
  from?: number;
  to?: number;
  pan?: [number, number];
  grade?: ColorCorrectionParams;
  vignette?: number;
  noise?: number;
  /** the honesty label, bottom left of the plate; required by the format for anything not literally a photo of it */
  label?: string;
  radius?: number;
  /** a framed print with a cast shadow (default) or a full-bleed plate */
  framed?: boolean;
  /** CSS filters instead of the GPU effects, for a machine where WebGL2 is not available */
  css?: boolean;
  style?: React.CSSProperties;
};

export const Plate: React.FC<Props> = (p) => {
  const f = useCurrentFrame();
  const { theme } = useReel();
  const scene = useContext(SceneContext);
  const url = useAsset(p.src);
  const x = p.x ?? 0, y = p.y ?? 520, w = p.w ?? 1080, h = p.h ?? 930;
  const [fx, fy] = p.focus ?? [0.5, 0.5];
  // the cover crop: as large as the box needs, shifted so the focus sits as near the centre as the edges allow
  const r = p.ratio ?? w / h;
  const iw = r > w / h ? h * r : w;
  const ih = r > w / h ? h : w / r;
  const ox = Math.min(0, Math.max(w - iw, w / 2 - fx * iw));
  const oy = Math.min(0, Math.max(h - ih, h / 2 - fy * ih));
  // the Ken Burns: never still, never fast. Linear, like a rostrum camera
  const at = p.at ?? (scene ? scene.from - LEAD : 0);
  const dur = p.dur ?? (scene ? Math.max(60, scene.to - at) : 300);
  const k = prog(f, at, dur, Easing.linear);
  const s = (p.from ?? 1.02) + ((p.to ?? 1.1) - (p.from ?? 1.02)) * k;
  const [px, py] = p.pan ?? [0, 0];
  const g = { ...ARCHIVE, ...p.grade };
  const move: React.CSSProperties = {
    position: "absolute", left: ox, top: oy, width: iw, height: ih,
    transformOrigin: `${fx * iw}px ${fy * ih}px`,
    transform: `translate(${(px * k).toFixed(2)}px, ${(py * k).toFixed(2)}px) scale(${s.toFixed(5)})`,
  };
  const framed = p.framed ?? true;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: framed ? p.radius ?? 18 : 0, overflow: "hidden", boxShadow: framed ? "0 40px 80px rgba(0,0,0,0.55), 0 8px 18px rgba(0,0,0,0.35)" : undefined, ...p.style }}>
      {p.css ? (
        <Img src={url} style={{ ...move, objectFit: "cover", filter: `sepia(${(g.temperature ?? 0) * 0.6}) saturate(${g.saturation ?? 1}) contrast(${g.contrast ?? 1})` }} />
      ) : (
        <Img
          src={url}
          width={Math.round(iw)}
          height={Math.round(ih)}
          style={move}
          effects={[
            colorCorrection(g),
            vignetteFx({ amount: p.vignette ?? 0.35, radius: 0.6, feather: 0.45 }),
            noiseFx({ amount: p.noise ?? 0.05, seed: Math.floor(f) % 997 }),
          ]}
        />
      )}
      {p.label && (
        <div style={{ position: "absolute", left: 26, bottom: 22, fontFamily: theme.font.ui, fontSize: 24, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.82)", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          {p.label}
        </div>
      )}
    </div>
  );
};
