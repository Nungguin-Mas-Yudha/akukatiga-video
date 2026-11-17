# 2 — Voice + caption

**Tujuan**: satu take suara utuh, caption yang cocok dengan kata yang diucapkan, dan timing per kata.
**Masuk**: `plans/script.txt`. **Keluar**: `assets/voice.mp3`, `plans/voice.alignment.json`,
`plans/caption.txt`, `plans/words.json`.

**Gerbang**: creator memilih suara; satu take tidak boleh disambung atau ditambal — ubah naskah lalu
regenerasi utuh; `check.py plan <slug>` lolos; setiap baris `!` dari align diselesaikan.

**Baca di folder ini**

| File | Untuk |
|---|---|
| [`workspace.md`](workspace.md) | folder kerja, suara, caption, plan, scene, cek, render; perintah per tahap |

Format: [`../format/reels.md`](../format/reels.md) (Ongky Himawan, narasi saja, caption maks 2 baris) ·
[`../format/landscape.md`](../format/landscape.md) (satu take per bab)

**Perintah** (dari root channel)

```bash
# ElevenLabs, satu take utuh
node ../../scripts/py.mjs scripts/voice.py <slug>
# Provider lain
node scripts/narrate.mjs --root ../.. --config reels/<slug>/voice.json \
  --text-file reels/<slug>/script.txt --out reels/<slug>/voice.mp3
# caption.txt + voice -> words.json
node ../../scripts/py.mjs scripts/align.py <slug>
# gerbang
node ../../scripts/py.mjs scripts/check.py plan <slug>
```
