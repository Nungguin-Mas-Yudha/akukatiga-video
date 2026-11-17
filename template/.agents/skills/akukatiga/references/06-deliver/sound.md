# Sound

## Goal

The viewer's attention stays on the explanation. Sound helps them follow it and feel the story; it never competes
with the voice.

## Reasoning

The model is the Veritasium way of scoring an explainer (creator decision, 2026-10-30): long stretches of voice alone,
light music under the story beats, and an occasional simple effect on something seen. Music under a dense explanation
splits attention; a whoosh on every cut reads as a template. Silence around the voice is what makes the hard part
land.

## Three modes, chosen per scene in plan.md

| Mode | When | How |
|---|---|---|
| **Voice only** | the mechanism, the hardest explanation, a number being built, any stretch the viewer must think through | no music cue covers it; effects only if an event on screen needs one |
| **Light music** | the story: a life, a setback, a journey, a turning point, chapter openings, the close | a `film.json` music cue, -20 to -24 dB, faded in and out over 3-4 s, ducked under the voice automatically |
| **Simple effect** | a visible event that a sound makes clearer or more real: a door, a switch, a stamp, a page, a spark, a count landing | `<Sfx src at={cue("word")} />` in the scene, -12 to -18 dB, short |

Every chapter has at least one voice-only stretch of a minute or more, at its hardest explanation. Music covers at
most about half of the film. The cold open and the close may carry music throughout.

## Where the sound comes from (creator decisions, 2026-10-30)

Who chooses each cue and effect, from what brief, and how it is measured: `sound-room.md`. Sources beyond the
YouTube Audio Library (open and free-to-use libraries whose terms allow monetized YouTube) are listed with their
terms, read on their own pages, in `workspace/library/before-the-prize/sound-sources.md`.

Music and effects come from the **YouTube Audio Library** (YouTube Studio > Audio Library), on the creator's own
channel account:
- The library sits behind the creator's sign-in. The agent never signs in. Per film it writes a cue sheet in
  `plan.md` (for each cue: mood, genre, instrument, length, the library's filters to use, two or three candidate
  track names once seen) and the creator downloads, or the creator signs in to the in-app browser and approves each
  download the agent makes.
- Files go to `films/<film>/music/` and `films/<film>/sfx/` under the library's own track names.
- Each track's row in `references.md` copies its licence line exactly as the library shows it. Tracks marked
  "Attribution required" get the library's credit text in `description.md`; prefer tracks that need none.
- The library's terms are read on its own page before the first film and noted in `references.md` (use in monetised
  videos, use outside YouTube for the shorts). A term that could not be read counts as not allowed.

## Music

- Licensed only (the YouTube Audio Library above), its row in `references.md`, its credit in the description when
  the licence asks.
- Calm, sparse, mostly instrumental: piano, strings, soft synth pads. No vocals under narration, no drops, no big
  percussion under speech.
- One musical colour per chapter at most; a change of cue lands on a chapter start or a turning point, never
  mid-sentence.
- Placed as cues in `film.json` (`delivery.md`); the gap between cues is voice-only by design.

## Effects

- Only for something the viewer sees happen at that moment, on its word (`cue`), as a visual event is.
- Simple and natural: one sound, not a stack. No risers, no "impact" hits, no whoosh on every transition. A big
  move (a dive, a reveal) may carry one soft air sound; a cut carries none.
- About one or two a minute on average, often none for minutes.
- From the YouTube Audio Library's sound effects, saved in `films/<film>/sfx/`, with a `references.md` row.
- `<Sfx dur>` trims a long file to the event with a short fade.

## How it is mixed

- A final render writes two stems per chapter: dialogue (voice, footage lines) and effects (`<Sfx>` only).
- `deliver.mjs` lays the effects as placed, ducks the music by the dialogue alone (an effect never pumps the music),
  then brings the whole mix to -14 LUFS, true peak -1.5 before AAC.
- A draft (`--draft`) carries voice, footage lines and effects in one track, without music; to judge music, deliver.

## The listen check (before the creator hears a chapter)

1. Play the hardest explanation: no music under it.
2. Every effect matches something on screen at that frame; mute it and ask whether the moment is weaker. If not, cut it.
3. Music never hides a word: read the subtitles while listening at phone speaker level.
4. The music changes only at chapter starts or turning points.
