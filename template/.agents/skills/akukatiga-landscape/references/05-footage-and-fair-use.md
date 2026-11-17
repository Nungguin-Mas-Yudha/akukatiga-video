# Pictures, footage and fair use

## Goal

A richer film than drawings alone, without a single claim or strike: every picture and clip on screen has a licence
that allows it, or a written fair-use case that holds. This is a technical rule set, not legal advice.

## What to know first

- There is no safe number of seconds. "Under 10 seconds is fine" is a myth. US fair use (17 U.S.C. section 107) is
  judged case by case on four factors: the purpose and whether the use transforms the work, the nature of the work,
  how much is taken, and the effect on the market for the original.
- Indonesia's copyright law (UU 28/2014, Pasal 44) allows use for education, criticism or review when the source is
  named and the owner's reasonable interests are not harmed.
- YouTube's Content ID can claim a clip even when the use is fair. Fair use is a defence, not a permission: a claim
  can take the film's money or block it until disputed.
- A still frame taken from a video is the same work as the video: the same rules apply.

## Four lanes, safest first

1. **Public domain.** US federal government works (NASA, National Archives, Library of Congress federal items,
   NIST, NIH), Prelinger Archives items marked public domain, and works published in the US before 1931 (public
   domain in the US as of 2026). Use freely; credit anyway.
2. **Open licences.** Wikimedia Commons (CC0, CC BY), Pexels and Pixabay video, institutional media marked CC BY.
   CC BY-SA only when nothing else exists (share-alike may reach the film), with the reason written down. Never NC
   or ND.
3. **Licensed archive.** British Pathe, AP Archive, Getty and similar, paid per clip. The licence document goes in
   `references.md`.
4. **Fair use, narrow (approved for this brand, 2026-10-30).** Only:
   - the person of the story in their own interview or lecture, or archive news footage of the event itself,
   - when the film comments on that exact moment (we show what they said and then tell what it meant, what was
     wrong, what came after),
   - short: the shortest stretch that makes the point, never the heart of a work, never a long run,
   - with our narration and framing around it, the source named on screen (`Footage` credit) and in the description,
   - and a four-factor note in `references.md` before the clip is placed (below).

   **Never, under any lane:** footage from another creator's explainer or documentary (Veritasium, Kurzgesagt and
   the like: that competes with the original, factor four), films and TV shows, music videos, anything from the
   Nobel Prize channels or nobelprize.org, stock with watermarks, AI-generated pictures.

## The references.md row

```
| id | what | lane | source page | author / owner | licence (exact words) or 4-factor note | used where | credit line |
```

A lane-4 note answers each factor in one line:
1. Purpose: what our film says about this clip that the clip does not say itself.
2. Nature: factual (interview, news) or creative (prefer factual).
3. Amount: start and end in the source, total seconds, why no less would do.
4. Market: why this does not replace watching the original.

A clip without its row is not placed. A licence that could not be read on the file's own page counts as never.

## Fetching

Haiku fetches candidates from several sources (5-10 per need) and saves them with their page URLs into
`films/<film>/assets/`. Opus picks on quality first (sharp at full size: 2560 px or more on the long side for a full
frame photo, 1440p or better for footage; no watermark; no burned-in captions) and writes the row. Pictures used only
as references to redraw from need no licence (`akukatiga-reels/references/11-image-assets.md`, References are free).

## On screen

- `Plate` for photos and illustrations, `Footage` for clips (`src/engine/media.tsx`). Both are graded toward the
  film and always moving.
- Every one carries its honesty label and its credit: "Archive photo / Library of Congress", "Footage / AP Archive".
- A clip plays its own sound only on a lane-4 interview line (`sound`); the music ducks under it with the narration.
- Faces: a real person shown for a claim about them only when the picture is of them, in context, from a lane above.
