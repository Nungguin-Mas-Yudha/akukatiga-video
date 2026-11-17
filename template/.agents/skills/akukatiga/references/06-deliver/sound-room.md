# The sound room: music, effects, mix

## Goal

Every cue of music and every effect is chosen for its moment, not picked at random: it carries the feeling the scene
needs, enters and leaves on the right word, never hides the voice, and is licensed. The viewer feels the story and
still hears every word.

## Reasoning

`sound.md` says what sound may do (three modes, the YouTube Audio Library, ducking, loudness). It does not say who
chooses, from what brief, or how a choice is checked. A library of thousands of tracks searched by feel gives
generic results. A film scores by spotting: decide where music lives and what it must do, then search for that, then
test it against the cut (creator, 2026-10-30).

One limit, stated plainly: the agent cannot listen the way a person does. It reads the library's metadata and
measures the files (tempo, energy over time, vocals, how much the music sits in the voice's frequencies, where it
rises and falls). That rules out what clearly will not work and builds a sound shortlist. Whether a track feels
right is the creator's ear, on a draft with the music in.

## Roles (one Opus subagent at medium effort plays the three roles in order, per chapter; the fetching of lists and files
 is Haiku's or a script's)

| Role | Owns | Writes |
|---|---|---|
| Music supervisor | the spotting session: where music lives, what each cue must do | `sound/spotting.md` |
| Sound designer | effects: one sound per seen event, on its word | the effects rows in `sound/spotting.md`, `<Sfx>` in scenes |
| Sound engineer | the mix: the voice always clear, ducking, loudness, true peak, no clashes | `sound/mix.md` and the measured checks |

## 1. Spotting (after the voice, before the visual plan is final)

Per chapter, the music supervisor reads `direction.md` (colour script, energy map), `plan.md` and the script, and
writes one row per cue:

| Field | Example |
|---|---|
| cue id, chapter | `C05-1`, 05 |
| in, on the word | "When they measured it" (05, 176.3 s) |
| out, on the word or a silence | after "two thirds higher." |
| job | lift the turning point, then settle |
| emotion | wonder turning to quiet triumph |
| tempo | 70-90 BPM or free |
| instruments | piano and strings, a soft pad; no drums |
| shape | starts thin, one swell placed on the needle landing, then holds |
| avoid | vocals, drops, big percussion, anything bright in 1-4 kHz under speech |
| library filters | Genre: Cinematic or Ambient; Mood: Inspirational or Calm; Duration over 2:00 |

Rules: every chapter keeps its voice-only stretch at the hardest explanation (`sound.md`); music covers at most
about half the film; a cue changes only at a chapter start or a turning point; the same musical colour returns with
its motif (a theme for Goodenough's persistence may come back in ch02, ch07 and ch08).

Effects rows: the seen event, its word, the sound wanted in plain words ("a soft paper slide", "a metal click",
"a short sizzle"), length, level.

## 2. Search (YouTube Audio Library, behind the creator's sign-in)

1. The creator signs in to YouTube Studio in the in-app browser themselves; the agent never handles the password.
2. Haiku reads the library list pages with the spotting filters and copies, per candidate: title, artist, genre,
   mood, duration, the licence line exactly as shown ("You're free to use this song..." or "Attribution required").
   No downloads at this step.
3. The music supervisor (Opus) reads the lists against each cue and picks 3-5 candidates per cue by metadata.
4. Each download is shown to the creator and made only with their approval, into `films/<film>/music/candidates/`
   (effects into `sfx/candidates/`).

## 3. Measure (the agent's ears)

`node scripts/audio-check.mjs <file> [--voice <chapter dialogue wav>] [--at <seconds>]` writes JSON and a line of
verdicts per candidate:

| Measure | Pass for a cue under speech |
|---|---|
| vocals | none detected (vocal-band harmonic energy below the threshold in the script) |
| voice band | music energy in 1-4 kHz at most -12 dB under the voice there, after ducking (with `--voice`) |
| tempo | inside the cue's range |
| dynamics | no hit or drop over 6 dB inside a speech passage; the swell lands within 1 s of the planned word (`--at`) |
| length | covers the cue, or loops cleanly at a bar line |
| loudness | integrated level noted, so the mix needs little gain |

The supervisor keeps 1-2 per cue, writes why in `sound/spotting.md`, and deletes the rejected candidate files.

## 4. Place and mix

- Music cues go into `film.json` (`delivery.md`), in and out on the spotting words, faded 3-4 s.
- Effects go into the scenes as `<Sfx src at={cue("word")} gain dur />`.
- The sound engineer delivers (`deliver.mjs`), then measures: -14 LUFS integrated, true peak at most -1 dBTP, the
  voice band clear under every cue, no effect louder than the voice around it, and the voice-only stretches truly
  without music. Results in `sound/mix.md`.

## 5. The ear check (the creator)

The creator listens to each chapter draft with its music, on headphones and on a phone speaker, and says what to
change in words. A cue the creator does not like is replaced from the shortlist or searched again; the reason goes
into `sound/spotting.md` so the next search knows it, and a taste that holds for later films goes into
`workspace/library/full-visual-landscape.preferences.md`.

## Sources (terms read on their own pages, 2026-10-30: `workspace/library/before-the-prize/sound-sources.md`)

| Source | Use | Rule |
|---|---|---|
| YouTube Audio Library | music and effects, first choice | allowed in monetized videos; a CC track's credit goes in the description; sign-in is the creator's |
| Pixabay Music | music, second choice | no attribution needed; never a track with the shield icon (registered with Content ID, may be claimed); keep the download's licence certificate in `music/` |
| Incompetech (Kevin MacLeod) | music | CC BY 4.0: the credit line in the description exactly as the site gives it |
| Free Music Archive, ccMixter | music, per track | licence shown on each song page: only CC0 or CC BY; never NC, ND or the old FMA-Limited |
| Freesound | effects | only CC0 or CC BY sounds (some are non-commercial: never those); download needs the creator's account |
| Musopen, Uppbeat, Chosic, BBC Sound Effects, Openverse, Mixkit | not yet | their terms could not be read (blocked, or no monetization text): not allowed until read on the page |

Every track also gets a Content ID risk note in `references.md`. A claim on an allowed track is disputed with the
licence page and the saved certificate; the source is avoided afterwards if claims repeat.

## Licences

Every track and effect has its `references.md` row with the library's licence line copied exactly; tracks marked
"Attribution required" get the library's credit text in `description.md`. Prefer tracks that need none. The library's
terms are read once on its own page and noted in `references.md`; a term that could not be read counts as not
allowed.
