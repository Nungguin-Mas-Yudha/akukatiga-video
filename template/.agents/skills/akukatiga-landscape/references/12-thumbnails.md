# Thumbnails

## Goal

A thumbnail that stops a scroll at 168 px wide and makes the title's question impossible to leave alone. It is the
other half of the title, never a repeat of it, and it shows the film's real thing, lit like a film.

## Reasoning

Studied from every Veritasium long-form thumbnail (447 measured, 2026-10-30; the study and contact sheets are in
`workspace/library/before-the-prize/thumb-study/`). Each was scored by its views against the median of its 20
neighbouring uploads, so an old video is compared with its own era. The recent era (newest 145) is the bar: the
older top list is vlog-era and no longer how the channel wins.

Measured, top quarter against bottom quarter: more dark area (24.5 % of pixels against 18.1 %), a little more
saturation (0.33 against 0.29) and detail (edge density 0.075 against 0.065). A face does not lift a thumbnail
(a face in 31 % of the top quarter, 36 % of the bottom). The rest was read by eye from the ranked sheets.

## What wins (recent era)

1. **One hero, lit on near-black.** A single real thing at its own beauty: the blue LED among red and green, the
   ASML machine, a bombe, a sword over sand, a fibre glowing green, a fork scratching. It fills 40-60 % of the frame,
   with dark space for the words. (x6.7, x6.1, x3.1, x2.2, x2.1)
2. **Or the person in their moment.** A historical figure in a dramatic act (Midgley pouring lead over the Earth,
   Einstein pulling a curtain on a wormhole, a scientist circling an equation), or a striking archive portrait with
   a short line ("DESTROYER OF WORLDS", x1.9). Veritasium commissions painted art; this channel uses graded archive
   photos and code or 3D renders (no AI images, ever).
3. **Two or three words that judge, not describe.** The image shows what; the words give the twist. Two styles:
   - serif, sentence case, a full stop, one word underlined in red: "This shouldn't exist.", "Made from sand.",
     "We cracked it", "How was this allowed?", "This is it.", "Infected.";
   - bold sans capitals for one concept or verdict: "ENTROPY", "INCOMPLETENESS", "UNSTOPPABLE?",
     "NO COMPUTER IS SAFE".
4. **A contrast the eye solves in one glance.** Three alike and one odd ("EASY / EASY / ALMOST IMPOSSIBLE", the
   film's best at x6.7), before and after, safe beside burning.
5. **One red mark at most.** A hand-drawn red arrow or circle on the detail that matters (the fork's line, Euclid's
   postulate, Europa's surface). Never more than one.

## What loses

- Bright, busy frames: a blue or white ground, a headline that describes the video in capitals ("SAME EARTHQUAKE",
  "THIS IS NOT YELLOW", "20 Million Miles. No Driver."), four or more words.
- The host's face as the subject with nothing strange beside it ("Am I Retiring?", a plain smiling portrait).
- A stock-photo look, cartoon clip art, a chart, a crowded split.
- Text that repeats the title.

## The recipe

| | Rule |
|---|---|
| Size | 1280x720, read at 168 px wide and at full size |
| Ground | near-black or a deep, dark colour; at least a fifth of the frame dark |
| Hero | one real object or one person, 40-60 % of the frame, lit with a rim light, sharp |
| Words | 0-3, judging; serif sentence case with one red-underlined word, or bold sans capitals; never the title's words |
| Mark | at most one red arrow or circle |
| Colour | one strong accent from the subject itself (the flame, the glowing cell, the blue LED) |
| Source | the film's own 3D renders and shaders, graded archive photos; never AI images, never the brand kit's style, no medal, no "Nobel" |

## Process

1. Write 6 thumbnail ideas, each pairing a picture with words the title does not say. Pick 3 that differ in kind:
   one object hero, one person, one contrast.
2. Render each from the film's own scenes (`node render.mjs <film> <NN-id> --stills t` at 2x, then composite the
   words and mark in code), save to `films/<film>/thumbs/`.
3. Check each at 168 px wide: the hero and the words read in one glance, and the question is clear.
4. The creator picks; YouTube's Test and Compare runs the other two.
