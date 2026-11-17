---
name: akukatiga
description: "Produksi video AkuKatiga (K3): workflow enam tahap untuk Reels 9:16 dan landscape 16:9, dari naskah sampai master. Aturan channel, aset, komposisi, dan serah-terima."
---

# AkuKatiga

Satu skill untuk channel ini. Entry point-nya **workflow**: cari tahap yang sedang dikerjakan, buka folder
tahap itu, dan baca `SKILL.md` di dalamnya. Jangan membaca semua tahap di awal.

## Dua format

| Format | Ukuran | Aturan channel |
|---|---|---|
| Reels / Shorts | 9:16, 1080×1920, timeline 60 fps, keluar 30 fps | [`references/format/reels.md`](references/format/reels.md) |
| Landscape | 16:9, film 18-25 menit | [`references/format/landscape.md`](references/format/landscape.md) · [tahap 16:9](references/format/landscape-workflow.md) |

Di mana aturan format dan aturan teknis bertentangan, aturan format menang.

## Workflow: satu folder satu tahap

| # | Tahap | Gerbang | Skill tahap |
|---|---|---|---|
| 1 | **Script** | naskah creator diterima apa adanya; jangan riset ulang isinya | [`references/01-script/SKILL.md`](references/01-script/SKILL.md) |
| 2 | **Voice + caption** | creator memilih suara; satu take utuh, jangan disambung; `check.py plan` lolos; semua baris `!` dari align selesai | [`references/02-voice/SKILL.md`](references/02-voice/SKILL.md) |
| 3 | **Treatment + plan** | creator menyetujui hook, treatment, dan plan **dalam kata** sebelum ada pixel; tiap beat punya aktor dan tempat | [`references/03-treatment/SKILL.md`](references/03-treatment/SKILL.md) |
| 4 | **Assets** | tiap objek yang tampil punya referensi + baris lisensi sebelum digambar; tidak ada scene mulai tanpa gambarnya; tidak ada gambar AI di layar | [`references/04-assets/SKILL.md`](references/04-assets/SKILL.md) |
| 5 | **Composition** | pass 1: 8-12 detik tersulit dulu, `check.py render` lolos, satu reviewer Opus, creator setuju. pass 2: sisanya, cek mesin per scene, kurasi di browser dengan suara, status `belum direview`/`revisi`/`disetujui` | [`references/05-composition/SKILL.md`](references/05-composition/SKILL.md) |
| 6 | **Sound + deliver** | loudness sekitar -14 LUFS, true peak maksimal -1 dBTP, kedua cek lolos pada file final; master per format, bukan crop | [`references/06-deliver/SKILL.md`](references/06-deliver/SKILL.md) |

Tiap `SKILL.md` tahap berisi tujuan, masukan/keluaran, gerbang, dan daftar file yang relevan untuk tahap itu
saja. File teknis yang dipakai beberapa tahap tinggal di folder tahap tempat ia pertama dipakai; jangan
menyalinnya ke tahap lain.

## Struktur project (wajib)

Satu video satu folder di `videos/<slug>/`. Jangan mengarang folder baru; ikuti `videos/example/`.

```text
videos/<slug>/
├── plans/          naskah & rencana: script.txt, caption.txt, plan.md, research.md,
│                   reel.json, voice.alignment.json, words.json, timeline-<format>.json
├── storyboard/
│   ├── script/     storyboard-<format>.md, script-<format>.md
│   └── visual/     board per format, atau 01-<scene>.svg per scene
├── assets/         media video ini = --public-dir: voice.mp3, foto, footage, aset 3D (datar)
├── compositions/   scene per format: reels/ dan landscape/, masing-masing punya index.tsx
├── scratch/        still, percobaan, cover — bukan hasil final
└── README.md       ringkasan video + perintah render
```

- Nama format wajib eksplisit: `compositions/reels/` dan/atau `compositions/landscape/`. Tidak ada
  `composition/` datar, termasuk untuk video satu format.
- Aset datar di `assets/`, tanpa subfolder per jenis.
- Helper khusus video: `parts.tsx` di folder formatnya; helper lintas video: `engine/`. Jangan bikin `utils/`.
- Tidak ada `script/`, `scripts/`, `notes/`, `production/`, `src/`, `public/` di dalam `videos/<slug>/`.
- `out/` dibuat sendiri oleh render; `.mp4` tidak di-commit.
- Entry `index.tsx` di tiap folder format yang mendaftarkan video ke studio/render.

## Aturan yang tidak boleh dilanggar

- **Reels**: suara Ongky Himawan (ElevenLabs ID), narasi SAJA — tanpa musik, SFX, ambience. Caption maksimal
  2 baris, tanpa em-dash. Maskot tangan bulat APAR. Detail: [`references/format/reels.md`](references/format/reels.md).
- **Landscape**: 16:9, 18-25 menit, sumber jurnal dicatat, sound room, thumbnail. Detail:
  [`references/format/landscape.md`](references/format/landscape.md).
- **Gambar**: setiap gambar yang tampil di-fetch atau digambar ulang dari referensi terukur. Tidak ada gambar
  AI di layar (keputusan creator 2026-10-29); generasi hanya untuk referensi suasana di `assets/_source/`.
- **Model**: Opus (effort MEDIUM) untuk semua kerja berpikir; Haiku 5.5 untuk fetch, unduh, alignment, render,
  qc-scan. Sonnet tidak dipakai.
- **Loudness**: -14 LUFS, true peak ≤ -1 dBTP, voice asli tidak diubah.
- **QC**: kurasi di browser dengan suara, bukan MP4 per scene. Master dirender setelah semua scene disetujui.
- **Fetch**: semua fetch dikerjakan subagent Haiku dengan brief minimal; laporkan daftar file + sumber saja.
