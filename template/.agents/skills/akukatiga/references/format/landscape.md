# Channel: Landscape 16:9

# AkuKatiga Landscape (16:9)

## Stages and gates

Every stage, what it takes in and gives out, and the gate it must pass before the creator sees anything: [`landscape-workflow.md`](landscape-workflow.md).

## Struktur project (wajib)

Satu video satu folder di `videos/<slug>/`. Jangan mengarang folder baru; ikuti folder video terbaru.

```text
videos/<slug>/
├── plans/          naskah & rencana: script.txt, caption.txt, plan.md, research.md,
│                   reel.json, voice.alignment.json
├── storyboard/     dua bentuk: script/ (storyboard-<format>.md, bentuk tulisan) dan visual/
│                   (board per format, atau SVG/PNG per scene)
├── assets/         media video ini = --public-dir: voice.mp3, foto, footage, aset 3D
├── compositions/   scene per format: reels/ dan landscape/, masing-masing punya index.tsx;
│                   satu file per scene: 01.hook.tsx, 02.….tsx
├── out/            dibuat render sendiri: out/YYYY-MM-DD/NN-<slug>.mp4; master terpilih di out/final/
├── scratch/        still, percobaan, cover — bukan hasil final
└── README.md       ringkasan video + perintah render
```

- `plans/` = kata dan rencana. `storyboard/` = papan: bentuk tulisan di `script/`, bentuk gambar di
  `visual/`. Naskah final tidak di `storyboard/`, papan tidak di `plans/`.
- Selalu `compositions/reels/` dan/atau `compositions/landscape/`, masing-masing dengan `index.tsx`. Nama
  formatnya wajib eksplisit, termasuk untuk video satu format; tidak ada `composition/` datar.
- Entry `index.tsx` itulah yang mendaftarkan video ke studio/render.
- Aset datar di `assets/`, tanpa subfolder per jenis (`images/`, `audio/`, `raw/`).
- Helper khusus video: `parts.tsx` di folder formatnya. Helper lintas video: `engine/`. Jangan bikin `utils/` baru di project.
- Tidak ada `script/`, `notes/`, `production/`, `utils/`, `src/`, atau `public/` di dalam `videos/<slug>/`.
- Slug: huruf kecil, `kebab-case`, tanpa tanggal. Nama scene berurutan: `01.`, `02.`, dst.
- `.mp4` tidak di-commit; `out/` dan `scratch/` tetap lokal.

Bentuk konkretnya ada di [`videos/example/`](../../../../../videos/example): kerangka kosong berisi `.gitkeep`,
tanpa naskah atau media contoh. Salin bentuk itu; jangan mengarang folder sendiri.

## Batas kerja QC

Jalankan cek mesin per scene tanpa reviewer. Setelah scene digabung, creator menonton draft dengan suara dan satu
reviewer Opus menilai contact sheet serta frame bermasalah untuk keseluruhan reel atau chapter. Reviewer menulis
maksimal 6 baris FAIL yang bisa dikerjakan, tanpa daftar PASS atau ringkasan ulang referensi. Gabungkan semua BLOCK
dalam satu batch perbaikan. Putaran kedua hanya mengukur dan menonton bagian yang berubah; panggil reviewer lagi
hanya jika muncul masalah visual baru atau hasilnya ambigu. Maksimal dua putaran per draft; BLOCK yang tersisa
dilaporkan sebagai belum lolos.

Folder project: `/root/projects/akukatiga/videos/`

## Aturan brand (prioritas di atas template)
- Topik: investigasi studi kasus K3, regulasi industri, bedah insiden keselamatan kerja.
- Template di bawah berasal dari pipeline Before the Prize; aturan brand AkuKatiga di atas yang berlaku jika bertentangan (bahasa, suara, brand kit).

## Aturan loudness (dikunci)
- Voice ElevenLabs masuk sekitar -24 LUFS. Draft dan final dinormalisasi ke -14 LUFS dengan true peak maksimal
  -1 dBTP setelah mux (loudnorm dua pass untuk final); file voice aslinya jangan diubah.
- Perbaikan kodenya dilakukan per engine waktu project brand itu dikerjakan: draft di-mux dengan loudnorm ke -14 LUFS,
  seperti `render.mjs` film goodenough-battery (Before the Prize landscape). Cek dengan ffmpeg ebur128 sebelum
  draft ditunjukkan ke creator.

## Aturan model (dikunci)
- Claude Opus (effort MEDIUM): semua tugas mikir: naskah, coding scene .tsx, review QC.
- Claude Haiku 5.5 (`claude-haiku-5-5`): tugas teknis/non-mikir: fetching jurnal, download gambar referensi, audio
  alignment, menjalankan render, qc-scan dan cek mesin, merangkum log.
- Sonnet DILARANG di seluruh pipeline ini (termasuk subagent).

---

## Aturan visual: 2.5D Remotion murni, tanpa Three.js dan Blender (dikunci, 2026-10-31)
Tujuannya produksi lebih cepat: tidak ada pipeline Blender, plate, atau render 3D di VPS. Kesan 3D dipalsukan:
- Foto: `photo/DepthPhoto.tsx` (depth map, parallax, relief, orbit kecil).
- Tempat: layer parallax (depan, tengah, belakang) + blur kedalaman + kabut tipis.
- Bidang datar yang dimiringkan atau dibuka (kartu, dokumen, lapisan sel, diagram): CSS `perspective` + `rotateX/Y`.
- Atom, molekul, kisi, partikel: titik dan garis diproyeksikan manual dari koordinat 3D (kristal dari data CIF),
  bola dengan radial gradient, diurutkan menurut z. Boleh berputar penuh.
- Cahaya, glow, api, asap, kilau logam, distorsi panas: shader Skia (RuntimeEffect).
- Lab, mesin, alur proses: isometrik.
- Shot yang hanya bisa dibuat dengan 3D asli (benda padat rumit diorbit bebas, fly-through ke dalam benda kompleks)
  tidak ditambal dengan alat baru: shot-nya diganti saat konsep (cutaway atau penampang yang di-push-in, foto atau
  arsip asli dengan depth). Tiap konsep scene menjawab "bisa 2.5D?" sebelum disetujui.
- Komponen fake-3D yang dipakai ulang (`DepthPhoto`, `ParallaxStack`, `Projected3D`, `CardTilt`) dibuat sekali di
  engine dan dipakai lintas project dan channel.

## Pipeline template

Jalankan dari folder project-nya (path `engine/`, `workspace/` relatif ke root project).

# Full visual landscape (Before the Prize)

A calm English voice tells the untold stretch before a breakthrough was recognised: the doubt, the rejection, the
years. The screen shows what the voice is about, in sync with the words, as one film. It is the reel format's craft
(`.agents/skills/akukatiga/`) at film length, with the reels' visual bar and variety. The Before the Prize brand kit is only the logo sting and the end screen, never the look of a scene or a thumbnail (`../05-composition/look-and-frame.md`).

**This is not AkuKatiga.** The rules in `CLAUDE.local.md` about the Ongky voice, Indonesian, narration-only sound and
the AkuKatiga look do not apply here. What still applies from it: Opus for every thinking job at medium effort, Haiku
5.5 for fetching and collecting only, no Sonnet. The brand's content rules are below; its kit
(`/root/projects/before-the-prize/library/brand/`) is only for the sting and the end screen.

## What carries over from the reels, and what does not

Carries over (read the named reel references when the stage comes):
- The real thing is the picture: machines, cells, crystals, documents and places redrawn at their own geometry,
  checked against fetched references (`../04-assets/object-references.md`).
- Sync: a change lands on the spoken word that names it, through `cue("word")`, never a typed time.
- One thread object per chapter, objects carried between scenes, setups paid off later
  (`../03-treatment/treatment.md`).
- Depth by layer: places in 2.5D planes, objects that turn as projected 3D drawn in 2D, fire and smoke as Skia
  shaders ("Aturan visual" above). No Three.js, no Blender.
- Numbers count, roll or fill and land on their word. A change of state happens to the object already on screen.
- Every picture is fetched, never generated: no AI images, ever.

Does not carry over:
- **No word-by-word caption.** Subtitles are a file (`.en.srt`, written by `deliver.mjs`). On screen only: names
  (lower thirds), places and years (place stamps), verified quotes (quote cards), numbers, chapter cards, labels.
- **Pace.** A new picture every 3-6 s, a shot may hold 4-8 s while something moves inside it
  (`../05-composition/pace-and-structure.md`), not every 1.2 s.
- **Transitions inside the scenes**, as in the reels; the engine's cut, dissolve or dip only where an object is
  carried or time jumps (`../05-composition/look-and-frame.md`).
- **Sound.** Narration first. Three modes chosen per scene: voice only (the hard explanations), light licensed
  music under story beats, and an occasional simple effect on something seen (`<Sfx>`, on its word). Footage sound
  only on a lane-4 interview line (`../06-deliver/sound.md`).
- **Length.** 18 minutes minimum (`film.json` `minMinutes`), 18-25 is the target.

## The fixed settings

| | Value |
|---|---|
| Composition | 1920x1080, timeline 48 fps (every scene duration is 48 fps frames) |
| Delivered | 2560x1440 (render scale 4/3), 24 fps (every second frame), H.264 High CRF 14 slow, yuv420p BT.709 |
| Draft | 1920x1080, CRF 23, sound muxed, for review |
| Sound | AAC-LC 384 kbps 48 kHz stereo, -14 LUFS integrated, true peak <= -1 dBTP, music ducked under dialogue |
| Frame | 16:9 full; letterbox 2.39:1 only for a named moment (cold open, flashback), never a whole chapter |
| Safe | title safe 96 px in, 54 px down; no film text in the end-screen zone over the last 20 s |
| Motion | pans slow enough not to judder at 24 fps (a full-frame pan takes 7 s or more); motion blur on fast moves |
| Grain | light (theme.finish.grain 0.012): YouTube's encoder breaks heavy grain into blocks |

Why 1440p: YouTube gives 1440p and 4K uploads its better codec, so the film looks sharper even watched at 1080p;
1440p costs about 1.8x the pixels of 1080p where 4K costs 4x. `--scale 2` renders 4K when the machine allows.

## Where things are

```
engine/full-visual-landscape/
  film.mjs                    new | audition | voice | align | status (the reel engine's voice.py and align.py, shared)
  render.mjs                  a chapter, all chapters, drafts, stills, guides
  deliver.mjs                 join, music, loudness, .srt, chapters.txt, check, copy to workspace/output
  scripts/check.mjs           the delivery check
  src/theme.ts                the brand tokens as the engine reads them
  src/engine/                 Stage (handovers), media (Plate, Footage, Sfx), brand (Symbol, Lockup, Label, LowerThird,
                              PlaceStamp, ChapterCard, QuoteCard, Letterbox, LogoSting), Finish, context (useScene)
  films/<film>/
    film.json                 title, minMinutes, voice, chapter titles, music cues
    sources.md                every claim and its sources (stage 1)
    references.md             every picture, clip and music file: source, licence or four-factor note
    treatment.md, plan.md, description.md
    assets/                   pictures and clips used across chapters
    music/                    licensed music files
    sfx/                      licensed sound effects
    chapters/NN-id/           script.txt, caption.txt, voice.mp3, words.json, chapter.json, scenes/index.tsx, assets/
    render/, deliver/         outputs
  films/btp-demo/             a layout test of the brand parts (sting, lockup) and handovers (no voice)
/root/projects/before-the-prize/library/brand/   the brand kit (sting and end screen only): README, SVG, PNG, tokens
```

A scene is a React component that reads `useScene()` (`f`, `cue`, `cueEnd`, `endsOn`, `scene`, `theme`, `ground`)
and imports its parts from `src/engine` (the reel kit's verbs are re-exported: `blurIn`, `pop`, `countTo`, `draw`,
`stagger`, `Travel`...). The kit's default durations are 60 fps frames, so here they run a quarter slower. Every motion starts from a cue and runs a number of frames: no seconds typed by hand, no `Math.random`.

## Commands (from `engine/full-visual-landscape/`, renders with the sandbox disabled)

```bash
node film.mjs new <film> 01-cold-open 02-the-weak-battery ...   # folders, film.json, empty script and caption files
node film.mjs audition <film> id:label,id:label                 # first lines per voice; the creator picks
node film.mjs voice <film> [NN-id]                              # one whole take per chapter
node film.mjs align <film> [NN-id]                              # caption.txt + voice -> words.json
node film.mjs status <film>                                     # per chapter: script, voice, words, scenes, render, length
node render.mjs <film> <NN-id> --draft --stills 3,40.5,90       # look before rendering
node render.mjs <film> <NN-id> --guides --end-screen --stills 9 # title safe and the end-screen zone drawn on
node render.mjs <film> <NN-id> --draft                          # a chapter with sound, for review
node render.mjs <film> all                                      # final pictures + dialogue stems
node deliver.mjs <film>                                         # the upload, .srt, chapters.txt, check, copy to output
node ../../node_modules/typescript/bin/tsc --noEmit -p .        # types, before any render
```

A 30 s chapter of flat 2D scenes rendered final in about 60 s on the laptop; a 3D or footage-heavy chapter takes
longer. Render a whole film overnight, or the 2.5D chapters on the VPS.

## Content rules (the channel's, not taste)

- Never the word "Nobel" in a title, thumbnail, channel or series name; never medals, laurels, diplomas or the Nobel
  Foundation's marks; never text copied from nobelprize.org. The award is named only as a fact inside the story.
- Never an invented fact, quote, date or number. Unverified means out of the script, or said as unverified.
- Politics stays out. Sensitive material (war, weapons, death, disease) is told with restraint and flagged in the plan.

## Aturan fetch (berlaku di skill ini)
Semua fetch (gambar referensi, logo, footage, jurnal, halaman web) dikerjakan subagent Haiku (`claude-haiku-5-5`) dengan brief minimal: apa yang dicari, sumber/URL kalau ada, folder tujuan, aturan nama file, lisensi. Jangan suruh Haiku membaca SKILL.md, AGENTS.md, CLAUDE.md, plan, atau reference lain. Dia cukup tahu apa yang dikerjakan saat itu; lapornya daftar file + sumber saja.
