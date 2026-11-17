# @akukatiga/video

Toolkit channel AkuKatiga: engine Remotion, skill channel, toolkit skrip, dan kerangka folder video.

```bash
npx @akukatiga/video --install          # pasang toolkit di folder ini
npx @akukatiga/video --install my-dir   # atau di folder lain
npx @akukatiga/video --new my-video     # buat videos/my-video dari videos/example
```

Kalau registry belum memuat versi terbaru, pakai repo ini langsung:

```bash
npx --yes --allow-remote=all --package github:Nungguin-Mas-Yudha/akukatiga-video video --install
```

## `--install`

Menulis isi repo channel tanpa video jadi: `README.md`, `START-HERE.md`, `package.json`,
`package-lock.json`, `remotion.config.ts`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/`,
`engine/`, `scripts/`, `.agents/skills/`, dan `videos/example/`.

- Folder tujuan harus kosong, kecuali `--force`.
- `package.json` yang sudah ada tidak ditimpa: script dan dependency yang belum ada saja yang ditambah.
- Setelah menyalin, `npm install` dijalankan. Lewati dengan `--no-deps`.

## `--new <slug>`

Menyalin bentuk `videos/example/` menjadi `videos/<slug>/`, membuang `.gitkeep`, dan menulis README
video yang sudah memuat slug-nya. Slug huruf kecil, `kebab-case`, tanpa tanggal.

## Isi repo

- `bin/`, `lib/` — CLI tanpa dependency.
- `template/` — isi yang disalin `--install`, dibangun dari repo channel `akukatiga`.
- `scripts/refresh-template.mjs` — menyegarkan `template/` dari checkout repo channel:
  ```bash
  node scripts/refresh-template.mjs --from "/path/ke/akukatiga"
  ```

`npm publish` menerbitkan paket ini apa adanya; tidak ada build step.
