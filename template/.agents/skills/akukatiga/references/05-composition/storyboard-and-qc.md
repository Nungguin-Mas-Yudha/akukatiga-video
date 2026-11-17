# Storyboard and QC

## Goal

See the whole film before building it, then judge every render with numbers and a second pair of eyes, not with the
builder's feeling.

## Reasoning

The first build of the hydrogen-bomb reel passed every old check and still lost to the reference on every measured
number: `check.py render` counted a glow pulse as motion. A plan in words also hid that one scene held one picture
for 13 s. A storyboard shows the holds before any scene is coded, and the calibrated metrics catch what the eye
forgives in its own work.

## Storyboard (`reels/<slug>/storyboard.md`)

One panel per beat (12-30 panels for 60-90 s). Each panel:

| Field | Content |
|---|---|
| number, time | `## Panel 07 · 21.7-24.2` (seconds from `words.json`) |
| words | the exact caption words |
| intent | what the viewer understands here, one sentence |
| picture | the actor (and the mockup it is copied from), its place, the stakes, size in frame, safe zones |
| size and energy | wide, medium, close or insert; quiet or loud |
| first and last frame | the HANDOFF in and out (`../03-treatment/treatment.md`) |
| angle | the framing (`camera-and-transitions.md`), never the previous panel's |
| camera | the move and its visible cause, or "locked" |
| motion | the verb on the trigger word ("the nucleus splits"), and what keeps the frame alive (breathing, blinking, flowing) |
| accent | one micro-accent, on which word |
| label | text or number on screen and its source |
| colour | the key colour from the look line |

Each panel gets a still (rough scene code is enough) from `node render.mjs <slug> --stills <t,...>`. Three panels (hook,
reveal, payoff) are finished styleframes and pass `check.py frame`.

Gates: no panel without intent; no actor without a place; no two panels in a row with the same picture or the same framing; every camera move
has its cause; a scene's first frame matches the previous scene's last frame for every carried object; a visual change
at least every 1.2 s; nothing still longer than 1.4 s; every label sourced; every physical object and photo referenced;
the three director tests below pass.

## Director tests

Run on the panel stills, in order, before any scene is finished. Write the result of each in `storyboard.md`.

- **Comic test.** Read the stills in order with no sound and no caption (cover the caption band). The story must
  still be followable: who, where, what happens, what it costs. Write the story the stills alone tell, in three
  sentences. If it does not match the script, the panels that broke it are redrawn.
- **Surprise test.** At least 3 moments the viewer would not predict, each named with its panel (the island vanishes
  in the same photo; the cell becomes one of a grid). A reel with fewer has only literal options picked: go back to
  the three options (`sentence-to-picture.md`).
- **Rhythm test.** No three panels in a row at the same size (wide, medium, close, insert) or the same energy (quiet,
  loud). The breath before the big move counts as quiet.

## QC loop (`scripts/check.py`, targets in `scripts/targets.json`)

1. `check.py render <slug> <mp4>`: beat interval ≤ 1.2 s, longest hold ≤ 1.4 s, motion ≥ 0.6 of frames, detail within
   the reference range, highlight p99 ≤ 225, shadow tint ≥ +2, at most 3 flashes a second, no text in Instagram's zones
   after 0.5 s, no bare frame in a handover. A check that could not run is a FAIL.
2. `check.py compare <slug> <mp4> --ref <reference.mp4>`: `reels/<slug>/review/side-by-side.jpg` and `scorecard.md`.
3. A second reviewer, an Opus subagent that did not build the scenes, reads the jpg, the scorecard and stills at full
   size and lists what fails, frame by frame: does the picture show the word being said, one focus, object whole or
   cut on purpose, label readable for 0.6 s and clear of the caption, shadows warm, accent on one object only.
4. Fix every FAIL and go back to 1. At most three rounds; after that, render and write the remaining faults plainly in
   the delivery note.

Targets come from the bom-hidrogen reference video (`check.py calibrate <mp4>`), the bar for finish, grade and photo
look. `targets.json` is calibrated on a warm photo look, so a UI-led reel is judged against a seller reel with
`check.py compare` (for example `--ref ../../workspace/projects/worked-reels/hf-hook-v5.mp4`) rather than failing on warm
targets alone. Staging, camera and transitions are judged against the seller reels. Recalibrate when the creator names
a new bar.

## Curation

The creator judges the reel in the browser, not in files. `npm run studio -- <slug>` opens the real
composition with the voice and the props the render would use; a scene is watched with a little context on
each side, so the seam can be judged too.

- Mark every scene `belum direview`, `revisi` or `disetujui`. A scene that opens and plays is not approved;
  approval is the creator's word on the picture.
- Never encode a per-scene MP4 for curation. If the preview cannot open, the judgement waits; source review is
  not visual approval.
- A revision edits the source, reloads the preview, and is re-judged on that scene only.
- One master per format, rendered after every scene in that format is `disetujui`.

## Traps

- Judging motion on a contact sheet: holds hide between the frames. The metrics and 60 fps bursts see them.
- The builder reviewing its own work. It is the one reader guaranteed to forgive it.
- Running the comic test with the caption visible. The caption carries the story; the test is whether the pictures do.
- Passing a check by gaming it (a constant flicker to raise "motion"). The motion must be the meaning moving.
