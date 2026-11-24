// Videos register through composition/index.tsx or compositions/index.tsx; the slug comes from their video folder.
// A video is its own folder (plans, storyboard, assets, src), so updating the engine never touches it.
import type { SceneMap } from "./src/engine/Stage";

let reels: Record<string, SceneMap> = {};
try {
  // The webpack parser replaces this call at build time. Never wrap it in `typeof require !== "undefined"`: the
  // bundled page has no `require` at runtime, so a guard silently skips the context and every video renders as a
  // caption over bare ground (found 2026-11-20, sound-horeg-tiap-hari).
  // @ts-ignore: require.context is webpack's, not Vite's or Node's
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
} catch (e) {
  console.error("registry: a video's compositions/index.tsx failed to load", e);
}

export { reels };
