// Editor dev/build config. The editor reuses the render engine (Reel + plans + assets), so there is no
// second renderer here: it only serves the app and the video assets the scenes ask for.
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

const here = import.meta.dirname;
const videosRoot = path.resolve(here, "videos");

const MIME: Record<string, string> = {
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".hdr": "application/octet-stream",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function buildAssetManifest(root: string) {
  const out: Record<string, { models: string[]; textures: string[]; hdris: string[]; is3D: boolean }> = {};
  if (!fs.existsSync(root)) return out;
  for (const slug of fs.readdirSync(root)) {
    const assetsDir = path.join(root, slug, "assets");
    if (!fs.existsSync(assetsDir) || !fs.statSync(assetsDir).isDirectory()) continue;
    const entry = { models: [] as string[], textures: [] as string[], hdris: [] as string[], is3D: false };
    for (const name of fs.readdirSync(assetsDir)) {
      if (name.startsWith("_") || name.startsWith(".")) continue;
      if (/\.(glb|gltf)$/i.test(name)) {
        entry.models.push(`${slug}/${name}`);
        entry.is3D = true;
      } else if (/\.hdr$/i.test(name)) {
        entry.hdris.push(`${slug}/${name}`);
        entry.is3D = true;
      } else if (/\.(png|jpe?g|webp)$/i.test(name)) {
        entry.textures.push(`${slug}/${name}`);
      }
    }
    out[slug] = entry;
  }
  return out;
}

// Serves videos/<slug>/assets/<file> at /<slug>/<file> (what staticFile() asks for) plus a manifest of the 3D
// assets, so .glb/.hdr load with the right MIME type and byte ranges while scrubbing.
function reelAssets(): Plugin {
  const handler = (req: any, res: any, next: () => void) => {
    const clean = String(req.url || "").split("?")[0];
    if (clean === "/__reel-assets.json") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-store");
      res.end(JSON.stringify(buildAssetManifest(videosRoot)));
      return;
    }
    const m = /^\/([a-z0-9-]+)\/(.+)$/.exec(clean);
    if (!m) return next();
    const [, slug, rel] = m;
    if (rel.startsWith("_") || rel.includes("..")) return next();
    const base = path.resolve(videosRoot, slug, "assets");
    const file = path.resolve(base, rel);
    if (!file.startsWith(base + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return next();

    const total = fs.statSync(file).size;
    const ext = path.extname(file).toLowerCase();
    const isAudio = ext === ".mp3" || ext === ".wav";
    const isVersioned = String(req.url || "").includes("?v=");
    res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader(
      "Cache-Control",
      isAudio || isVersioned ? "public, max-age=3600" : "no-store, must-revalidate",
    );

    const range = req.headers?.range;
    if (typeof range === "string" && range.startsWith("bytes=")) {
      const [startStr, endStr] = range.slice(6).split("-");
      const start = startStr ? Math.max(0, Math.min(total - 1, Number(startStr))) : 0;
      const end = endStr ? Math.max(start, Math.min(total - 1, Number(endStr))) : total - 1;
      if (!Number.isNaN(start) && !Number.isNaN(end) && start <= end) {
        res.statusCode = 206;
        res.setHeader("Content-Range", `bytes ${start}-${end}/${total}`);
        res.setHeader("Content-Length", String(end - start + 1));
        const stream = fs.createReadStream(file, { start, end });
        res.on("close", () => stream.destroy());
        stream.pipe(res);
        return;
      }
    }
    res.setHeader("Content-Length", String(total));
    const stream = fs.createReadStream(file);
    res.on("close", () => stream.destroy());
    stream.pipe(res);
  };

  return {
    name: "reel-assets",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const clean = String(req.url || "").split("?")[0];
        if (clean === "/" || clean === "/index.html") {
          res.setHeader("Cache-Control", "no-store, must-revalidate");
        }
        if (clean.endsWith(".css")) {
          res.setHeader("Vary", "Accept, Origin");
        }
        next();
      });
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
    closeBundle() {
      const outDir = path.resolve(here, "dist");
      if (!fs.existsSync(outDir)) return;
      fs.writeFileSync(path.join(outDir, "__reel-assets.json"), JSON.stringify(buildAssetManifest(videosRoot)));
      if (!fs.existsSync(videosRoot)) return;
      for (const slug of fs.readdirSync(videosRoot)) {
        const srcDir = path.join(videosRoot, slug, "assets");
        if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) continue;
        const dstDir = path.join(outDir, slug);
        fs.mkdirSync(dstDir, { recursive: true });
        for (const name of fs.readdirSync(srcDir)) {
          if (name.startsWith("_") || name.startsWith(".")) continue;
          const srcFile = path.join(srcDir, name);
          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, path.join(dstDir, name));
          }
        }
      }
    },
  };
}

export default defineConfig({
  root: here,
  plugins: [react(), reelAssets()],
  resolve: {
    // One copy of each 3D/React library, or the canvas contexts fight each other.
    dedupe: ["react", "react-dom", "three", "@react-three/fiber", "@react-three/drei", "@remotion/three", "remotion"],
    alias: [
      { find: "@", replacement: here },
      { find: /^@shopify\/react-native-skia(\/.*)?$/, replacement: path.resolve(here, "engine/custom-editor/src/skia-stub.ts") },
      { find: /^@remotion\/skia(\/.*)?$/, replacement: path.resolve(here, "engine/custom-editor/src/skia-stub.ts") },
    ],
  },
  optimizeDeps: {
    entries: [
      "index.html",
      "src/main.tsx",
      "engine/custom-editor/src/App.tsx",
      "engine/full-visual/src/Reel.tsx",
      "videos/*/composition/index.tsx",
      "videos/*/compositions/index.tsx",
      "videos/*/compositions/{reels,landscape}/index.tsx",
    ],
  },
  server: {
    port: Number(process.env.DEFAULT_APP_PORT ?? 3000),
    host: "0.0.0.0",
    strictPort: false,
    allowedHosts: true,
    hmr: false,
    fs: { allow: [here] },
    warmup: {
      clientFiles: [
        "./src/main.tsx",
        "./src/App.tsx",
        "./engine/custom-editor/src/App.tsx",
        "./engine/full-visual/src/Reel.tsx",
        "./videos/*/composition/index.tsx",
        "./videos/*/composition/world.tsx",
        "./videos/*/compositions/index.tsx",
        "./videos/*/compositions/{reels,landscape}/index.tsx",
        "./videos/*/compositions/{reels,landscape}/world.tsx",
      ],
    },
  },
  build: { outDir: path.resolve(here, "dist"), emptyOutDir: true },
  preview: { port: Number(process.env.DEFAULT_APP_PORT ?? 3000), host: "0.0.0.0", allowedHosts: true },
});
