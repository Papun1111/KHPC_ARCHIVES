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

// ─── Demo / Seed Data ──────────────────────────────────────────────────

export interface DemoImage {
  id: string;
  url: string;
  width: number;
  height: number;
  aspectRatio: number;
  caption: string;
  isFavorite: boolean;
  labels: string[];
}

export const DEMO_IMAGES: DemoImage[] = [
  { id: "1", url: "https://picsum.photos/seed/aot1/800/1200", width: 800, height: 1200, aspectRatio: 0.667, caption: "The day humanity received a grim reminder...", isFavorite: true, labels: ["survey"] },
  { id: "2", url: "https://picsum.photos/seed/aot2/1200/600", width: 1200, height: 600, aspectRatio: 2.0, caption: "Wall Maria falls. The outer gate has been breached.", isFavorite: false, labels: ["garrison"] },
  { id: "3", url: "https://picsum.photos/seed/aot3/900/900", width: 900, height: 900, aspectRatio: 1.0, caption: "Dedicate your hearts.", isFavorite: true, labels: ["survey"] },
  { id: "4", url: "https://picsum.photos/seed/aot4/600/900", width: 600, height: 900, aspectRatio: 0.667, caption: "Beyond the walls, freedom awaits.", isFavorite: false, labels: ["survey"] },
  { id: "5", url: "https://picsum.photos/seed/aot5/1600/700", width: 1600, height: 700, aspectRatio: 2.286, caption: "The Rumbling begins. There is no going back.", isFavorite: true, labels: ["survey", "garrison"] },
  { id: "6", url: "https://picsum.photos/seed/aot6/700/1000", width: 700, height: 1000, aspectRatio: 0.7, caption: "Stand up. Fight. That is all I have ever known.", isFavorite: false, labels: ["trainee"] },
  { id: "7", url: "https://picsum.photos/seed/aot7/1000/800", width: 1000, height: 800, aspectRatio: 1.25, caption: "Advance! The enemy is right in front of us!", isFavorite: false, labels: ["military_police"] },
  { id: "8", url: "https://picsum.photos/seed/aot8/850/1100", width: 850, height: 1100, aspectRatio: 0.773, caption: "If you win, you live. If you lose, you die.", isFavorite: true, labels: ["survey"] },
  { id: "9", url: "https://picsum.photos/seed/aot9/1400/650", width: 1400, height: 650, aspectRatio: 2.154, caption: "The world is merciless, and it is also very beautiful.", isFavorite: false, labels: ["garrison"] },
  { id: "10", url: "https://picsum.photos/seed/aot10/750/950", width: 750, height: 950, aspectRatio: 0.789, caption: "I will keep moving forward until my enemies are destroyed.", isFavorite: true, labels: ["survey"] },
];
