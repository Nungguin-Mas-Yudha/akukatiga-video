# The bar

The house bar, in the words of the creator who built this format. A creator who saved their own look, voice or words
(`workspace/library/full-visual.preferences.md`) keeps this bar for the picture and the motion, and their own for
the rest.

What the creator called "craaaazy good. Insane actually": distillation v2. A real Distillation app window (collect, filter,
train) with a loss curve drawing down, a cutaway of the model's layers with real measured numbers, the next-token race,
a Hugging Face page with a capacity gauge. Every scene a new real thing, every idea drawn as its mechanism working.
Look at `engine/full-visual/reels/distillation-us/` and `engine/full-visual/reels/hf-incident-h5/` before building.

## The picture

- **A new real thing for every sentence group.** An interface, a document, a machine opened up. A thread object (two
  marks, one example sentence) can stay small across the reel; it is never the main picture twice. The creator's words: "we're
  reusing AGAIN the claude to qwen...?"
- **Explain by showing the mechanism move.** An abstract idea (hidden states, probabilities, a proof, a router) is drawn
  doing its job, step by step on the words, with real numbers. Measure an open model when the numbers can be measured.
  Never blur, frost or a vague panel: "it's blurry, we see no animation, nothing moving".
- **Real material only.** Real logos, fetched, bare (no white circle, no tile). Interfaces at their real geometry and
  copy (a Google bar that is Google's, Gemini's real input box). Documents scrolled Apple-smooth to the line that
  matters. Real-colour maps. Agents are drawn as agents (the Claude or ChatGPT mark, a real agent shape), never a blue
  dot. Nothing that looks vibe-coded. Machines, parts, devices and anatomy are shown from fetched references, never from memory: the real shape,
  simplified, never invented (`../04-assets/object-references.md`), drawn in code (in three.js when it turns) or as a fetched, licensed plate or cut-out (never an AI image:
  labelled "Ilustrasi" or "Foto", one style per reel: `../04-assets/image-assets.md`).
  Depth is hybrid by layer on one camera: the place in 2.5D, real 3D only for an object that turns or needs real
  metal or glass, fire and steam as Skia shaders, droplets and labels in SVG in front; a scene with no turning object
  stays 2.5D (creator decision 2026-10-29, after the A/B test in `../04-assets/three-d-look-and-plates.md`). A historical
  moment or place may be a real archive photo (public domain or CC, sourced, graded to the reel, always moving, with
  the change of state drawn on top: `../04-assets/three-d-look-and-plates.md`). Interfaces, diagrams and numbers are always drawn
  in code. (Creator decision 2026-10-29, replacing "no photos, plates or image textures".)
- **One focus at a time.** Not three or four cards. No terminal at the bottom, no dashed lines. The creator's audience is not
  technical: clear beats complete.
- **Show the why.** When the script gives a cause, the cause is on screen ("SO WE UNDERSTAND WHY they hacked Hugging
  Face").
- **Big and centred first, then it moves aside** as the rest arrives. What stays put stays put: no object drifting up
  at a handover, and the outgoing scene stops drawing an object the next scene shares.

## Light and material

- Every hero surface has three things: a base gradient, one rim or edge light on the side away from the key,
  and a soft contact shadow on the ground. Metal adds one sheen band; painted steel adds faint noise.
- One light per event drives every layer: the fire that lights a three.js wok also lights the 2.5D wall behind it,
  from the same intensity. Fire light is cream on neutral walls, so the frame stays under the saturation limit.
- Light is an event, not a state: a glow, flare or ray burst rises in 3 to 5 frames and decays over 15 to 30
  (burst envelope), on the word that releases energy. One per sentence at most.
- Glow = radial gradient + screen blend. Rays = 8 to 16 lines from the centre, fading out. Flare = 4-point star.
- A quiet whole-frame finish: vignette 20 to 30 percent at the edges, fine grain about 1.5 percent, blacks lifted
  to about 10/255. Never on the caption.
- A small honesty label ("Ilustrasi", "Tidak sesuai skala" / "Illustrative", "Not to scale") whenever the picture
  exaggerates size or is not a real photo, 24 to 28 px, grey, inside the stage.

Code for this section starts per reel in `scenes/parts.tsx`; it is promoted to `src/engine` only
after two reels use it. No lock is changed by this section. QC: at most 3 flashes per second, and
if everything shines, nothing feels important, so keep light scarce.

## Background

The background is always a dark range that follows the reel's tone, never white or light, and there is no switch
from dark to light between scenes (creator preference, `workspace/library/full-visual.preferences.md`). The seller
flips grounds by meaning; we do not: a change of place is carried by the object and the angle. What matters is that
it stays dark, not that it is always the same code.

- The frame edges and corners stay dark: each colour channel at most about 32 when measured on a still corner.
  Nearblackblue #06090C remains a valid anchor and default dark, but it is no longer a mandatory flat fill
  everywhere. This supersedes the earlier fixed #06090C everywhere lock for K3 (user decision 2026-10-28).
- The interior may carry a code-drawn topic ground (gradient, grid, noise, drawn texture), graded dark to the reel
  palette, with the vignette from Light and material. It must read as the same world as the drawn objects.
- Not too dark: object edges, labels, and the ground itself must stay readable on a phone screen. If detail
  disappears into black, the background is too dark, even if the corners measure dark.
- Not too light: white caption text and the gold accent must stay clearly readable against every part of the
  background that sits behind them. If caption contrast drops, darken the background behind the caption, not the
  caption itself.
- Dark is not empty. The place (a table, a floor, an island, a street) is drawn inside the dark ground and lit where
  the actor stands. An object floating in a bare void is an illustration, not a scene (`sentence-to-picture.md`).
- One visual language per reel: one background treatment for the whole reel, varied only by the topic ground and
  the light events in it, never a new background per scene.

## The motion

- Something is always moving, through the objects (breathing, blinking, flowing), not through constant camera drift.
  The first 10 seconds carry the most motion. Handovers are part of the craft, never a dead fade: an object carried
  into the next scene (`../03-treatment/treatment.md`).
- Every change belongs to a word: an event lands on it, a build ends on it. Followable, then a short hold.

## The hook (the first 3-4 seconds)

The most important part of the reel. One big physical, cinematic move with weight, depth and inertia, done to the
story's real material, ultra contextualised: it could only belong to this story. The big move hits the key word, the
payoff holds. References: `engine/full-visual/reels/hf-hook-v5` (the one that went viral) and
`distill-hook-v1`..`v5` ("WAAAO all are insane"). Losers: a UI story, a stack of cards, anything that looks coded
("not realistic, very weird, looks vibe coded"). The treatment writes 3 to 5 hook ideas, each a different physical
metaphor of the same claim; you pick the strongest one in text and build only that (`../03-treatment/treatment.md`).

## The words

The creator's transcript is the script and is taken as true: never rewrite it, never fact-check it. The voice is distillation's: Snap (`gWaDC0oXAheKoZfljzuI`), eleven_v3, stability 0.5, one untouched take, snappy,
with emotion that follows the sentence (`engine/full-visual/reels/distillation-us/script.v3.txt`: curious on the questions,
quickly on the news, emphasized on the key line, impressed on the payoff, serious on the catch), then pauses cut to
0.2 s with `tighten.py`, the hook never cut. Money and big numbers are written in words in the script ("1 million
dollars", not "$1 million"); the v3 voice reads them better. The CTA is like, share and follow only: never
`comment "KEYWORD"`, never a promised poster or PDF the creator has not made. A creator's saved voice replaces Snap (`../02-voice/workspace.md`, The voice).
