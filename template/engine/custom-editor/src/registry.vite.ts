import type { SceneMap } from "../../full-visual/src/engine/Stage";

// Stand-in for engine/full-visual/registry.ts, which uses require.context (webpack). Same shape:
// slug -> scenes, plus slug:format for videos that keep one composition per format under compositions/.
const found = import.meta.glob("../../../videos/*/{composition,compositions}/index.tsx", { eager: true }) as Record<
  string,
  { scenes: SceneMap }
>;
const perFormat = import.meta.glob("../../../videos/*/compositions/{reels,landscape}/index.tsx", { eager: true }) as Record<
  string,
  { scenes: SceneMap }
>;

// Key-only check for 3D continuous-world modules without importing/duplicating world code in the registry.
const worlds = import.meta.glob("../../../videos/*/{composition,compositions}/world.tsx", {
  query: "?url",
  eager: false,
});
const formatWorlds = import.meta.glob("../../../videos/*/compositions/{reels,landscape}/world.tsx", {
  query: "?url",
  eager: false,
});

function slugFromPath(file: string): string {
  const m = /videos\/([^/]+)\//.exec(file);
  return m ? m[1] : file;
}

const entries: Record<string, SceneMap> = {};
for (const [file, mod] of Object.entries(found)) {
  entries[slugFromPath(file)] = mod.scenes;
}
// Videos that only keep one composition per format under compositions/ still need a bare slug key: plans with
// words.json alone resolve as format "default", and Reel then asks for reels[slug]. Prefer reels, like the
// webpack registry does.
const sortedFormats = Object.entries(perFormat).sort(
  ([a], [b]) => Number(b.includes("/reels/")) - Number(a.includes("/reels/")),
);
for (const [file, mod] of sortedFormats) {
  const m = /videos\/([^/]+)\/compositions\/(reels|landscape)\//.exec(file);
  if (!m) continue;
  entries[`${m[1]}:${m[2]}`] = mod.scenes;
  if (!entries[m[1]]) entries[m[1]] = mod.scenes;
}

export const reels: Record<string, SceneMap> = entries;

export const worldSlugs = new Set(
  [...Object.keys(worlds), ...Object.keys(formatWorlds)].map(slugFromPath),
);

export type SlugAssets = {
  models: string[];
  textures: string[];
  hdris: string[];
  is3D: boolean;
};
