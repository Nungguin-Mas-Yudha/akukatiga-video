# Motion and sync

## Goal

Every change on screen belongs to a word, arrives by one of a dozen verbs, and is over in a fraction of a second. The
frame never sits still and never goes bare, and nothing moves without a reason the sentence gives it.

## Reasoning

The ear registers a word at its onset; the eye registers a build at its completion. So a single event lands on its
word, and a build is started early enough to finish on it. That one distinction is most of what reads as "perfectly
synced". The rest is speed: objects cross 300 px in a fifth of a second, which only reads because blur follows the
velocity, and the caption ticks four times a second under all of it, so a stage that holds for a second still feels
alive. The objects keep living on top of that (breathing, blinking, flowing), and the camera moves only for a cause
on screen (`camera-and-transitions.md`); text that must be read holds still relative to the frame, and the caption
band never moves. There are no hard cuts because continuity is the argument: the thing on screen at second 40 is the
thing that arrived at second 6, handed from scene to scene (`../03-treatment/treatment.md`, HANDOFF).

## Sync

- **A single event lands on its word**, within a frame or two: `at={cue("DDoS")}`. When the word is the event (a colour
  flip, a lock opening, "swap"), one frame.
- **A build ends on its word**: `at={endsOn("300", 17)}` starts a 17-frame build so its last piece lands as "300" is
  said. Grids, lists, typed lines, counters.
- **A counter finishes before the sentence does**, so the last words are spoken over a still number.
- **Colour flips follow the data**, not the voice: the gauge turns red on the frame it crosses the threshold.
- **The key-word box follows its word** by about 5 frames: the number, then the frame around it.
- The caption word starts about 40 ms before the voice so it is sharp on the syllable (the engine does this).
- A list the sentence does not spell out (six apps for "almost any kind of app") runs on a steady beat instead of words.
- Density: 3 to 6 changes a second counting caption words, and a visual beat on the stage at least every 1.2 s.
  The only rest is the hold on a payoff number, under 1.4 s, with its objects still alive. `check.py render` fails a beat interval over 1.2 s, a hold over 1.4 s and motion under 0.6 of frames.

## The kit (`src/engine/moves.ts`, `Motion.tsx`), durations in 60 fps frames

| Verb | Default | For |
|---|---|---|
| `blurIn` | 7 f, blur 12 px to 0, in place | anything that does not travel; the default arrival |
| `pop` | 8 f, scale up with a small overshoot | badges, chips, pills, avatars, marks |
| `<Travel>` | in 12 f ease-out over 260 px, out 9 f ease-in, blur along the axis of travel | cards, panels, anything crossing the frame; the invoice dropping from the top |
| `blurOut` | 7 f | a thing leaving in place |
| `typeOn` | 36 ms a character, with a caret | names, prompts, commands, form fields, documents |
| `countTo` (+ `jitter`) | hard ease-out; exact on its last frame; jitter keeps a live number twitching | every number |
| `stagger` | 4, 6, 8 or 12 f between siblings, one rhythm per group; grids on a diagonal | rows, tiles, pills |
| `mix` | 3 to 5 f | recolour in place: the state change |
| `draw` | 14 f along a path | arcs, routes, outlines, strikes |
| `<Cursor>` | eased segments on a slight arc, rests before a click; the click is a one-frame state change on the target | every performed action |
| handover (engine) | `rise`: the scene blurs, lifts 140 px and fades in 9 f while the ground cross-fades linearly over 6 f; `scroll`: old card out through the top, new one up from below, 13 f; the carried object waits at its HANDOFF; `in: match / iris / zoom / flash / fade` at most twice a reel (`camera-and-transitions.md`) | between scenes, in the silence |
| `<Camera>` (engine) | push, pull-back, dive, whip from cues, each with a cause; `drift={0}` unless a cause is named; motion blur only on fast moves | a scene whose camera is not written by hand |
| `spring()` (remotion) | a weighted landing with a small overshoot, computed from the frame | objects that fall into place, a stamp, a lid |
| `noise2D/3D` (`@remotion/noise`) | seeded, smooth | breathing, heat shimmer, organic wobble, never per-frame random |
| `evolvePath`, `interpolatePath` (`@remotion/paths`) | along an SVG path | lines drawing on, outlines morphing |
| `@remotion/effects` | on canvas components (`Img`, shapes, `HtmlInCanvas`) | grading a plate, glow, light leak, lens/zoom blur, shatter, chromatic aberration |
| `<Trail>`, `<CameraMotionBlur>` (`@remotion/motion-blur`) | only during a fast move; a lite layer with no WebGL effects inside the blur | whips, dives, a fast-falling object |
| Skia shader (`@remotion/skia`) | time as a uniform from the frame | fire, smoke, steam, heat haze, caustics, liquid shimmer |
| `Circle`, `Underline`, `Highlight` (`@remotion/rough-notation`) | `progress` over 14 f, fixed `seed` | hand-drawn emphasis on a label in the stage |
| `Easing.bezier`, `Easing.inOut` (remotion) | in `interpolate` | camera and object character beyond `spring()` |

How, imports and traps for these rows and for paths, light leaks and Lottie: `quality-boosts.md`.

The next scene is mounted 6 frames before `scene.from`: start its first entrance at `scene.from - 6` and the two
scenes overlap. One big move per reel (a stamp slamming, a fleet squeezing into a ring), on the biggest number, the
turn or the hook, named in the treatment (`../03-treatment/treatment.md`). The camera is written in the scene or uses the
`<Camera>` row above (`camera-and-transitions.md`); the caption band never moves with it. Parallax inside a depth field or between layers of a plate, never on interfaces or text under 48 px.

### What good looks like

- Reading a 60 fps burst around any event (sixty stills a second over the window, `node render.mjs <slug> --stills` at 1/60 s steps, read side by side): the event
  starts or ends on the frame the caption word appears, blur is visible only while the thing is moving, nothing pops
  from nothing.
- A number rolls, lands on the frame its word arrives, and the box draws around the word two beats later.
- In a handover burst there is no frame of bare ground. `check.py render` counts them.
- The stage and the caption may move on the same frame; the bands keep them apart. Only the biggest beats gain from two
  to four frames between word and object.

### Traps

- Timing anything in typed seconds. A cue is a word; if the word changes, the picture follows.
- Starting a build on its word: it finishes after the sentence has moved on.
- A transition picked per scene. The story moves inside the scene (a dive, a window widening); the handover is the
  lift with HANDOFF.
- An instant state change on the beat that matters (a toggle flipping in 2 frames is invisible). Give it 6 to 8.
- A counter left easing towards its target: it must read the exact figure on the word.
- A move too fast to read (eight cards in 0.6 s, a calendar rewinding in 0.9 s) or a hold with nothing under it
  (1.5 s a quarter of the way in is where people leave).
- Payoff numbers or the pill's digits under Instagram's interface. Check with `--guides`.
- Checking motion on a contact sheet. Stills are read at full size, motion in 60 fps bursts.
