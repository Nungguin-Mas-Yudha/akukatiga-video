# 4 — Assets

**Gerbang mesin**: `node ../../scripts/py.mjs scripts/check.py stage <slug> 4` — harus `exit 0`.

**Tahap wajib.** Tidak ada scene yang boleh ditulis sebelum tahap ini selesai. Lewat dari sini = kerja
dibatalkan, bukan dipercepat.

**Tujuan**: setiap objek yang disebut plan sudah punya file nyata di `assets/`, sumber, dan lisensi —
sebelum satu scene pun ditulis.
**Masuk**: `plans/plan.md` yang sudah disetujui. **Keluar**:
1. `plans/assets.md` — tabel wajib, satu baris per objek yang tampil:
   `objek | scene | jenis (plate/cut-out/ghost/logo/footage/kode) | file di assets/ | sumber | lisensi | status`
2. file nyatanya di `assets/` (nama menyebut objeknya: `plate-lab.jpg`, `tank-cutout.png`, `tank-ghost.png`),
3. `references.md` di root video untuk detail kandidat, cek rasio, dan label kejujuran.

**Gerbang** — semua harus benar, bukan sebagian:
- **Gerbang mesin** (kumulatif): `stage <slug> <n>` menjalankan tahap 1..n. Jadi `stage <slug> 5` gagal
  kalau aset belum ada, seberapa pun bagusnya scene-nya.
- Setiap baris `plans/assets.md` menunjuk file yang benar-benar ada. Baris tanpa file = tahap belum selesai.
- `assets/_source/` hanya referensi suasana: **tidak pernah** boleh jadi nilai kolom `file` di `assets.md`.
- Setiap scene di `words.json` punya baris di `assets.md`; scene yang benar-benar tanpa gambar ditulis
  `tanpa aset`. Scene tanpa baris = FAIL.
- Setiap objek punya baris lisensi **sebelum** digambar; lisensi yang tidak terbaca dihitung "tidak ada".
- Objek yang digambar di kode ikut terdaftar, dengan baris referensinya — bukan jalan pintas.
- Tidak ada gambar AI di layar (keputusan creator 2026-10-29); generasi hanya untuk referensi suasana di
  `assets/_source/`.

**Cara menyatakan selesai**: `node ../../scripts/py.mjs scripts/check.py stage <slug> 4` harus `exit 0`.
Perintah itu memeriksa tiap baris `plans/assets.md` terhadap isi `assets/`, jadi "sudah" tidak bisa diklaim.

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
Scene yang ternyata butuh objek di luar `plans/assets.md` berhenti dan kembali ke sini; menambah gambar di
tengah build tanpa baris di `assets.md` = pelanggaran gerbang.
