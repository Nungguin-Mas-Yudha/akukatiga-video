# References template (per reel)

Copy this file to `reels/<slug>/references.md` and fill one block per drawn physical object. This template is the
record the rule in `object-references.md` requires. It is not a render input: nothing in this file, and nothing in
`reels/<slug>/refs/`, is ever imported by a scene. Keep downloaded reference files out of `public/`.

## Object: <name, as labelled on screen>

- Sentence or sentences it carries:
- Candidates, fetched by Haiku 5.5 (3 to 5 images, plus 2 to 3 model candidates when the object needs a 3D reference).
  For each candidate, record mechanically, without judging: source (URL, or document and page), type (diagram, photo,
  model), licence as stated at the source, date opened, angle, resolution, and visible defects as facts (blur, crop,
  watermark, missing part in frame).
  - Candidate A (diagram): parts in order, where each sits.
  - Candidate B (photo): material and finish (paint, metal, rubber, wear, where the light sits).
  - Candidate C (further diagram or photo, different angle or source):
  - Candidate D (3D model, only if the object turns, opens, is cut away, or has parts in depth): format (GLB or
    glTF first, USD only when that is what exists), bounding box per mesh (glTF POSITION `min` and `max`, node scale
    applied), angles it reads best from, features that only show in depth. Shape reference only. Never embedded,
    loaded, or rendered in the reel.
- Opus pick (thinking work): primary reference and reason, backup reference and reason, discarded candidates and
  reason each. Main ratios cross-checked across at least two independent sources; a ratio disputed by more than the
  5% check threshold is not used alone.
- Main proportions as ratios, read off the picked references (height to width, part to whole):
- Parts marked `inference` (no reference shows them), and why each is kept or left out:
- Honesty label on screen, if any ("Ilustrasi", "Skema prinsip, bukan potongan asli", "Tidak sesuai skala"):
- Brand handling: generic unit with no brand, unless the sentence is about that brand:

## Side by side check, per scene

- Scene:
- Still (time and file):
- Reference used, at the same height and as close to the same view as the reel angle allows:
- Ratio on the reference, ratio on the still, gap in percent:
- Mismatches listed (missing, extra, or misplaced part; wrong count; wrong proportion; wrong feature):
- Each mismatch: fixed, or kept as a simplification the sentence needs, with the reason written here. An unexplained
  mismatch fails the scene. A check that could not run counts as a failure, and the reason is written here.

## Storage

- This file lives at `reels/<slug>/references.md`. The one-row-per-object summary lives in `plan.md`, section Sources.
- Downloaded reference files, when kept at all, go in `reels/<slug>/refs/`, never in `public/`. They are data: never
  run, never imported by a scene.
- Nothing goes to a shared drive or a new folder without the creator's yes.
- Licence rule: looking at an image to draw from it is not embedding it. Never embed a copyrighted image or model
  without a licence, and never trace one copyrighted figure line for line. Draw from measured proportions and from
  more than one reference.
