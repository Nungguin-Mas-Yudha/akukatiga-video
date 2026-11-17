# Asset pipeline (the `cara-kerja-apar` standard)

Video yang hasilnya bagus bukan yang scene-nya paling rapi — yang asetnya sudah matang sebelum satu
scene ditulis. `cara-kerja-apar` jadi acuan: 12 MB aset (8 GLB, 1 HDR studio, 9 tekstur PNG) dibangun
dulu, baru 46 scene memakainya.

## Urutan yang terbukti

1. **Inventaris objek dari plan.** Tiap beat menyebut objek yang tampil. Kumpulkan jadi daftar; daftar itu
   yang mengisi `plans/assets.md`.
2. **Pilih cara membangun per objek**

   | Objek | Cara | Keluaran |
   |---|---|---|
   | benda yang berputar, terpotong, atau punya bagian di kedalaman | 3D asli | `<benda>.glb` + `tex-<benda>.png` |
   | benda datar yang dilihat satu sisi | cut-out / plate | `<benda>-cutout.png`, `plate-<tempat>.jpg` |
   | benda yang bergerak bagiannya di dalam scene | kode di folder format | baris `(kode)` di `assets.md` + referensi |
   | suasana, cahaya | HDRI / plate gelap | `studio-lowkey.hdr` |

3. **Bangun dengan generator, bukan tangan.** `cara-kerja-apar` menyimpan `assets/_source/build_assets.mjs`
   yang menghasilkan GLB prosedural, HDR, dan tekstur PBR sekaligus — bisa dijalankan ulang, ukurannya
   terdokumentasi, dan tidak ada langkah manual yang terlupa. Generator tinggal di `assets/_source/`,
   bukan folder `scripts/` (yang dilarang di dalam video).
4. **Beri nama sesuai objeknya**, datar di `assets/`: `apar-tank.glb`, `co2-cutaway.glb`,
   `tex-gauge-dial.png`. Tanpa subfolder per jenis.
5. **Kontak sheet.** Satu gambar `assets/_sheet.jpg` berisi semua aset dengan label nama file. Ini
   artefak visual tahap 4 — satu-satunya cara creator bisa menyetujui aset tanpa membuka folder.
6. **Creator melihat sheet sebelum scene pertama.** Setelah disetujui, barulah composition.

## Membuat kontak sheet

```bash
cd videos/<slug>
# semua gambar, satu grid dengan nama file
magick montage assets/*.png assets/*.jpg -label '%f' -tile 6x -geometry 240x240+8+8 \
  -background '#101317' -fill white -pointsize 14 assets/_sheet.jpg
# GLB tidak bisa di-montage: render thumbnail-nya dulu, atau tulis baris teks "8 glb: apar-tank, …" di sheet
```

Tanpa ImageMagick, `ffmpeg` juga cukup untuk gambar; untuk GLB pakai thumbnail dari `--stills` scene yang
memakainya. Yang penting: satu file yang bisa dibuka creator.

## Aturan yang tidak berubah

- Tidak ada gambar AI di layar. Generasi hanya untuk referensi suasana di `assets/_source/`.
- `assets/_source/` bukan aset layar: tidak boleh jadi nilai kolom `file` di `plans/assets.md`.
- Aset yang tidak dipakai scene jangan ditaruh di `assets/`; simpan di `_source/` kalau masih referensi.
- Scene yang butuh objek baru setelah tahap 4 selesai: berhenti, tambah baris di `assets.md`, bangun
  asetnya, baru lanjut. Jangan menggambar objek dadakan di tengah build.
