# Channel: Reels 9:16

# AkuKatiga Reels (9:16)

This skill is the whole kit for the format: the engine grammar and scene rules (the reference files here) plus the
AkuKatiga channel rules below. Where a channel rule differs, the channel rule wins.

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

### Kalau project 3D / hybrid (Three.js)

2D tidak punya file dunia. Project 3D atau hybrid punya **satu world** yang memegang kamera dan matematika, dan
scene-nya jadi tipis:

```text
compositions/<format>/     reels/ atau landscape/
├── index.tsx        registri scene (sama seperti 2D)
├── world.tsx        satu dunia: kamera (camAt/cam3At, threeCam), project, quadMatrix, rand (seeded),
│                    material, light plan, komponen benda (Shot, Lens, Lights, Phone3D, ...)
├── core.tsx         geometri + state dunia: posisi benda, rute, konstanta warna (hanya jika perlu)
├── parts.tsx        helper angka kecil: lerp, p01, clamp (bukan dunia)
├── 01.hook.tsx      scene tipis: baca cue sekali → hitung kamera/cahaya → kirim props ke world
└── 02.….tsx
```

- Satu `world` per project. Dunia khusus satu hook boleh punya file sendiri (`HookX5World.tsx`), bukan world kedua
  di dalam scene. Scene tidak boleh punya kamera atau drift sendiri.
- `world` = fungsi murni dari frame: tanpa `useFrame`, tanpa `Math.random` (pakai `rand(i, s)` seeded), tanpa clock.
- 3D asli hanya untuk benda yang berputar atau butuh material nyata (`@remotion/three` di layer tengah). Tempat tetap
  plane 2.5D (`matrix3d`), api/asap/steam shader Skia, droplet/ember SVG dari `project()`.
- Aset 3D tetap datar di `assets/`: `assets/<benda>.glb`, `assets/<benda>.hdr`, tekstur `assets/tex-<benda>.png`.
  Jangan bikin `assets/models/`, `assets/textures/`.
- Engine menyediakan rig tetap `src/engine/Stage3D.tsx` untuk scene yang tidak perlu light mengikuti event; hybrid yang
  butuh itu memakai `ThreeCanvas` langsung.
- **Pola Continuous One-Take 3D (opsional via `__world`):**
  - Default (non-continuous): tiap scene boleh merender `<World3D>` / `<Stage3D>` sendiri seperti biasa.
  - Jika video menginginkan **semua scene menyatu tanpa jeda/kedip WebGL** (seakan satu shot kamera kontinu):
    1. Daftarkan komponen 3D persisten pada key `__world` di `compositions/<format>/index.tsx` (engine `Reel.tsx` me-render `__world` sekali di antara `<Ground />` dan `<Stage />`, tepat di bawah `<Finish />` dan `<Caption />`, sehingga `<ThreeCanvas>` tidak pernah di-unmount antar scene).
    2. Komponen `__world` membaca `useReel()` + `useCurrentFrame()` (fungsi murni dari `f`, tanpa `useFrame`/`Math.random`) untuk menginterpolasi kamera, pencahayaan, dan seluruh aktor 3D lintas scene secara kontinu.
    3. Tetap pertahankan semua file scene (`01.….tsx`, `02.….tsx`, dst.) di `index.tsx` dengan `Comp.keep = true` untuk memegang HUD/badge/pill 2D dan cue teks masing-masing scene di atas layer 3D (tanpa merender `<ThreeCanvas>` di dalam file scene).
- Render 3D di laptop GPU (`node render.mjs <slug> --gl vulkan` di Linux AMD RADV / `--gl angle` di Windows), **jangan** di VPS Labkom (tanpa GPU, ~9× lebih lambat).

## Batas kerja QC

Jalankan cek mesin per scene tanpa reviewer. Setelah scene digabung, creator menonton draft dengan suara dan satu
reviewer Opus menilai contact sheet serta frame bermasalah untuk keseluruhan reel atau chapter. Reviewer menulis
maksimal 6 baris FAIL yang bisa dikerjakan, tanpa daftar PASS atau ringkasan ulang referensi. Gabungkan semua BLOCK
dalam satu batch perbaikan. Putaran kedua hanya mengukur dan menonton bagian yang berubah; panggil reviewer lagi
hanya jika muncul masalah visual baru atau hasilnya ambigu. Maksimal dua putaran per draft; BLOCK yang tersisa
dilaporkan sebagai belum lolos.

Folder project: `/root/projects/akukatiga/videos/`

## Aturan brand (prioritas di atas template)
- Suara: Ongky Himawan (ElevenLabs, Bahasa Indonesia).
- Audio: narasi SAJA. Tanpa musik background, tanpa SFX, tanpa ambience.
- Caption: maksimal 2 baris, tanpa em-dash.
- Karakter: tangan bulat APAR.
- Topik: edukasi K3 dan keselamatan.

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

## Aturan visual reels: 2.5D + 3D + shader (diperbarui 2026-10-31)
Reels boleh memakai kombinasi 2.5D, 3D asli, dan shader. Hanya video landscape yang dibatasi 2.5D murni. 3D asli hanya lewat Three.js; Blender tidak dipakai (tidak ada pipeline Blender, plate, atau render 3D di VPS). Teknik 2.5D di bawah tetap jadi dasar, 3D asli dipakai bila shot memang butuh:
- Foto: `photo/DepthPhoto.tsx` (depth map, parallax, relief, orbit kecil).
- Tempat: layer parallax (depan, tengah, belakang) + blur kedalaman + kabut tipis.
- Bidang datar yang dimiringkan atau dibuka (kartu, dokumen, lapisan sel, diagram): CSS `perspective` + `rotateX/Y`.
- Atom, molekul, kisi, partikel: titik dan garis diproyeksikan manual dari koordinat 3D (kristal dari data CIF),
  bola dengan radial gradient, diurutkan menurut z. Boleh berputar penuh.
- Cahaya, glow, api, asap, kilau logam, distorsi panas: shader Skia (RuntimeEffect).
- Lab, mesin, alur proses: isometrik.
- Shot yang butuh 3D asli (benda padat rumit diorbit bebas, fly-through ke dalam benda kompleks): boleh dibuat dengan
  3D asli (Three.js). Pilih 3D hanya bila 2.5D tidak cukup; untuk shot lain tetap utamakan 2.5D dan shader.
- Komponen fake-3D yang dipakai ulang (`DepthPhoto`, `ParallaxStack`, `Projected3D`, `CardTilt`) dibuat sekali di
  engine dan dipakai lintas project dan channel.

## Aturan look + suara (dikunci, 2026-11-05, dari reel sadap-lims)
- Look = reel ori full-visual v2 / fullvisual_mod: LOW-KEY. Latar hampir hitam, key hangat + rim dingin, debu bokeh,
  vignette; warna hanya pada benda yang tersorot atau menyala. Bukan gelap rata (v1 sadap-lims), bukan dunia terang/krem
  (v2 lama). Caption `ground: dark`; kotak seleksi biru bawaan (jangan override `theme.marker`).
- Benda: material dan detail nyata dari referensi (ribuan detail kecil: jendela kota, LED rak, kisi), satu benda utama
  close-up. Tidak ada primitif polos yang terasa "geometrik". Model GLB CC0 (Poly Haven) boleh, label dilokalkan.
- Shader: `@remotion/skia` TIDAK terpasang di full-visual v2. Efek shader ditulis GLSL `ShaderMaterial` Three.js.
  Jangan EffectComposer + bloom di dunia terang (gambar pudar). Kit acuan: `sadap-lims/scenes/world.tsx`, `core.tsx`.
- plan.md: setiap beat punya kolom "kedalaman: how"; "the one big move" di treatment wajib dibangun, tidak diganti diam-diam.
- Suara: satu take utuh dengan setting yang sudah disetujui; JANGAN time-stretch atau menaikkan speed (karakter suara
  Ongky berubah). Durasi panjang diterima; padatkan lewat naskah, bukan tempo.
- Cover: didesain khusus (judul 2-3 baris + objek hook), semua elemen penting di crop 3:4 tengah.
- Cover (gaya judul AkuKatiga, dari cover karhutla-gambut, motor-goyang-bensin, randy-gardner): Montserrat 900
  kapital; satu baris putih + satu kata kunci besar warna aksen (oranye `#F88818`, atau merah `#F84838` untuk bahaya);
  bayangan hitam tebal + gradasi gelap di belakang teks; 2-4 kata per baris; teks di bawah, atau terbelah atas-bawah
  seperti cover motor. Contoh kode: `videos/sadap-lims/scratch/cover/Cover.tsx`.
- Referensi benda + material asli (judul berita, kutipan spesifikasi) di-fetch Haiku sebelum build; kartu berita yang
  memuat nama tersangka tidak dipakai.

## Pipeline template

Jalankan dari folder project-nya (path `engine/`, `workspace/` relatif ke root project).

# Full visual

A voice explains; the screen is the explanation. No face, no music, no hard cut: one concept, one thread object, and
objects handed from scene to scene, with the story moving inside the scenes (a dive into a mark, a window widening)
(`../03-treatment/treatment.md`, `../05-composition/camera-and-transitions.md`). The caption at the top says the sentence
one word at a time, and under it a short event plays: an actor in a real place, changing on the word that changes it.
A new picture arrives at least every 1.2 s.

**The bar for concept, staging, camera and transitions** is the seller's worked reels in `engine/full-visual/reels/`
(`distillation-us`, `hf-incident` with its hook `hf-hook-v5`, `distill-hook-v1`..`v5`, `chrome-fingerprinting-us`),
rendered with `node render.mjs <slug>`, and the study of how they are directed,
`workspace/projects/worked-reels/seller-study.md`. Watch them before starting and read their `plan.md` and scene
headers: they are things to look at, not descriptions to trust.

**The bar for finish, grade and photo look** is the reference study
`workspace/projects/2026-10-29-full-visual-bom-hidrogen/reference-study.md`; `check.py` measures it with
`scripts/targets.json`, calibrated on that video. `targets.json` is calibrated on a warm photo look, so a UI-led reel is
judged against a seller reel with `check.py compare` rather than failing on warm targets alone.

When the prompt names a project in `workspace/projects/`, read `../02-voice/workspace.md`
first and follow it.

## The brief

The agent directs; it does not illustrate. Each scene is a short event: an actor in a place, with something at stake,
and something happens to it on the trigger word. The reel is one story with setups and payoffs: a bomb falls toward an
island in the hook, and later the island vanishes in the same photo (`../05-composition/sentence-to-picture.md`,
`../03-treatment/treatment.md`).

The actors are real things, redrawn at their own geometry with their real copy, stripped to what the beat needs. The
viewer should be able to follow the whole argument with the sound
off, and should never see a frame where nothing is happening or a frame they cannot read on a phone. Sync is the
craft: a picture that lands a fifth of a second off its word is wrong, however good it looks.

The bars above are reels, for the craft. A physical thing a sentence is about (a machine, a part, a safety device, a
structure, a body part) has its own reference: the agent fetches it before drawing it, as it fetches a logo, looks at
it as a picture, measures it, and checks the drawing against it (`../04-assets/object-references.md`). Interfaces,
documents and logos keep the rules they have.

Before a reel, read `workspace/library/full-visual.preferences.md` and `workspace/library/full-visual/profile.json`
when they exist: the creator's saved look, voice and words (`/full-visual-customization` writes them). They dress the
format; they never change its method. With no profile the format runs exactly as written here.

## What never changes (the engine, `engine/full-visual/src/engine/`)

1. No presenter, no hard cut, no music. The camera moves only for a cause the viewer can see (a slam, a copy leaving,
   a dive into a mark), written in the scene (`../05-composition/camera-and-transitions.md`). A frame stays alive through
   its objects (breathing, blinking, flowing), never through constant drift, and never through zoom pulses on words.
   A punch-in is for a blast or impact the viewer sees, one or two per reel (minyak-air had 37 on key words, read as a
   stutter, and the creator cut them to 2). A failing motion check is fixed by moving objects, not the stage.
   The camera reframes about once per sentence, each move about 0.5 s (28-32 frames at 60 fps) eased, then holds; the
   pace between comes from objects changing (minyak-air r5 had 86 quick reframes and felt busy; r6 with 23 was approved). The caption band never moves. The voice
   is the only clock.
2. Three bands on one centre axis: caption y 300-500, stage y 520-1450, pinned chrome below, the last 220 px left to
   Instagram. `--guides` draws them on a still.
3. The caption is one word per spoken word. A word not yet said does not exist. Active word bold, full ink; said words
   regular, grey, in one frame; the new word resolves from blur in place; two lines at most; one key word per block in
   the selection box, which lands a few frames after its word.
4. A scene hands over only in a silence between sentences, with the next scene already arriving, so the ground is
   never bare. The engine places the handover; nobody authors a scene time. The handover is the plain lift, and the
   object it carries is already where the next scene picks it up (`HANDOFF`, `../03-treatment/treatment.md`). The move
   that carries the story (a dive, a server growing into a wall, a pull-back) happens inside the scene. `in: iris`,
   `zoom`, `flash`, `match` or `fade` in `caption.txt` is rare: at most two per reel, each with its reason in `plan.md`.
5. Interfaces are redrawn, never recorded: real geometry, real copy, only the parts the sentence needs, starting from a
   copied seller mockup (`../04-assets/mockups.md`). A physical object is drawn in code with material and moving
   parts, as the seller's machines are, or is a 2.5D picture: a plate behind and a cut-out with states on its own
   layer (`../04-assets/image-assets.md`). A historical moment may be a graded archive photo. Depth is 2.5D by layer, all
   layers on one camera function: the place in 2.5D planes (`matrix3d` onto the camera's projection), an object that
   turns as 3D points projected by hand and drawn in 2D, or a card tilted with CSS `perspective`, fire, smoke and steam
   as Skia shaders, droplets and labels in SVG in front. Real 3D and shaders are allowed on reels ("Aturan visual reels" above). Every picture is checked against fetched
   references. The change of state is done by code or a state image on top of it, on its word.
6. A number is never static: it counts, rolls or fills, and lands on its word.
7. A change of state happens to the object already on screen. It recolours, breaks, grows a row. It is not replaced.
8. The CTA is performed in the real Instagram interface: a cursor taps like, share and follow. Never a comment keyword,
   never a promised deliverable (a poster, a PDF) the creator has not made.

9. One palette and one finish per reel: warm split-toned shadows, vignette, grain, bloom only on what is hot
   (`reel.json` `theme.finish`). `check.py render` fails cold shadows and blown highlights.

What a reel may change lives in `src/theme.ts` and the reel's `reel.json`: fonts, grounds (always a dark range,
`../05-composition/taste.md`), marker style and colour, role colours, stage width, handover verb, finish, pinned chrome
(countdown pill, terminal, none).

## Commands (from `engine/full-visual/`, renders with the sandbox disabled)

```bash
node ../../scripts/py.mjs scripts/voice.py <slug> --audition id:label,...   # a synthetic voice: the creator picks from reels/<slug>/voices/
node ../../scripts/py.mjs scripts/voice.py <slug>                 # script.txt -> voice.mp3 + voice.alignment.json, whole take, never patched
node ../../scripts/py.mjs scripts/align.py <slug>                 # caption.txt + voice -> words.json
node ../../scripts/py.mjs scripts/check.py stage <slug> <n>       # the gate at the end of stage n (1-6)
node ../../scripts/py.mjs scripts/check.py plan <slug>            # before pixels
node render.mjs <slug> --stills 1.2,3.45,9      # look before rendering: reels/<slug>/stills/
node render.mjs <slug> --guides --stills 9      # bands + Instagram's zones drawn on
node render.mjs <slug> [--from s --to s]        # videos/<slug>/out/YYYY-MM-DD/NN-<slug>.mp4, 30 fps (--fps 60 for 60)
node render-remote.mjs <slug> [flags]           # the render itself: always on the VPS Labkom GPU (ssh labkm-vps), mp4 back in output/, job folder deleted after; local render only for stills
node ../../scripts/py.mjs scripts/check.py render <slug> <mp4>    # stills, bare handovers, and the targets.json numbers when calibrated
node ../../scripts/py.mjs scripts/check.py compare <slug> <mp4> --ref <ref.mp4>   # reels/<slug>/review/side-by-side.jpg + scorecard.md for the second reviewer
node ../../scripts/py.mjs scripts/check.py calibrate <ref.mp4>    # rewrite scripts/targets.json from a reference video
node ../../node_modules/typescript/bin/tsc --noEmit -p .           # types, before any render
```

At 30 fps `render.mjs` renders silent and lays `voice.mp3` under afterwards, because Remotion's `everyNthFrame`
squeezed the audio 2x (an 89 s voice came out 44.7 s).

A new reel: `reels/<slug>/` with `voice.*`, `caption.txt`, `reel.json`, `scenes/index.tsx` (scene id → component). It registers
itself: `reels/index.ts` finds every `reels/<slug>/scenes/index.tsx`. A scene with no component yet renders as caption over ground, which is how the caption is
judged first.

## What a scene is

A React component that reads `useScene()`: the current frame `f`, `cue("word")` (the frame that word starts, within
this scene; it throws if the word is not in the caption), `cueEnd`, `endsOn("word", dur)` (where a build of `dur`
frames must start to finish on the word), `scene.from`, the ground palette and the theme. It draws inside
`<Column>` and moves things with the kit in `src/engine/moves.ts` and `Motion.tsx`: `blurIn`, `pop`, `blurOut`,
`<Travel>`, `typeOn`, `countTo`, `jitter`, `stagger`, `mix`, `draw`, `<Cursor>`, plus a camera helper (`<Camera>`:
moves from cues, `drift={0}` unless a cause is named), photos and illustrations (`<Plate>`), cut-outs with states
(`<Cutout>`) and the finish (`theme.finish`) in `src/engine/`, and the Remotion packages installed for it:
`@remotion/effects` (colour correction, LUT, glow, light leak, lens and
zoom blur, noise, shatter...), `@remotion/transitions`, `@remotion/motion-blur`, `@remotion/noise`, `@remotion/paths`,
`@remotion/shapes`, `@remotion/lottie`, `@remotion/skia`, `@remotion/rough-notation`,
`Easing`, and `spring()`
(`../05-composition/motion-and-sync.md`; how layers share one camera: `../04-assets/three-d-look-and-plates.md` (2.5D parts and, for reels, its Three.js parts); when and how for Skia shaders, motion blur, paths, light leaks, rough notation,
easing and Lottie: `../05-composition/quality-boosts.md`). Every
motion is a start frame taken from a cue and a duration in frames, drawn only from `useCurrentFrame` (never
`useFrame`, `Math.random` or a clock). No timeline file, no seconds typed by hand.

The kit is verbs, not components: nothing in it has content. What a reel draws is written for that reel, starting from
a copied mockup (`../04-assets/mockups.md`).

Each reel has a `scenes/parts.tsx` that is its bible: `STAGE`, the palette by role, the bare `Logo`, the thread
component and the `HANDOFF` table. Each scene file opens with a header: the sentence, its first frame (the HANDOFF it
starts from), word → event, and its last frame (`distillation-us/scenes/Distill.tsx:2-8`).

## Aturan fetch (berlaku di skill ini)
Semua fetch (gambar referensi, logo, footage, jurnal, halaman web) dikerjakan subagent Haiku (`claude-haiku-5-5`) dengan brief minimal: apa yang dicari, sumber/URL kalau ada, folder tujuan, aturan nama file, lisensi. Jangan suruh Haiku membaca SKILL.md, AGENTS.md, CLAUDE.md, plan, atau reference lain. Dia cukup tahu apa yang dikerjakan saat itu; lapornya daftar file + sumber saja.
