# Direction: meaning, camera, rhythm, attention

## Goal

**The bar (creator, 2026-10-30):** every explanation should be the clearest, most accurate, most beautiful animation of its idea anyone has made: understood at first sight, efficient (nothing extra), exact to the science, and leaving the viewer in awe. A scene that is merely correct and clear is not finished.

The pictures serve the story. A viewer follows the voice, understands the mechanism, feels the turns, and never
looks at a picture instead of listening. Over 20 minutes it is never monotonous, and every picture means something.

## Reasoning

The reel director (comic, surprise, rhythm tests on stills) judges a minute. A 20-minute film fails in ways a minute
cannot: a visual idea repeated until it is wallpaper, a camera that moves for nothing, a beautiful shot that pulls
the eye off the key sentence, an explanation drawn too busy to follow, a setup never paid off. Long form needs a
director's plan before the scenes and a review room after them (creator, 2026-10-30).

## 1. The director's treatment (stage 4, before `plan.md`)

One page, `films/<film>/direction.md`:

| Part | What it fixes |
|---|---|
| Visual thesis | one sentence: what the pictures argue beside the words ("a battery is a fall of electrons, and one man found how to make the fall deeper") |
| Colour script | per chapter: the light and colour temperature (for example cold and dim while the batteries fail, warming toward four volts, gold at the payoff, soft at the end) |
| Visual vocabulary | what each colour and shape always means, locked for the film: ions cyan, electrons gold, danger red, safe green, heat amber, the cell's three parts. Taught once, never broken |
| Motifs and payoffs | each visual setup and where it returns (the phone, the leaves, the tanks, "too old"). Every setup is paid off |
| Camera by act | how the camera behaves in each kind of passage: story (moves, travels, reveals), explanation (still or slow, one focus), turning point (the one big move), reflection (slow, wide) |
| Energy map | per chapter, the loud and quiet passages and where the breath before the big move goes |

## 2. The camera speaks

A move has a cause on screen and a meaning (`akukatiga-reels/references/08-camera-and-transitions.md`):

| Move | Means | Use |
|---|---|---|
| slow push | this matters more and more | a sentence the voice stays with |
| push-in on a word | this is the thing | the key word of a beat, at most once a sentence |
| pull-back | context, consequence, scale | after a detail, when the sentence widens |
| static | read this | every explanation step a viewer must follow |
| orbit | see it whole | a 3D object first shown, a reveal |
| track along | it is long, or time passes | a row, a timeline, a journey |
| dive into | going inside | once a chapter at most |
| low angle | weight, power | an institution, a machine, a verdict |
| high angle | small, alone | a person against the odds |

**Wow without dizziness (creator, 2026-10-30).** The camera makes the big moments physical: it rides beside the
falling electron, cranes down after a draining surface, dives through scales, orbits a crystal as it changes. And it
never makes anyone sick:
- one move at a time (orbit, or push, or crane), eased in and out; the horizon never rolls;
- slow moves at most about 15 degrees a second of turn; a fast move (a dive, a whip) lasts under 2 s, carries motion
  blur, and lands on a still frame;
- a follow shot keeps the subject in the same place on screen while the world moves past it;
- during an explanation step or a label's read time the camera holds or drifts very slowly (a 2-4 degree breathing
  orbit keeps the 3D alive through parallax);
- the big move of a chapter has a breath before it and a hold after it.

Lens: wide for a place and its scale, long for a detail pulled out of its context. Light has a source the viewer
could name (a lamp, a window, a flame, a screen); a light event lands on its word (`taste.md`).

## 3. Attention: the story first

- **One focus per beat.** The eye has one place to go; everything else is darker, smaller or still.
- **Eye trace.** Across a cut or a scene change, the next focus appears near where the last one was, so the eye does
  not hunt.
- **Complexity budget.** The harder the sentence, the simpler the frame: an explanation step gets a still or slow
  camera, one moving thing, at most one label. Spectacle goes where the words are easy (story, transitions, payoffs).
- **Read time.** Any text holds at least 0.6 s plus 0.3 s per word; never more than one label arriving at a time.
- **No upstaging.** On the film's key sentences (the turning points, the mechanism's one line), the picture does
  exactly what the words say and nothing else.
- **Quiet frames.** After a dense passage, a few seconds of a simple, beautiful frame so the idea can land.

## 4. Rhythm over minutes

- Alternate: wide after close, quiet after loud, story after mechanism, 3D after flat.
- A chapter has a shape: an opening image, rising beats, one big move, a short release.
- Variety is judged over 2-minute windows, not three stills: no treatment holds more than 40 % of any window
  (`03-look-and-frame.md`, Variety).
- Transitions carry meaning: a match cut joins two things the story joins; a dive goes inside; a pull-back widens;
  a cut is used when the subject changes and nothing carries.

## 4a. Reality first, and a bold director (creator, 2026-10-30)

The reels' best work (`engine/full-visual/reels/` and the creator's references in `Video Motion/Motion/Referensi/`:
the MacBook trackpad, the iPhone keyboard, the hydrogen bomb) never explains with a textbook chart. It explains
inside the real thing:
- **The real object, cloned from references.** The trackpad film is the actual MacBook on a wooden desk, its
  trackpad cut open to the real coil, magnets, sensor and hinge, so close to the real thing it reads as a product
  render. Every physical object in a mechanism is built from fetched references (photos, teardowns, micrographs,
  crystal structures, patents) laid side by side with the build and measured (`akukatiga-reels/references/object-references.md`):
  proportions, layer thicknesses, materials, colours, the small parts. "Close enough" is a fail.
- **A hidden layer revealed over the real thing.** The keyboard film shows the real iOS keyboard, then lights the
  invisible hit regions on it. The idea is drawn onto or into the object, not beside it on a board.
- **Scale as a journey.** The bomb film dives bomb, uranium, nucleus. A mechanism usually lives at a scale no one has
  seen: go there, continuously, from the object the viewer knows (phone, cell, foil, coating, particle, crystal,
  atom), with real-looking matter (lit spheres, depth of field, thousands of particles).
- **A concrete case.** One real example the viewer can hold ("api" against "apu"; this phone, this cell, titanium
  against cobalt) instead of a general statement.
- **Abstractions only as overlays.** A graph, a bracket, a number sits small on the real picture (the trackpad's
  force curve in a corner), never as the main picture for long.

**A reference board for every scene, before it is built (gate, creator 2026-10-30).** No scene is drawn from memory.
Boards are gathered after the creator approves the one-page plan, scene by scene as the builder reaches it, never
for the whole film up front. `board.md` stays under a page.
Each scene's row in `plan.md` names its concept in one line and its references, gathered first into
`films/<film>/refs/<scene-id>/` with `refs/<scene-id>/board.md`:

| Kind | From | Use |
|---|---|---|
| photos | Wikimedia Commons, NASA, NARA, museum open access; teardown sites | the real shape, material, colour, small parts |
| journal figures | open papers via `scripts/journal.mjs` (micrographs, cross-sections, structures, schematics) | true proportions, scales, what happens inside |
| video frames | frames taken from a real video of the thing (`ffmpeg`) | how it moves, how light falls on it, the order of a process; reference only unless licensed |
| patents, manuals, datasheets | Google Patents, maker pages | exact dimensions, internal layout |
| interfaces | screenshots of the real UI | cloned at real geometry |

`board.md` lists each reference (what, where, licence, what is taken from it: proportion, colour, motion, layout),
the measured numbers, and after the build a still of the build beside the references with what still differs. Haiku
fetches; Opus chooses and measures. A reference that may not be shown (non-commercial, unclear) is still allowed as
a drawing reference, never on screen. The review room's cinematographer and director check the build against the
board.

The bold director: for the 1-2 hardest mechanisms of the film the treatment writes three concepts, one of them an
"impossible camera" (inside, at atomic scale, through a wall, from the electron's point of view), each a few lines,
and keeps the boldest one that stays exact and can be done in 2.5D. Every other scene gets one concept line in
`plan.md`. A concept a textbook would draw is the safe fallback, not the choice.

## 4a-2. Science communication: easy to take in, beautiful, and true (creator, 2026-10-30)

The builder works as a visual communication designer and a scientist at once: it translates the science into
pictures a newcomer takes in at a glance and enjoys, without one false thing in them.

**The metaphor map (in `direction.md`, one row per mechanism, before any scene is built).** For each picture that
stands for science (tanks for energy, a landscape for energy levels, a lake for the anion's band, a bead for an
electron): what in the picture maps to what in the science, where the picture breaks (what it would wrongly suggest),
and how the film keeps the break from misleading (a word in the script, a label, the next shot showing the real
thing). A metaphor with no row is not used.

**Design rules (visual communication).**
- Concrete before abstract: show the real thing, then the idea drawn on it, then the name.
- One idea per frame; the rest recedes (darker, smaller, slower: pre-attentive contrast in size, colour, motion).
- Progressive disclosure: add one element per sentence; never the whole diagram at once.
- Colour is code: the locked vocabulary means the same thing every time it appears.
- Gestalt: what belongs together is grouped, aligned or the same colour; the eye reads the structure before the
  words.
- Scale is honest: say when it is not to scale; keep orders right (smaller is smaller, deeper is lower, more is more).
- Numbers only when they carry the point, and then exact, with their source.

**Scientific truth of the picture.** Shapes, proportions, orders of magnitude, colours of real materials, the order
of energy levels, what moves and what stays: all from the reference board and the sources. Simplify, never invert.

## 4b. Micro motion: every frame alive, nothing stealing the eye

A still diagram reads as a slide; the reels keep frames alive through their objects (`taste.md`, The motion). Every
object has a resting life that follows its physics, small and slow, under the story's events (creator, 2026-10-30).

| Thing | Its life |
|---|---|
| water | a surface ripple and slow sway; a glint travelling along it; flow along a pipe |
| electrons in a band, ions in a crystal | thermal jitter around their places (they really do vibrate); a slow drift in a liquid |
| a lone electron, a spark | its glow breathing; a faint bob |
| a lit metal edge, a glass rim | a highlight sliding slowly along it |
| a lamp, a window | dust drifting in its beam; a slight flicker for a flame |
| fire, smoke, steam | always moving (shader time) |
| paper, cloth, leaves | a slow lift or sway as if in room air |

Budget, so it never pulls focus:
- amplitude at most about 3 % of the object's size (a few pixels on a particle), frequency 0.3-2 Hz, eased, never a
  jerk; seeded per element so no two move in step;
- lower in contrast and speed than the beat's event: the event is the loudest motion on screen, always;
- on a key sentence or a label's read time, micro motion near the focus drops by half; nothing outside the focus moves
  faster than the focus;
- physically honest: jitter for particles, flow for liquids; no decorative motion on a thing that would be still.

The focus guard checks it in the review room: life everywhere, attention still on the sentence.

## 5. The visual review room

Run on the hardest passage and every chapter draft, in this order (2026-10-31, the six-agent room burned the budget
without finding what the creator found):

1. **Machine scan, no tokens.** Frame pops and blinks (a frame unlike both neighbours), black or empty frames,
   freezes, loudness, and a contact sheet (small frames tiled, one image per 30-60 s). A pop is a FAIL by itself.
2. **The creator watches** the draft with sound and writes notes.
3. **One reviewer**, an Opus subagent at medium effort that did not build the scenes, holds all six checklists below.
   It reads a short brief card (the rules it needs and the film's decisions), `plan.md`, the creator's notes, the
   scan and the contact sheets; full frames only at flagged or suspect seconds. It writes `qc/visual-<chapter>.md`:
   FAIL lines only (`second | problem | fix`), one page at most, no PASS lines, no essay. Round 2 covers only the
   scenes that changed and overwrites the same file.

| Checklist | Asks |
|---|---|
| Director | Does each picture say what the sentence says? Is the metaphor exact for the concept, or only pretty? Does the visual thesis hold? |
| Cinematographer | Does every move have a cause and the meaning in section 2? Is the light motivated? Is the hero lit (base, rim, contact shadow)? |
| Editor | Rhythm, eye trace across cuts, carried objects, transitions with a reason, the energy map kept, no treatment over 40 % of a 2-minute window? |
| Newcomer | Reading the stills in order with the words, can they say what happened and explain the mechanism? What confused them? Does anything read as missing (an empty frame, a name with no face)? |
| Scientist | Is every picture true to the science (shapes, proportions, scales, energy order, what moves)? Does each metaphor follow its row in the metaphor map, and is its break kept from misleading? Anything simplified into something false? |
| Focus guard | Where would the eye go instead of listening? Any label read in under its time, any spectacle on a hard sentence, any frame with two focuses? Is every frame alive (micro motion, section 4b) without any of it louder than the event? |

Gate: a chapter leaves the room when every FAIL is fixed or answered in writing. At most two rounds; remaining
faults are written plainly in the delivery note. The reel director tests (comic, surprise, rhythm) and the variety
test still run (`03-look-and-frame.md`, The director). At most 3-4 subagents run at once across all chapters.

## 6. Dailies

Each chapter is rendered as a draft with sound and watched once start to finish before the review room, at full
speed, never as a contact sheet alone: holds, rhythm and attention only show in motion.

## Measured bar

From a shot-by-shot study of five Veritasium long-form films, 2,066 shots
(`workspace/library/before-the-prize/visual-study/study.md`):

| | Bar |
|---|---|
| Median shot (or picture beat) | about 3 s (theirs 3.1 s; ours one beat per sentence, about 4 s) |
| Spread | wide on purpose: a quarter under 1.7 s, a fifth over 8 s |
| Cold open | a trailer: 10-30 beats in 60-80 s previewing the film's key images, most 1-3 s |
| Bursts | 0.2-1.5 s beats for "everywhere", scale, time passing and the closing impact montage, then a long hold to land |
| Mechanism | one continuous animated model per hard idea, 30 s to several minutes, camera travelling inside, labels arriving as parts are named; never cut into pieces |
| People | archive portrait, sepia, the name set in a serif inside the frame; a quote on the portrait or a dark page |
| Documents | the real page (or its faithful recreation), the key line highlighted in yellow |
| Scoreboard | the story's open problems as a numbered list, shown again each time one falls |
| Home base | the thread object on its table, returned to every few minutes |
| Numbers | set on the real world (a city, a road, a field), not on a blank chart |
| Past and present | past in one warm sepia (photos and drawn moments alike), present clean and colourful |
