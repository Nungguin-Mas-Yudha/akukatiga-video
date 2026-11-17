// Editor theme: the channel's QC tool borrows the neutral palette of the
// WA-Bot app (shadcn grays, one near-white accent, Plus Jakarta Sans), so the
// UI stays monochrome and the video is the only thing with colour.
import { defineTheme } from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral/built";

const sans = '"Figtree", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const mono = sans;

export const editorTheme = defineTheme({
  name: "akukatiga-editor",
  extends: neutralTheme,
  tokens: {
    "--font-family-body": sans,
    "--font-family-heading": sans,
    "--font-family-code": mono,
    "--radius-container": "12px",
    "--radius-element": "10px",
    "--radius-inner": "8px",
    "--color-background-body": ["oklch(1 0 0)", "oklch(0.145 0 0)"],
    "--color-background-surface": ["oklch(1 0 0)", "oklch(0.178 0 0)"],
    "--color-background-card": ["oklch(1 0 0)", "oklch(0.205 0 0)"],
    "--color-background-popover": ["oklch(1 0 0)", "oklch(0.205 0 0)"],
    "--color-background-muted": ["oklch(0.97 0 0)", "oklch(0.245 0 0)"],
    "--color-border": ["oklch(0.922 0 0)", "oklch(1 0 0 / 10%)"],
    "--color-border-emphasized": ["oklch(0.87 0 0)", "oklch(1 0 0 / 18%)"],
    "--color-text-primary": ["oklch(0.145 0 0)", "oklch(0.985 0 0)"],
    "--color-text-secondary": ["oklch(0.556 0 0)", "oklch(0.708 0 0)"],
    "--color-accent": ["oklch(0.205 0 0)", "oklch(0.922 0 0)"],
    "--color-accent-muted": ["oklch(0 0 0 / 8%)", "oklch(1 0 0 / 14%)"],
    "--color-on-accent": ["oklch(0.985 0 0)", "oklch(0.205 0 0)"],
    "--color-text-accent": ["oklch(0.205 0 0)", "oklch(0.922 0 0)"],
    "--color-icon-accent": ["oklch(0.205 0 0)", "oklch(0.922 0 0)"],
  },
});
