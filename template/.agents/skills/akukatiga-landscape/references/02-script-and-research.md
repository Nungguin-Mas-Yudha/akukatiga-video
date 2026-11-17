# Research, outline, script and caption

## Goal

A film that a curious adult watches to the end and trusts. Every claim holds up, the story moves, and the words are
written to be heard.

## Research (stage 1)

- `sources.md` has one row per claim the film may make: the claim in one line, two sources (a primary paper, a
  university or institutional page, a reputable biography or interview, the person's memoir), and a verdict:
  VERIFIED, PARTLY TRUE (what part), FALSE, UNVERIFIED (what would settle it), plus the excerpt that proves it (at
  most 3 sentences, quoted, with the paper's section or the page). Reviewers read the excerpts, not whole papers.
- A claim with one source, or with sources that copy each other, is UNVERIFIED.
- Quotes: the exact words, who said them, where and when, with the page or timestamp. A quote found only on a quote
  site is UNVERIFIED. A paraphrase is never set in quote marks.
- nobelprize.org may be read for facts; its biographies and lectures are never copied or closely paraphrased.
- Haiku fetches pages and lists; Opus reads, judges and writes the verdicts.

## Outline (stage 1, the creator approves it)

- 3 working titles: curiosity-driven, true, no "Nobel".
- The hook for the first 30 s: an everyday thing or a moment of doubt, and the question the film will answer.
- 6-10 chapters, each 2-4 minutes, each with a title for its chapter card and the YouTube chapter list.
- Per chapter: its beats, the facts (rows of `sources.md`) each beat stands on, its thread object, its one big move.
- A retention question every 2-3 minutes: an open question or a promised reveal that pulls into the next stretch.
- A change of mode every 60-90 s: photo, diagram, 3D object, map, quote card, footage, back to the story.
- At least two plant-and-payoff pairs across the film.
- The close: a reflective landing on what is still unsolved, then a soft subscribe line.

## Script (stage 2)

- About 150 words a minute: 2,700 words for 18 minutes, 3,700 for 25. Read the rate off the chosen voice's take and
  adjust; never pad to reach the length. If verified material runs short, say so and add a researched beat.
- Written to be heard: short sentences, one idea each, each following from the last. Spoken glue ("Here's the
  problem.", "And that's where it gets strange.") is welcome; written order and stacked clauses are not.
- One analogy per concept, kept for the whole film (a battery's ions as cars in a parking garage, say, every time).
- Fair to everyone in the story: a shared discovery is told as shared.
- No em dashes anywhere (script, captions, description). No hashtags.
- Restraint on sensitive material: no gore, no mockery of the dead, no politics.

## caption.txt (stage 3)

The same file format as the reels (`akukatiga-reels/references/02-script-and-caption.md`), read by the same `align.py`.
Here it drives the scenes and the subtitles, not an on-screen caption:

```
== cold-open | ground: ink                    a scene: its id (key in scenes/index.tsx) and its ground
Every phone in this room                     one line = one subtitle block (deliver.mjs splits at 42 characters)
runs on an idea from 1980.
== doors | ground: ink | in: arch            how the scene arrives: cut (default), dissolve, dip, arch
```

- Grounds: `ink` (the default), `smoke`, `bone`. Bone is for paper things: quote cards, documents, notebooks.
- A scene usually spans several sentences here (a reel scene is one). Hand over where the picture really changes.
- `*key*` words and emoji are ignored by the landscape engine and stripped from subtitles; leave them out.
- Each chapter has its own `script.txt` and `caption.txt`; their words must match, as for a reel.
