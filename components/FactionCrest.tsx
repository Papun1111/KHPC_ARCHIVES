"use client";

import type { InsigniaType } from "@/lib/constants";

// ═══════════════════════════════════════════════════════════════════════════
// Faction Crest SVG Icons — Lore-Accurate Attack on Titan Emblems
// ═══════════════════════════════════════════════════════════════════════════

interface FactionCrestProps {
  type: InsigniaType;
  size?: number;
  className?: string;
}

export function FactionCrest({ type, size = 20, className = "" }: FactionCrestProps) {
  const crests: Record<InsigniaType, React.ReactNode> = {
    // ── Wings of Freedom (Survey Corps) ──
    survey: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        {/* Left wing (dark) */}
        <path
          d="M12 20 L4 8 L2 4 L6 6 L8 3 L10 7 L12 4 L12 20Z"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Right wing (light) */}
        <path
          d="M12 20 L20 8 L22 4 L18 6 L16 3 L14 7 L12 4 L12 20Z"
          fill="currentColor"
          opacity="0.5"
        />
        {/* Center spine */}
        <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      </svg>
    ),

    // ── Garrison Roses ──
    garrison: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        {/* Rose petals */}
        <path
          d="M12 4 C14 6, 18 8, 18 12 C18 16, 14 18, 12 20 C10 18, 6 16, 6 12 C6 8, 10 6, 12 4Z"
          fill="currentColor"
          opacity="0.8"
        />
        {/* Inner detail */}
        <path
          d="M12 7 C13.5 9, 15 10, 15 12 C15 14.5, 13 16, 12 17 C11 16, 9 14.5, 9 12 C9 10, 10.5 9, 12 7Z"
          fill="currentColor"
          opacity="0.4"
        />
        {/* Stem */}
        <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1.2" />
        {/* Leaves */}
        <path d="M12 19 C10 18, 8 19, 7 18" stroke="currentColor" strokeWidth="0.8" fill="none" />
        <path d="M12 20 C14 19, 16 20, 17 19" stroke="currentColor" strokeWidth="0.8" fill="none" />
      </svg>
    ),

    // ── Military Police Unicorn ──
    military_police: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        {/* Horn */}
        <path
          d="M14 2 L12 8 L16 8 Z"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Head */}
        <path
          d="M8 10 C8 6, 12 5, 14 8 L16 8 C18 8, 19 10, 19 12 C19 14, 18 16, 16 17 L14 18 C12 19, 10 18, 8 16 C6 14, 6 12, 8 10Z"
          fill="currentColor"
          opacity="0.7"
        />
        {/* Eye */}
        <circle cx="12" cy="11" r="1.2" fill="currentColor" opacity="0.3" />
        {/* Mane */}
        <path
          d="M8 10 C6 8, 5 11, 5 13 C5 15, 6 17, 8 16"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        {/* Neck */}
        <path d="M10 18 L8 22 L14 22 L12 18" fill="currentColor" opacity="0.6" />
      </svg>
    ),

    // ── Cadet / Trainee Corps Crossed Swords ──
    trainee: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        {/* Sword 1 (left-to-right diagonal) */}
        <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 3 L5 3 L5 5 Z" fill="currentColor" opacity="0.8" />
        <line x1="18" y1="20" x2="20" y2="22" stroke="currentColor" strokeWidth="2.5" />

        {/* Sword 2 (right-to-left diagonal) */}
        <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M21 3 L19 3 L19 5 Z" fill="currentColor" opacity="0.8" />
        <line x1="4" y1="20" x2="6" y2="22" stroke="currentColor" strokeWidth="2.5" />

        {/* Cross guard accent */}
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5" />
      </svg>
    ),
  };

  return <>{crests[type]}</>;
}
