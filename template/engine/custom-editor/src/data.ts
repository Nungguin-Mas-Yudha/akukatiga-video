// Everything the editor needs about a video, read straight from its plans/ folder at build time.
// No copy, no second source of truth: if plans change, the editor changes.

type Json = Record<string, unknown>;

const timelines = import.meta.glob("../../../videos/*/plans/timeline-*.json", { eager: true, import: "default" }) as Record<string, Json>;
const words = import.meta.glob("../../../videos/*/plans/words.json", { eager: true, import: "default" }) as Record<string, Json>;
const configs = import.meta.glob("../../../videos/*/plans/reel*.json", { eager: true, import: "default" }) as Record<string, Json>;
const audioAssets = import.meta.glob("../../../videos/*/assets/voice*.mp3", { eager: true, import: "default" }) as Record<string, string>;

export type Track = {
  slug: string;
  format: "reels" | "landscape" | "default";
  data: Json;
  config: Json;
  audio: string | null;
};

const files = new Map<string, Record<string, Json>>();
for (const [file, value] of [...Object.entries(timelines), ...Object.entries(words), ...Object.entries(configs)]) {
  const parts = file.split("/");
  const slug = parts[parts.indexOf("videos") + 1];
  const bucket = files.get(slug) ?? {};
  bucket[parts[parts.length - 1]] = value;
  files.set(slug, bucket);
}

const availableAudio = new Set(
  Object.keys(audioAssets).map((file) => {
    const parts = file.split("/");
    const slug = parts[parts.indexOf("videos") + 1];
    return `${slug}/${parts[parts.length - 1]}`;
  }),
);

// Vertical cut first: that is the channel's main format, landscape is the extra.
const FORMAT_ORDER: Record<Track["format"], number> = { reels: 0, default: 1, landscape: 2 };

export const tracks: Track[] = [...files.entries()]
  .flatMap(([slug, bucket]) => {
    // A format only shows up when its timeline is complete: the engine needs scenes, blocks, words and silences.
    const usable = (data: Json | undefined) =>
      !!data && ["scenes", "blocks", "words", "silences"].every((key) => Array.isArray((data as Record<string, unknown>)[key]));
    const formats: Track["format"][] = [];
    if (usable(bucket["timeline-reels.json"])) formats.push("reels");
    if (usable(bucket["timeline-landscape.json"])) formats.push("landscape");
    if (!formats.length && usable(bucket["words.json"])) formats.push("default");
    return formats.map((format) => {
      const audioPath = `${slug}/${format === "default" ? "voice.mp3" : `voice-${format}.mp3`}`;
      return {
        slug,
        format,
        data: (format === "default" ? bucket["words.json"] : bucket[`timeline-${format}.json`]) as Json,
        config: (bucket[`reel-${format}.json`] ?? bucket["reel.json"] ?? {}) as Json,
        audio: availableAudio.has(audioPath) ? audioPath : null,
      };
    });
  })
  .sort((a, b) => a.slug.localeCompare(b.slug) || FORMAT_ORDER[a.format] - FORMAT_ORDER[b.format]);

export const slugs = [...new Set(tracks.map((t) => t.slug))];
