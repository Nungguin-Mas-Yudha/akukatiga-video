# Quality boosts

Seven Remotion techniques the kit had installed but did not use. Each is a tool for one job, not a look to spread
over a reel. The creator's rules still hold: dark ground, no AI images, real 3D only as the middle layer of a hybrid shot
(`09-three-d-look-and-plates.md`), light is an event
(`taste.md`). Every motion reads `useCurrentFrame()`; nothing uses a clock or `Math.random`.

Package versions: every `@remotion/*` package is `4.0.522` (root `package.json`), `@shopify/react-native-skia`
`2.14.0`. The installed type definitions in `node_modules/` are the truth for names; the doc site can be newer.

## 1. Skia shaders: fire, smoke, steam, heat haze, caustics, liquid shimmer

**When.** Anything that is a field rather than an object: a flame, smoke from a fire, steam off a pot, heat shimmer
over a burner, light on water, a liquid surface. Draw it procedurally; never a stock video loop or an AI image.

**Setup, once (engine, not a reel).** `render.mjs` already bundles with `enableSkia`. The page must also load the
Skia WebAssembly before `registerRoot`. Remotion's install page (https://www.remotion.dev/docs/skia/) gives this
`src/index.ts`; check it is in place before the first Skia scene:

```ts
import { LoadSkia } from "@shopify/react-native-skia/src/web";
import { registerRoot } from "remotion";

(async () => {
  await LoadSkia();
  const { Root } = await import("./Root");
  registerRoot(Root);
})();
```

**How.** One `RuntimeEffect` per reel part, compiled at module scope; time comes in as a uniform from the frame.

```tsx
import { useCurrentFrame, useVideoConfig } from "remotion";
import { SkiaCanvas } from "@remotion/skia";
import { Fill, Shader, Skia } from "@shopify/react-native-skia";

const FIRE = Skia.RuntimeEffect.Make(`
uniform float2 res;
uniform float t;
float h(float2 p){ return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }
float n(float2 p){ float2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+float2(1,0)), f.x), mix(h(i+float2(0,1)), h(i+float2(1,1)), f.x), f.y); }
float fbm(float2 p){ float v = 0.0, a = 0.5; for (int k = 0; k < 5; k++){ v += a*n(p); p *= 2.0; a *= 0.5; } return v; }
half4 main(float2 xy){
  float2 uv = xy / res;
  float y = 1.0 - uv.y;
  float d = fbm(float2(uv.x*4.0, y*3.0 - t*1.6));
  float flame = smoothstep(0.0, 1.0, d*1.4 - y*1.1 - abs(uv.x-0.5)*1.6 + 0.35);
  half3 c = mix(half3(0.55,0.08,0.0), half3(1.0,0.62,0.12), half(flame));
  c = mix(c, half3(1.0,0.93,0.75), half(smoothstep(0.75, 1.0, flame)));
  return half4(c*half(flame), half(flame));
}`)!;

export const Fire: React.FC<{ w: number; h: number }> = ({ w, h }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SkiaCanvas width={w} height={h}>
      <Fill>
        <Shader source={FIRE} uniforms={{ res: [w, h], t: f / fps }} />
      </Fill>
    </SkiaCanvas>
  );
};
```

This shader was compiled and drawn with the installed CanvasKit (2026-10-29): bright cream at the base, transparent
at the top. It returns premultiplied colour, so it sits on the dark ground with no box.

Variations on the same `fbm`, each a few lines:

- **Smoke / steam:** grey or cream, low alpha (0.15 to 0.4), slower rise (`t*0.4`), wider spread with height.
- **Heat haze:** a faint warm `fbm` band, alpha 0.05 to 0.1, rising above the heat source; or the
  `@remotion/effects` `noise-displacement` / `wave` effect on the plate behind it, driven from the frame.
- **Caustics / liquid shimmer:** `abs(sin(fbm(uv*6 + t*0.3) * 12))`, gold or blue, multiplied into the liquid's shape.

**Trap.** `Skia.RuntimeEffect.Make` returns `null` on an SkSL error and logs it; a null source draws nothing. Use
`float2`, `half4`, `main(float2 xy)`, not GLSL's `vec2`, `gl_FragCoord` or `iTime`. Keep the canvas the size of the
thing (a burner, a pot), not the full frame. Field motion stays calm: a flame flickers, it does not flash.
Skia renders in Studio and in `render.mjs` (local and VPS); the docs mark it unsupported in serverless renders.

## 2. Motion blur on every fast move

**When.** Only while something moves fast: a camera dive or pull-out, a whip, an object falling or thrown. A held
frame never carries blur (`03-motion-and-sync.md`, What good looks like).

**How.**

```tsx
import { CameraMotionBlur, Trail } from "@remotion/motion-blur";

const fast = (t > 2.47 && t < 2.8) || (t > 4.68 && t < 4.98);   // windows of the fast moves
return fast ? <CameraMotionBlur shutterAngle={180} samples={6}><Stack lite /></CameraMotionBlur> : <Stack />;
```

- `CameraMotionBlur` props: `shutterAngle`, `samples`. `reels/ab-kb-4/scenes/Hook.tsx:258-262` uses
  `shutterAngle={180} samples={6}`, switched on only during the dive and the pull-out. Docs: 5 to 10 samples.
- `Trail` props: `layers` (integer), `lagInFrames` (may be fractional), `trailOpacity`. For a streak behind one
  object, not for the camera.
- Children must be absolutely positioned.

**Trap.** Inside `CameraMotionBlur` each sample is a sub-frame render. WebGL effects (`@remotion/effects` glow, noise,
blur, drop shadow) in every sample exhausted the GPU in ab-kb-4 ("framebuffer incomplete"). Render a lite layer
inside the blur: the same scene with `effects={[]}` or CSS stand-ins (`ab-kb-4/scenes/Hook.tsx:129-130, 222`).
The blend is destructive to colour; inspect the frames. Skia canvases count as GPU too: keep them out of the blurred
layer. The docs mention a `blurOpacity` prop on `Trail`; the installed 4.0.522 type has no such prop.

## 3. Paths: drawing on, travelling, morphing (`@remotion/paths`)

**When.** A leader line drawing to its label; a drop, a particle or a truck travelling along a curve; one outline
turning into another (a drop to a bubble to a cloud).

```tsx
import { evolvePath, getPointAtLength, getTangentAtLength, getLength, interpolatePath } from "@remotion/paths";

const { strokeDasharray, strokeDashoffset } = evolvePath(p, d);          // p 0..1 → <path ... />
const pt = getPointAtLength(d, p * getLength(d));                        // { x, y } | null
const tan = getTangentAtLength(d, p * getLength(d));                     // { x, y } | null, for rotation
const shape = interpolatePath(k, DROP, BUBBLE);                          // k 0..1 → new d
```

- `evolvePath(progress, path)`: spread the result on the `<path>`; time it like the `draw` verb (14 f).
- `getPointAtLength` and `getTangentAtLength` return `null` past the path; guard with `?.`.
- `interpolatePath(value, from, to)`: best when both paths have a similar number of points. Chain shapes by
  ranges of one progress: drop → bubble on 0 to 1, bubble → cloud on 1 to 2.

**Trap.** Morph over 10 to 16 frames with an ease; a linear morph looks like a glitch. Two paths with very different
point counts tear in the middle; add points to the simpler one.

## 4. Light leak and starburst (`@remotion/effects`)

**When.** A light event only: the flash of a blast, a reveal, the payoff. One per sentence at most, rising in 3 to 5
frames and decaying over 15 to 30 (`taste.md`, Light and material). Never a texture left on.

```tsx
import { Solid } from "remotion";
import { lightLeak } from "@remotion/effects/light-leak";
import { starburst } from "@remotion/effects/starburst";

<Solid width={1080} height={1920} color="#000" style={{ mixBlendMode: "screen" }}
  effects={[lightLeak({ seed: 3, hueShift: 30, progress })]} />
<Solid width={1080} height={1920}
  effects={[starburst({ rays: 12, colors: ["#FFB347", "#00000000"], rotation, smoothness: 0.6, origin: [0.5, 0.45] })]} />
```

- `lightLeak({ seed, hueShift, progress })`: reveals over the first half of `progress` and retracts over the second.
  Drive `progress` from the frame; it does not animate itself. Default `0.5` shows it fully.
- `starburst({ rays, colors, rotation, smoothness, origin })`: `rays` and `colors` (at least two) are required.
- Both need WebGL2: `render.mjs` passes `--gl angle` (swangle on Linux).

**Trap.** The standalone packages `@remotion/light-leaks` and `@remotion/starburst` exist on the doc site but are not
installed; use the effect functions above. A leak in warm amber only, matching the reel's accent; never on the
caption band; at most 3 flashes a second.

## 5. Rough notation (`@remotion/rough-notation`)

**When.** Hand-drawn emphasis on a label in the stage: circle a number, underline a name, highlight a line of a
document. One mark per beat, drawing on its word.

```tsx
import { Circle, Underline, Highlight, Box, Bracket, StrikeThrough, CrossedOff } from "@remotion/rough-notation";

<Circle progress={p} color="#FFB347" strokeWidth={4} padding={{ left: 12, right: 12 }} seed={2}>
  <span>1952</span>
</Circle>
<Underline progress={p} color="#FFB347" iterations={1}><span>Ivy Mike</span></Underline>
<Highlight progress={p} color="rgba(255,179,71,0.35)"><span>10,4 megaton</span></Highlight>
```

- `progress` 0..1 from the frame (14 f, like `draw`). Fix `seed` so the stroke does not change between renders.
- Shared options: `roughness`, `bowing`, `disableMultiStroke`; `iterations` for one clean pass.

**Trap.** Not on the caption: the caption's box is fixed by the engine. One accent colour, the reel's. A strike is the
reel's one red stroke only when it means wrong.

## 6. Custom easing (`Easing` from `remotion`)

**When.** A camera or an object needs a character `spring()` does not give: a slow-in heavy push, a snap that settles
without overshoot, a sweep.

```tsx
import { Easing, interpolate } from "remotion";

const k = interpolate(f, [at, at + 24], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1),            // fast start, long settle: an arrival
});
```

- Arrival (things landing): `Easing.bezier(0.16, 1, 0.3, 1)`. Departure: `Easing.bezier(0.7, 0, 0.84, 0)`.
- Camera push or sweep: `Easing.inOut(Easing.cubic)`; heavier: `Easing.inOut(Easing.poly(5))` (there is no `Easing.quint`).
- `spring()` stays for things with weight that overshoot; bezier for the camera and anything that must land exact.

**Trap.** One easing family per reel for the camera. A bezier with y outside 0..1 overshoots; keep it for objects.

## 7. Lottie (`@remotion/lottie`), low priority

**When.** Rarely: a small icon animation that code would take long to draw. Code-drawn first.

```tsx
import { Lottie, type LottieAnimationData } from "@remotion/lottie";
<Lottie animationData={data} />   // data loaded once and memoised; a new object re-initialises the animation
```

**Licence.** Only a file whose licence allows commercial use and modification. On LottieFiles, read the licence on
the file's own page (the free licence terms) and record the URL, author and licence in `references.md`. No file
without a stated licence, no AI-generated animation. Recolour it to the reel's palette.

**Trap.** A Lottie in a stock style breaks the reel's one look. Load JSON with `delayRender` and memoise it.
