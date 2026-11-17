# Shot recipes

## Goal

A library of shots that tell a story, each taken from the reference video, the seller reels or the A/B test and built with this
engine. The plan picks from here when it writes its three options per beat (`sentence-to-picture.md`); the shot
grammar that orders them is in `camera-and-transitions.md`.

Times are from the reference study, `workspace/projects/2026-10-29-full-visual-bom-hidrogen/reference-study.md`.
Files are under `engine/full-visual/reels/`. Every recipe stays inside the creator's rules: dark ground, no AI images,
blue for water, depth hybrid by layer (real 3D only for an object that turns or needs real material,
`../04-assets/three-d-look-and-plates.md`), photos only from licensed sources and
always moving (`../04-assets/image-assets.md`). A photo or drawing that exaggerates carries its honesty label.

Each recipe: where it was seen, when to use it, how it is built.

## From the reference video

### Bomb falling onto an island (scale and stakes)
- **Seen:** reference, hook 0-4 s. Our version: `bom-hidrogen/scenes/Hook.tsx:1-4`.
- **Use when:** the hook has an actor that threatens a place. Small actor, big place, the stakes visible.
- **Build:** a licensed aerial `<Plate>` of the place, pushing in slowly. The actor (a drawn object or `<Cutout>`)
  above it, its scale rising from `prog(f, cue(...))` so it seems to fall toward the lens of the plate. A lock-on ring
  or label on the place. On the impact word, a flash (below) and the next state.

### Iris dive into an object to its inside
- **Seen:** reference, 12-16 s ("Inside": a circle opens on the bomb body and fills the frame, through the uranium
  texture into the crystal lattice).
- **Use when:** the sentence goes inside a thing ("inside", "made of", "what's in it").
- **Build:** a circle mask on the actor at the point the sentence names, its radius growing with `ease.in` until it
  covers the stage; inside it, the next layer (texture, then lattice) already moving. Done in the scene with a CSS
  `clip-path: circle()`; the engine's `in: iris` only when the cut is between scenes (counts as one of the two).

### Dolly-out reveal with a counter rising
- **Seen:** reference, 17-35 s (one bar in close-up, the camera pulls back, the count rises to 64 as more bars
  appear). Our version: `bom-hidrogen/scenes/Ingots.tsx:1-5`.
- **Use when:** a number is the size of a group: one becomes many.
- **Build:** start at scale about 4 on one item. Scale down with `ease.out` over 60-120 f, ending on the number's word
  (`endsOn`). `countTo` runs with the same progress, so the count is the camera. Items outside the first frame are
  already placed and enter as the frame widens.

### Before and after on the same photo
- **Seen:** reference, 66-80 s (the Elugelab island photo, a flash, then the island gone).
- **Use when:** the payoff of a plant: the same place, changed. Needs the plant earlier (`../03-treatment/treatment.md`).
- **Build:** the same `<Plate>`, same framing and grade as when it was planted. Hold it a breath. On the word, a
  flash, and under the flash swap to the after state: a second licensed photo of the same place, or the first one with
  the change drawn in code on top (a crater, water where land was). Label "Ilustrasi" when the after is drawn.

### Particles gathering into a new object (morph)
- **Seen:** reference, 55-66 s (a particle cloud gathers into the capsule). Seller: `hf-incident/scenes/FleetTower.tsx:1-3`
  (a tower built from pieces that breaks into particles and grows back).
- **Use when:** a new object must arrive without a hard cut, or a thing is assembled from parts.
- **Build:** seeded particle positions (`rand()`) in two layouts: the cloud and the target outline. Interpolate per
  particle with a staggered `prog`, so the shape forms from one side. Outlines morph with `@remotion/paths`
  (`interpolatePath`). The finished object fades in over the settled particles.

### Flash as a transition
- **Seen:** reference, hook ("hits": a white frame about 0.25 s, which is also the cut to the horizon shot).
- **Use when:** an impact that also changes place. At most one or two per reel; at most 3 flashes a second.
- **Build:** inside the scene, a full-stage white layer rising in 3 frames and decaying over 5-8, peaking on the
  impact word. The next state is already drawn under it at the peak. Between scenes, `in: flash` with its reason in
  `plan.md`.

### Hero under a spotlight on a table
- **Seen:** reference, 12-16 s (Little Boy hanging under a spotlight, with a floor and a wall) and 55-66 s (Teller's
  portrait framed on a wooden table, with a cast shadow). Seller: `hf-incident/scenes/LogsBook.tsx:1-3` (a logbook on a
  desk under a warm lamp).
- **Use when:** introducing the actor. It gives the object a place instead of a void.
- **Build:** a dark ground, a table top or floor drawn in CSS 3D (`rotateX` 55-65) with a wood or steel texture graded
  dark. A radial pool of light under the hero, a soft contact shadow, a rim light on the far side (`taste.md`, Light
  and material). The spotlight cone from above (next recipe). The rest of the frame stays dark.

### Volumetric light cone singling one item out
- **Seen:** reference, 17-35 s ("less than one kilo": every bar dims, one stays lit in a cone). Seller:
  `hf-incident/scenes/InStreet.tsx:72` (a lamp cone with dust in it).
- **Use when:** one of many is the subject: the one that matters, the one that fails.
- **Build:** on the word, every other item's brightness drops with `mix`. A cone (an SVG trapezoid with a linear
  gradient, screen blend) from above onto the one item, plus a pool where it lands. A few dust motes drift in the cone
  so the frame stays alive.

### A growing area circle as a comparison
- **Seen:** reference, 66-80 s (a gold circle grows beside the capsule while "about 631 times" counts to "about 700
  times"; the area is the comparison). Our version: `bom-hidrogen/scenes/Hook.tsx:3-4` (Hiroshima beside it at true
  area scale).
- **Use when:** comparing two sizes, energies or amounts.
- **Build:** the small thing as a circle of radius r. The big circle's radius is r times the square root of the
  ratio, so the area is true. Grow it with `ease.out`, ending on the number's word, while `countTo` runs. Label the
  ratio, not the radius.

### Odometer digits on a year or a number
- **Seen:** reference, 66-80 s ("1952" rolls in like a slot machine). Our version: `bom-hidrogen/scenes/IvyMike.tsx:5`.
- **Use when:** a date or a figure is the fact of the sentence.
- **Build:** each digit a vertical strip clipped to one cell, translated by its own `prog`, the right digit landing
  last on the word, with a small overshoot (`ease.back`).

### Stack rising with a counter
- **Seen:** reference, 17-35 s (crates of TNT stacking up with a "tons of TNT" counter).
- **Use when:** a quantity should feel physical.
- **Build:** one drawn crate repeated in a grid, each dropping in with `stagger` and a small bounce; the counter is
  tied to how many have landed, so it lands on the word with the last crate.

### Fill from the bottom
- **Seen:** reference, 80-88 s (the empty capsule fills from the bottom, then glows as "a piece of the sun").
  Seller: `distillation-us/scenes/HookX4.tsx:2-7` (Qwen fills from the bottom with the stolen light).
- **Use when:** a container gets what it lacked; the payoff of an empty vessel planted earlier.
- **Build:** a mask whose top edge rises with `prog`, a wavy surface (a sine on the edge), and a glow burst when it
  is full, on the payoff word.

## From the seller reels

### Dive into a mark
- **Seen:** `distillation-us/scenes/Weights.tsx:2-5` (header), `:29-50` (the move).
- **Use when:** going inside the thing on screen, so the next scene starts in its inside. Once per chapter.
- **Build:** the label clears, then scale 1 to 11 with `ease.in`, blur growing past 35 % of the move, opacity out in the
  last 14 frames. The next layer (the mark's colour, then its contents) is already drawn under it.

### A server growing into a wall
- **Seen:** `hf-incident/scenes/Locker.tsx:4-11` (header: the server grows into the wall of lockers it really is).
- **Use when:** one thing is revealed to be many, or to be bigger than it looked.
- **Build:** the single object scales up and its outline extends into a repeated grid of the same unit (lockers,
  shelves, cells) drawn behind it; the old context falls away. Each unit gets its own small life (a lit vent, a label).

### A window widening
- **Seen:** `hf-incident/scenes/OutView.tsx:1-3`, rect interpolation `:10-12`.
- **Use when:** moving from inside to outside, or from a detail to the world it opens on.
- **Build:** a small window already shows a sliver of the next place. On the word, its rect interpolates to a wide
  rect over the stage; the actors stay at its sill, looking through.

### Pull-back to a crowd
- **Seen:** `hf-incident/scenes/ScaryField.tsx:1-3`, zoom `:34-40`; `hf-incident/scenes/ReportSandbox.tsx:5-6` (one
  cell becomes one of a grid).
- **Use when:** "every", "all of them", a count of hundreds.
- **Build:** the followed group sits in world coordinates; the rest wait outside the frame. Zoom from 1 to about 0.3
  with `ease.inOut`, ending on the count's word, then a slow breath. Draw the crowd with a light glyph so 1,200 render.

### A change of role in place
- **Seen:** `chrome-fingerprinting-us/scenes/CtaWindow.tsx:1-3` (Chrome becomes Firefox, same object).
- **Use when:** the same thing is now something else: a rival, a fixed version, a later state.
- **Build:** one component with a `k` from 0 to 1 that interpolates colours and geometry (`mixHex`, `lerp`). Never a
  second card.

### Travel down a stack
- **Seen:** `distillation-us/scenes/Catch.tsx:5-9` (header), `camAt()` down 28 plates (`:25,86`); `CatchStack.tsx:1-5`.
- **Use when:** the thing is long or deep (layers, floors, a pipeline), and the sentence goes through it.
- **Build:** plates in CSS 3D at tilt about 60; a `camAt(f)` that moves the root along the stack's axis; a band of light
  running down the plates so the frame stays alive.

### Cutaway window into a closed machine
- **Seen:** `distillation-us/scenes/CatchCasing.tsx:1-3`, `CatchInside.tsx:1-5`.
- **Use when:** showing what is hidden from someone while the viewer sees it (point of view: ours vs theirs).
- **Build:** the casing closes around the machine (walls slide up, the lid drops); one rectangular window stays cut
  out for the viewer; the inside keeps moving through it. One port shows what leaves.

### Doll's-house cutaway
- **Seen:** `hf-incident/scenes/FileBuilding.tsx:1-3`.
- **Use when:** a building or an organisation has rooms with different jobs.
- **Build:** one-point perspective: each floor drawn as back wall, floor and side walls, with objects in each room;
  a door or vault that opens with `perspective(700px) rotateY` (`FileBuilding.tsx:94`).

### A lamp stutters on over a place
- **Seen:** `hf-incident/scenes/InStreet.tsx:1-3` (a key ring on a public pavement at night, a lamp stutters on).
- **Use when:** hide then reveal: the place is the news ("it was lying in the street").
- **Build:** a floor in perspective (`rotateX` about 62), dark. The lamp flickers on with two or three short bursts,
  its cone and pool appear, and the place and its sign become readable on the word.

### A sweep that is the count
- **Seen:** `hf-incident/scenes/WhySheet.tsx:1-3` (898 boxes tick in a diagonal sweep that lands on 198).
- **Use when:** the number is a part of a whole.
- **Build:** a grid of the real total. A diagonal sweep marks each box; the counter counts the boxes the sweep has
  passed, so it lands on its word by construction.

### The stamp hit (the one big move)
- **Seen:** `chrome-fingerprinting-us/scenes/FingerprintFinale.tsx:1-4` (the hash stamps: 14 f up to 121 %, 16 f back).
- **Use when:** the reel's one big move on its key word. A breath before it.
- **Build:** the inputs fly into one point as lines; the stamp scales to 121 % in 14 f and back in 16 f, the card
  around it taking the hit (a small jolt).

### Slam with a jolt
- **Seen:** `distillation-us/scenes/HookX3.tsx:2-8`, jolt `:33-34`.
- **Use when:** an impact the hook is built on.
- **Build:** the falling object starts mid-fall at f1. On the word: flash, sparks with gravity, a shock ring, material
  thrown up, a few px of camera jolt that decays in under 0.2 s.

### A copy peeling off
- **Seen:** `distillation-us/scenes/HookX2.tsx:2-8` (a copier: duplicates peel off behind the lamp).
- **Use when:** copying, leaking, duplicating.
- **Build:** the original on a steep plane; a lamp sweeps; behind it a duplicate lifts like a sheet (CSS 3D
  `rotateX` on a hinge), flutters to a pile, and recolours into the copy's identity. Each pass faster.

### A reflection that lags
- **Seen:** `distillation-us/scenes/HookX5.tsx:2-8`.
- **Use when:** an imitation, a shadow version, something that follows a beat late.
- **Build:** a glossy actor on a reflective floor under a spotlight; the reflection is the same drawing flipped, its
  motion read from `f - lag`, the lag growing on each word until it tears free.

### Ring squeezing to a shatter
- **Seen:** `hf-incident/scenes/HookV5.tsx:2-8`, quake `:56-58`; orbit maths `HookV5Fleet.tsx:12-28`.
- **Use when:** many attack one; pressure building to a break.
- **Build:** actors on a tilted orbit by hand projection, split into back and front layers around the target. On the
  word the ring tightens and spins faster, cracks run inward, and on the last word the target shatters, shards flying
  at the lens (foreground depth).

## From the A/B test

### Hybrid shot: a turning object in a real place, with fire
- **Seen:** `ab-wok-hybrid/scenes/Throw.tsx:1-12` (header: steam bursts out of hot oil in a wok, throws burning
  droplets, and they become a fireball, under one 40-degree orbit). The only variant of four that passed every
  `check.py frame` check (`../04-assets/three-d-look-and-plates.md`, A/B result).
- **Use when:** the hero turns under the camera or needs real material (metal, glass), and the place around it must
  turn with it. Fire, smoke or steam is part of the event. Without a turning object, build it 2.5D instead.
- **Build:** one world file, four layers on its camera (back to front, inside one stage mask), one scene that wires
  them.
  1. **World.** Copied from `world.ts`: keep `camAt`, `threeCam`, `project`, `quadMatrix`, `rand`, `clamp01`, `lerp`,
     `smooth`, `inOut` as they are. Rewrite the world units, the object's dimensions, the orbit's angles and distance,
     the `Beats` type, and the event functions (`fireball`, `fireLight`, `dropAt`) for the new story.
  2. **Back.** Copied from `Back.tsx`: keep the `box()` helper, the `quadMatrix` call per plane and the fire pool
     (a screen-blended radial gradient whose opacity is the shared light). Redraw the place itself (wall, counter,
     window) from its references, with neutral walls and cream fire light.
  3. **Middle.** Copied from `Wok3D.tsx`: keep the `Rig` (the three.js camera set from the shared `Cam` in a
     layout effect), the light set (a dim key, a low fill, one point light at the event scaled by the shared light),
     `ContactShadows` and the small `Environment` of `Lightformer`s. Replace the meshes with the new object, built in
     code from its references (a lathe for anything turned, like the wok).
  4. **Fx.** Copied from `SkiaFx.tsx`: keep the `NOISE` block, the `ramp`, and one `<Rect>` with a `<Shader>` per
     effect, sized from projected points. Retune the shapes; add a hot core gradient and self-shadow so the core is
     not a flat cream disc.
  5. **Front.** Copied from `Front.tsx`: keep `LabelTag`, the lens blur steps and the "ILUSTRASI" label. Droplets and
     embers take their positions from `project()`; vary each one's size and phase.
  6. **Scene.** Copied from `Throw.tsx`: read the cues into `Beats` once, compute the camera (with any jolt), the
     light, and every projected position, then pass props down. Labels are clamped inside the stage.
- **Render:** on the laptop GPU (`node render.mjs <slug>`, `--gl angle`), never the VPS. The test rendered 9.2 s in
  31.8 s.
- **Check:** a still at the brightest moment through `check.py frame` (saturation is the tight one under fire light),
  the oil or liquid showing the fire, no two flames alike.

## Traps

- A recipe used as decoration. Each one carries a beat of the story; name the beat in the plan.
- The same recipe twice in a row, or the big recipes (dive, flash, stamp) more than once per chapter.
- A hybrid recipe with three.js for the place, or with a layer that has its own camera.
- A photo recipe with an unlicensed or AI image. Fetch it under `../04-assets/image-assets.md` or draw it in code.
