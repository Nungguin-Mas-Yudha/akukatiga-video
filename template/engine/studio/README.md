# Studio

Peluncur **Remotion Studio bawaan** (bukan app kita): menyusun props satu video dari `videos/<slug>/plans/`
lalu menjalankan `remotion studio engine/full-visual/src/index.ts`.

```bash
node engine/studio/studio.mjs <slug> [--format landscape|reels] [--port 3000]
node engine/studio/studio.mjs        # daftar slug yang bisa dibuka
```

Tidak ada kode tampilan di sini; semua UI milik Remotion. Untuk editor buatan kita (QC per scene), lihat `../editor/`.
