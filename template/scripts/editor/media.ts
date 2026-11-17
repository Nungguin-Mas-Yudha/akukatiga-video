// Pictures and sounds the timeline draws inside its clips: a filmstrip per video and a waveform per sound, each asked
// for once and kept for the session.
import { useEffect, useState } from 'react';

export const mediaUrl = (path: string) => '/media/' + path.split('/').map(encodeURIComponent).join('/');

const waves = new Map<string, Promise<{ rate: number; peaks: number[] } | null>>();
export function useWave(path?: string) {
  const [wave, setWave] = useState<{ rate: number; peaks: number[] } | null>(null);
  useEffect(() => {
    if (!path) return;
    if (!waves.has(path)) waves.set(path, fetch(`/api/edit/wave?path=${encodeURIComponent(path)}`).then((r) => (r.ok ? r.json() : null)).catch(() => null));
    let live = true;
    waves.get(path)!.then((w) => live && setWave(w));
    return () => { live = false; };
  }, [path]);
  return wave;
}

const strips = new Map<string, Promise<{ url: string; tile: number } | null>>();
export const STRIP_FRAMES = 48;
export function useStrip(path?: string) {
  const [strip, setStrip] = useState<{ url: string; tile: number } | null>(null);
  useEffect(() => {
    if (!path) return;
    if (!strips.has(path)) {
      const url = `/api/edit/strip?path=${encodeURIComponent(path)}`;
      strips.set(path, new Promise((accept) => {
        const img = new Image();
        img.onload = () => accept({ url, tile: img.naturalWidth / STRIP_FRAMES });
        img.onerror = () => accept(null);
        img.src = url;
      }));
    }
    let live = true;
    strips.get(path)!.then((s) => live && setStrip(s));
    return () => { live = false; };
  }, [path]);
  return strip;
}

const sizes = new Map<string, Promise<{ w: number; h: number } | null>>();
export function imageSize(url: string) {
  if (!sizes.has(url)) sizes.set(url, new Promise((accept) => { const img = new Image(); img.onload = () => accept({ w: img.naturalWidth, h: img.naturalHeight }); img.onerror = () => accept(null); img.src = url; }));
  return sizes.get(url)!;
}
