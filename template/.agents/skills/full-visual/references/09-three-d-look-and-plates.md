# Depth, look and photo plates

## Goal

Physical things look like things: volume, material, light that falls on them and a shadow under them. Historical
moments look like the day they happened. The whole reel is one warm film, not a set of coded panels.

## Reasoning

On the bom-hidrogen reference the ingots sit on a table under a spotlight, the nuclei are lit spheres with depth of
field, the Ivy Mike device is its 1952 photograph, and every frame shares one warm sepia grade. Measured: detail 9.4
against our 7.3, shadow tint R-B +12 against our -10, highlights at p99 187 against our 255 (blown). Flat SVG on a cold
navy ground loses on every one of those numbers. That reference is the bar for finish, grade and photo look; the seller
reels are the bar for how a 2.5D place is drawn, and the hybrid wok test (below) for how layers share one camera.

## Depth: hybrid by layer

Creator decision 2026-10-29, after one scene was built four ways (A/B result below). A shot is up to four layers that
share one camera. Each layer does only the job it does best. The worked example is
`engine/full-visual/reels/ab-wok-hybrid/scenes/` (the wok fire, 9.2 s).

| Layer | What it holds | Built with | Copied from |
|---|---|---|---|
| Back | the place: wall, floor, counter, window, a plate | flat SVG or CSS planes in world units, each mapped by a `matrix3d` homography onto the four corners the 3D camera projects, so it turns with the exact perspective | `Back.tsx`; `quadMatrix()` in `world.ts:55-67` |
| Middle | only an object that turns or needs real material (metal, glass) | `@remotion/three` (`ThreeCanvas`), geometry built in code from the object's references | `Wok3D.tsx` |
| Fx | fire, smoke, steam, heat haze | Skia `RuntimeEffect` shaders in one full-frame `<SkiaCanvas>`, placed in screen space from `project()` | `SkiaFx.tsx` (`15-quality-boosts.md`, section 1) |
| Front | droplets, embers, sparks, labels, the "Ilustrasi" label | SVG, every position from `project()` | `Front.tsx` |

1. **One camera for every layer.** `camAt(k, jolt)` returns the camera. `threeCam()` hands three.js the same camera,
   `project(cam, p)` turns a world point into screen px plus px per world unit at that depth, and `quadMatrix()` maps a
   plane (`world.ts:23-67`). No layer has its own camera or its own drift.
2. **Everything from the frame.** The scene reads its cues once into beat times (`Throw.tsx:24-32`), then computes the
   camera, the light and every position, and passes them down as props. Layers are pure functions of their props.
   Randomness is seeded (`rand(i, s)`, `world.ts:13`). Never `Math.random`, `useFrame` or a clock.
3. **One light, driven by the event.** One intensity (`fireLight()`, `world.ts:82-87`) drives the three.js point light
   at the fire (`Wok3D.tsx:88`) and the 2D glow pool on the back layer's wall and counter (`Back.tsx`, the fire pool).
   The metal and the wall light up together.
4. **Real 3D only where it earns it.** The middle layer holds only what turns or needs real material. The place is
   never built in three.js. A scene with no turning object stays 2.5D: planes, cut-outs and SVG, no `ThreeCanvas`.
5. **Order and mask.** Back, Middle, Fx, Front, inside one stage mask (`Throw.tsx:121-127`). The caption band is in no
   layer and never moves.
6. **Render 3D on the laptop GPU.** `node render.mjs <slug>` uses `--gl angle` on Windows. Not on the VPS: it has no
   GPU and runs 3D about 9x slower (CLAUDE.local.md). A 2.5D-only reel may go to the VPS.

`<Stage3D>` (`src/engine/Stage3D.tsx`) is the engine's fixed studio rig, used by bom-hidrogen. A hybrid shot uses
`ThreeCanvas` directly, so its light can follow the event.

### 2.5D tools (the seller's, for the back layer and for 2.5D-only scenes)

1. **Hand projection.** Positions in 3D, one camera, `project()`: s = F / z, x' = cx + x*s, y' = cy + y*s
   (`hf-incident/scenes/HookV5Fleet.tsx:12-28`). Split the field into a back and a front layer around the hero and sort
   by z (`HookV5.tsx:67-71`, `HookV5Fleet.tsx:118-135`). Size and opacity scale with depth; motion trails from frame
   f-3 (`HookV5Fleet.tsx:126,153-155`). Fields of particles: `06-depth-and-particles.md`.
2. **CSS 3D.** A `perspective` root with `preserve-3d` and `translateZ`/`rotateX`/`rotateZ` (`HookX2.tsx:73-74`;
   tilted plates `CatchStack.tsx:74-75`; a glass cube `hf-incident/scenes/ReportCube.tsx`; a vault door with
   `perspective(700px) rotateY`, `FileBuilding.tsx:94`; a street floor at rotateX 62, `InStreet.tsx:27,98`). When SVG
   particles must sit in the same world, write "one projection that matches the CSS 3D camera exactly"
   (`distillation-us/scenes/HookX3Space.tsx:1-3,24,71-74`). With a three.js middle layer, use `quadMatrix()` instead.
3. **Fake shading.** A lit, base and deep gradient plus a highlight ellipse (`HookV5Fleet.tsx:91-114`); the rim and
   contact shadow of `taste.md`, Light and material.
4. **Physics as maths.** Angular momentum on a squeezing ring (`HookV5Fleet.tsx:4-5,43-54`), overshoot with
   `ease.back`, a decaying quake.

Each depth shot keeps its maths in one World or Space file of pure functions (`ab-wok-hybrid/scenes/world.ts`,
`HookV5Fleet.tsx`, `HookX1World.ts`, `HookX3Space.tsx`), read per frame from `useCurrentFrame()`.

An object that turns is the middle layer in three.js. In a 2.5D-only scene it is drawn in code at the new angle, or,
as a cut-out, is a new image at the new angle (`11-image-assets.md`). One hero object per chapter, whole or cut on
purpose, dark space around it. The visible width is about 0.56 of the height: pull back rather than crop by accident.

### Traps found in the test

- **A flat cream fire core.** A ramp that ends in cream over a wide band reads as a pasted disc. Give the core a hot
  gradient (small, brightest low in the body) and self-shadow (the cap's top and far side darker), as
  `SkiaFx.tsx:43-45` starts to.
- **Identical droplet flames.** Clones read as a stamp. Vary each flame's size (its own radius and depth) and phase
  (a per-droplet seed, `s: i * 1.7` in `Throw.tsx:78`).
- **Oil that does not reflect the fire.** A liquid under a fire must show it. Low roughness, clearcoat, the event's
  point light, emissive rising with the light (`Wok3D.tsx:161`); check a still for the fire's highlight on the oil.
- **No gas flame because blue is kept for water.** A burner with no flame reads as off. A small blue gas flame at the
  burner is allowed; blue elsewhere stays for water.
- **Saturation over the limit under fire light.** `check.py frame` passes saturation 0.34-0.62 only. Keep walls neutral
  (low-chroma grey-brown) and make the fire's light cream (`#E8B890` in `Back.tsx`), not orange. The colour comes from
  the fire itself.

## A/B result (2026-10-29)

One scene (the wok fire, 9.2 s) built four ways by Opus at medium effort. Reels: `ab-wok-25d`, `ab-wok-3d`,
`ab-wok-skia`, `ab-wok-hybrid`.

| Variant | Tokens | Scene lines | `check.py frame` fails |
|---|---|---|---|
| A 2.5D | 196k | 494 | 3 |
| B 3D | 169k | 392 | 2 |
| C 2.5D + Skia | 195k | 569 | 3 |
| D hybrid | 227k | 737 | 0 |

D was the only one to pass every frame check. It looked best, and it rendered fastest: 31.8 s for 9.2 s. It costs the
most tokens and lines, so keep 3D for the shots that need it.

## Look (one per reel, written in `plan.md`)

| Zone | Target (measured on the reference) |
|---|---|
| shadows | warm: R above B by 2 or more (reference +12); never neutral-magenta or blue |
| blacks | lifted to about 10/255 (p5 6.6-12.4) |
| highlights | warm cream, p99 at most 225; no blown white on the hero object |
| saturation | calm; one accent colour per frame; `check.py frame` passes 0.34-0.62, tight under fire light |

Colour meanings, kept across the channel: orange/amber = energy, heat, fission; gold = the payoff, the sun; blue =
water, field, data, cold hydrogen before it lights (a small gas flame at its burner is the one other blue); red = danger or wrong (the reel's one red stroke); green = safe or right.

The finish (`reel.json`), drawn over the stage and never over the caption:

```json
"theme": {
  "finish": { "vignette": 0.28, "grain": 0.015, "splitTone": { "shadows": "#24140A", "highlights": "#FFE8C8", "amount": 0.25 }, "blackLift": 0 },
  "grounds": {
    "dark":  { "bg": "#0B0806", "grid": "rgba(255,220,180,0.02)", "ink": "#FFFFFF", "spoken": "#7A6E64", "card": "#17110C", "hairline": "#2A2018", "dim": "#9A8E82" },
    "light": { "bg": "#14100C", "grid": "rgba(255,220,180,0.03)", "ink": "#FFFFFF", "spoken": "#7A6E64", "card": "#1C150F", "hairline": "#30251B", "dim": "#A0948A" }
  }
}
```

The `light` key is the engine's second ground; here it is a dark too, so a scene marked `light` stays dark
(`taste.md`, Background). These values were measured to pass (`check.py frame`, 2026-10-29): black, shadow tint and
highlight clip in range. The split-tone and black lift add to the ground, so a lighter ground with `blackLift` 10
measured blacks at 34 (target 6.6-12.4). Keep the ground warm near-black and let the finish do the rest. Detail and
saturation then depend on the scene's content, not on the finish.

Bloom only on the brightest things during an event. `check.py frame <png>` measures a styleframe; `check.py render`
fails cold shadows, blown highlights and low detail on the whole file. A UI-led reel is judged with `check.py compare`
against a seller reel as well (`10-storyboard-and-qc.md`).

## Photo plates (`<Plate>` in `src/engine/Plate.tsx`)

- For a historical moment or place nothing drawn can replace: the device in 1952, the island before and after, a
  portrait of a scientist. Not for things code draws better (interfaces, diagrams, numbers).
- Public domain (US government photos, most of Wikimedia's archive) or CC with credit. Source, licence and date go in
  `references.md`; a credit line sits in the honesty label if the licence asks for one.
- `<Plate src="x.jpg" ratio={w/h} x y w h focus={[fx, fy]} label="Foto arsip, ..." grade={...} />`, a Ken Burns move over the scene by default (`at, dur, from 1.02, to 1.1, pan`).
- Graded to the reel with `@remotion/effects` (colour correction or LUT, vignette, noise) so it matches the drawings;
  always moving under the camera (CLAUDE.local.md); never a static slide.
- The change of state is still code on top of it: a label on a leader line, a flash, a mask that removes the island,
  a number rolling in. A plate is a ground, the event is drawn.
- No AI-generated image presented as a photo. No photo of a political figure (CLAUDE.local.md).

## Traps

- Depth for its own sake: a spinning logo explains nothing. The object must be the thing the sentence is about.
- Lights that never change: light is an event (taste.md); the rig is constant, the bursts are not.
- A photo used as a slide behind text. It moves, it is graded, and something happens on it.
- Mixing a cold drawing, a warm photo and a neutral diagram in one reel. One grade for all.
- Reaching for three.js because a shot needs volume. A place, a wall or a flat object is a 2.5D plane; three.js is
  only for the object that turns or needs real material.
- A layer with its own camera. Every layer reads the one camera function, or the world comes apart as it turns.
- A 3D shot sent to the VPS. It has no GPU; render 3D on the laptop.
