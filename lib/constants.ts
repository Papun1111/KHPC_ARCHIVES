// ─── AoT Theme Constants (Official Site Aesthetic) ───────────────────

export const COLORS = {
  bg: {
    primary: "#f4f4f4", // light grey concrete
    secondary: "#ffffff", // stark white
    tertiary: "#e5e5e5",
    card: "#ffffff",
    overlay: "rgba(255, 255, 255, 0.9)",
  },
  black: {
    primary: "#111111",
    secondary: "#222222",
    border: "#000000",
  },
  blood: {
    primary: "#8a0303", // deep blood red
    bright: "#bc0000",
    splatter: "rgba(138, 3, 3, 0.8)",
  },
  text: {
    primary: "#000000",
    secondary: "#444444",
    muted: "#888888",
  },
};

// ─── Insignia Types ────────────────────────────────────────────────────

export type InsigniaType = "survey" | "garrison" | "military_police" | "trainee";

export const INSIGNIA_CONFIG: Record<
  InsigniaType,
  { label: string; color: string; description: string }
> = {
  survey: {
    label: "Survey Corps",
    color: "#000000", // Sharp black
    description: "Wings of Freedom",
  },
  garrison: {
    label: "Garrison",
    color: "#8a0303", // Blood red
    description: "Wall Guard",
  },
  military_police: {
    label: "Military Police",
    color: "#444444", // Grey
    description: "Interior Brigade",
  },
  trainee: {
    label: "Trainee Corps",
    color: "#888888", // Light grey
    description: "Cadet",
  },
};

// ─── Manga Layout Config ───────────────────────────────────────────────

export const MANGA_LAYOUT = {
  targetRowHeight: 280,
  gap: 2, // Tighter gap for comic panel feel
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
