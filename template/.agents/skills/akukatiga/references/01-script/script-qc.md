# Script QC: the review room

## Goal

A script that is as scientific as a textbook chapter and as easy to follow as a good conversation, before a single
word is voiced. The study of Veritasium (`script-recipe.md`) showed both can be true at once: deep, complete
explanations in plain spoken English. This review room checks both, from people who did not write the script.

## How it runs

1. `node scripts/script-check.mjs <film>` passes first (length, sentence length, "you", questions, turns). A script
   that fails the measures does not go to review.
2. Two Opus agents (medium effort) that did not write it read the whole script: one holds the Science Editor,
   Curious Newcomer, Story Editor and Listener checklists below, one is the Fact Checker (it reads the sources).
   Each is given: the script (`script-full.md` or the chapter files), `sources.md` (its excerpts are the evidence;
   a paper's `text.md` is only grepped at the section an excerpt names), `treatment.md` and their own section of
   this file. Run them in parallel.
3. Each returns only BLOCK and FIX lines, one format: `chapter | the line (first words) | the problem | the fix |
   severity` (BLOCK: wrong or unclear enough to lose or mislead a viewer; FIX: weakens the film). No NOTEs, no
   praise, no summary; the scores in one line. One page at most.
4. The writer (the showrunner) merges the findings, fixes every BLOCK and decides each FIX in writing in
   `qc/script-qc.md` (fixed, or why not). Contradictions between reviewers are resolved there with a reason.
5. The film passes when there are no open BLOCKs and every score is at or above its bar. Then the creator reads it.
   A second round runs only on the lines and claims that changed. Two rounds at most.

## The five checklists (two agents: the Fact Checker alone, the other four in one)

### 1. The Science Editor (depth and correctness)

Reads like a physicist or chemist who loves teaching. Checks that every explanation is true and that it goes deep
enough to be satisfying, not just named.

The depth ladder (each core science block must reach level 4; a supporting block level 3):
1. **What** happens ("the battery stores energy").
2. **How** it happens, as a sequence of steps ("ions move one way inside, electrons the other way outside").
3. **Why** it happens, at the level of the mechanism ("the electron falls to a lower energy level in the cobalt;
   that drop is the voltage").
4. **How much**: a number made physical, and the consequence that follows from it ("about 4 volts against 2,
   so twice the energy from the same charge").
5. **The limit**: where the explanation stops being true, or what still is not solved ("only about half the lithium
   can leave before the layers strain").

Checks:
- Every step of every mechanism is correct; a simplification is allowed, a wrong picture is not. Mark any sentence
  that would make a specialist wince.
- Hand-waving: any place where the script names an effect instead of explaining it ("the landing spot sits deeper"
  without saying why).
- Missing steps: any jump in the climb a curious viewer would ask about.
- The analogy holds where it is used and is never stretched past what it can carry; say where it breaks.
- Each science claim has its `sources.md` row; a mechanism step with no source is a BLOCK.

STEM coverage (creator decision, 2026-10-30: the explanations should be as strong in science as Veritasium's):
- Name the disciplines the story really needs (physics, chemistry, mathematics, biology, engineering) and check each
  one gets its mechanism, not just its vocabulary. A battery film needs chemistry (what is oxidised and reduced),
  physics (energy levels, voltage, charge) and a little mathematics (energy = voltage x charge, worked once with
  round numbers).
- Every core block carries at least one worked number or a simple relation said in words, with its consequence.
- An equation may be shown on screen only if it is also said in plain words; the viewer must never need the symbols.

Demos (what Veritasium does with a laser, a piston or a metronome, we do with a working experiment drawn in code,
or licensed footage of a real one):
- Every core block has at least one moment written to be *shown happening*, not described: "watch what happens when
  the lithium comes back unevenly". Mark each one `DEMO:` in your findings with what the experiment would show and
  which physics it must obey, so the visual plan can build it (a growing whisker that shorts the cell, a voltmeter
  climbing from two to four volts, ions shuttling between two shelves).
- A demo must be honest: it runs on the real rule (the real ratio, the real order of events), never a decoration.
- A core block with nothing to show is a FIX: find the experiment, or say why the idea cannot be shown.

Scores (1-5): correctness, depth (the lowest ladder level reached by a core block), completeness, STEM coverage.
Bar: correctness 5, depth 4, completeness 4, STEM coverage 4.

### 2. The Curious Newcomer (clarity)

Reads as a bright 15-year-old, or an adult who left science at school, hearing it once at speaking speed with no
pause button.

Checks:
- Every technical word is used only after it is explained, in plain words, the first time ("electrolyte").
- Every sentence makes sense on the first hearing; mark any that needs a second listen.
- Each step of a climb follows from the one before; mark any "wait, how did we get here?"
- The analogy is introduced before it is needed, and used the same way every time.
- Numbers are said in a way the ear can take (round, with a comparison), never a string of digits.
- After each explanation, can they say back the point in one sentence? Write the sentence they would say; if it is
  wrong, the explanation failed.

Scores: clarity, ease, the one-sentence recall (share of explanations recalled right). Bar: 4, 4, 100 %.

### 3. The Story Editor (structure and retention)

Reads with a stopwatch at 155 words a minute.

Checks against `script-recipe.md`:
- The skeleton's proportions: cold open, setup, the long explanation by 15-35 %, the quest, the low point near 60 %,
  the climax at 75-80 %, the cost, the coda.
- The promise is made in the first 90 seconds and kept, visibly counted.
- Every open loop: where it is planted and where it is paid; any loop never paid, any payoff never planted.
- A turn every 2-4 minutes; list the timestamps and mark any gap.
- Every explanation is triggered by a story question spoken aloud, and hands back to the story with a consequence.
- Chapter endings: each one pulls into the next.
- Characters drawn by acts, not adjectives; resistance appears at least twice.
- The ending: no recap of facts, a callback to the opening, a short first-person reflection.
- **Guess before the reveal:** at least one moment per core science block, and three or more in the film, where the
  viewer is asked to predict before being told ("Before I tell you, how many volts would you guess?"). The answer
  must come within a few sentences.
- **Dry humour:** one light, understated line every chapter or two, placed after a dense stretch to let the viewer
  breathe. Never about the dead, the suffering or a real person's failings. A film with none is a FIX.
- **A second, smaller mystery:** planted in the middle third, paid in the coda (who, what happened to, what became
  of). Not the main question.
- **Today and tomorrow:** a short stretch in the coda on where the science stands now and what is still being
  chased, sourced like any fact.
- **Voices:** mark the two or three moments where the person's own words, or an expert's, would carry the emotion
  better than narration (a doubt, a triumph, a regret). For each, say whether a verified quote, an archive clip
  (lane 4) or a recorded expert interview could fill it.

Scores: hook, structure, momentum, participation (guesses and humour). Bar: 4 each.

### 4. The Fact Checker (truth and fairness)

Reads with `sources.md` open, and re-checks the claims against the web as they now stand in the script, because a
claim drifts when it is rewritten.

The re-check (fetching by Haiku, judging by Opus, as the folder's model rule says):
Round 1 checks every claim; later rounds only the claims whose wording changed since the last check.
1. The Fact Checker lists every checkable claim in the script, one line each, numbered, with its chapter: names,
   dates, numbers, mechanisms, quotes, superlatives ("the oldest", "the lightest").
2. Haiku agents, in parallel, a batch of claims each, search the web fresh for every claim: at least two
   independent sources where they exist, preferring primary papers, universities, institutions and reputable
   outlets, and return for each source its URL, outlet, date and an excerpt of 40 words or fewer. They do not
   judge.
3. The Fact Checker (Opus) reads what came back and gives each claim a verdict: CONFIRMED, CONFIRMED WITH WORDING
   CHANGE (the fix), NOT CONFIRMED (a BLOCK: cut it or attribute it), CONTRADICTED (a BLOCK). New sources go into
   `sources.md`.

Checks:
- Every fact, number, date, name and quote maps to a `sources.md` row with a verdict of VERIFIED, or PARTLY with the
  attribution the row asks for ("according to The New York Times"). Anything else is a BLOCK.
- Overclaims: "every", "invented", "first", "only", "never" used beyond what the source says.
- Quotes are word for word from the source, or clearly told as a paraphrase without quote marks.
- Shared credit stays shared (co-authors, rivals, the other laureates).
- Brand rules: "Nobel" only as a fact inside the story; no text from nobelprize.org; no em dashes; no politics.
- Sensitive material told with restraint.

Scores: accuracy, fairness, share of claims CONFIRMED on the fresh re-check. Bar: 5, 5, 100 % (after fixes).

### 5. The Listener (spoken rhythm)

Reads the script aloud in their head at the voice's pace, as the narrator will.

Checks:
- Sentences that need a second breath; runs of short fragments that sound like a list; three sentences in a row of
  the same length or shape.
- Words or numbers a voice will stumble on, or say wrongly (abbreviations, symbols, chemical formulas, years).
  Mark how each should be written for the voice ("lithium cobalt oxide", not LiCoO2).
- Repeated words close together, and repeated sentence openings.
- Hinges ("So", "But", "Now") used as hinges, not as filler on every line.
- Places where a pause, a question or a short punch would land the point better.

Scores: flow, voice-readiness. Bar: 4, 5.

## What the reviewers do not do

They do not rewrite the script. They find, explain and propose a fix; the writer decides. They do not add facts
of their own: a missing fact is a request for research, written as such.

## The QC file

`films/<film>/qc/script-qc.md`, one page: the date, the `script-check` line, the scores in one line, each BLOCK and
FIX with its decision (fixed, or why not), and the pass line ("No open BLOCKs; all scores at bar") or what remains.
