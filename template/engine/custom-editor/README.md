# Editor

QC per scene. Pemutarnya `@remotion/player` dengan komponen `engine/full-visual/src/Reel.tsx`, sama seperti
`render.mjs`, dan props dari `videos/<slug>/plans/`. Tidak ada salinan scene di folder ini.

```bash
npm run dev                    # editor, http://localhost:3000 (entry AI Studio)
npm run custom-editor          # editor di port 3400
npm run studio -- <slug>       # Remotion Studio bawaan, satu video
```

UI memakai Astryx (`@astryxdesign/core`) dengan tema abu-abu netral dari theme-neutral, jadi fontnya sama
dengan proyek Dua Naga ERP: Figtree untuk semua teks, angka pakai tabular numerals. Warna di layar hanya
datang dari video.

Isi layar:

- sidebar: brand, daftar video, footer berisi jumlah scene, fps, dan durasi. Di bawah 980px daftar berubah
  jadi satu baris dengan dropdown.
- panel konten (satu kartu membulat): header berisi judul video + scene aktif, player, scrubber, tombol
  putar/lompat/mute/guides/caption, lalu rail scene dengan rentang detik. Klik baris scene untuk lompat.

Editor tidak merender MP4 (itu `engine/full-visual/render.mjs`) dan tidak menjalankan check
(`npm run check -- plan <slug>`).

Catatan teknis:

- `src/registry.vite.ts` menggantikan `engine/full-visual/registry.ts` (yang memakai `require.context` milik
  webpack) dengan `import.meta.glob`.
- Editor hanya menampilkan format yang timeline-nya lengkap (`scenes`, `blocks`, `words`, `silences`).
- `vite.config.ts` di root menyajikan `videos/<slug>/assets` sebagai `/<slug>/<file>` (MIME `.glb`/`.hdr`,
  byte range) plus `__reel-assets.json`.
- Player baru dipasang setelah font Figtree siap. Caption mengukur teks dengan `validateFontIsLoaded`, dan
  `document.body` sengaja memakai font sistem: pengukuran fallback Remotion menempelkan span ke body, jadi
  body ber-Figtree membuat pengecekan itu salah tuduh.
