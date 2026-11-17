# 4 — Assets

**Tujuan**: setiap gambar yang dibutuhkan plan sudah ada, berlisensi jelas, dan tersimpan datar di
`assets/` — sebelum satu scene pun ditulis.
**Masuk**: `plans/plan.md` yang sudah disetujui. **Keluar**: referensi + baris lisensi di `references.md`,
plate, cut-out, ghost view, logo, footage, atau objek kode yang memang harus bergerak.

**Gerbang**: tidak ada scene mulai tanpa gambarnya; setiap objek yang tampil punya referensi dan baris
lisensi sebelum digambar; nama file menyebut objeknya (`plate-lab.jpg`, `tank-cutout.png`,
`tank-ghost.png`); tidak ada gambar AI di layar (keputusan creator 2026-10-29) — generasi hanya untuk
referensi suasana di `assets/_source/`.

**Baca di folder ini**

| File | Untuk |
|---|---|
| [`image-assets.md`](image-assets.md) | plate, cut-out, states, dari mana gambar datang, aturan lisensi |
| [`object-references.md`](object-references.md) | cara mengambil, mengukur, dan mencatat referensi objek |
| [`three-d-look-and-plates.md`](three-d-look-and-plates.md) | kapan gambar datar, kapan 3D asli, kapan hybrid |
| [`mockups.md`](mockups.md) | objek yang harus bergerak bagiannya: digambar di kode |
| [`footage-and-fair-use.md`](footage-and-fair-use.md) | footage, kutipan, dan batas fair use |
| [`references-template.md`](references-template.md) | bentuk `references.md` per video |

Format: [`../format/reels.md`](../format/reels.md) · [`../format/landscape.md`](../format/landscape.md)

Logo dan footage diambil lewat `scripts/logos.mjs` dan `scripts/footage.mjs`, bukan dicari manual di shell.

Assets dan composition dua tahap terpisah: tahap ini mengumpulkan gambar, tahap 5 menaruhnya di timeline.
Scene yang ternyata butuh gambar baru berhenti dan kembali ke sini, tidak mencomot gambar di tengah build.
