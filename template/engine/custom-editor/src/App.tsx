import React, { Component, useEffect, useMemo, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Divider } from "@astryxdesign/core/Divider";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Kbd } from "@astryxdesign/core/Kbd";
import { List, ListItem } from "@astryxdesign/core/List";
import { ScrollableArea } from "@astryxdesign/core/ScrollableArea";
import { SegmentedControl, SegmentedControlItem } from "@astryxdesign/core/SegmentedControl";
import { Selector } from "@astryxdesign/core/Selector";
import { Slider } from "@astryxdesign/core/Slider";
import { Spinner } from "@astryxdesign/core/Spinner";
import { Text } from "@astryxdesign/core/Text";
import { Theme } from "@astryxdesign/core/theme";
import { ToggleButton } from "@astryxdesign/core/ToggleButton";
import { VStack } from "@astryxdesign/core/VStack";
import { Reel, type ReelProps } from "../../full-visual/src/Reel";
import { buildTimeline, type ReelConfig, type ReelData } from "../../full-visual/src/engine/timeline";
import { theme as baseTheme, withOverrides } from "../../full-visual/src/theme";
import { fontsReady } from "../../full-visual/src/fonts";
import { slugs, tracks } from "./data";
import { reels, worldSlugs, type SlugAssets } from "./registry.vite";
import { isWebGLAvailable, preloadSlug3DAssets } from "./preload3d";
import { editorTheme } from "./theme";
import {
  BoxIcon,
  CaptionIcon,
  FilmIcon,
  GuidesIcon,
  MuteIcon,
  NextSceneIcon,
  PauseIcon,
  PlayIcon,
  PrevSceneIcon,
  RestartIcon,
  VolumeIcon,
} from "./icons";

function readInitialQuery() {
  if (typeof window === "undefined") {
    return { slug: null, format: null, scene: null, t: null, guides: false, noCaption: false, muted: false };
  }
  const sp = new URLSearchParams(window.location.search);
  const tRaw = sp.get("t");
  const tVal = tRaw !== null && !Number.isNaN(Number(tRaw)) ? Number(tRaw) : null;
  return {
    slug: sp.get("slug"),
    format: sp.get("format"),
    scene: sp.get("scene"),
    t: tVal,
    guides: sp.get("guides") === "1",
    noCaption: sp.get("nocaption") === "1",
    muted: sp.get("mute") === "1",
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

function FormatTag({ is3D }: { is3D: boolean }) {
  return (
    <span className="fmt-tag" data-kind={is3D ? "3d" : "2d"}>
      {is3D ? "3D" : "2D"}
    </span>
  );
}
const secs = (frames: number, fps: number) => (frames / fps).toFixed(2);

class PlayerBoundary extends Component<
  { resetKey: string; children: React.ReactNode },
  { error: string | null }
> {
  state = { error: null as string | null };

  static getDerivedStateFromError(err: Error) {
    return { error: err?.message || "Gagal memuat preview scene." };
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="stage-error">
        <EmptyState
          title="Preview gagal dirender"
          description={this.state.error}
          actions={
            <Button label="Muat ulang stage" variant="secondary" onClick={() => this.setState({ error: null })} />
          }
        />
      </div>
    );
  }
}

export default function App() {
  const initialQuery = useMemo(() => readInitialQuery(), []);
  const initialSlug = initialQuery.slug && slugs.includes(initialQuery.slug) ? initialQuery.slug : slugs[0];

  const [slug, setSlug] = useState<string | undefined>(initialSlug);
  const [format, setFormat] = useState<string | null>(
    initialQuery.format === "reels" || initialQuery.format === "landscape" ? initialQuery.format : null,
  );
  const [active, setActive] = useState(0);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [guides, setGuides] = useState(initialQuery.guides);
  const [noCaption, setNoCaption] = useState(initialQuery.noCaption);
  const [muted, setMuted] = useState(initialQuery.muted);
  const [assetsBySlug, setAssetsBySlug] = useState<Record<string, SlugAssets>>({});
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [webglOk] = useState(() => isWebGLAvailable());
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 980px)").matches,
  );
  const appliedQueryRef = useRef(false);
  const player = useRef<PlayerRef>(null);

  const options = useMemo(() => tracks.filter((t) => t.slug === slug), [slug]);
  const track = useMemo(
    () => options.find((t) => t.format === format) ?? options[0] ?? null,
    [options, format],
  );

  const theme = useMemo(
    () =>
      track
        ? withOverrides(baseTheme, (track.config as { theme?: Record<string, unknown> }).theme as never)
        : baseTheme,
    [track],
  );

  const timeline = useMemo(
    () =>
      track
        ? buildTimeline(track.data as unknown as ReelData, theme)
        : { fps: 30, frames: 1, scenes: [] },
    [track, theme],
  );

  const fps = timeline.fps;
  const film = (track?.config as { theme?: { layout?: string } } | undefined)?.theme?.layout === "film";
  const [width, height] = film ? [1920, 1080] : [1080, 1920];
  const manifest = track ? assetsBySlug[track.slug] : undefined;
  const is3D = Boolean(manifest?.is3D || (track && worldSlugs.has(track.slug)));

  const initialFrame = useMemo(() => {
    if (appliedQueryRef.current || !track) return 0;
    if (initialQuery.scene) {
      const clean = initialQuery.scene.replace(/^\d+\./, "");
      const found = timeline.scenes.find((s) => s.id === clean || s.id === initialQuery.scene);
      if (found) {
        return Math.min(found.to - 1, Math.round((found.from + found.to) * 0.5));
      }
    }
    if (initialQuery.t !== null) {
      return Math.max(0, Math.min(timeline.frames - 1, Math.round(initialQuery.t * fps)));
    }
    return 0;
  }, [track, timeline, initialQuery, fps]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 980px)");
    const sync = () => setNarrow(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // The Reel measures caption text with Figtree on its first frame and throws if the
  // face is still missing, so the player only mounts once the engine's fonts are in.
  useEffect(() => {
    let alive = true;
    const done = () => {
      if (alive) setFontsLoaded(true);
    };
    const wait = async () => {
      try {
        await fontsReady;
      } catch {
        // Fall through: the editor is still usable with the fallback face.
      }
      // load() resolves even when no matching @font-face is registered yet, so
      // poll check() until the faces are actually usable.
      for (let i = 0; i < 80 && alive; i++) {
        if (document.fonts.check('400 16px Figtree') && document.fonts.check('700 16px Figtree')) {
          done();
          return;
        }
        try {
          await document.fonts.load("400 16px Figtree");
          await document.fonts.load("700 16px Figtree");
        } catch {
          // Retry: a missing webfont only affects caption metrics.
        }
        await new Promise((resolve) => window.setTimeout(resolve, 100));
      }
      done();
    };
    wait();
    const timer = window.setTimeout(done, 9000);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/__reel-assets.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data === "object") {
          setAssetsBySlug(data as Record<string, SlugAssets>);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const firstSlug = useRef(true);
  useEffect(() => {
    // Keep ?format= on the first load; only a real video switch resets the format.
    if (firstSlug.current) {
      firstSlug.current = false;
      return;
    }
    setFormat(null);
    setActive(0);
    setFrame(0);
    setPlaying(false);
  }, [slug]);

  useEffect(() => {
    if (track && manifest?.is3D) {
      preloadSlug3DAssets(track.slug, manifest);
    }
  }, [track, manifest]);

  useEffect(() => {
    const ref = player.current;
    if (!ref || !track) return;

    if (!appliedQueryRef.current && initialFrame > 0) {
      appliedQueryRef.current = true;
      ref.seekTo(initialFrame);
      setFrame(initialFrame);
      const idx = timeline.scenes.findIndex((s) => initialFrame >= s.from && initialFrame < s.to);
      if (idx >= 0) setActive(idx);
    }

    const onFrame = (e: { detail: { frame: number } }) => {
      const f = e.detail.frame;
      setFrame(f);
      const index = timeline.scenes.findIndex((s) => f >= s.from && f < s.to);
      if (index >= 0) setActive(index);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    ref.addEventListener("frameupdate", onFrame as never);
    ref.addEventListener("seeked", onFrame as never);
    ref.addEventListener("play", onPlay as never);
    ref.addEventListener("pause", onPause as never);
    ref.addEventListener("ended", onPause as never);
    return () => {
      ref.removeEventListener("frameupdate", onFrame as never);
      ref.removeEventListener("seeked", onFrame as never);
      ref.removeEventListener("play", onPlay as never);
      ref.removeEventListener("pause", onPause as never);
      ref.removeEventListener("ended", onPause as never);
    };
  }, [timeline, track, initialFrame, fontsLoaded]);

  const seekTo = (nextFrame: number) => {
    const clamped = Math.max(0, Math.min(timeline.frames - 1, Math.round(nextFrame)));
    player.current?.seekTo(clamped);
    setFrame(clamped);
    const idx = timeline.scenes.findIndex((s) => clamped >= s.from && clamped < s.to);
    if (idx >= 0) setActive(idx);
  };

  const jump = (index: number) => {
    const scene = timeline.scenes[index];
    if (!scene) return;
    seekTo(scene.from);
  };

  const togglePlay = (e?: React.SyntheticEvent | Event) => {
    const ref = player.current;
    if (!ref) return;
    const nativeEvt = e && "nativeEvent" in e ? e.nativeEvent : e;
    ref.toggle(nativeEvt as never);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (player.current) {
      if (next) player.current.mute();
      else player.current.unmute();
    }
  };

  // Watchdog: if playback is active (`Jeda`) while unmuted yet frames do not advance
  // within 550ms (e.g. iframe AudioContext.getOutputTimestamp blocked), auto-mute so video plays smoothly.
  const latestFrameRef = useRef(frame);
  latestFrameRef.current = frame;
  useEffect(() => {
    if (!playing || muted) return;
    const startFrame = latestFrameRef.current;
    const timer = window.setTimeout(() => {
      if (latestFrameRef.current === startFrame && player.current?.isPlaying()) {
        player.current.mute();
        setMuted(true);
      }
    }, 550);
    return () => window.clearTimeout(timer);
  }, [playing, muted]);

  const keyHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {});
  keyHandlerRef.current = (e: KeyboardEvent) => {
    const el = e.target as HTMLElement | null;
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable)) {
      return;
    }
    if (e.code === "Space") {
      e.preventDefault();
      togglePlay(e);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      seekTo(frame - (e.shiftKey ? fps : 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      seekTo(frame + (e.shiftKey ? fps : 1));
    } else if (e.key === "[") {
      e.preventDefault();
      jump(Math.max(0, active - 1));
    } else if (e.key === "]") {
      e.preventDefault();
      jump(Math.min(timeline.scenes.length - 1, active + 1));
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => keyHandlerRef.current(e);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const inputProps: ReelProps | null = useMemo(
    () =>
      track
        ? {
            slug: track.slug,
            data: track.data as unknown as ReelData,
            config: track.config as unknown as ReelConfig,
            audio: track.audio,
            guides,
            noCaption,
            scenes: reels[`${track.slug}:${track.format}`] ?? reels[track.slug],
          }
        : null,
    [track, guides, noCaption],
  );

  if (!fontsLoaded) {
    return (
      <Theme theme={editorTheme} mode="dark">
        <div className="app app-empty">
          <VStack gap={3} hAlign="center" vAlign="center">
            <Spinner size="lg" label="Menyiapkan font & komposisi..." />
          </VStack>
        </div>
      </Theme>
    );
  }

  if (!track || !inputProps) {
    return (
      <Theme theme={editorTheme} mode="dark">
        <div className="app app-empty">
          <EmptyState
            title="Belum ada video"
            description="Tambahkan folder videos/<slug>/ dengan plans/words.json (atau timeline-*.json) dan composition/index.tsx."
          />
        </div>
      </Theme>
    );
  }

  const key = `${track.slug}:${track.format}`;
  const total = timeline.scenes.length;
  const currentScene = timeline.scenes[active];
  const maxFrame = Math.max(0, timeline.frames - 1);

  return (
    <Theme theme={editorTheme} mode="dark">
      <div
        className="app"
        data-current-scene={currentScene?.id ?? ""}
        data-current-frame={frame}
        data-mode={is3D ? "3d" : "2d"}
      >
        <aside className="rail">
          <div className="rail-head">
            <span className="brand-mark" aria-hidden="true">
              AK
            </span>
            <VStack gap={0} className="brand-text">
              <span className="brand-name">AkuKatiga</span>
              <Text type="supporting">Pratinjau scene</Text>
            </VStack>
            {narrow && (
              <div className="rail-picker">
                <Selector
                  label="Video"
                  isLabelHidden
                  hasSearch
                  size="sm"
                  variant="ghost"
                  width="100%"
                  value={slug}
                  onChange={setSlug}
                  options={slugs.map((name) => ({
                    value: name,
                    label: name,
                    description: assetsBySlug[name]?.is3D || worldSlugs.has(name) ? "3D" : "2D",
                  }))}
                />
              </div>
            )}
            {narrow && <FormatTag is3D={is3D} />}
          </div>
          {!narrow && (
          <VStack gap={2} paddingInline={2} paddingBlock={3} className="rail-body">
            <HStack justify="between" vAlign="center" paddingInline={1.5}>
              <Text type="label" color="secondary">
                Video
              </Text>
              <Text type="supporting" hasTabularNumbers>
                {slugs.length}
              </Text>
            </HStack>
            <ScrollableArea label="Daftar video" axis="block" className="rail-scroll">
              <List density="compact">
                {slugs.map((name) => {
                  const slug3D = Boolean(assetsBySlug[name]?.is3D || worldSlugs.has(name));
                  return (
                    <ListItem
                      key={name}
                      label={name}
                      isSelected={name === slug}
                      onClick={() => setSlug(name)}
                      endContent={slug3D ? <FormatTag is3D /> : undefined}
                    />
                  );
                })}
              </List>
            </ScrollableArea>
          </VStack>
          )}
          {!narrow && (
          <div className="rail-foot">
            <HStack gap={1.5} vAlign="center" wrap="wrap" className="rail-meta">
              <Text type="supporting" hasTabularNumbers>
                {total} scene
              </Text>
              <Text type="supporting">·</Text>
              <Text type="supporting" hasTabularNumbers>
                {fps} fps
              </Text>
              <Text type="supporting">·</Text>
              <Text type="supporting" hasTabularNumbers>
                {secs(timeline.frames, fps)}s
              </Text>
            </HStack>
          </div>
          )}
        </aside>

        <main className="main">
          <div className="content">
          <header className="content-head">
            {!narrow && (
              <HStack gap={1.5} vAlign="center" className="main-head-left">
                <span className="video-title">{track.slug}</span>
                <FormatTag is3D={is3D} />
              </HStack>
            )}
            <HStack gap={2} vAlign="center">
              {options.length > 1 && !narrow && (
                <SegmentedControl label="Format" value={track.format} onChange={setFormat} size="sm">
                  {options.map((option) => (
                    <SegmentedControlItem key={option.format} value={option.format} label={option.format} />
                  ))}
                </SegmentedControl>
              )}
              <Text type="supporting" hasTabularNumbers>
                Scene {active + 1}/{total}
              </Text>
              <Text type="body" color="secondary" maxLines={1}>
                {currentScene?.id}
              </Text>
              <Divider orientation="vertical" />
              <Text type="code" color="secondary">
                {secs(frame, fps)}s
              </Text>
            </HStack>
          </header>

          <div className="stage">
            {is3D && !webglOk ? (
              <div className="stage-error">
                <EmptyState
                  title="WebGL tidak aktif"
                  description="Scene 3D membutuhkan WebGL2/WebGL agar kanvas @remotion/three bisa dirender."
                />
              </div>
            ) : (
              <div className={`stage-frame ${film ? "is-film" : "is-reel"}`} data-testid="reel-stage">
                <PlayerBoundary resetKey={`${key}:${frame}`}>
                  <Player
                    key={key}
                    ref={player}
                    component={Reel}
                    inputProps={inputProps}
                    durationInFrames={Math.max(1, timeline.frames)}
                    fps={fps}
                    compositionWidth={width}
                    compositionHeight={height}
                    initialFrame={initialFrame}
                    initiallyMuted={muted}
                    clickToPlay
                    acknowledgeRemotionLicense
                    style={{ width: "100%", height: "100%" }}
                    controls={false}
                  />
                </PlayerBoundary>
              </div>
            )}
          </div>

          <footer className="transport">
            <div className="transport-scrub">
              <Slider
                label="Posisi timeline"
                isLabelHidden
                value={frame}
                min={0}
                max={Math.max(1, maxFrame)}
                step={1}
                valueDisplay="none"
                width="100%"
                onChange={(value) => seekTo(typeof value === "number" ? value : value[0])}
              />
            </div>
            <HStack gap={2} vAlign="center" className="transport-row">
              <Button
                label={playing ? "Jeda" : "Putar"}
                variant="primary"
                icon={<Icon icon={playing ? PauseIcon : PlayIcon} />}
                onClick={(e) => togglePlay(e)}
                width={108}
              />
              <HStack gap={0.5} vAlign="center">
                <IconButton
                  label="Kembali ke awal"
                  tooltip="Kembali ke awal"
                  variant="ghost"
                  icon={<Icon icon={RestartIcon} />}
                  onClick={() => seekTo(0)}
                />
                <IconButton
                  label="Scene sebelumnya"
                  tooltip="Scene sebelumnya ( [ )"
                  variant="ghost"
                  icon={<Icon icon={PrevSceneIcon} />}
                  onClick={() => jump(Math.max(0, active - 1))}
                  isDisabled={active === 0}
                />
                <IconButton
                  label="Scene berikutnya"
                  tooltip="Scene berikutnya ( ] )"
                  variant="ghost"
                  icon={<Icon icon={NextSceneIcon} />}
                  onClick={() => jump(Math.min(total - 1, active + 1))}
                  isDisabled={active >= total - 1}
                />
              </HStack>
              <Divider orientation="vertical" />
              <ToggleButton
                label={muted ? "Nyalakan suara" : "Matikan suara"}
                isIconOnly
                icon={<Icon icon={muted ? MuteIcon : VolumeIcon} />}
                isPressed={!muted}
                onPressedChange={toggleMute}
                size="sm"
              />
              {!film && (
                <>
                  <ToggleButton
                    label="Guides"
                    tooltip="Guides"
                    isIconOnly={narrow}
                    size="sm"
                    icon={<Icon icon={GuidesIcon} />}
                    isPressed={guides}
                    onPressedChange={setGuides}
                  />
                  <ToggleButton
                    label="Caption"
                    tooltip="Caption"
                    isIconOnly={narrow}
                    size="sm"
                    icon={<Icon icon={CaptionIcon} />}
                    isPressed={!noCaption}
                    onPressedChange={(pressed) => setNoCaption(!pressed)}
                  />
                </>
              )}
              <div className="transport-spacer" />
              <HStack gap={1.5} vAlign="center">
                <span className="transport-frame">
                  <Text type="code" color="secondary">
                    f {frame} / {maxFrame}
                  </Text>
                </span>
              </HStack>
            </HStack>
          </footer>

        <aside className="scenes">
          <div className="scenes-head">
            <HStack justify="between" vAlign="center">
              <HStack gap={1.5} vAlign="center">
                <Text type="label" color="primary">
                  Scene
                </Text>
                <Badge variant="neutral" label={String(total)} />
              </HStack>
              {narrow && options.length > 1 ? (
                <SegmentedControl label="Format" value={track.format} onChange={setFormat} size="sm">
                  {options.map((option) => (
                    <SegmentedControlItem key={option.format} value={option.format} label={option.format} />
                  ))}
                </SegmentedControl>
              ) : narrow ? (
                <Text type="supporting" hasTabularNumbers>
                  {pad(active + 1)} · {secs(frame, fps)}s
                </Text>
              ) : (
                <HStack gap={1} vAlign="center">
                  <Icon icon={is3D ? BoxIcon : FilmIcon} size="xsm" color="tertiary" />
                  <Text type="supporting">{is3D ? "3D" : "2D"}</Text>
                </HStack>
              )}
            </HStack>
          </div>
          <ScrollableArea label="Daftar scene" axis="block" className="scenes-scroll">
            <VStack gap={0.5} padding={2}>
              {timeline.scenes.map((scene, index) => (
                <button
                  type="button"
                  key={scene.id}
                  className={`scene-row${index === active ? " is-active" : ""}`}
                  onClick={() => jump(index)}
                >
                  <span className="scene-num">{pad(index + 1)}</span>
                  <span className="scene-name">
                    <Text type="body" color={index === active ? "primary" : "secondary"} maxLines={1}>
                      {scene.id}
                    </Text>
                  </span>
                  <span className="scene-time">
                    <Text type="supporting" hasTabularNumbers>
                      {(scene.from / fps).toFixed(1)}–{(scene.to / fps).toFixed(1)}s
                    </Text>
                  </span>
                </button>
              ))}
            </VStack>
          </ScrollableArea>
          <div className="scenes-foot">
            <HStack gap={1.5} vAlign="center" wrap="wrap">
              <Kbd keys="space" />
              <Text type="supporting">putar</Text>
              <Kbd keys="left" />
              <Kbd keys="right" />
              <Text type="supporting">1 frame</Text>
              <Kbd keys="[" />
              <Kbd keys="]" />
              <Text type="supporting">scene</Text>
            </HStack>
          </div>
        </aside>
        </div>
        </main>
      </div>
    </Theme>
  );
}
