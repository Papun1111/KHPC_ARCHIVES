// ═══════════════════════════════════════════════════════════════════════════
// KHPC Archives — AoT Theme Constants (Dark-Fantasy Palette)
// ═══════════════════════════════════════════════════════════════════════════

export const COLORS = {
  bg: {
    primary: "#0a0b10",
    secondary: "#111318",
    card: "#15171e",
    elevated: "#1a1d26",
    overlay: "rgba(10, 11, 16, 0.92)",
  },
  faction: {
    surveyGreen: "#3a5a40",
    surveyGreenBright: "#4a7c59",
    wallStone: "#6b6458",
    wallStoneLight: "#8a8275",
    odmIron: "#8c8fa3",
    odmSteel: "#b0b3c5",
  },
  accent: {
    bloodRed: "#8a0303",
    bloodBright: "#bc2020",
    parchment: "#d4c5a0",
    parchmentDark: "#b0a07a",
    titanAmber: "#d4a843",
  },
  text: {
    primary: "#e8e6e1",
    secondary: "#9a978f",
    muted: "#5a584f",
  },
  border: {
    default: "#3a3830",
    light: "rgba(107, 100, 88, 0.3)",
  },
};

// ─── Insignia Types ────────────────────────────────────────────────────

export type InsigniaType = "survey" | "garrison" | "military_police" | "trainee";

export const INSIGNIA_CONFIG: Record<
  InsigniaType,
  { label: string; color: string; description: string; icon: string }
> = {
  survey: {
    label: "Survey Corps",
    color: "#3a5a40",
    description: "Wings of Freedom",
    icon: "wings",
  },
  garrison: {
    label: "Garrison",
    color: "#8a8275",
    description: "Rose Guard",
    icon: "roses",
  },
  military_police: {
    label: "Military Police",
    color: "#8c8fa3",
    description: "Unicorn Brigade",
    icon: "unicorn",
  },
  trainee: {
    label: "Trainee Corps",
    color: "#b0a07a",
    description: "Crossed Swords",
    icon: "swords",
  },
};

// ─── Gallery Layout Modes ──────────────────────────────────────────────

export type GalleryMode = "manga" | "masonry" | "collage" | "panorama" | "grid" | "carousel";

export const GALLERY_MODES: { mode: GalleryMode; label: string; icon: string }[] = [
  { mode: "manga", label: "PANEL", icon: "◫" },
  { mode: "masonry", label: "MASONRY", icon: "⚏" },
  { mode: "collage", label: "COLLAGE", icon: "⬡" },
  { mode: "panorama", label: "PANORAMA", icon: "↔" },
  { mode: "grid", label: "GRID", icon: "⊞" },
  { mode: "carousel", label: "CAROUSEL", icon: "▶" },
];

// ─── Manga Layout Config ───────────────────────────────────────────────

export const MANGA_LAYOUT = {
  targetRowHeight: 280,
  gap: 2,
  panoramaThreshold: 2.0,
  minRowItems: 1,
  maxRowItems: 5,
};

// ─── Canvas Config ─────────────────────────────────────────────────────

export const CANVAS_CONFIG = {
  nodeSize: 160,
  coordinateSize: 200,
  defaultZoom: 0.8,
  minZoom: 0.1,
  maxZoom: 2,
};


