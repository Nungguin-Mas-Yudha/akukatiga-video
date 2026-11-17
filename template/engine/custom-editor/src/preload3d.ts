import { useGLTF, useTexture } from "@react-three/drei";
import { staticFile } from "remotion";
import type { SlugAssets } from "./registry.vite";

const preloadedSlugs = new Set<string>();
const ASSET_REV = "20261116";

/**
 * Preloads .glb/.gltf meshes and textures for a 3D video slug so jumping directly
 * to any scene renders immediately without Suspense blank frames during preview/scrubbing.
 */
export function preloadSlug3DAssets(slug: string, manifest?: SlugAssets): void {
  if (!manifest || !manifest.is3D || preloadedSlugs.has(slug)) return;
  preloadedSlugs.add(slug);

  for (const rel of manifest.models) {
    try {
      useGLTF.preload(`${staticFile(rel)}?v=${ASSET_REV}`, false);
    } catch {
      // Non-fatal: individual scene will load on demand if preload fails
    }
  }
  for (const rel of manifest.textures) {
    try {
      useTexture.preload(`${staticFile(rel)}?v=${ASSET_REV}`);
    } catch {
      // Non-fatal
    }
  }
}

export function isWebGLAvailable(): boolean {
  if (typeof document === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    if (!gl) return false;
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
