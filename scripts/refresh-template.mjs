// Rebuilds ./template from a checkout of the channel repo. The template is committed here, so the
// published package needs no build step; this script only refreshes it when the channel changes.
//
//   node scripts/refresh-template.mjs --from "/path/to/akukatiga"

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = fileURLToPath(new URL(".", import.meta.url))
const template = join(here, "..", "template")

const args = process.argv.slice(2)
const fromIndex = args.indexOf("--from")
const root = fromIndex >= 0 ? resolve(args[fromIndex + 1] ?? "") : undefined
if (!root || !existsSync(join(root, "engine"))) {
  console.error(`usage: node scripts/refresh-template.mjs --from /path/to/akukatiga`)
  process.exit(1)
}

const FILES = ["README.md", "package.json", "package-lock.json", "remotion.config.ts", "tsconfig.json", "vite.config.ts", "index.html"]
const DIRS = [".agents", "engine", "scripts", "src"]

const START_HERE = `# AkuKatiga starter

The AkuKatiga channel repo without the finished videos: engine, toolkit, the two channel skills, and an
empty folder skeleton for a new video.

## Read first

- \`.agents/skills/akukatiga/SKILL.md\` — the workflow: six stages, each linking its own folder.
- \`.agents/skills/akukatiga/references/<NN-stage>/SKILL.md\` — the step to do next; open one stage at a time.
- \`videos/example/README.md\` — the folder a new video copies, with the expected file names.
- \`README.md\` — channel overview, commands, standard structure.

If a document and a skill disagree, the skill wins.

## Structure a new video must have

\`\`\`text
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
\`\`\`

- Always name the format: \`compositions/reels/\` and/or \`compositions/landscape/\`, each with its own\n  \`index.tsx\`. There is no flat \`composition/\`.
- \`out/\` is not created by hand: \`render.mjs\` writes \`out/YYYY-MM-DD/NN-<slug>.mp4\`, and \`.mp4\` is
  never committed.
- Do not invent \`script/\`, \`scripts/\`, \`notes/\`, \`production/\`, \`utils/\`, \`src/\`, \`public/\` inside a video.
- Folder and file names are English; prose can be Indonesian.

## Start

1. Copy the shape of \`videos/example/\` into \`videos/<slug>/\` (keep the empty folders, drop the placeholders).
2. \`plans/script.txt\` = narration read by voice.py; \`plans/caption.txt\` = on-screen caption.
3. \`npm install\`, then \`npm run studio -- <slug>\` to open the video in Remotion Studio.

## Not included

- Finished videos and their media — each lives in its own repo under \`videos/\`.
- \`node_modules\`, \`dist\`, \`.keyframes\`, \`.env*\`.
- Rendered files: \`render.mjs\` creates \`out/\` on demand.
`

rmSync(template, { recursive: true, force: true })
mkdirSync(template, { recursive: true })

// The channel checkout is a working tree, so it holds things the published package must never carry:
// Python bytecode from the check scripts, nested installs, and local build output.
const SKIP = new Set(["__pycache__", "node_modules", "dist", ".keyframes", ".git"])
const keep = (src) => !SKIP.has(src.split("/").pop()) && !src.endsWith(".pyc")

for (const name of FILES) {
  const src = join(root, name)
  if (!existsSync(src)) throw new Error(`${name} is missing at ${root}`)
  cpSync(src, join(template, name), { recursive: true })
}
for (const name of DIRS) {
  const src = join(root, name)
  if (!existsSync(src)) throw new Error(`${name}/ is missing at ${root}`)
  cpSync(src, join(template, name), { recursive: true, filter: keep })
}

// npm strips a file named .gitignore from the tarball; ship it as "gitignore" and let the installer
// rename it.
cpSync(join(root, ".gitignore"), join(template, "gitignore"))

mkdirSync(join(template, "videos"), { recursive: true })
cpSync(join(root, "videos", "example"), join(template, "videos", "example"), { recursive: true })
cpSync(join(root, "videos", "README.md"), join(template, "videos", "README.md"))
writeFileSync(join(template, "START-HERE.md"), START_HERE)

console.log(`template rebuilt from ${root}`)
