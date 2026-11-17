// Videos register through composition/index.tsx or compositions/index.tsx; the slug comes from their video folder.
// A video is its own folder (plans, storyboard, assets, src), so updating the engine never touches it.
import type { SceneMap } from "./src/engine/Stage";

let reels: Record<string, SceneMap> = {};
try {
  // @ts-ignore: require.context is the bundler's (Webpack), not Vite's or Node's
  if (typeof require !== "undefined" && typeof (require as { context?: unknown }).context === "function") {
    // @ts-ignore: webpack context
    const found = require.context(
      "../../videos",
      true,
      /^\.\/[^/]+\/(?:composition\/index\.tsx|compositions\/(?:(?:landscape|reels)\/)?index\.tsx)$/,
    );
    const entries = new Map<string, string>();
    for (const key of found.keys() as string[]) {
      const mFmt = /^\.\/([^/]+)\/compositions\/(landscape|reels)\/index\.tsx$/.exec(key);
      if (mFmt) {
        const [, slug, fmt] = mFmt;
        entries.set(`${slug}:${fmt}`, key);
        if (!entries.has(slug)) entries.set(slug, key);
        continue;
      }
      const slug = key.split("/")[1];
      const previous = entries.get(slug);
      // If both layouts exist, prefer the plural scene-composition registry.
      if (!previous || key.includes("/compositions/")) entries.set(slug, key);
    }
    reels = Object.fromEntries(
      [...entries].map(([entryKey, key]) => [entryKey, (found(key) as { scenes: SceneMap }).scenes]),
    );
  }
} catch {}

export { reels };
