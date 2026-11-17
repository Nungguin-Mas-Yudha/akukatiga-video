// Small inline SVG glyphs for the editor controls. Astryx ships a handful of
// semantic icons (play/pause is not one of them), and its `Icon` accepts any SVG
// component, so the transport icons live here instead of pulling a whole pack.
import type { SVGProps } from "react";

type GlyphProps = SVGProps<SVGSVGElement>;

const stroke = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const PlayIcon = (props: GlyphProps) => (
  <svg {...stroke} stroke="none" fill="currentColor" {...props}>
    <path d="M8 5.2v13.6a.8.8 0 0 0 1.22.68l10.6-6.8a.8.8 0 0 0 0-1.36L9.22 4.52A.8.8 0 0 0 8 5.2Z" />
  </svg>
);

export const PauseIcon = (props: GlyphProps) => (
  <svg {...stroke} stroke="none" fill="currentColor" {...props}>
    <rect x="6.5" y="5" width="3.8" height="14" rx="1.2" />
    <rect x="13.7" y="5" width="3.8" height="14" rx="1.2" />
  </svg>
);

export const RestartIcon = (props: GlyphProps) => (
  <svg {...stroke} {...props}>
    <path d="M4.5 5.5v5h5" />
    <path d="M4.9 10.4a7.5 7.5 0 1 1 1.1 6" />
  </svg>
);

export const PrevSceneIcon = (props: GlyphProps) => (
  <svg {...stroke} {...props}>
    <path d="M18 5.8v12.4L8.5 12 18 5.8Z" />
    <path d="M5.5 5v14" />
  </svg>
);

export const NextSceneIcon = (props: GlyphProps) => (
  <svg {...stroke} {...props}>
    <path d="M6 5.8v12.4L15.5 12 6 5.8Z" />
    <path d="M18.5 5v14" />
  </svg>
);

export const VolumeIcon = (props: GlyphProps) => (
  <svg {...stroke} {...props}>
    <path d="M4 9.5h3.4L12 5.6v12.8L7.4 14.5H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z" />
    <path d="M16 9a4.2 4.2 0 0 1 0 6" />
    <path d="M18.6 6.6a7.8 7.8 0 0 1 0 10.8" />
  </svg>
);

export const MuteIcon = (props: GlyphProps) => (
  <svg {...stroke} {...props}>
    <path d="M4 9.5h3.4L12 5.6v12.8L7.4 14.5H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z" />
    <path d="m16.2 9.8 5 4.4" />
    <path d="m21.2 9.8-5 4.4" />
  </svg>
);

export const GuidesIcon = (props: GlyphProps) => (
  <svg {...stroke} {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
    <path d="M9 3.5v17M15 3.5v17M3.5 9h17M3.5 15h17" />
  </svg>
);

export const CaptionIcon = (props: GlyphProps) => (
  <svg {...stroke} {...props}>
    <rect x="2.5" y="5" width="19" height="14" rx="3" />
    <path d="M9.5 10.6a2.6 2.6 0 1 0 0 2.8M17.5 10.6a2.6 2.6 0 1 0 0 2.8" />
  </svg>
);

export const BoxIcon = (props: GlyphProps) => (
  <svg {...stroke} {...props}>
    <path d="M12 2.9 20.5 7v10L12 21.1 3.5 17V7L12 2.9Z" />
    <path d="m3.5 7 8.5 4.6L20.5 7M12 11.6v9.5" />
  </svg>
);

export const FilmIcon = (props: GlyphProps) => (
  <svg {...stroke} {...props}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="M7 4.5v15M17 4.5v15M2.5 12h19M2.5 8.2h4.5M2.5 15.8h4.5M17 8.2h4.5M17 15.8h4.5" />
  </svg>
);

export const CheckIcon = (props: GlyphProps) => (
  <svg {...stroke} {...props}>
    <path d="m5 12.6 4.4 4.4L19 6.6" />
  </svg>
);

export const CloseIcon = (props: GlyphProps) => (
  <svg {...stroke} {...props}>
    <path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" />
  </svg>
);
