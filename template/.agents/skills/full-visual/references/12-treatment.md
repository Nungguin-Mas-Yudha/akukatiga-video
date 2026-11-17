# Treatment

## Goal

Decide the film before the scenes: one concept, one thread, the objects that carry from scene to scene, what is planted
and paid off, one big move, and the hook. Written in `reels/<slug>/treatment.md`, approved by the creator before `plan.md`.

## Reasoning

The seller's reels read as one film because every scene happens in one world, and an object leaves one scene exactly
where the next picks it up (`workspace/projects/worked-reels/seller-study.md`, sections 1 and 4). Our first plans were
technique-first (a camera move and a transition per scene, `bom-hidrogen/plan.md`) and read as a list of scenes.

## What it holds

1. **The concept.** One sentence: the world every scene happens in.
   - A metaphor world when the mechanism has no readable artefact: "Every technique is drawn as a metaphor object (a
     locker, a window, a pass, a key ring, a parcel), never as code" (`hf-incident/plan.md:6`).
   - One interface when the viewer knows it: one Chrome window every scene "is something happening in or to"
     (`chrome-fingerprinting-us/plan.md:11-13`).
   - A pair and one example: teacher and student, one sentence carried through (`distillation-us/plan.md:11-16`).
2. **The thread object.** The story's protagonist, kept small: where it is born, how it changes, where it ends. It is
   in every scene and never the main picture twice. The agent bot of `hf-incident` (`scenes/AgentIcon.tsx`,
   `parts.tsx:30-39`), the row of four browser marks that is also a progress bar (`chrome-fingerprinting-us/plan.md:14-16`).
3. **The carried objects and their HANDOFF table** (below).
4. **Plant and payoff:** at least two pairs (below).
5. **The one big move.** One, on which word, and "nothing else is that loud". Often the hook; in the Chrome reel the
   fingerprint finale (`FingerprintFinale.tsx:1`).
6. **3 to 5 hook ideas** (below).
7. **The ground.** One dark range for the whole reel, by its tone (`taste.md`, Background). The seller flips dark and
   light by meaning; this creator does not, so a change of place is carried by the object and the angle.

## HANDOFF

Objects change role in place; they are never swapped for a new card. The Chrome window is full size, then a tile
parked top-left, then half size, then back; it "becomes Firefox in place" (`CtaWindow.tsx:1-3`).

In `treatment.md`, one row per carried object:

| Object | Leaves scene | At (x, y, size, state) | Picked up by | Then |
|---|---|---|---|---|
| student (Qwen mark) | `distill`, last frame | cx 540, cy 960, size 260, label under it | `weights`, first frame | dives into the mark |
| server (tower) | `locker`, last frame | the HANDOFF.server box | `out`, first frame | its small window widens |

In code, the same table is `export const HANDOFF` in `scenes/parts.tsx`, one entry per object with a comment naming
"end of X = start of Y" (`distillation-us/scenes/parts.tsx:72-84`, `hf-incident/scenes/parts.tsx:57-62`,
`chrome-fingerprinting-us/scenes/parts.tsx:111-122`). Every scene header says it in words: "First frame: the pair as
`report` left it (HANDOFF.pair) ... Ends at HANDOFF.student" (`distillation-us/scenes/Distill.tsx:2-8`). The outgoing
scene stops drawing the object on the frame the next one starts drawing it.

## Plant and payoff

A thing shown early, for its own reason, comes back later and changes meaning. It turns a list of scenes into one
story. The treatment names at least two pairs:

| Planted | Where, on which word | Paid off | Where, on which word | What changes |
|---|---|---|---|---|
| the island under the falling bomb | hook | the same island photo | the Ivy Mike scene | the island is gone (bom-hidrogen `reference-study.md`, 66-80 s) |
| one glass of water | hook | the glass, then 1,700 glasses | the payoff | the scale of the claim |

The plant must be seen clearly, not hidden in a corner, and must not announce itself as a setup. The payoff uses the
same object at the same look (the same photo, the same drawing), so the viewer recognises it.

## Hook ideas

Each idea is a different physical metaphor of the same claim, with the story's real marks as actors in a place, with
something at stake. The seller built
ten: for "How do Chinese AI companies copy Anthropic models?" a swarm stealing light, a copier, a counterfeit cast,
thinking ripped out of a glass core, a reflection that walks away (`distillation-us/scenes/HookX1.tsx`..`HookX5.tsx`,
headers); for hf-incident a mark unravelling, a starling swarm, sandboxes cracking, a siege, a ring
(`hf-incident/scenes/HookV1.tsx`..`HookV5.tsx`).

Per idea, three lines: the metaphor, the event on each key word, the payoff. Every idea:
- starts mid-action at frame 0 (agents emit from -8 frames, `HookV5Fleet.tsx:31`);
- has one physical move with weight (overshoot, a spin-up, a decaying quake, `HookV5.tsx:56`);
- puts depth around the hero (layers behind and in front, dust, shards at the lens);
- lands any counter exactly on its word (`HookV5.tsx:33-37`);
- is one shot from a mostly locked camera: the cinema is in the object's physics.

Up to 3 ideas get a rough still. Each is a variant reel `reels/<slug>-hook-vN/` with the reel's `caption.txt`,
`reel.json` and voice files, whose `scenes/index.tsx` maps only `hook` to that idea's component
(`hf-hook-v5/scenes/index.tsx`, `distill-hook-v1`..`v5`). `node render.mjs <slug>-hook-vN --stills <t>` on the key
word. The creator picks one; the others stay as files.

A hook idea's maths lives in its own World or Space file (`HookX1World.ts`, `HookX3Space.tsx`); see
`09-three-d-look-and-plates.md` for depth.

## Gate

- One concept sentence, one thread with its life cycle, a HANDOFF row for every object that crosses a handover, at
  least two plant-and-payoff pairs, one big move, 3-5 hook ideas.
- The creator picks a hook from the stills and approves the treatment in words. Then `plan.md`
  (`02-sentence-to-picture.md`).

## Traps

- A concept per scene instead of per reel: six worlds read as six slides.
- The thread as the main picture again. Each scene's main picture is a new object (`hf-incident/plan.md:11-12`).
- Hook ideas that are the same metaphor with a different camera. Different objects, different physics.
- A hook that is a UI story or a stack of cards (`taste.md`, The hook).
- A payoff with no plant: the vanished island means nothing if the island was never shown.
- A plant that never pays off: cut it, or pay it off.
