# Camera, angles and transitions

## Goal

The viewer travels through one world. The picture changes at least every 1.2 s without a hard cut. Every scene has
its own angle, the camera moves only for a cause on screen, and the story moves from scene to scene inside the scenes.

## Reasoning

The seller's reels have no camera component and no noise drift (`workspace/projects/worked-reels/seller-study.md`,
section 1). The camera is code inside each scene, and each move has a cause the viewer sees: "a slow push-in and turn
from f0, a kick on every copy that leaves, a buzz in overdrive" (`distillation-us/scenes/HookX2.tsx:23-30`); a jolt on
the slam (`HookX3.tsx:33-34`); a quake that only starts on "Face" (`hf-incident/scenes/HookV5.tsx:56-58`). "Never
still" comes from the objects: a breathing nebula (`HookV5.tsx:27`), blinking agents, flowing streams, a band of light
running down the plates (`CatchStack.tsx:1-5`).

`check.py render` still fails a beat interval over 1.2 s, a hold over 1.4 s and motion under 0.6 of frames. Living
objects carry those numbers, not drift. "One world" is not "one shot": every sentence still gets a new picture, a new
shot, a new state or a new number.

The caption band never moves. Text on the stage that must be read holds still relative to the frame for at least 0.6 s.

## Angles

Each scene names its framing in the plan's angle column. No two consecutive scenes share a framing.

| Framing | Seller code |
|---|---|
| three-quarter top (from above and to the right) | `hf-incident/scenes/ReportChamber.tsx:1` |
| tilted road floor (rotateX 62 under a lamp) | `hf-incident/scenes/InStreet.tsx:27,98` |
| cropped or cutaway building (doll's house, one-point) | `hf-incident/scenes/FileBuilding.tsx:1`; side face `WeekendGate.tsx` |
| board close-up, flat | `hf-incident/scenes/Go.tsx`, `GoBoard.tsx` |
| desk under a lamp, from above | `hf-incident/scenes/LogsBook.tsx` |
| tilted orbit | `hf-incident/scenes/HookV5Fleet.tsx:20` |
| reflective floor | `distillation-us/scenes/HookX5World.tsx` |
| steep plane (copier glass, tilted layer stack) | `distillation-us/scenes/HookX2.tsx`, `CatchStack.tsx` (tilt 60) |
| front and above (a forge bed) | `distillation-us/scenes/HookX3Space.tsx:1-2` |
| low banked rush over a floor | `hf-incident/scenes/HookV3.tsx` |
| from above and behind a crowd | `hf-incident/scenes/HookV4Ground.tsx` |
| wide field (a count of 1,200) | `hf-incident/scenes/ScaryField.tsx` |
| interface in a window, straight on | `chrome-fingerprinting-us/scenes/parts.tsx` (`ChromeWindow`) |
| cutaway window into a machine | `distillation-us/scenes/CatchCasing.tsx`, `CatchInside.tsx` |

## Shot grammar

The framing says where; the grammar says how shots follow each other. Each one is built in `14-shot-recipes.md`.

- **Establishing, closer, insert.** Show the place first, then the actor in it, then the one part that matters (the
  island from the air, the bomb over it, the hydrogen inside the bomb).
- **Hide, then reveal.** Keep the answer off frame, dark or covered, and show it on its word (a lamp stutters on over
  a street, `InStreet.tsx:1-3`; a pull-back reveals the count, `ScaryField.tsx:1-3`).
- **Scale contrast.** A small actor in a big place, or one big thing beside many small ones (a bomb over an island;
  one bar against 64).
- **Foreground at the lens.** One object close to the lens, soft and moving faster, gives depth to the frame
  (shards at the lens, `HookV5.tsx:8`; dust in a lamp cone).
- **Point of view.** The frame is what the actor sees, or the inside of the object (the island from the falling bomb;
  inside the casing).
- **A breath before the big move.** One quiet beat right before the reel's big move: the frame settles, the objects
  keep breathing, nothing new arrives. Under 1.2 s, so the pace checks still pass.
- **Alternate.** Wide follows close, quiet follows loud. Three panels in a row at the same size or energy fail the
  rhythm test (`10-storyboard-and-qc.md`).

## The camera

Write it in the scene as a function of the frame, the seller's way: a CSS 3D root (`perspective` with
`translateZ`/`rotateX`/`rotateZ` on a `preserve-3d` element, `HookX2.tsx:73-74`) or a scale and translate, driven
from cues. `<Camera>` in `src/engine/Camera.tsx` is a helper that composes the same moves; pass `drift={0}` unless the
scene names a cause for drift (a ship deck, a hand-held search). A photo plate always moves (CLAUDE.local.md): its
slow push or pan is its own cause.

| Move | Cause on screen | Parameters | Avoid |
|---|---|---|---|
| slow push | a thing the sentence stays with, growing in importance | scale +8-15 % over the sentence, `ease.inOut` | as a default on every scene |
| push-in on a key word | the word that names it | +5-12 % in 36 f, ease out, ending on the word (`endsOn`) | every sentence |
| pull-back reveal | the count or the bigger picture: one cell becomes a grid, one agent becomes 1,200 | scale down over 60-120 f, ease out, the number counting (`ReportSandbox.tsx:5`, `ScaryField.tsx:38-40`) | |
| dive into a mark | going inside the thing | scale 1 to 11, ease in, growing blur, until the frame is its inside (`distillation-us/scenes/Weights.tsx:29-50`) | more than one per chapter |
| travel along | the object is long (a stack, a street) | `camAt()` down the 28 plates (`Catch.tsx:25,86`) | |
| kick or jolt | an impact: a slam, a copy leaving | a few px, decaying (`HookX2.tsx:24-30`, `HookX3.tsx:33-34`) | longer than 0.2 s |
| quake | the payoff hit | starts on its word, decays (`HookV5.tsx:56-58`) | before the word |
| whip | a fast change of subject inside the scene | 12-18 f, motion blur along the move | more than one per 5 s |

Fast moves get motion blur only while they move; slow moves never do. Anticipation before a big move, a small
overshoot on arrival, follow-through on loose parts. In the hook the camera is mostly locked: the cinema is in the
object's physics (`taste.md`, The hook).

## Transitions happen inside scenes

The story moves through the world inside the outgoing scene, then the engine's plain lift hands over with the carried
object already in place (`HANDOFF`, `12-treatment.md`). Each one has a motivation in the script:

- **Dive into a logo:** the camera dives into the Qwen mark until the frame is its violet inside, and the next scene
  starts there (`Weights.tsx:29-50`).
- **A server growing into a wall:** the server opens into a deep wall of lockers (`hf-incident/scenes/Locker.tsx`).
- **A window widening:** the tower's small window stretches over the frame into a view of the internet
  (`OutView.tsx:1-3`).
- **A pull-back reveal:** one cell becomes a grid of cells (`ReportSandbox.tsx:5`); the swarm becomes 1,200 agents
  (`ScaryField.tsx:38-40`).
- **A change of role in place:** the Chrome window becomes Firefox (`CtaWindow.tsx:1-3`), shrinks to a tile, comes back.

More, with how each is built: `14-shot-recipes.md`.

## Engine transitions (`in:` in `caption.txt`): rare

```
== lattice | ground: dark | in: iris 640,960
```

None of the seller reels uses them. At most two per reel, each with its reason in `plan.md`, and only when one object
visibly carries the cut. The transition belongs to the incoming scene and runs around the middle of the silence. The
optional `x,y` is the stage point iris and zoom open from (default 540,985); align.py refuses any other value. Timing:
flash 3 frames before the cut and 5 after, iris 10 and 12, zoom 10 and 6, match 3 and 3, fade 5 and 5.

| `in:` | Means | Does |
|---|---|---|
| `lift` (default) | next item | the scene whips off the top under a vertical smear |
| `match` | two things are one | the incoming is already in place, same shape and position; 6 f cross-dissolve (an opacity ramp, not a true match cut) |
| `iris` | inside this | a circle opens from the point the outgoing scene names |
| `zoom` | one level deeper | the outgoing scales up and blurs into the incoming |
| `flash` | impact | white burst, 0.1 s, at most 3 flashes a second |
| `fade` | time passing | a short cross-fade, only where nothing else fits |

## Morphs inside a scene

A change of state stays on the object (rule 7), and a new object may grow out of the old one: particles gathering
into a capsule, a bar becoming a circle, a tower breaking into particles and restacking (`FleetTower.tsx:1-3`).
`@remotion/paths` (`interpolatePath`, `evolvePath`) for outlines, seeded particle positions interpolated between two
layouts for fields.

## Traps

- Drift with no cause, to make a frame look alive. Make the objects alive instead.
- Two scenes in a row with the same framing, or three at the same size.
- The big move with no breath before it: loud after loud reads as noise.
- A camera that only moves inside one composition: it is still one picture. Each sentence needs a new picture.
- A whip or dive without blur reads as a jump; a slow push with blur reads as a fault.
- The caption or any text moving with the camera.
- An engine transition used as decoration. The move belongs inside the scene, with a reason.
