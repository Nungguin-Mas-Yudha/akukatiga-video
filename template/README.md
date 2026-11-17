# AkuKatiga

Channel edukasi **K3 (Keselamatan dan Kesehatan Kerja)** berbahasa Indonesia: studi kasus, regulasi industri, dan bedah insiden keselamatan kerja.

- **Landscape 16:9**: video YouTube panjang, investigasi mendalam satu kasus atau regulasi.
- **Reels/Shorts 9:16**: edukasi K3 singkat. Suara Ongky Himawan (ElevenLabs, Bahasa Indonesia), narasi saja tanpa musik/SFX, caption maksimal 2 baris, maskot tangan bulat APAR.

## Struktur standar

```
akukatiga/                    repo channel (parent)
├── package.json              satu npm untuk semua video (Remotion 4.0.540)
├── node_modules/             tidak di-commit
├── remotion.config.ts        override webpack Skia
├── engine/full-visual/       satu engine bersama (Stage, Caption, Camera, Plate, Stage3D, Finish, ...)
│   ├── registry.ts           menemukan videos/*/composition/index.tsx sendiri
│   ├── render.mjs  scripts/  render, align, voice, check
├── scripts/  .keyframes/  context/    toolkit runtime (doctor, intake, board, ...)
├── .claude/skills/  .agents/skills/   skill channel
├── workspace/output/         paket siap upload
├── videos/example/           kerangka kosong videos/<slug>/ (gitkeep saja, bukan video)
└── videos/<slug>/            satu folder per video (submodule bila sudah punya repo)
    ├── plans/  storyboard/{script,visual}/  assets/  compositions/{reels,landscape}/  out/final/  scratch/
    └── README.md  CHANNEL.md  PRODUCTION_GUIDELINES.md  HANDOFF-*.md
```

Video baru: buat `videos/<slug>/` dengan susunan di atas — salin bentuknya dari `videos/example/` —
lalu isi `plans/caption.txt` dan `plans/script.txt`, `npm run align -- <slug>`, dan render.
Semua perintah dari root channel; `git submodule update --init` untuk mengambil video yang sudah jadi submodule.

```bash
npm run studio -- <slug> [--format landscape|reels] [--port 3000]   # Remotion Studio untuk satu video
npm run studio                                                       # daftar slug yang bisa dibuka
node engine/full-visual/render.mjs <slug> --format reels --stills 2,20,60
node engine/full-visual/render.mjs <slug> --format reels
```

## Video

Submodule aktif ([`videos/`](videos/README.md)):

- [`bom-hidrogen`](videos/bom-hidrogen)
- [`fake-certificate`](videos/fake-certificate)
- [`karhutla-gambut`](videos/karhutla-gambut)
- [`cara-kerja-apar`](videos/cara-kerja-apar)
- [`mie-instan-seminggu`](videos/mie-instan-seminggu)
- [`tanpa-air-putih`](videos/tanpa-air-putih)
- [`minyak-air`](videos/minyak-air)
- [`motor-goyang-bensin`](videos/motor-goyang-bensin)
- [`penemuan-lampu`](videos/penemuan-lampu)
- [`randy-gardner`](videos/randy-gardner)
- [`sadap-lims`](videos/sadap-lims)
- [`sertifikat-k3-palsu`](videos/sertifikat-k3-palsu)
- [`what-if-jupiter`](videos/what-if-jupiter)
