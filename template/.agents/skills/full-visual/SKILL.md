---
name: full-visual
description: "Build a full-screen animated explainer reel in this Keyframes folder (the reference format): no presenter, a voice, a word-by-word caption at the top with one boxed key word per line, and under it real interfaces, logos, numbers, documents, code-drawn machines and graded archive photos, animated in sync with the words as one film whose objects carry from scene to scene, with the transitions made inside the scenes, 1080x1920, timeline 60 fps, delivered at 30 fps. One caption.txt per reel drives the script, the caption blocks, the key words, the emoji, the scenes and the grounds; the engine holds the fixed grammar; scenes are written per reel with a small motion kit; scripts refuse the known defects. Use whenever the user wants a full visual explainer, 'the reference format', an animated explainer with no face, a reel where everything is drawn and synced to a voiceover, wants to edit or re-render a reel in engine/full-visual/reels/, or asks how an example reel was made. NOT talking-head edits, NOT still explainer slides."
---

# Full visual

## Batas kerja QC

Cek mesin dijalankan langsung per scene/chapter. Satu reviewer menilai draft lengkap dengan contact sheet dan
frame yang ditandai; keluaran hanya tabel FAIL maksimal 6 baris. Perbaiki BLOCK sekaligus, lalu jalankan ulang
cek mesin dan tontonan terarah pada bagian yang berubah. Maksimal dua putaran per draft; reviewer kedua hanya
untuk masalah visual baru atau hasil ambigu. BLOCK tersisa dilaporkan sebagai belum lolos.

A voice explains; the screen is the explanation. No face, no music, no hard cut: one concept, one thread object, and
objects handed from scene to scene, with the story moving inside the scenes (a dive into a mark, a window widening)
(`references/12-treatment.md`, `references/07-camera-and-transitions.md`). The caption at the top says the sentence
one word at a time, and under it a short event plays: an actor in a real place, changing on the word that changes it.
A new picture arrives at least every 1.2 s.

**The bar for concept, staging, camera and transitions** is the seller's worked reels in `engine/full-visual/reels/`
(`distillation-us`, `hf-incident` with its hook `hf-hook-v5`, `distill-hook-v1`..`v5`, `chrome-fingerprinting-us`),
rendered with `node render.mjs <slug>`, and the study of how they are directed,
`workspace/projects/worked-reels/seller-study.md`. Watch them before starting and read their `plan.md` and scene
headers: they are things to look at, not descriptions to trust.

**The bar for finish, grade and photo look** is the reference study
`workspace/projects/2026-10-29-full-visual-bom-hidrogen/reference-study.md`; `check.py` measures it with
`scripts/targets.json`, calibrated on that video. `targets.json` is calibrated on a warm photo look, so a UI-led reel is
judged against a seller reel with `check.py compare` rather than failing on warm targets alone.

When the prompt names a project in `workspace/projects/`, read `.agents/skills/full-visual/references/05-workspace.md`
first and follow it.

## The brief

The agent directs; it does not illustrate. Each scene is a short event: an actor in a place, with something at stake,
and something happens to it on the trigger word. The reel is one story with setups and payoffs: a bomb falls toward an
island in the hook, and later the island vanishes in the same photo (`references/02-sentence-to-picture.md`,
`references/12-treatment.md`).

The actors are real things, redrawn at their own geometry with their real copy, stripped to what the beat needs. The
viewer should be able to follow the whole argument with the sound
off, and should never see a frame where nothing is happening or a frame they cannot read on a phone. Sync is the
craft: a picture that lands a fifth of a second off its word is wrong, however good it looks.

The bars above are reels, for the craft. A physical thing a sentence is about (a machine, a part, a safety device, a
structure, a body part) has its own reference: the agent fetches it before drawing it, as it fetches a logo, looks at
it as a picture, measures it, and checks the drawing against it (`references/object-references.md`). Interfaces,
documents and logos keep the rules they have.

Before a reel, read `workspace/library/full-visual.preferences.md` and `workspace/library/full-visual/profile.json`
when they exist: the creator's saved look, voice and words (`/full-visual-customization` writes them). They dress the
format; they never change its method. With no profile the format runs exactly as written here.

## What never changes (the engine, `engine/full-visual/src/engine/`)

1. No presenter, no hard cut, no music. The camera moves only for a cause the viewer can see (a slam, a copy leaving,
   a dive into a mark), written in the scene (`references/07-camera-and-transitions.md`). A frame stays alive through
   its objects (breathing, blinking, flowing), never through constant drift, and never through zoom pulses on words.
   A punch-in is for a blast or impact the viewer sees, one or two per reel (minyak-air had 37 on key words, read as a
   stutter, and the creator cut them to 2). A failing motion check is fixed by moving objects, not the stage.
   The camera reframes about once per sentence, each move about 0.5 s (28-32 frames at 60 fps) eased, then holds; the
   pace between comes from objects changing (minyak-air r5 had 86 quick reframes and felt busy; r6 with 23 was approved). The caption band never moves. The voice
   is the only clock.
2. Three bands on one centre axis: caption y 300-500, stage y 520-1450, pinned chrome below, the last 220 px left to
   Instagram. `--guides` draws them on a still.
3. The caption is one word per spoken word. A word not yet said does not exist. Active word bold, full ink; said words
   regular, grey, in one frame; the new word resolves from blur in place; two lines at most; one key word per block in
   the selection box, which lands a few frames after its word.
4. A scene hands over only in a silence between sentences, with the next scene already arriving, so the ground is
   never bare. The engine places the handover; nobody authors a scene time. The handover is the plain lift, and the
   object it carries is already where the next scene picks it up (`HANDOFF`, `references/12-treatment.md`). The move
   that carries the story (a dive, a server growing into a wall, a pull-back) happens inside the scene. `in: iris`,
   `zoom`, `flash`, `match` or `fade` in `caption.txt` is rare: at most two per reel, each with its reason in `plan.md`.
5. Interfaces are redrawn, never recorded: real geometry, real copy, only the parts the sentence needs, starting from a
   copied seller mockup (`references/13-mockups.md`). A physical object is drawn in code with material and moving
   parts, as the seller's machines are, or is a 2.5D picture: a plate behind and a cut-out with states on its own
   layer (`references/11-image-assets.md`). A historical moment may be a graded archive photo. Depth is hybrid by layer, all
   layers on one camera function: the place in 2.5D planes (`matrix3d` onto the 3D camera's projection), real 3D
   (`@remotion/three`) only for an object that turns or needs real metal or glass, fire, smoke and steam as Skia
   shaders, droplets and labels in SVG in front. A scene with no turning object stays 2.5D
   (`references/09-three-d-look-and-plates.md`, worked example `reels/ab-wok-hybrid/scenes/`). Every picture is checked against fetched
   references. The change of state is done by code or a state image on top of it, on its word.
6. A number is never static: it counts, rolls or fills, and lands on its word.
7. A change of state happens to the object already on screen. It recolours, breaks, grows a row. It is not replaced.
8. The CTA is performed in the real Instagram interface: a cursor taps like, share and follow. Never a comment keyword,
   never a promised deliverable (a poster, a PDF) the creator has not made.

9. One palette and one finish per reel: warm split-toned shadows, vignette, grain, bloom only on what is hot
   (`reel.json` `theme.finish`). `check.py render` fails cold shadows and blown highlights.

What a reel may change lives in `src/theme.ts` and the reel's `reel.json`: fonts, grounds (always a dark range,
`references/taste.md`), marker style and colour, role colours, stage width, handover verb, finish, pinned chrome
(countdown pill, terminal, none).

## Stages and gates

| # | Stage | In, out | Gate before the creator sees anything | Pattern |
|---|---|---|---|---|
| 1 | Script | the creator's transcript → `script.txt` | the script the creator gives is done and taken as true: never fact-check or re-verify it | `references/01-script-and-caption.md` |
| 2 | Voice | script → `voice.mp3` (+ `voice.alignment.json` when the voice is ElevenLabs: exact word times; another provider through `node scripts/narrate.mjs --root ../.. --config reels/<slug>/voice.json --text-file reels/<slug>/script.txt --out reels/<slug>/voice.mp3`, then align.py times it by speech recognition) | the creator chose the voice; never splice a take, regenerate it whole | same, and `references/05-workspace.md` (The voice) |
| 3 | Caption | script → `caption.txt` → `node ../../scripts/py.mjs scripts/align.py <slug>` → `words.json` | `node ../../scripts/py.mjs scripts/check.py plan <slug>` exits 0; every "!" line from align read and resolved | same |
| 4 | Treatment | caption → `treatment.md`: the concept, the thread object, the objects carried between scenes with their `HANDOFF` table, at least two plant-and-payoff pairs, the one big move, 3-5 hook ideas (each a different physical metaphor of the same claim); rough stills for up to 3 hooks | **the creator picks a hook from the stills and approves the treatment in words before the plan** | `references/12-treatment.md` |
| 5 | Visual plan | treatment → `plan.md`: per beat (every key word, at most 1.2 s apart) the actor, the place, the stakes, first frame, trigger word → event, last frame, angle, and the visible cause of the camera move; three options (literal, point of view, scale or metaphor) written for the hook, the mechanism and the payoff; one look line for the reel (palette, finish, light) | **the creator approves the plan in words before any pixel.** Every beat has an actor in a place; an object floating with no place fails. No two scenes in a row share a framing. Every physical object, photo, illustration and cut-out state set (`references/11-image-assets.md`) has its references fetched, looked at and written down in `reels/<slug>/references.md` before the plan is shown | `references/02-sentence-to-picture.md`, `references/14-shot-recipes.md`, `references/object-references.md`, `references/07-camera-and-transitions.md`, `references/13-mockups.md` |
| 6 | Storyboard | plan → `storyboard.md` + one still per panel (`node render.mjs <slug> --stills`, rough scenes allowed) and 2-3 finished styleframes (hook, reveal, payoff) | no two panels in a row look the same; each panel has its angle, camera cause, and first and last frame; the director tests pass: comic (the stills alone, with no sound or caption, tell the story), surprise (at least 3 named moments the viewer would not predict), rhythm (no three panels in a row at the same size or energy); the styleframes pass the finish checks (`check.py frame`) | `references/10-storyboard-and-qc.md` |
| 7 | One passage | the hardest 8-12 s built first, alone | stills read at full size against the plan and the seller reels; every physical object laid side by side with its reference, mismatches listed and fixed (`references/object-references.md`, The check); `check.py render` exits 0 on pace, hold, motion, detail, tone and flashes; `check.py compare` side-by-side read by a second Opus reviewer who did not build it; then the creator sees it. Nothing else is built until the creator accepts it | `references/03-motion-and-sync.md`, `references/10-storyboard-and-qc.md` |
| 8 | The rest | remaining scenes | machine checks per scene; one combined visual review after the complete draft, then changed scenes only on round 2 | same |
| 9 | Sound | picture accepted | narration only: no music, SFX or ambience (CLAUDE.local.md); loudness to about -14 LUFS, true peak at most -1 dBTP | |
| 10 | Deliver | `node render.mjs <slug>` → `engine/full-visual/output/YYYY-MM-DD/NN-<slug>.mp4`, caption `.txt`, copy it to `workspace/output/<project folder>/<slug>.mp4` with `caption.txt` (the post caption) and `cover.jpg` (a frame of the video), full paths printed (`references/05-workspace.md`) | both checks exit 0 on the final file | |

## Commands (from `engine/full-visual/`, renders with the sandbox disabled)

```bash
node ../../scripts/py.mjs scripts/voice.py <slug> --audition id:label,...   # a synthetic voice: the creator picks from reels/<slug>/voices/
node ../../scripts/py.mjs scripts/voice.py <slug>                 # script.txt -> voice.mp3 + voice.alignment.json, whole take, never patched
node ../../scripts/py.mjs scripts/align.py <slug>                 # caption.txt + voice -> words.json
node ../../scripts/py.mjs scripts/check.py plan <slug>            # before pixels
node render.mjs <slug> --stills 1.2,3.45,9      # look before rendering: reels/<slug>/stills/
node render.mjs <slug> --guides --stills 9      # bands + Instagram's zones drawn on
node render.mjs <slug> [--from s --to s]        # output/YYYY-MM-DD/NN-<slug>.mp4, 30 fps (--fps 60 for 60)
node render-remote.mjs <slug> [flags]           # same render on the VPS (akk-vps), mp4 back in output/; slower, 2.5D only: a three.js shot renders on the laptop GPU
node ../../scripts/py.mjs scripts/check.py render <slug> <mp4>    # pace, holds, motion, detail, tone, flashes, Instagram zones, bare handovers
node ../../scripts/py.mjs scripts/check.py compare <slug> <mp4> --ref <ref.mp4>   # reels/<slug>/review/side-by-side.jpg + scorecard.md for the second reviewer
node ../../scripts/py.mjs scripts/check.py calibrate <ref.mp4>    # rewrite scripts/targets.json from a reference video
node ../../node_modules/typescript/bin/tsc --noEmit -p .           # types, before any render
```

At 30 fps `render.mjs` renders silent and lays `voice.mp3` under afterwards, because Remotion's `everyNthFrame`
squeezed the audio 2x (an 89 s voice came out 44.7 s).

A new reel: `reels/<slug>/` with `voice.*`, `caption.txt`, `reel.json`, `scenes/index.tsx` (scene id → component). It registers
itself: `reels/index.ts` finds every `reels/<slug>/scenes/index.tsx`. A scene with no component yet renders as caption over ground, which is how the caption is
judged first.

## What a scene is

A React component that reads `useScene()`: the current frame `f`, `cue("word")` (the frame that word starts, within
this scene; it throws if the word is not in the caption), `cueEnd`, `endsOn("word", dur)` (where a build of `dur`
frames must start to finish on the word), `scene.from`, the ground palette and the theme. It draws inside
`<Column>` and moves things with the kit in `src/engine/moves.ts` and `Motion.tsx`: `blurIn`, `pop`, `blurOut`,
`<Travel>`, `typeOn`, `countTo`, `jitter`, `stagger`, `mix`, `draw`, `<Cursor>`, plus a camera helper (`<Camera>`:
moves from cues, `drift={0}` unless a cause is named), photos and illustrations (`<Plate>`), cut-outs with states
(`<Cutout>`) and the finish (`theme.finish`) in `src/engine/`, and the Remotion packages installed for it:
`@remotion/effects` (colour correction, LUT, glow, light leak, lens and
zoom blur, noise, shatter...), `@remotion/transitions`, `@remotion/motion-blur`, `@remotion/noise`, `@remotion/paths`,
`@remotion/shapes`, `@remotion/lottie`, `@remotion/skia`, `@remotion/three` (the middle layer of a hybrid shot, only for an
object that turns or needs real material, rendered on the laptop GPU with `--gl angle`), `@remotion/rough-notation`,
`Easing`, and `spring()`
(`references/03-motion-and-sync.md`; how layers share one camera: `references/09-three-d-look-and-plates.md`; when and how for Skia shaders, motion blur, paths, light leaks, rough notation,
easing and Lottie: `references/15-quality-boosts.md`). Every
motion is a start frame taken from a cue and a duration in frames, drawn only from `useCurrentFrame` (never
`useFrame`, `Math.random` or a clock). No timeline file, no seconds typed by hand.

The kit is verbs, not components: nothing in it has content. What a reel draws is written for that reel, starting from
a copied mockup (`references/13-mockups.md`).

Each reel has a `scenes/parts.tsx` that is its bible: `STAGE`, the palette by role, the bare `Logo`, the thread
component and the `HANDOFF` table. Each scene file opens with a header: the sentence, its first frame (the HANDOFF it
starts from), word → event, and its last frame (`distillation-us/scenes/Distill.tsx:2-8`).
