# Pace and structure

## Goal

A film that breathes like a documentary and still never shows a dead frame. The viewer has time to look, and
something is always happening in what they are looking at.

## Reasoning

A reel fights a thumb: a new picture every 1.2 s. A long film fights fatigue instead: constant cutting tires the eye
and cheapens the story, and a static frame on a 20-minute film reads as a slideshow. The answer is longer shots with
motion inside them, a change of mode every minute or so, and a question left open every few minutes.

The pace is set by the voice, not by the reels. Measured on the Goodenough takes (George, eleven_v4, 2026-10-30):
165 words a minute, a sentence lasts 3.9 s at the median (p10 1.5 s, p90 7.8 s), the pause between sentences 0.64 s,
and a scene (one caption block) runs 16 s at the median (p90 28 s). So a picture beat per sentence lands about
every 4 s: calmer than a reel, never a slideshow. Re-measure for a new voice and scale the numbers below.

## The numbers

| | Value |
|---|---|
| Picture beat | one per sentence (about every 4 s): a new shot, a new state of the object, or a number landing. A sentence over 6 s gets two |
| Inside a sentence | the motion is continuous; the event lands on the word that names it |
| Shots per scene | 3-5: the scene's place and object carry, the shot changes (closer, wider, inside, another angle) |
| By mode | story and the cold open faster (a beat every 2-3 s); a mechanism may run up to 10 s in one framing if a step lands on every clause; a reflection slower (5-6 s) |
| Handover | in the pause between sentences (0.64 s), which the shared timeline already uses |
| Longest hold | 8 s of one framing, only while something moves in it; 10 s for a mechanism stepping on the words |
| Frozen | never 6 s or more with nothing moving: `check.mjs` fails it |
| Treatment | changes at every scene; a bigger mode change every 60-90 s (03-look-and-frame.md, Variety) |
| Retention question | every 2-3 min |
| Chapter | 2-4 min; opens on its first picture with the number and title set in it (3-4 s) |
| Cold open | 30-90 s before the logo sting; may be letterboxed |
| Logo sting | once, after the cold open, 2.4 s (`LogoSting`) |
| Big move | at least one per chapter (a dive, a pull-back reveal, a 3D turn, a transformation) |
| End | the last 20 s leave the end-screen zone free (`--end-screen` guide) |

## The camera

- It moves for a cause the viewer can see (`full-visual/references/07-camera-and-transitions.md`), and the reels' moves at film
  size: a push of 5-15 % across a shot, a push-in on a key word, a dive or reveal once a chapter, moves eased over
  1-3 s (not the reels' 0.5 s snaps),  a pan that crosses the frame in 7 s or more (faster judders at 24 fps).
- Photos always move (`Plate` pushes across its scene by default). A fast move gets motion blur
  (`@remotion/motion-blur`), which is also what makes 24 fps read as film.
- Every shot has its own angle (`full-visual/references/07-camera-and-transitions.md`, Angles).

## Building a chapter

- Scenes are written per chapter, as reel scenes are: an actor in a place, an event on its trigger word.
- Each scene file opens with a header: the sentences it covers, its first frame, word -> event, its last frame.
- A chapter's `scenes/index.tsx` maps scene ids to components. A scene with no component renders as its bare ground,
  which is how a chapter's timing is judged before its pictures exist.
- Build the hardest 60 s first, as a draft with sound, and show it before building the rest.
