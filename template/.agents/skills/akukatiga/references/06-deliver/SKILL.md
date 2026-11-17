# 6 — Sound + deliver

**Tujuan**: satu master per format yang sudah dinormalisasi, plus caption dan cover untuk unggah.
**Masuk**: semua scene `disetujui`. **Keluar**: `out/YYYY-MM-DD/NN-<slug>.mp4`, `caption.txt`,
`cover.jpg`, disalin ke `workspace/output/<folder>/`; untuk 16:9 ditambah thumbnail dan description.

**Gerbang**: loudness sekitar -14 LUFS, true peak maksimal -1 dBTP, kedua cek lolos pada file final; master
per format, bukan crop; setiap kredit lisensi yang diminta ada di caption/description; tidak ada hashtag
atau em-dash.

**Baca di folder ini**

| File | Untuk |
|---|---|
| [`delivery.md`](delivery.md) | paket akhir 16:9: encode, cek, penamaan, kredit |
| [`sound.md`](sound.md) | suara 16:9: voice, musik berlisensi, satu efek sesekali |
| [`sound-room.md`](sound-room.md) | penempatan musik dan efek per bab |
| [`thumbnails.md`](thumbnails.md) | tiga konsep thumbnail 16:9 |

Format: [`../format/reels.md`](../format/reels.md) (narasi saja, tanpa musik/SFX) ·
[`../format/landscape.md`](../format/landscape.md)

**Perintah** (dari root channel)

```bash
node render.mjs <slug>
# -> engine/full-visual/output/YYYY-MM-DD/NN-<slug>.mp4
# salin ke workspace/output/<folder>/ bersama caption.txt dan cover.jpg
```
