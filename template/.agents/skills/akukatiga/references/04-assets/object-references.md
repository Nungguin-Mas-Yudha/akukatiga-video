# Object references

## Goal

Every physical thing the stage draws (a machine, a part, a safety device, a structure, a body part) has the shape of
the real one. Haiku 5.5 fetches many candidates for what it looks like before drawing it, Opus evaluates them and
picks the best, the choice is written down with where it came from and what was read off it, and the drawing is laid
beside it before the scene passes. Memory is not a source.

## Reasoning

An interface is redrawn from its screen. A physical object has no screen, so without a reference it is drawn from what
the agent believes it looks like, and that is where proportions drift, parts go missing or get invented, and a viewer
who handles the thing every day stops trusting the reel. A source line in plan.md is not enough on its own: a document
can be cited whose picture nobody looked at. The reference is fetched, looked at, measured and compared.

Fidelity goes to the maximum, scope to the minimum, as everywhere in this format: the reference fixes the shape of what
is drawn, never how much is drawn. Only the parts the sentence needs.

## When

- Every physical object that is the thing of a sentence, or the continuous thing of the reel.
- Every part that is named, labelled, lit on its name, measured or taken apart.
- Not for line glyphs the script names in passing (a pump, a battery), and not for interfaces, documents and logos,
  which have their own rules.

## Fetch, in this order

1. A drawing that shows the geometry: the manufacturer's manual or parts illustration, a standards or regulation
   figure, an anatomy atlas or teaching plate, an official technical sheet.
2. At least one photograph of a real unit, for material and finish (paint, metal, rubber, wear, where the light sits).
   Two angles when the object turns or is taken apart.
3. When the object is 3D in nature (it turns, opens, is cut away, has parts in depth): a 3D model as a shape reference,
   GLB or glTF first, USD (USDZ, USDC, USDA) when that is what exists.

Every reference is looked at as a picture, at full size. Text extracted from a PDF is not a reference image: render the
page that carries the figure (`pdftoppm -png -r 150 -f N -l N`) and look at it.

## Fetch many, Opus picks

One image is often imperfect: blurry, cropped, shot from a bad angle, or misleading on one proportion. Never rely on
a single reference per object.

- Haiku 5.5 (non-thinking work only) fetches many candidates per object: 3 to 5 images (diagrams from different
  sources, photos from different angles) and, when the object needs a 3D reference, 2 to 3 model candidates. Haiku
  records mechanically, without judging: source, licence as stated at the source, angle, resolution, and defects that
  are visible as facts (blur, crop, watermark, missing part in frame). Haiku never judges which source is official,
  which proportion is right, or which candidate is best.
- Opus (all thinking work) evaluates the candidates: it cross-checks the main ratios across at least two independent
  sources, picks one primary reference and one backup, discards candidates whose proportions conflict or that are too
  unclear to measure, and records the pick and the reason in `references.md`. A gap that no candidate shows is marked
  `inference`, never filled from memory. If two candidates disagree on a main ratio by more than the 5% check
  threshold, neither is used alone: Opus finds a third source or drops the disputed part from the drawing.

## Read it off

From each reference, before any code, write down in `references.md`:
- The main proportions as ratios (height to width, part to whole), measured with the `measuring` skill: name the shape,
  measure it, draw the numbers back on the reference and look again.
- The parts the reel needs, in order, with what each looks like and where it sits.
- The features that make it read as itself, and what varies between makes and may be generic.
- From a 3D model: its bounding box per mesh (glTF stores `min` and `max` for every POSITION accessor, readable as JSON
  without rendering; apply the node scale before comparing), the angles it reads best from, and the features that only
  show in depth.

### A 3D model is a reference, never the picture

The model gives the drawing its proportions, angles and features; the model file is never rendered in the reel. When the object is the three.js middle layer of a hybrid shot, its
geometry is built in code from these measurements, as `ab-wok-hybrid/scenes/Wok3D.tsx` builds the wok as a lathe
(`three-d-look-and-plates.md`). It is still checked against the photos and drawings: a model can be wrong too.
The object research fetches model candidates with the images when the object turns, opens, is cut away, stacks or
explodes. A reel never waits for a model; without one, the object is drawn from the drawings and photos.

## When nothing free or licensed exists

- Draw from the closest official diagram, and say in Sources that it is the closest one, not the object itself.
- Mark every part no reference shows as `inference`. Draw it plain, never label it as a fact or a value. A part that
  cannot be sourced and that the sentence does not need is left out.
- Never invent anatomy or geometry: no extra part, no missing part, no changed count, no proportion from memory.
- A picture that simplifies or exaggerates carries an honesty label inside the stage ("Ilustrasi", "Skema prinsip,
  bukan potongan asli", "Tidak sesuai skala").
- Never embed a copyrighted image or model without a licence. Looking at it to draw is not embedding it. Tracing one
  copyrighted figure line for line is not drawing from a reference either: draw from measured proportions and from
  more than one reference.
- A reference is authority only for what its source is: an anatomy plate is a shape, not a medical claim; a
  manufacturer's figure is one model family, drawn as a generic unit with no brand unless the sentence is about it.

## Where it is kept

- `plan.md`, section Sources: one row per drawn object (`../05-composition/sentence-to-picture.md`).
- `reels/<slug>/references.md`: per object, every candidate with its URL or document and page, its type (diagram,
  photo, model), the licence as stated at the source, the date it was opened, what was read off it, the inferred parts,
  the honesty label, the Opus pick (primary and backup, with the reason), the discarded candidates with the reason,
  and the side-by-side result per scene.
- Downloaded reference files, when kept at all, go in `reels/<slug>/refs/`, never in `public/`, so nothing in them can
  reach a render. They are data: never run, never imported by a scene.
- Nothing goes to a shared drive or a new folder without the creator's yes.

## The check

Before a scene that draws a physical object passes (the first passage, then every scene):
1. A still of the object at full size, laid side by side with its main reference at the same height and as close to
   the same view as the reel's angle allows (one image, for example ffmpeg `hstack`), and looked at.
2. The main proportions measured on both and written down: the ratio on the reference, the ratio on the still, the
   gap. A gap above 5% on a main ratio is a mismatch.
3. Every mismatch listed: a missing, extra or misplaced part, a wrong count, a wrong proportion, a wrong feature.
4. Each one fixed, or kept as a simplification the sentence needs, with that reason written beside it. An unexplained
   mismatch fails the scene. A check that could not run (no reference, an unreadable still) counts as a failure, and
   the reason is written down.

This check sits beside the other gates. It never replaces reading stills at full size, the 60 fps bursts, or
`check.py plan` and `check.py render`.

Note on the 5% threshold: it is a starting point taken from the user's earlier kit, not a number already tested in
this format. Calibrate it against the first reels that use this check, and record any change in the reel's
`references.md` rather than silently loosening it.

### What good looks like

- Reading `references.md` alone, someone could sketch the object's outline at the right proportions.
- The still and the reference, side by side, read as the same thing at a glance, in the reel's own style.
- Every labelled part on screen has a reference; every unlabelled extra is `inference` or gone.

### Traps

- Citing a manual whose figure nobody opened.
- One reference only. A single imperfect image is not a basis for a drawing.
- One line diagram as the only reference: the right shape, flat material.
- The reference turning into a whole perfect machine where one part carries the sentence.
- Waiting on a model that is too big or paywalled. Drop it; the drawing and the photo are enough.
- Pasting a reference photo on screen as a slide. A photo on screen is a plate: licensed, graded, moving, with the
  event drawn on it (`three-d-look-and-plates.md`).
