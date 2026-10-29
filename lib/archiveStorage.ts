// ═══════════════════════════════════════════════════════════════════════════
// KHPC Archives — Local Storage Persistence for User Uploaded Data & Stories
// ═══════════════════════════════════════════════════════════════════════════

import type { PickUpItem } from "@/components/PickUpCarousel";
import type { MovieEntry } from "@/components/MovieGalleryTimeline";
import type { AnimationPoster } from "@/components/AnimationGallery";
import type { ImageData } from "@/components/ImageCard";

const STORAGE_KEYS = {
  PICKUP: "khpc_user_pickup_items",
  MOVIES: "khpc_user_movie_items",
  ANIMATION: "khpc_user_animation_items",
  GALLERY: "khpc_user_gallery_images",
};

// Safe JSON parse helper
function safeGet<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err);
  }
}

// ─── Pick Up Records ────────────────────────────────────────────────────────
export function getSavedPickUpItems(): PickUpItem[] {
  return safeGet<PickUpItem[]>(STORAGE_KEYS.PICKUP, []);
}

export function savePickUpItems(items: PickUpItem[]): void {
  safeSet(STORAGE_KEYS.PICKUP, items);
}

// ─── Movie Gallery Records ──────────────────────────────────────────────────
export function getSavedMovieItems(): MovieEntry[] {
  return safeGet<MovieEntry[]>(STORAGE_KEYS.MOVIES, []);
}

export function saveMovieItems(items: MovieEntry[]): void {
  safeSet(STORAGE_KEYS.MOVIES, items);
}

// ─── Animation Gallery Records ──────────────────────────────────────────────
export function getSavedAnimationItems(): AnimationPoster[] {
  return safeGet<AnimationPoster[]>(STORAGE_KEYS.ANIMATION, []);
}

export function saveAnimationItems(items: AnimationPoster[]): void {
  safeSet(STORAGE_KEYS.ANIMATION, items);
}

// ─── General Gallery Records ────────────────────────────────────────────────
export function getSavedGalleryImages(): ImageData[] {
  return safeGet<ImageData[]>(STORAGE_KEYS.GALLERY, []);
}

export function saveGalleryImages(images: ImageData[]): void {
  safeSet(STORAGE_KEYS.GALLERY, images);
}
