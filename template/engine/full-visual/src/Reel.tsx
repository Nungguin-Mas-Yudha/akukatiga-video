// Back to front: ground, stage, caption, pinned chrome. No camera, no cut, no music: the voice is the only clock.
import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, staticFile } from "remotion";
import { theme as base, withOverrides } from "./theme";
import { fontsReady } from "./fonts";
import { ReelContext } from "./engine/context";
import { buildTimeline, type ReelConfig, type ReelData } from "./engine/timeline";
import { Ground } from "./engine/Ground";
import { Stage } from "./engine/Stage";
import { Caption } from "./engine/Caption";
import { Chrome } from "./engine/Chrome";
import { Finish } from "./engine/Finish";
import type { SceneMap } from "./engine/Stage";
import { reels } from "../registry";

export type ReelProps = { slug: string; data: ReelData; config: ReelConfig; audio: string | null; guides?: boolean; noCaption?: boolean; scenes?: SceneMap };

// the bands, and where Instagram draws over the reel. Stills only (--guides).
const Guides: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: "monospace", fontSize: 22, color: "#ff3b7f" }}>
    {[[300, "caption"], [520, "stage"], [1450, "stage ends"], [1600, "chrome"]].map(([y, label]) => (
      <div key={label} style={{ position: "absolute", top: y as number, left: 0, right: 0, borderTop: "2px dashed #ff3b7f" }}>&nbsp;{label} {y}</div>
    ))}
    <div style={{ position: "absolute", top: 1700, bottom: 0, left: 0, right: 0, background: "rgba(255,59,127,0.16)" }}>&nbsp;Instagram caption + buttons</div>
    <div style={{ position: "absolute", top: 1100, bottom: 220, right: 0, width: 130, background: "rgba(255,59,127,0.16)" }} />
  </AbsoluteFill>
);

export const Reel: React.FC<ReelProps> = ({ slug, data, config, audio, guides, noCaption, scenes }) => {
  const [handle] = useState(() => delayRender("fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      setReady(true);
      continueRender(handle);
    };
    const timer = window.setTimeout(done, 1500);
    fontsReady.then(done).catch(done);
    return () => window.clearTimeout(timer);
  }, [handle]);
  const theme = useMemo(() => withOverrides(base, config.theme), [config.theme]);
  const tl = useMemo(() => buildTimeline(data, theme), [data, theme]);
  const film = config.theme?.layout === "film";
  const formatKey = film ? "landscape" : "reels";
  if (!ready) return null;
  const sceneMap = scenes ?? reels[`${slug}:${formatKey}`] ?? reels[slug] ?? {};
  // optional persistent continuous 3D world rendered once under <Stage> (zero WebGL remount between scenes)
  const World = sceneMap.__world;
  // optional reel-wide layer above every scene (scenes map key "__overlay"), e.g. the creator's character in a corner
  const Overlay = sceneMap.__overlay;
  return (
    <ReelContext.Provider value={{ theme, tl, slug }}>
      <AbsoluteFill>
        <Ground />
        {World && <World />}
        <Stage scenes={sceneMap} />
        <Finish />
        {Overlay && <Overlay />}
        {!film && !noCaption && <Caption />}
        {!film && <Chrome config={config.chrome} />}
        {!film && guides && <Guides />}
        {audio && <Audio src={staticFile(audio)} pauseWhenBuffering={false} />}
      </AbsoluteFill>
    </ReelContext.Provider>
  );
};
