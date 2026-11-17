# AkuKatiga starter

The AkuKatiga channel repo without the finished videos: engine, toolkit, the two channel skills, and an
empty folder skeleton for a new video.

## Read first

- `.agents/skills/akukatiga/SKILL.md` — the workflow: six stages, each linking its own folder.
- `.agents/skills/akukatiga/references/<NN-stage>/SKILL.md` — the step to do next; open one stage at a time.
- `videos/example/README.md` — the folder a new video copies, with the expected file names.
- `README.md` — channel overview, commands, standard structure.

If a document and a skill disagree, the skill wins.

## Structure a new video must have

```text
videos/<slug>/
├── plans/                 script.txt, caption.txt, plan.md, research.md, reel.json,
│                          words.json, voice.alignment.json, timeline-<format>.json
├── storyboard/
│   ├── script/            storyboard-<format>.md, script-<format>.md
│   └── visual/            board per format, or 01-<scene>.svg per scene
├── assets/                voice.mp3, photos/footage, glb/hdr/tex (flat)
├── compositions/
│   ├── reels/index.tsx    scene list, 9:16
│   └── landscape/index.tsx scene list, 16:9
├── scratch/               stills and experiments, local only
└── README.md
```

- Always name the format: `compositions/reels/` and/or `compositions/landscape/`, each with its own
  `index.tsx`. There is no flat `composition/`.
- `out/` is not created by hand: `render.mjs` writes `out/YYYY-MM-DD/NN-<slug>.mp4`, and `.mp4` is
  never committed.
- Do not invent `script/`, `scripts/`, `notes/`, `production/`, `utils/`, `src/`, `public/` inside a video.
- Folder and file names are English; prose can be Indonesian.

## Start

1. Copy the shape of `videos/example/` into `videos/<slug>/` (keep the empty folders, drop the placeholders).
2. `plans/script.txt` = narration read by voice.py; `plans/caption.txt` = on-screen caption.
3. `npm install`, then `npm run studio -- <slug>` to open the video in Remotion Studio.

## Not included

- Finished videos and their media — each lives in its own repo under `videos/`.
- `node_modules`, `dist`, `.keyframes`, `.env*`.
- Rendered files: `render.mjs` creates `out/` on demand.
