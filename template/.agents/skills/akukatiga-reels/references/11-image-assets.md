# Image assets: plates, cut-outs and ghost views

## Goal

The rich, real-looking objects of the reference (an ear in cross-section, an AirPod that turns see-through) are
pictures, not code: an illustrated plate behind, a cut-out object on its own layer, and code on top for everything
that moves on a word. This 2.5D layering is one of two ways to show a physical object; the other is an object drawn in
code with material and moving parts, as the seller's machines are (`13-mockups.md`). Pick code when parts must move
apart (shutters drop, bolts slide, a tower restacks); pick a picture when the source picture is the quality. When the object
turns or needs real metal or glass, it is the three.js middle layer of a hybrid shot, and the place behind it stays a
2.5D plane (`09-three-d-look-and-plates.md`).

## Reasoning

Taken apart frame by frame (2026-10-29), a reel made with this same kit and Opus at medium effort reached the
reference's look because its anatomy moved as one rigid picture under the camera, the earbud slid in as a separate
layer at one fixed angle, and its see-through version appeared in exactly the same framing: two raster images and a
cross-dissolve. The particles, the waveform, the labels and the counters were code. In an A/B test on the same shot,
a code-drawn SVG and a clip-art plate cost the same tokens and time (about 130 k, 5 minutes) and both looked worse:
the quality comes from the source picture, not from the method.

## The layers

1. **Plate** (`<Plate>`): the ground of the shot, a place or a cross-section. Full-bleed in the stage band, graded,
   always moving.
2. **Cut-out** (`<Cutout>`): an object as a transparent PNG on its own layer, with a contact shadow and an optional
   rim light. It moves with the kit's verbs (travel in, push, swell), never rotates in perspective (it is flat: an
   angle change needs a new image).
3. **States** of a cut-out (`states` on `<Cutout>`): further fetched images of the same object at the same framing,
   cross-dissolved on a cue. The standard one is the **ghost view** (phantom or X-ray view): the shell turned to
   frosted glass with the parts inside shown. Others: exploded, cut in half, heated, broken.
4. **Code on top**: particles, waves, arrows, labels with leader lines, counters, highlights, the camera. Every
   change of state still lands on its word through this layer or a state cross-dissolve.

## Where the pictures come from

Every picture is fetched, never generated (creator decision 2026-10-29: no AI images). Haiku fetches the candidates
(`object-references.md`, Fetch many, Opus picks); Opus picks and records source and licence in `references.md`.
Sources, in this order:
1. A real photograph or archive picture: public domain (US government, NASA, Wikimedia PD) or CC.
2. A licensed illustration: Servier Medical Art (CC BY 4.0, medical and biology), Wikimedia (CC BY / CC BY-SA),
   BodyParts3D renders (CC BY-SA), credited in the honesty label when the licence asks.
3. A free-licence photograph: Unsplash, Pexels (their licences allow use without credit; record the page anyway).
Never a photo of a real person for a claim about them, never a political figure, never a brand product unless the
sentence is about that brand.

## References are free, what is shown is not (creator decision 2026-10-29)

Any picture on the internet may be fetched as a reference to look at, measure and redraw in code: screenshots,
product photos, diagrams, frames of other videos, whatever its licence. Redrawing means our own drawing from
measured proportions, never a line-for-line trace of one picture. Only a picture that appears on screen itself
(a plate, a cut-out, a segmented layer) must pass the licence rules below. When in doubt, redraw.

## Licence safety (creator's rule: never break a licence)

The reels are commercial, so a picture is usable only when its licence allows commercial use and modification
(cropping, grading, labels, motion):
- **Use:** public domain (PD-USGov, NASA, PD-old), CC0, CC BY (credit in the honesty label or the post caption,
  as the licence asks), Unsplash licence, Pexels licence.
- **Avoid unless nothing else exists:** CC BY-SA (share-alike can extend to the video itself). If used, record why and
  credit it.
- **Never:** NC (non-commercial), ND (no derivatives), "all rights reserved", editorial-only, unknown or missing
  licence, stock with watermarks, screenshots of other people's videos, AI-generated images.
- **Separate from copyright:** a recognisable person needs a model release (avoid faces); a brand logo or product is a
  trademark (only when the sentence is about that brand; never implies endorsement); Unsplash/Pexels forbid selling
  the picture unaltered and implying endorsement.
- **Proof:** read the licence on the file's own page (not a mirror or a search result), copy its exact wording, page
  URL, author and date opened into `references.md`. A licence that could not be read counts as "never".

## High quality first (creator's rule)

Search wide and take the best picture, not the first licensed one. Haiku fetches 5-10 candidates per object from
several sources; Opus picks on quality before anything else: sharp at full size (no upscaled blur, no compression
blocks), at least 2160 px long side for a plate and 1500 px wide for a cut-out, professional light and shading
(painted medical illustration, studio product photo, archive original scan), clean edges, no watermark. A clip-art
diagram or a low-resolution scan loses to a better source even if it is easier. If nothing high quality exists, say
so in `references.md` and draw that object in code instead.

## Picking a set that fits together

- One style for the whole reel: either photographs, or one illustration family (all Servier, or all from one
  illustrator on Commons). Do not mix a painted plate, a clip-art diagram and a photo in one reel.
- A state set (normal → ghost view, closed → open) only exists when the same source has both pictures at the same
  framing (product teardown photos, an atlas with layers). Otherwise draw the second state in code on top of the one
  picture: an SVG see-through overlay, a cut line, a glow, parts sliding out.
- Prefer pictures without burned-in text; otherwise remove the text (record it: "tulisan dihapus").
- Size: plates at least 2160 px on the long side; cut-outs at least 1500 px wide.
- Grade every picture to the reel's look (`09`) so the set reads as one film; clip-art with heavy black outlines
  fails `check.py frame` (detail, black): pick a softer source.

## Cutting out

Prefer a source with a transparent background (PNG cut-outs, SVG). Otherwise remove the background locally
(`uv run --with rembg python -c ...`, or the session's remove-background tool), check the edge at full size, and
keep a 2-4 px soft edge. Save as PNG in `reels/<slug>/assets/`.

## Checks

- Side by side with the object's references: proportions within 5 %, parts present and in order, nothing invented
  (`object-references.md`, The check).
- `check.py frame` on a styleframe with the plate and cut-outs in place: the plate's grade must bring black, clip and
  saturation into range (clip-art with heavy black outlines fails detail and black; choose or regenerate a softer
  style).
- States: overlay the two images at 50 %; the outline must not jump.

## Traps

- Mixing styles in one reel (a painted plate, a clip-art diagram and a flat SVG). One style line, every picture.
- A cut-out that turns: it is flat. Turn it with a new image at the new angle, cross-dissolved.
- A picture doing the explaining with no event on top. The word still needs its change on screen.
- Brand products drawn when the sentence is not about the brand.
