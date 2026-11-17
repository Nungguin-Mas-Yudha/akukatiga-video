# Depth and particles

## Scope

The way to draw a field with depth in SVG or canvas. Real 3D is only the middle layer of a hybrid shot,
for an object that turns (`09-three-d-look-and-plates.md`); a particle field stays 2.5D, and lit spheres are sprites with a radial gradient and a highlight. The camera moves
only for a cause (`07-camera-and-transitions.md`). The caption band never moves.

## Goal

A mechanism made of many small things (molecules, gas, dust, sparks, people in a crowd) is
drawn as a field with depth: near is bigger, brighter and sharp, far is smaller, dimmer and
soft. It moves on the words like any object.

## How (no WebGL)

- Positions live in 3D, seeded (`rand(seed)`), computed once per reel into arrays; the frame only reads them.
- Project with one camera: s = F / (F + z); x' = cx + x*s; y' = cy + y*s. Start from
  `reels/hf-incident/scenes/HookV5Fleet.tsx` (`project`, F = 1000, D = 1000, front and back layers).
- Draw each particle as a sprite: radial gradient (light from upper left), one highlight, faint noise.
  Sort by z every frame. Size from s, opacity 0.35 + 0.65*s.
- Depth of field: blur = k * |z - zFocus|, capped at 12 px. Rack focus = move zFocus over 18 to 24 frames on a word.
- Count: SVG up to about 800 sprites; more than that goes to one <canvas> layer drawn from the same arrays.
- A camera dive is a change of F or of the camera z over 10 to 14 frames, ending on the word.
- State changes stay on the same particles: merge, recolour, label swap (HYDROGEN to HELIUM pattern).

## What good looks like

- A still read at full size shows three depths at once: sharp foreground, mid, soft background.
- The field lives every frame (particles flowing 1 to 3 px a frame) but the event lands on its word.
- Labels are leader lines to one particle, 32 px or more, never on a blurred one.

## Traps

- Thousands of equal dots: no depth, no reading. Fewer, bigger, sorted.
- Random per frame (flicker). Seeded once.
- Blur on text or on the caption band.

## Cost and QC

- Render is slower on a passage that uses depth (blur per sprite is expensive; allow roughly 1.5 to 3 times
  the render time per second of video on that passage).
- QC: depth of field must never blur a label. Keep one visual language per reel; a cinematic
  depth passage must not clash with the rest of the reel.
