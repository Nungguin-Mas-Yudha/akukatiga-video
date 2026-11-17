# The look and the frame

## Goal

Every scene is built to the reel format's bar: a real thing on screen, its mechanism moving on the words, depth by
layer (2.5D place, projected fake 3D for what turns, shaders for fire and smoke; no Three.js, no Blender), light as an event, one warm cinematic world.
A viewer should want to keep watching for the pictures alone. Nothing about the look is held back to match a brand.

## Reasoning

The first storyboard copied the channel's brand kit into the scenes (ink and bone, one crack of lamplight, arched
doors, square corners). The creator rejected it: limits taken from a logo kit box the picture in, and the film
looked flat next to the reels. The reels are the bar (creator decision 2026-10-30).

## The brand is identity only

The Before the Prize kit (`workspace/library/before-the-prize/brand/`) is used for:
- the logo sting, once, after the cold open (`LogoSting`);
- the end screen lockup over the last 20 s.

It is never the look of a scene or a thumbnail (thumbnails: `11-thumbnails.md`). No palette lock, no "one lamplight per frame", no square-corners rule, no arch doors as
story objects, no brand chapter card. The brand's content rules stay (SKILL.md): no "Nobel" in branding, no medals,
no invented facts, politics out.

## The bar: read these before a first scene

From `.agents/skills/full-visual/references/`:

| File | What to take |
|---|---|
| `taste.md` | The picture, Light and material, Background, The motion, The hook (the caption parts do not apply) |
| `09-three-d-look-and-plates.md` | hybrid layers on one camera, the look targets, photo plates |
| `07-camera-and-transitions.md` | angles (no two scenes in a row share one), shot grammar, camera moves with causes, transitions inside scenes |
| `14-shot-recipes.md`, `15-quality-boosts.md` | how each shot and boost is built |
| `06-depth-and-particles.md`, `object-references.md`, `11-image-assets.md`, `12-treatment.md` | particles, real shapes, plates and cut-outs, thread objects |

Worked examples to open: `engine/full-visual/reels/ab-wok-hybrid/scenes/` (the hybrid layers),
`distillation-us/`, `hf-incident/` (hooks, angles, transitions inside scenes), `bom-hidrogen/` (archive photos and
the warm grade).

## Variety: every scene its own kind of picture

One grade holds the film together; the pictures themselves keep changing, as in the reels. A film drawn in one
style (outlines on dark, one accent) reads as monochrome and boring, whatever the story (creator, 2026-10-30).

- **No two scenes in a row use the same treatment.** Treatments to rotate through: an object turning in fake 3D (crystal,
  molecule, a card or layer tilting open), a 2.5D place with depth (a lab, a street, a bedroom, a campus), a graded archive photo
  with the event drawn on it, a cutaway into a machine, a document or interface at its real geometry, a map, a
  particle field (ions, electrons, atoms), a data scene where numbers count and bars grow, a macro close-up of a
  material, a split screen when the sentence compares.
- **Real colour.** Materials in their own colour: copper is copper, cobalt oxide is near-black blue-grey, lithium is
  silver, flame is amber, a 1940s photo keeps its warm sepia, a lab bench its steel. The colour meanings above lead
  the accent; the grade keeps it warm and calm. No scene in grey outlines only.
- **A new real thing for every sentence group** (`taste.md`). A thread object can stay small across the film; it is
  never the main picture twice in a row.
- **Mode change every 60-90 s at least**, and a big move (a dive, a reveal, a 3D turn) in every chapter.

## The director

The reel format's director tests run on the hardest passage and every chapter's contact sheet
(`full-visual/references/10-storyboard-and-qc.md`, Director tests), results written in `storyboard.md`:

- **Comic test.** The stills alone, with no sound, tell the story in three sentences that match the script.
- **Surprise test.** At least 3 moments per chapter the viewer would not predict, each named with its still.
- **Rhythm test.** No three stills in a row at the same size (wide, medium, close, insert) or the same energy.
- **Variety test** (this format's addition). Name each still's treatment; no two in a row share one, and no chapter
  is more than half one treatment.

A second Opus reviewer, who did not build the scenes, runs the tests and the frame check on the stills at full size
and lists every fail. The builder never passes its own work.

## What changes for 16:9

- **The whole frame is the stage.** No caption band. Use the width: establishing wides, lateral travel along a long
  object, scale contrast (a small actor in a big place), a foreground object at the lens, two things side by side
  when the sentence compares them.
- **Ground.** Warm near-black with a topic ground drawn in it (`09`, Look; `taste.md`, Background); corners dark,
  detail readable. No light paper scenes: a document is an object lying in the dark world, lit.
- **Colour meanings** (`09`): amber energy and heat, gold the payoff, blue water, cold and data, red danger or
  wrong, green safe or right. One accent per frame.
- **Text on screen** is only what a viewer needs to read: names, places and years, numbers, labels on the
  mechanism, a verified quote. Set in the film's look, never under 24 px at 1920x1080. Subtitles stay a file.
- **Chapter opener.** A scene, not a card: the chapter's first picture with its number and title set into it for
  3-4 s, the title matching `film.json` and `chapters.txt`.
- **Labels only where a viewer could be misled** (creator, 2026-10-30): a real photo or clip carries its credit
  ("Photo · source, licence"); a recreated document carries "Recreation"; a size comparison that is not true to
  scale carries "Not to scale". Animated scenes carry no "Illustration" label: the film is plainly drawn. Figures
  redrawn from a paper are credited in the description and `references.md`.
- **24 fps.** A full-frame pan takes 7 s or more; fast moves carry motion blur while they move.
- **Render 3D on the laptop GPU** (`--gl angle`), never on the VPS.

## Handovers

Transitions happen inside the scenes (`07`): a dive into the object, a pull-back reveal, a window widening, a
change of role in place, an object carried into the next scene already in place. The engine's `in:` is rare:

| `in:` | Use |
|---|---|
| (none) = cut | the carried object is already in place in the next scene |
| `dissolve` | time passing inside one line of thought |
| `dip` | a jump in time or place, usually a chapter start |

`arch` is the brand's and is not used in scenes.

## The frame check (every still, every styleframe)

Every still is audited on these, each answered PASS or FAIL in the review file (creator, 2026-10-30):
- **Overlap:** no label, tag, gauge or object crossing another, or text over a busy area; nothing cut by the frame edge.
- **Composition:** one clear focus, the frame balanced, no large dead area, the subject not jammed against an edge.
- **Labels and captions:** readable at 480 px wide (at least 40 px), on a calm background or plate, held long enough, and understood by a newcomer without the voice.
- **Exposure:** not too dark (the subject and its details readable on a phone in daylight) and not washed out; measured with check.py, judged by eye.
- **Colour:** follows the locked vocabulary, one accent per frame, no two meanings in one colour, real materials in their real colours, saturation calm.

1. Inside title safe; nothing of ours in the end-screen zone over the last 20 s (`--guides --end-screen`).
2. Look targets measured: `node ../../scripts/py.mjs ../full-visual/scripts/check.py frame <png>` (warm shadows,
   blacks lifted, highlights p99 at most 225, saturation calm). A check that cannot run is a fail.
3. The hero has a base gradient, a rim light and a contact shadow; it stands in a place, not a void.
4. No two scenes in a row share a framing; something moves in every shot.
5. Readable at phone size: shrink to 480 px wide and read every claim.
6. Every photo or clip credited, every recreated document marked, no needless labels; no "Nobel", medal, laurel or Nobel Foundation material.
