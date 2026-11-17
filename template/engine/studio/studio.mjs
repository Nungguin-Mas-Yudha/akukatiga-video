#!/usr/bin/env node
// studio/studio.mjs <slug> [--format landscape|reels] [--port 3000]
// Contract: opens Remotion Studio on one video's reel, with the same props render.mjs would use
//   (timeline, reel config, voice). The engine registers two compositions, so the slug cannot be picked
//   inside the Studio: it is chosen here, before the bundle is built.
//   No slug prints the videos that can open. The temp public folder and props file are removed on exit.
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, "..", "..");
const videosDir = join(root, "videos");
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const slug = args.find((a) => !a.startsWith("--"));
const format = opt("--format");

const playable = () => readdirSync(videosDir).filter((name) => ["composition", "compositions"].some((d) => existsSync(join(videosDir, name, d, "index.tsx"))));

if (!slug) {
  console.error("usage: node engine/studio/studio.mjs <slug> [--format landscape|reels] [--port 3000]\n\nvideos:\n  " + playable().join("\n  "));
  process.exit(1);
}
const videoDir = join(videosDir, slug);
if (!playable().includes(slug)) {
  console.error(`${slug} is not a video with composition/index.tsx or compositions/index.tsx\n\nvideos:\n  ${playable().join("\n  ")}`);
  process.exit(1);
}
if (format && !["landscape", "reels"].includes(format)) {
  console.error("--format must be landscape or reels");
  process.exit(1);
}

const reelDir = join(videoDir, "plans");
const assetsDir = join(videoDir, "assets");
const dataPath = join(reelDir, format ? `timeline-${format}.json` : "words.json");
if (!existsSync(dataPath)) {
  console.error(`missing ${dataPath}: run scripts/align.py or prepare the format timeline first`);
  process.exit(1);
}
const data = JSON.parse(readFileSync(dataPath, "utf8"));
const formatConfig = format ? join(reelDir, `reel-${format}.json`) : undefined;
const configPath = formatConfig && existsSync(formatConfig) ? formatConfig : join(reelDir, "reel.json");
const config = existsSync(configPath) ? JSON.parse(readFileSync(configPath, "utf8")) : {};

const voiceName = format ? `voice-${format}.mp3` : "voice.mp3";
const voice = existsSync(join(assetsDir, voiceName)) ? voiceName : existsSync(assetsDir) ? readdirSync(assetsDir).find((f) => /^voice\.(mp3|wav|m4a)$/.test(f)) : undefined;

// The bundler wants one public folder and the reel asks for <slug>/<file>, so mirror what render.mjs assembles:
// a temp folder of links to every assets/ folder the scenes mention.
const publicDir = mkdtempSync(join(tmpdir(), "fv-studio-"));
const sceneText = ["composition", "compositions"].flatMap((name) => {
  const sceneDir = join(videoDir, name);
  return existsSync(sceneDir)
    ? readdirSync(sceneDir, { recursive: true }).filter((f) => /\.tsx?$/.test(f)).map((f) => readFileSync(join(sceneDir, f), "utf8"))
    : [];
}).join("\n");
for (const name of readdirSync(videosDir)) {
  const assets = join(videosDir, name, "assets");
  if (!existsSync(assets) || !(name === slug || sceneText.includes(`${name}/`))) continue;
  symlinkSync(assets, join(publicDir, name), "dir");
}
const propsPath = join(publicDir, "props.json");
writeFileSync(propsPath, JSON.stringify({ slug, data, config, audio: voice ? `${slug}/${voice}` : null, guides: false, noCaption: false }));

// Remotion refuses to start without a tsconfig.json beside package.json; the engine keeps its own in engine/full-visual.
if (!existsSync(join(root, "tsconfig.json"))) console.warn("warning: no tsconfig.json at the channel root; Remotion Studio may refuse to start");

const port = opt("--port");
const child = spawn(join(root, "node_modules", ".bin", "remotion"), [
  "studio", join("engine", "full-visual", "src", "index.ts"),
  `--props=${propsPath}`, `--public-dir=${publicDir}`,
  ...(port ? [`--port=${port}`] : []),
], { cwd: root, stdio: "inherit" });
const cleanup = () => { try { rmSync(publicDir, { recursive: true, force: true }); } catch {} };
child.on("exit", (code) => { cleanup(); process.exit(code ?? 0); });
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => { child.kill(sig); cleanup(); process.exit(1); });
