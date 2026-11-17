// videos/<slug> starts as a copy of videos/example: same folders, no placeholders, and a README that
// already knows the slug.

import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function createVideo({ root, slug }) {
  if (!SLUG.test(slug)) {
    throw new Error(`slug must be lowercase kebab-case, no dates: "${slug}"`)
  }

  const example = join(root, "videos", "example")
  if (!existsSync(example) || !statSync(example).isDirectory()) {
    throw new Error("videos/example not found: run --install first")
  }

  const dest = join(root, "videos", slug)
  if (existsSync(dest)) throw new Error(`videos/${slug} already exists`)

  cpSync(example, dest, { recursive: true })
  removePlaceholders(dest)
  writeFileSync(join(dest, "README.md"), videoReadme(slug))

  return dest
}

function removePlaceholders(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) removePlaceholders(path)
    else if (name === ".gitkeep") rmSync(path)
  }
}

function videoReadme(slug) {
  return `# ${slug}

Reels AkuKatiga. Engine, npm, dan skrip ada di root channel; folder ini hanya berisi video.

- \`plans/\` — naskah (\`script.txt\`), caption (\`caption.txt\`), \`plan.md\`, riset, \`reel.json\`,
  \`words.json\`, alignment, timeline.
- \`storyboard/script/\` — papan tertulis; \`storyboard/visual/\` — papan gambar.
- \`assets/\` — aset runtime + \`voice.mp3\`. \`compositions/\` — scene reels dan landscape.
- \`scratch/\` — percobaan dan still tinjauan. \`out/\` dibuat sendiri oleh render.

## Perintah (dari root channel)

\`\`\`bash
npm run studio -- ${slug}                     # Remotion Studio
node engine/full-visual/render.mjs ${slug} --stills 2,20,60
node engine/full-visual/render.mjs ${slug}
\`\`\`
`
}
