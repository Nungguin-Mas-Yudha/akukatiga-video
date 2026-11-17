# 5 — Composition

**Gerbang mesin**: `node ../../scripts/py.mjs scripts/check.py stage <slug> 5` — harus `exit 0`.

**Prasyarat wajib** — cek dulu, jangan langsung menulis scene:
1. `plans/assets.md` ada.
2. Setiap barisnya punya file di `assets/` (cek dengan `ls assets/`).
3. Objek di scene yang akan dibangun ada di daftar itu.

Kalau salah satu tidak terpenuhi: **berhenti**, balik ke tahap 4, jangan menulis scene. Tidak ada
pengecualian untuk objek yang "nanti digambar di kode" — objek kode tetap harus terdaftar di
`plans/assets.md` dengan referensinya.

Sudah terlanjur ada scene tapi `plans/assets.md` tidak ada atau `assets/` cuma berisi `_source/`? Itu bukan
kemajuan, itu tahap 4 yang dilewati. Jalankan `check.py stage <slug> 5`: gerbangnya kumulatif dan akan
menunjuk tahap 4. Kumpulkan objeknya dulu; scene yang sudah ada tinggal menunggu, tidak perlu dihapus.

**Tujuan**: scene ditulis ke folder formatnya, dengan aset dari tahap 4 dan timing dari `words.json`.
**Masuk**: `assets/`, `plans/assets.md`, `plans/plan.md`. **Keluar**: `compositions/reels/` dan/atau
`compositions/landscape/`, tiap folder punya `index.tsx` + satu file per scene.

**Gerbang**
- Pass 1: 8-12 detik tersulit dibangun dulu, sendirian, sekaligus jadi styleframe. Tiap objek diletakkan
  di samping referensinya; `check.py render` lolos; satu reviewer Opus yang tidak membangunnya membaca `check.py compare`, FAIL saja; creator
  setuju. Belum ada scene lain sebelum ini diterima.
- Pass 2: sisanya, satu builder per scene. Cek mesin per scene, kurasi di browser dengan suara, tiap scene
  ditandai `belum direview` / `revisi` / `disetujui`. Tidak ada MP4 per scene. Satu reviewer gabungan
  setelah draft penuh; putaran 2 hanya scene yang berubah.

**Baca di folder ini**

| File | Untuk |
|---|---|
| [`sentence-to-picture.md`](sentence-to-picture.md) | kalimat → satu gambar yang bisa digambar |
| [`motion-and-sync.md`](motion-and-sync.md) | gerak yang mendarat di kata yang menyebutnya |
| [`camera-and-transitions.md`](camera-and-transitions.md) | angle, sebab gerak kamera, transisi di dalam scene |
| [`depth-and-particles.md`](depth-and-particles.md) | kedalaman palsu: layer, parallax, partikel |
| [`shot-recipes.md`](shot-recipes.md) | resep shot yang sudah terbukti |
| [`pace-and-structure.md`](pace-and-structure.md) | tempo 16:9: gambar baru tiap 3-6 detik |
| [`look-and-frame.md`](look-and-frame.md) | look, grade, frame 16:9 |
| [`storytelling.md`](storytelling.md) | cerita panjang: bab, pertanyaan retensi |
| [`storyboard-and-qc.md`](storyboard-and-qc.md) | papan, director tests, kurasi, QC mesin |
| [`taste.md`](taste.md) | bar rasa channel dan referensi yang dipakai |
| [`quality-boosts.md`](quality-boosts.md) | penambah kualitas yang murah |

Format: [`../format/reels.md`](../format/reels.md) · [`../format/landscape.md`](../format/landscape.md) ·
[tahap 16:9](../format/landscape-workflow.md)
