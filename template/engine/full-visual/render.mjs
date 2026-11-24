// Render a reel, or look at it first.
//   node render.mjs <slug>                          -> videos/<slug>/out/YYYY-MM-DD/NN-<slug>.mp4
//   node render.mjs <slug> --stills 1.2,3.45,9      -> videos/<slug>/scratch/stills/t_001.20.png ... (seconds)
//   node render.mjs <slug> --guides --stills 3      -> with the bands and Instagram's zones drawn on
//   node render.mjs <slug> --from 4 --to 9          -> only that stretch
//   node render.mjs <slug> --gl vulkan              -> WebGL scenes (three.js hooks) on this Linux GPU (AMD RADV)
//   node render.mjs <slug> --gl angle               -> WebGL scenes on Windows; on this headless Linux box ANGLE cannot make a context
//   node render.mjs <slug> --gl swangle             -> software WebGL fallback (no GPU, CI/VPS), ~30-50x slower
//   node render.mjs <slug> --no-caption             -> without the top word caption (format 1 only; default keeps it)
// A reel whose reel.json says "format": 2 renders on the format-2 engine (src/v2, composition FullVisual2).
// Run with the sandbox disabled (Remotion's Chrome).
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

let enableSkia = (c) => c;
try {
  ({ enableSkia } = await import("@remotion/skia/enable"));
} catch {}
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const slug = args[0];
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const format = opt("--format");
// A video is ../../videos/<slug>/: plans/ (caption, script, reel.json, words.json), assets/ (voice + media), src/ (scenes).
const videosDir = path.join(dir, "..", "..", "videos");
const videoDir = path.join(videosDir, slug ?? "");
const reelDir = path.join(videoDir, "plans");
const assetsDir = path.join(videoDir, "assets");
if (format && !["landscape", "reels"].includes(format)) {
  console.error("--format must be landscape or reels");
  process.exit(1);
}
const dataPath = path.join(reelDir, format ? `timeline-${format}.json` : "words.json");
if (!slug || !fs.existsSync(dataPath)) {
  console.error(`usage: node render.mjs <slug> [--format landscape|reels] [--stills s,s,s] [--guides] [--from s --to s] [--out path]\n(needs ${path.relative(dir, dataPath)}: run scripts/align.py or prepare the format timeline first)`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
const formatConfig = format ? path.join(reelDir, `reel-${format}.json`) : undefined;
const configPath = formatConfig && fs.existsSync(formatConfig) ? formatConfig : path.join(reelDir, "reel.json");
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, "utf-8")) : {};

const voiceName = format ? `voice-${format}.mp3` : "voice.mp3";
const voice = fs.existsSync(path.join(assetsDir, voiceName)) ? voiceName : fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir).find((f) => /^voice\.(mp3|wav|m4a)$/.test(f)) : undefined;

// format 2 (reel.json "format": 2) renders on src/v2 (FullVisual2) with its character and the voice's loudness
const v2 = false;   // format 2 does not ship in this folder
const inputProps = { slug, data, config, audio: voice ? `${slug}/${voice}` : null, guides: args.includes("--guides"), noCaption: args.includes("--no-caption"), };
const browserExecutable = process.env.CHROME || undefined;   // Remotion fetches its own browser for this system

function outputPath() {
  if (opt("--out")) return path.resolve(opt("--out"));
  const day = new Date().toLocaleDateString("en-CA");
  const outDir = path.join(videoDir, "out", day);
  fs.mkdirSync(outDir, { recursive: true });
  const stem = `${slug}${format ? `-${format}` : ""}.mp4`;
  const mine = fs.readdirSync(outDir).find((f) => f.replace(/^\d+-/, "") === stem);
  if (mine) return path.join(outDir, mine);
  const n = new Set(fs.readdirSync(outDir).map((f) => f.slice(0, 2))).size + 1;
  return path.join(outDir, `${String(n).padStart(2, "0")}-${stem}`);
}

// At most FV_RENDER_SLOTS renders at once on this machine: each one is a webpack bundle (~1.1 GB of node)
// plus Chrome, and 13 to 16 at once on 16 GB froze the Mac into a kernel panic (four times, 9-10 Oct 2026). The others wait.
const slotDir = path.join((await import("os")).tmpdir(), "fv-render-slots");
fs.mkdirSync(slotDir, { recursive: true });
// Default 1 since 11 Oct 2026: three workflows build at once, and their agents and tsc runs already take most of the 16 GB.
const slots = Math.max(1, Number(process.env.FV_RENDER_SLOTS ?? 1));
let slot = null;
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === "EPERM"; } };
for (let waited = 0; !slot; waited++) {
  for (let i = 0; i < slots && !slot; i++) {
    const f = path.join(slotDir, `${i}.lock`);
    try { fs.writeFileSync(f, String(process.pid), { flag: "wx" }); slot = f; } catch {
      // a lock whose process died (a crash, a kill -9) is free again
      try { if (!alive(Number(fs.readFileSync(f, "utf-8")))) fs.rmSync(f, { force: true }); } catch {}
    }
  }
  if (!slot) {
    if (waited === 0) console.error(`waiting for a render slot (${slots} at once)...`);
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
  }
}
process.on("exit", () => { try { fs.rmSync(slot, { force: true }); } catch {} });

// The bundler wants one public/ folder: assemble a temporary one with videos/<slug>/assets/ as public/<slug>/ (folders
// starting with "_" are working material and stay out), plus the assets of any other video whose "<name>/" the scenes mention.
const publicDir = fs.mkdtempSync(path.join((await import("os")).tmpdir(), "fv-public-"));
{
  const sceneDirs = ["composition", "compositions"].map((name) => path.join(videoDir, name));
  const sceneText = [...sceneDirs, path.join(dir, "src")].flatMap((d) => fs.existsSync(d)
    ? fs.readdirSync(d, { recursive: true }).filter((f) => /\.tsx?$/.test(f)).map((f) => fs.readFileSync(path.join(d, f), "utf-8")) : []).join("\n");
  for (const name of fs.readdirSync(videosDir)) {
    const a = path.join(videosDir, name, "assets");
    if (!fs.existsSync(a) || !(name === slug || sceneText.includes(`${name}/`))) continue;
    fs.cpSync(a, path.join(publicDir, name), { recursive: true, filter: (src) => !path.basename(src).startsWith("_") });
  }
}
// each bundle copies public/ into the tmp dir: delete it on exit (also when the bundle fails), or parallel builders fill the disk
let serveUrl = null;
const cleanup = () => {
  for (const p of [serveUrl, publicDir])
    if (p) try { fs.rmSync(p, { recursive: true, force: true }); } catch {}
};
process.on("exit", cleanup);
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => { cleanup(); process.exit(1); });
// FV_NO_CACHE=1 skips webpack's disk cache (it grows by about 1 GB a bundle in creator-dev/node_modules/.cache)
serveUrl = await bundle({ entryPoint: path.join(dir, "src/index.ts"), publicDir, enableCaching: !process.env.FV_NO_CACHE, webpackOverride: (c) => {
  const sk = enableSkia(c);
  // Skia's web build imports react-native; the browser bundle gets react-native-web instead
  return { ...sk, resolve: { ...sk.resolve, alias: { ...sk.resolve.alias, "react-native$": "react-native-web" } } };
} });
const glOpts = opt("--gl") ? { chromiumOptions: { gl: opt("--gl") } } : {};
const composition = await selectComposition({ serveUrl, id: config.theme?.layout === "film" ? "FullVisualFilm" : v2 ? "FullVisual2" : "FullVisual", inputProps, browserExecutable, ...glOpts });
const fps = composition.fps;

if (opt("--stills")) {
  const out = path.join(videoDir, "scratch", format ? `stills-${format}` : "stills");
  fs.mkdirSync(out, { recursive: true });
  for (const s of opt("--stills").split(",").map(Number)) {
    const output = path.join(out, `t_${s.toFixed(2).padStart(6, "0")}${inputProps.guides ? "_guides" : ""}.png`);
    await renderStill({ serveUrl, composition, inputProps, browserExecutable, ...glOpts, frame: Math.min(composition.durationInFrames - 1, Math.round(s * fps)), output });
    console.log(output);
  }
} else {
  const outputLocation = outputPath();
  const frameRange = opt("--from") || opt("--to")
    ? [Math.round(Number(opt("--from") ?? 0) * fps), Math.min(composition.durationInFrames - 1, Math.round(Number(opt("--to") ?? 1e9) * fps))]
    : undefined;
  await renderMedia({
    serveUrl, composition, inputProps, browserExecutable, outputLocation, frameRange,
    codec: "h264", crf: Number(opt("--crf") ?? 16), pixelFormat: "yuv420p", x264Preset: "slow",
    scale: Number(opt("--scale") ?? 1), // 4/3 on a 1920x1080 film delivers 2560x1440
    concurrency: Number(opt("--concurrency") ?? 2), // Remotion's own default is half the cores: too many Chrome tabs next to other builds
    ...glOpts, // --gl angle or swiftshader: a WebGL (three.js) scene
    onProgress: ({ progress }) => process.stdout.write(`\r${Math.round(progress * 100)}%`),
  });
  console.log(`\n${outputLocation}`);
  // Loudness, always: ElevenLabs voices come in near -26 LUFS and Reels plays at about -14. Two-pass loudnorm on the
  // audio only (picture stream copied, no re-render), target -14 LUFS, true peak -1.5 dBTP. --no-loudnorm skips it.
  if (!args.includes("--no-loudnorm")) {
    const { ffbin, ffenv } = await import("../../scripts/_lib.mjs");
    const ff = ffbin("ffmpeg");
    if (!ff) console.log("loudnorm skipped: ffmpeg not found");
    else {
      const { spawnSync } = await import("child_process");
      const run = (a) => spawnSync(ff, ["-hide_banner", "-nostats", ...a], { encoding: "utf8", maxBuffer: 1 << 26, env: ffenv(ff) });
      const T = "I=-14:TP=-1.5:LRA=11";
      const m1 = run(["-i", outputLocation, "-vn", "-af", `loudnorm=${T}:print_format=json`, "-f", "null", "-"]).stderr || "";
      let m = null; try { m = JSON.parse(m1.slice(m1.lastIndexOf("{"), m1.lastIndexOf("}") + 1)); } catch {}
      if (!m?.input_i) console.log("loudnorm skipped: no audio or no reading");
      else {
        const tmp = outputLocation.replace(/\.mp4$/, ".ln.mp4");
        const af = `loudnorm=${T}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,alimiter=limit=0.79:attack=5:release=40:level=disabled`;
        const r = run(["-y", "-i", outputLocation, "-map", "0:v", "-map", "0:a", "-c:v", "copy", "-af", af, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", tmp]);
        if (r.status === 0) { fs.renameSync(tmp, outputLocation); console.log(`loudnorm: ${m.input_i} -> -14 LUFS`); }
        else { try { fs.rmSync(tmp, { force: true }); } catch {} console.log("loudnorm failed, file left as rendered"); }
      }
    }
  }
}
