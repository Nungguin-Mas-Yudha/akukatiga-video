// Scenes never cut. A scene leaves as one block inside the silence before the next scene's first word, and the next
// one is already mounted while it goes, so the ground is never bare. What is inside a scene enters by its own cues.
// A scene that says "in: flash | iris | zoom | match | fade" in caption.txt takes over with that designed transition
// instead, inside the same silence; one that says nothing (or "in: lift") gets the lift-off, unchanged.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { SceneContext, useReel } from "./context";
import { GroundFill } from "./Ground";
import { ease, leaveEase, prog } from "./moves";
import type { Scene, Transition } from "./timeline";

export type SceneMap = Record<string, React.FC>;

const OUT = 9; // frames the outgoing scene takes to leave (rise)
const OUT_M = 11; // measured: the lift-off is 10-12 frames, displacement x 1.45 every frame, off the top
const LIFT = 2000; // measured: the stage leaves the frame, it does not shrink or dissolve in place
const SCROLL = 13; // frames for a whole-stage scroll
export const LEAD = 6;
const CAPTION_FLOOR = 510; // the caption band ends at y 500; a leaving stage is clipped above this line
// and faded toward it, so its smear never shows as a hard strip along the top of the incoming stage
const LIFT_MASK = `linear-gradient(to bottom, transparent 0px, transparent ${CAPTION_FLOOR + 50}px, #000 ${CAPTION_FLOOR + 190}px)`; // a scene is mounted this early: start its first entrance at scene.from - LEAD and the ground is never bare

type Designed = Exclude<Transition, "lift">;
// frames a designed transition takes before and after the handover point, the middle of the silence
const TR: Record<Designed, [number, number]> = { flash: [3, 5], iris: [10, 12], zoom: [10, 6], match: [3, 3], fade: [5, 5] };
const STAGE_C: [number, number] = [540, 985]; // the stage band's centre: where an iris or a zoom opens by default
const designed = (s?: Scene): Designed | undefined => (s && s.index > 0 && s.in && s.in !== "lift" ? s.in : undefined);

/** flash: a white burst peaking on the cut, about 0.1 s, rises in 3 frames and decays (the kit's burst envelope) */
const flashAt = (f: number, m: number) => {
  const age = f - (m - 3);
  if (age < 0 || age > 8) return 0;
  return age < 3 ? Easing.inOut(Easing.quad)(age / 3) : Math.exp(-(age - 3) / 1.6);
};

export const Stage: React.FC<{ scenes: SceneMap }> = ({ scenes }) => {
  const { theme, tl } = useReel();
  const f = useCurrentFrame();
  const film = theme.layout === "film";
  const SC: [number, number] = film ? [960, 540] : STAGE_C;
  const [CW, CH] = film ? [1920, 1080] : [1080, 1920];
  // later scenes draw over earlier ones; a fade or a zoom leaves over the scene it uncovers, so that pair swaps.
  // (Order, not z-index: a z-index here would lift the stage over the caption, and isolating the stage would
  // change how existing scenes blend with the ground.)
  const over = (s: Scene) => {
    const n = tl.scenes[s.index + 1];
    const t = designed(n);
    // from the frame the incoming scene mounts (LEAD can be earlier than the transition), so it never paints on top
    return (t === "fade" || t === "zoom") && f >= n.from - Math.max(TR[t][0], LEAD) ? s.index + 1.5 : s.index;
  };
  const order = [...tl.scenes].sort((a, b) => over(a) - over(b));
  return (
    <AbsoluteFill>
      {order.map((s) => {
        const Comp = scenes[s.id];
        const last = s.index === tl.scenes.length - 1;
        const hard = film && !designed(tl.scenes[s.index + 1]);
        const meas = theme.motion === "measured" && theme.handover !== "scroll";
        const outDur = meas ? OUT_M : OUT;
        const leaveAt = s.to - (theme.handover === "scroll" ? Math.floor(SCROLL / 2) : outDur - 4);
        let gone = last ? Infinity : hard ? s.to : leaveAt + (theme.handover === "scroll" ? SCROLL : outDur);
        let mountAt = s.index === 0 ? 0 : s.from - (theme.handover === "scroll" ? Math.floor(SCROLL / 2) : LEAD);
        const next = tl.scenes[s.index + 1];
        const outTr = designed(next); // how this scene is left: chosen by the scene that follows
        const inTr = designed(s); // how this scene arrives
        if (outTr) gone = outTr === "flash" ? s.to : s.to + TR[outTr][1];
        if (inTr) mountAt = Math.min(mountAt, s.from - TR[inTr][0]);
        // a scene component with `keep = true` hands over in place: the next scene starts on the very same picture
        // (a shared continuous world), so it is not lifted off; it simply stops drawing once the next one is mounted
        const keep = !!(Comp as unknown as { keep?: boolean } | undefined)?.keep && !last;
        if (!Comp || f < mountAt || f >= (keep ? s.to - LEAD : gone)) return null;
        let style: React.CSSProperties = {};
        let smear = 0;
        let paint = false; // the scene carries its own ground while a designed transition is under way
        if (keep) {
          style = {};
        } else if (outTr) {
          const m = s.to;
          const [px, py] = next.inAt ?? SC;
          paint = outTr !== "flash" && f >= m - TR[outTr][0];
          if (outTr === "fade") style = { opacity: 1 - prog(f, m - 5, 10, ease.linear) };
          if (outTr === "zoom") {
            // the outgoing stage rushes past the camera: scale up about the point, blurring, gone on the far side
            const p = prog(f, m - 10, 16, Easing.in(Easing.quad));
            style = { transformOrigin: `${px}px ${py}px`, transform: `scale(${(1 + 0.9 * p).toFixed(4)})`, filter: p > 0 ? `blur(${(p * 22).toFixed(1)}px)` : undefined, opacity: 1 - prog(f, m - 4, 10, ease.linear) };
          }
        } else if (hard) {
          style = {}; // film: a hard cut, the next scene is already mounted and covers the frame
        } else if (theme.handover === "scroll") {
          // old card leaves through the top, new one rises from below, as one 220 ms move
          const yAt = (fr: number) =>
            (s.index === 0 ? 0 : (1 - prog(fr, mountAt, SCROLL, ease.inOut)) * 1500) - (last ? 0 : prog(fr, leaveAt, SCROLL, ease.inOut) * 1500);
          const y = yAt(f);
          const v = Math.abs(y - yAt(f - 1));
          style = { transform: `translateY(${y.toFixed(1)}px)`, filter: v > 2 ? `blur(${Math.min(18, v * 0.12).toFixed(1)}px)` : undefined };
        } else if (meas && !last) {
          // the measured lift-off: it hangs, then whips out of the top under a vertical smear, at full opacity.
          // No scale and no dissolve in place; the frame is never left holding a half-faded scene.
          // The smear has to be an SVG filter: CSS blur() is isotropic and takes one radius, so a directional
          // one cannot be written as blur(0px Npx) (that is invalid and silently drops).
          const p = prog(f, leaveAt, outDur, leaveEase(outDur));
          const q = prog(f - 1, leaveAt, outDur, leaveEase(outDur));
          smear = Math.min(46, ((p - q) * LIFT) * 0.16);
          style = {
            transform: `translateY(${(-LIFT * p).toFixed(1)}px)`,
            // it goes while it is fastest and most smeared, so no readable ghost is ever left over the caption
            opacity: 1 - prog(f, leaveAt + outDur - 5, 5, ease.linear),
            filter: smear > 0.5 ? `url(#lift-${s.id})` : undefined,
          };
        } else if (!last) {
          const p = prog(f, leaveAt, OUT, ease.in);
          style = { transform: `translateY(${(-140 * p).toFixed(1)}px) scale(${1 - 0.04 * p})`, opacity: 1 - p, filter: p > 0 ? `blur(${(p * 16).toFixed(1)}px)` : undefined };
        }
        if (inTr) {
          const m = s.from;
          const [px, py] = s.inAt ?? SC;
          paint = paint || f < m + TR[inTr][1];
          if (inTr === "flash" && f < m) style = { ...style, opacity: 0 }; // the cut happens under the white
          if (inTr === "match") style = { ...style, opacity: (style.opacity as number ?? 1) * prog(f, m - 3, 6, ease.linear) };
          if (inTr === "zoom") style = { ...style, transformOrigin: `${px}px ${py}px`, transform: `scale(${(1.12 - 0.12 * prog(f, m - 10, 16, ease.out)).toFixed(4)})` };
          if (inTr === "iris" && f < m + TR.iris[1]) {
            // a circle opening from the point the cut goes through, accelerating like the dive that led into it
            const R = Math.hypot(Math.max(px, CW - px), Math.max(py, CH - py));
            const r = R * prog(f, m - TR.iris[0], TR.iris[0] + TR.iris[1], Easing.in(Easing.quad));
            style = { ...style, clipPath: `circle(${r.toFixed(1)}px at ${px}px ${py}px)` };
          }
        }
        // a plain (non-designed) handover moves the whole stage up: from the frame it starts leaving, clip it below the
        // caption band (y 300-500), so nothing it carries is dragged through the caption on the way out
        const lifting = !film && !keep && !outTr && !last && f >= leaveAt;
        const scene = (
          <AbsoluteFill style={style}>
            {paint && <GroundFill name={s.ground} />}
            <Comp />
          </AbsoluteFill>
        );
        return (
          <SceneContext.Provider key={s.id} value={s}>
            {smear > 0.5 && (
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <filter id={`lift-${s.id}`} x="-10%" y="-60%" width="120%" height="220%">
                  <feGaussianBlur stdDeviation={`0 ${smear.toFixed(2)}`} />
                </filter>
              </svg>
            )}
            {lifting ? <AbsoluteFill style={{ clipPath: `inset(${CAPTION_FLOOR}px 0px 0px 0px)`, WebkitMaskImage: LIFT_MASK, maskImage: LIFT_MASK }}>{scene}</AbsoluteFill> : scene}
          </SceneContext.Provider>
        );
      })}
      {tl.scenes.map((s) => (designed(s) === "flash" && flashAt(f, s.from) > 0 ? <AbsoluteFill key={`flash-${s.id}`} style={{ background: "#FFFFFF", opacity: flashAt(f, s.from) }} /> : null))}
    </AbsoluteFill>
  );
};

/** the centred column every scene builds in */
export const Column: React.FC<{ children: React.ReactNode; width?: number }> = ({ children, width }) => {
  const { theme } = useReel();
  const w = width ?? theme.stage.width;
  return <div style={{ position: "absolute", left: (1080 - w) / 2, width: w, top: 0, height: 1920 }}>{children}</div>;
};
