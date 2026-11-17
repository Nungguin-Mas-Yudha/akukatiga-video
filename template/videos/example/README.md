# Contoh struktur folder video

Folder ini **bukan video**. Isinya kerangka `videos/<slug>/` tanpa naskah, tanpa media, tanpa scene:
setiap folder cuma punya `.gitkeep` supaya bentuknya ikut ter-commit dan bisa dilihat langsung.

Aturan yang mengikat ada di satu skill channel: [`akukatiga`](../../.agents/skills/akukatiga/SKILL.md),
mulai dari workflow enam tahapnya. Kalau isi folder ini berbeda dengan skill, ikuti skill.

## Bentuk folder

```text
videos/<slug>/
├── plans/                    kata & rencana
├── storyboard/
│   ├── script/               bentuk tulisan: storyboard-reels.md, storyboard-landscape.md
│   └── visual/               bentuk gambar: board per format, atau satu SVG/PNG per scene
├── assets/                   media yang dipakai Remotion (--public-dir)
├── compositions/
│   ├── reels/                scene 9:16: index.tsx + 01.hook.tsx, 02.….tsx
│   └── landscape/            scene 16:9: index.tsx + 01.hook.tsx, 02.….tsx
├── scratch/                  still & percobaan (lokal, tidak di-commit)
└── README.md                 ringkasan video + perintah render
```

Storyboard punya dua bentuk dan boleh punya keduanya: `script/` yang dibaca seperti naskah
(adegan, aksi, dialog, durasi) dan `visual/` yang dilihat seperti papan (gambar per scene).
Isi yang satu tidak menggantikan yang lain.

## Nama file yang diharapkan

| Folder | File | Isi |
|---|---|---|
| `plans/` | `script.txt` | naskah final yang dibacakan |
| | `caption.txt` | caption upload, maksimal 2 baris |
| | `plan.md` | rencana visual beat per beat |
| | `research.md` | sumber, angka, dan temuannya |
| | `reel.json` | durasi, fps, format, audio |
| | `words.json` | kata + timing untuk caption |
| | `voice.alignment.json` | hasil `npm run align`, kata per frame |
| `storyboard/script/` | `storyboard-reels.md`, `storyboard-landscape.md` | papan dalam bentuk tulisan, satu file per format |
| `storyboard/visual/` | `storyboard-reels.svg`, `storyboard-landscape.svg` | board ringkas, satu gambar per format |
| | `01-<scene>.svg` | atau satu gambar per scene, nomor sama dengan scene |
| `assets/` | `voice.mp3` | narasi (dua format: `voice-reels.mp3`, `voice-landscape.mp3`) |
| | foto / footage | media yang dipakai scene |
| | `<benda>.glb`, `<benda>.hdr`, `tex-<benda>.png` | hanya untuk 3D/hybrid |
| `compositions/reels/` | `index.tsx` | **wajib**: daftar scene reels; dari sini video terdaftar |
| | `01.<scene>.tsx` | satu file per scene, berurutan |
| `compositions/landscape/` | `index.tsx` | **wajib**: daftar scene landscape |
| | `01.<scene>.tsx` | satu file per scene, berurutan |
| `compositions/<format>/` | `parts.tsx` | helper angka; `world.tsx` + `core.tsx` hanya untuk 3D/hybrid |
| `scratch/` | bebas | still, percobaan, cover |

## Varian yang diizinkan

- **Dua format** (reels + landscape, kasus biasa): `compositions/reels/` dan `compositions/landscape/`,
  masing-masing punya `index.tsx` sendiri.
- **Satu format**: tetap sebut namanya — `compositions/reels/` saja atau `compositions/landscape/` saja,
  dengan `index.tsx` di dalamnya. Tidak ada `composition/` datar.
- **3D/hybrid**: tambah `world.tsx` dan `core.tsx` di dalam folder format yang dipakai; scene tetap tipis.

`out/` tidak disiapkan di kerangka ini: `render.mjs` membuat `out/YYYY-MM-DD/NN-<slug>.mp4` sendiri, dan
file `.mp4` tidak di-commit.

Video lama ada yang menaruh `storyboard.md` langsung di `storyboard/` dan `_source/` di `assets/`; itu
bentuk lama, bukan contoh untuk video baru.

Kalau satu format punya dua dokumen tertulis, taruh keduanya di `storyboard/script/`: pementasan
`storyboard-<format>.md` dan naskah per scene `script-<format>.md`.

## Yang tidak boleh muncul

`videos/<slug>/composition/`, `videos/<slug>/script/`, `videos/<slug>/scripts/`, `notes/`, `production/`, `utils/`, `src/`, `public/`, `assets/models/`, `assets/textures/`.
