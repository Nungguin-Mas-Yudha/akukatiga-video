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

const entries: [string, SceneMap][] = [];
for (const [file, mod] of Object.entries(found)) {
  entries.push([slugFromPath(file), mod.scenes]);
}
for (const [file, mod] of Object.entries(perFormat)) {
  const m = /videos\/([^/]+)\/compositions\/(reels|landscape)\//.exec(file);
  if (m) entries.push([`${m[1]}:${m[2]}`, mod.scenes]);
}

export const reels: Record<string, SceneMap> = Object.fromEntries(entries);

export const worldSlugs = new Set(
  [...Object.keys(worlds), ...Object.keys(formatWorlds)].map(slugFromPath),
);

export type SlugAssets = {
  models: string[];
  textures: string[];
  hdris: string[];
  is3D: boolean;
};
