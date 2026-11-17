# Assets (wajib, sebelum satu scene pun ditulis)

Satu baris per objek yang tampil. Baris yang file-nya tidak ada = tahap 4 belum selesai.
Detail kandidat, cek rasio, dan label kejujuran masuk `../../references.md`.

| objek | scene | jenis | file | sumber | lisensi | status |
|---|---|---|---|---|---|---|
| | | | | | | |

- `jenis`: `plate`, `cut-out`, `ghost`, `logo`, `footage`, atau `kode`.
- `file`: nama file di `assets/`; objek yang dibangun di kode isi `(kode)`.
- `sumber`: URL, dokumen + halaman, atau catatan referensi untuk objek kode.
- `lisensi`: seperti yang tertulis di sumber; `tidak diketahui` kalau tidak terbaca.
- Scene tanpa gambar sama sekali: satu baris dengan `objek` = `tanpa aset`.
- `assets/_source/` hanya referensi suasana. Tidak pernah boleh masuk kolom `file`.

Gerbang: `node ../../scripts/py.mjs scripts/check.py stage <slug> 4` harus `exit 0`.
