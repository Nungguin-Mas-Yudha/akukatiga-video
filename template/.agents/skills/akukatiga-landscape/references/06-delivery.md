# Sound, delivery and packaging

## Sound

- Narration: one whole ElevenLabs take per chapter (`film.mjs voice`), English, the voice the creator picked by ear
  (`film.mjs audition`). Never spliced inside a chapter; a bad take is regenerated whole.
- Music: from the YouTube Audio Library (`06-sound.md`, Where the sound comes from), its licence row in
  `references.md`. Placed as cues in `film.json`:
  ```json
  "music": [{ "file": "music/opening.mp3", "from": "01-cold-open", "to": "02-the-weak-battery", "gain": -20, "fadeIn": 3, "fadeOut": 4 }]
  ```
  `from` and `to` name a chapter's start, a number of seconds, or `"end"`. `deliver.mjs` ducks every cue under the
  dialogue on its own (sidechain).
- Which scenes get music, effects or the voice alone: `06-sound.md`. Effects are `<Sfx>` in the scenes, licensed
  like music, in `films/<film>/sfx/`.
- The mix is brought to -14 LUFS integrated, true peak -1.5 before encoding (two-pass loudnorm), so it lands at or
  under -1 dBTP after AAC.

## Rendering

- `node render.mjs <film> all` writes per chapter a picture (`render/NN-id.mp4`, CRF 14 slow, 2560x1440, 24 fps),
  its dialogue stem (`.wav`), its effects stem (`.sfx.wav`) and `encode.json`. Drafts (`--draft`, `--from/--to`)
  never count as final.
- Remotion squeezes audio when it skips frames, so picture and sound render apart and join in `deliver.mjs`.

## Deliver

`node deliver.mjs <film>`:
1. joins the chapter pictures without re-encoding, each stem's chapters end to end padded to each picture,
2. lays the effects as placed and the music under, ducked by the dialogue alone, and normalises the mix,
3. writes `deliver/<film>.mp4` (AAC 384 kbps), `<film>.en.srt` (one cue per caption block, 42 characters a line, two
   lines at most), `chapters.txt` (YouTube timestamps from `film.json` chapter titles),
4. runs `scripts/check.mjs`, and only if it passes copies everything with `description.md`, `sources.md`,
   `references.md` and `thumbs/` to `workspace/output/<date>-full-visual-landscape-<film>/`.

## The check (`scripts/check.mjs`, writes `deliver/check.md`)

picture 2560x1440 (or 3840x2160) H.264, 24 fps, length >= minMinutes, every chapter rendered final, AAC 48 kHz
stereo, -14 +-1 LUFS, true peak <= -1 dBTP, nothing frozen 6 s or more, no black longer than 1.5 s, an `.en.srt` with
cues and no em dash, at least three chapters starting at 00:00 and each 10 s or longer. A check that cannot run is a
failure. Fix the cause and run it again; never lower a threshold to pass.

## Packaging

- **Thumbnails** (`films/<film>/thumbs/`): 3 concepts at 1280x720 built from the thumbnail recipe
  (`references/12-thumbnails.md`, studied from every Veritasium thumbnail), never in the brand kit's style; no medals
  or "Nobel"; readable at 168 px wide.
- **Description** (`description.md`): two or three sentences on the story, the chapter list from `chapters.txt`, the
  sources, and every credit a licence asks for. No hashtags, no em dashes.
- **Subtitles**: upload `<film>.en.srt` as English captions.
- **Shorts**: three 30-45 s stretches marked by timecode in `description.md` (each with its own hook line). They are
  rebuilt vertically with the reel format (`/full-visual`), not cropped from the 16:9 file.
- Nothing is posted by the agent. The files go to the creator's Google Drive folder for the channel when asked.
