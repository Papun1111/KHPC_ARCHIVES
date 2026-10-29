"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface MovieEntry {
  id: string;
  version: string;
  date: string;
  category: string;
  title: string;
  subtitle: string;
  runtime?: string;
  format?: string;
  posterUrl?: string;
  gradient?: string;
}

export interface MovieGalleryTimelineProps {
  movies?: MovieEntry[];
  className?: string;
  onMovieSelect?: (movie: MovieEntry) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// Demo Data — Official Attack on Titan Theatrical Releases
// ═══════════════════════════════════════════════════════════════════════════

export const DEMO_MOVIES: MovieEntry[] = [
  {
    id: "movie-v1",
    version: "V1",
    date: "2025.8.16",
    category: "MOVIE",
    title: "Movie Attack On Titan - Special Version - The Last Attack",
    subtitle:
      "Special report // Final season theatrical compilation featuring reconstructed battle sequences, remastered 5.1ch surround sound, and exclusive post-credits epilogue footage.",
    runtime: "145 MIN",
    format: "THEATRICAL SPECIAL VERSION // 5.1ch",
    posterUrl: "/aot.jpg",
    gradient:
      "radial-gradient(circle at 75% 25%, rgba(196, 30, 30, 0.45) 0%, rgba(138, 3, 3, 0.3) 35%, rgba(21, 21, 21, 0.95) 75%), linear-gradient(135deg, #151515 0%, #1e0909 50%, #420606 100%)",
  },
  {
    id: "movie-v2",
    version: "V2",
    date: "2025.8.15",
    category: "MOVIE",
    title: "Movie Attack On Titan (2nd part) - Wings of Freedom",
    subtitle:
      "Special report // Season 1 compilation film part two, chronicling the fateful 57th Exterior Scouting Mission and the clash against the Female Titan inside Stohess District.",
    runtime: "120 MIN",
    format: "THEATRICAL 4K REMASTER // 5.1ch",
    posterUrl: "/ymir.jpg",
    gradient:
      "radial-gradient(circle at 80% 30%, rgba(138, 3, 3, 0.5) 0%, rgba(92, 2, 2, 0.35) 40%, rgba(21, 21, 21, 0.95) 80%), linear-gradient(135deg, #121212 0%, #1c0a0a 45%, #4a0707 100%)",
  },
  {
    id: "movie-v3",
    version: "V3",
    date: "2025.8.15",
    category: "MOVIE",
    title: "Movie Attack On Titan (1st part) - Crimson Bow and Arrow",
    subtitle:
      "Special report // Season 1 compilation film part one, documenting the initial fall of Wall Maria, the grueling Trainee Corps days, and the defense of Trost District.",
    runtime: "119 MIN",
    format: "THEATRICAL 4K REMASTER // 5.1ch",
    posterUrl: "/aot.jpg",
    gradient:
      "radial-gradient(circle at 70% 30%, rgba(196, 30, 30, 0.45) 0%, rgba(138, 3, 3, 0.3) 45%, rgba(21, 21, 21, 0.95) 85%), linear-gradient(135deg, #151515 0%, #240a0a 55%, #5c0202 100%)",
  },
  {
    id: "movie-v4",
    version: "V4",
    date: "2020.7.17",
    category: "MOVIE",
    title: "Attack on Titan: Chronicle",
    subtitle:
      "Special report // Definitive cinematic chronicle synthesizing the complete story arc of Seasons 1–3 into a singular theatrical experience before the final march.",
    runtime: "122 MIN",
    format: "CHRONICLE EDITION // 5.1ch",
    posterUrl: "/ymir.jpg",
    gradient:
      "radial-gradient(circle at 75% 25%, rgba(160, 20, 20, 0.4) 0%, rgba(92, 2, 2, 0.3) 40%, rgba(18, 18, 18, 0.95) 80%), linear-gradient(135deg, #121212 0%, #1a0808 50%, #3d0505 100%)",
  },
  {
    id: "movie-v5",
    version: "V5",
    date: "2018.1.13",
    category: "MOVIE",
    title: "Movie Attack On Titan: The Roar of Awakening",
    subtitle:
      "Special report // Season 2 theatrical recap chronicling the breach of Wall Rose, Utgard Castle siege, and the devastating revelation of the Colossal and Armored Titans.",
    runtime: "120 MIN",
    format: "THEATRICAL CUT // 5.1ch",
    posterUrl: "/aot.jpg",
    gradient:
      "radial-gradient(circle at 80% 20%, rgba(196, 30, 30, 0.5) 0%, rgba(138, 3, 3, 0.3) 35%, rgba(21, 21, 21, 0.95) 75%), linear-gradient(135deg, #151515 0%, #200808 45%, #4d0606 100%)",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MovieGalleryTimeline Component
// ═══════════════════════════════════════════════════════════════════════════

export function MovieGalleryTimeline({
  movies = DEMO_MOVIES,
  className = "",
  onMovieSelect,
}: MovieGalleryTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeMovie = movies[activeIndex] || movies[0];

  return (
    <section
      id="movie-gallery"
      className={`relative w-full bg-aot-parchment text-aot-dark crack-overlay py-16 md:py-24 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] bg-aot-blood inline-block" />
              <span className="text-mono-xs text-aot-blood tracking-[0.3em] uppercase font-bold">
                THEATRICAL ARCHIVE // 劇場版
              </span>
            </div>
            <h2 className="heading-brutal heading-brutal-xl">
              MOVIE GALLERY
            </h2>
          </div>

          <div className="text-mono-xs text-aot-grey-dark uppercase tracking-widest sm:text-right pb-1">
            <span className="font-mono text-aot-dark font-bold">
              RECORDS: 0{movies.length} ENTRIES
            </span>
            <div className="text-[10px] text-text-secondary font-mono tracking-wider mt-0.5">
              TIMELINE // 2018 — 2025
            </div>
          </div>
        </div>

        {/* ── 1px Divider Line Below Heading ── */}
        <div className="section-divider mt-6 mb-10 md:mb-14" />

        {/* ── Two-Column Split Layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative">
          {/* ═══════════════════════════════════════════════════════════════
              LEFT SIDE (55-60% width): Sticky Featured Image/Poster Area
              ═══════════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[58%] lg:sticky lg:top-24 self-start z-10">
            <div className="relative aot-border bg-aot-dark overflow-hidden crosshair-corners-all aspect-[16/10] sm:aspect-[16/10] min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] shadow-2xl flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMovie.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8"
                  style={{
                    background:
                      activeMovie.gradient ||
                      "radial-gradient(ellipse at 75% 25%, rgba(196, 30, 30, 0.45) 0%, rgba(138, 3, 3, 0.3) 35%, rgba(21, 21, 21, 0.95) 75%), linear-gradient(135deg, #151515 0%, #1e0909 50%, #420606 100%)",
                  }}
                >
                  {/* Featured poster artwork overlay */}
                  {activeMovie.posterUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={activeMovie.posterUrl}
                      alt={activeMovie.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity filter contrast-125 brightness-75 pointer-events-none"
                    />
                  )}

                  {/* Cinematic dark vignette gradients */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(21,21,21,0.88) 0%, rgba(21,21,21,0.2) 35%, rgba(21,21,21,0.5) 65%, rgba(21,21,21,0.96) 100%)",
                    }}
                  />

                  {/* Subtle technical grid pattern */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.06]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* ── Top Meta Bar Overlay ── */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-aot-blood text-white font-mono font-bold text-xs tracking-widest uppercase shadow-md border border-white/20">
                        {activeMovie.version}
                      </span>
                      <span className="text-mono-xs text-white/80 font-mono tracking-wider">
                        {activeMovie.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-sm border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-aot-blood-bright animate-pulse" />
                      <span className="text-mono-xs text-white/90 tracking-widest uppercase font-mono font-semibold">
                        {activeMovie.category} 
                      </span>
                    </div>
                  </div>

                  {/* ── Center Decorative Watermark ── */}
                  <div className="relative z-10 my-auto pointer-events-none flex items-center justify-center opacity-10">
                    <span
                      className="text-8xl sm:text-9xl font-black text-white tracking-widest select-none"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {activeMovie.version}
                    </span>
                  </div>

                  {/* ── Bottom Overlay Text: Title in large Cinzel font ── */}
                  <div className="relative z-10 mt-auto pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-mono-xs text-aot-blood-bright tracking-[0.25em] font-bold uppercase">
                        OFFICIAL THEATRICAL ARCHIVE
                      </span>
                      <span className="text-white/40 text-xs">•</span>
                      <span className="text-mono-xs text-white/70 font-mono">
                        {activeMovie.runtime || "120 MIN"}
                      </span>
                    </div>

                    {/* Movie title in large Cinzel font */}
                    <h3
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight uppercase tracking-tight drop-shadow-lg"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {activeMovie.title}
                    </h3>

                    {/* Movie subtitle / description */}
                    <p className="text-xs sm:text-sm text-aot-grey/90 mt-2 max-w-xl line-clamp-2 leading-relaxed font-sans">
                      {activeMovie.subtitle}
                    </p>

                    {/* Technical footer metadata */}
                    <div className="flex items-center justify-between border-t border-white/15 pt-3 mt-4 text-mono-xs text-white/70">
                      <span>
                        SPEC: {activeMovie.format || "THEATRICAL 4K // 5.1ch"}
                      </span>
                      <span className="text-aot-blood-bright tracking-wider flex items-center gap-1 font-mono">
                        HOVER TIMELINE TO INSPECT
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              RIGHT SIDE (40-45% width): Scrollable Timeline Entries
              ═══════════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[42%] relative flex-1">
            {/* Thin continuous vertical timeline stroke (1px line) */}
            <div className="timeline-line" />

            {/* List of timeline entries */}
            <div className="flex flex-col">
              {movies.map((movie, idx) => {
                const isActive = activeIndex === idx;

                return (
                  <div
                    key={movie.id}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onFocus={() => setActiveIndex(idx)}
                    onClick={() => {
                      setActiveIndex(idx);
                      onMovieSelect?.(movie);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${movie.version}: ${movie.title}`}
                    className={`timeline-entry group transition-all duration-300 select-none ${
                      isActive
                        ? "active bg-aot-blood/[0.04]"
                        : "hover:bg-aot-blood/[0.02]"
                    }`}
                  >
                    {/* Active/hovered entry subtle left border accent */}
                    {isActive && (
                      <motion.div
                        layoutId="active-movie-timeline-indicator"
                        className="absolute left-0 top-0 bottom-0 w-[2px] bg-aot-blood z-10"
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      />
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Meta Row: Version label, Category, Date */}
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <span className="font-mono font-bold text-xs sm:text-sm text-aot-blood tracking-wider">
                            {movie.version}
                          </span>

                          <span className="text-[10px] text-aot-grey-dark uppercase tracking-widest font-mono font-semibold">
                            [{movie.category}]
                          </span>

                          <span className="text-mono-xs text-text-secondary font-mono">
                            {movie.date}
                          </span>
                        </div>

                        {/* Full Movie Title */}
                        <h4
                          className={`text-base sm:text-lg md:text-xl font-bold transition-colors duration-200 leading-snug ${
                            isActive
                              ? "text-aot-blood"
                              : "text-aot-dark group-hover:text-aot-blood"
                          }`}
                          style={{ fontFamily: "var(--font-cinzel)" }}
                        >
                          {movie.title}
                        </h4>

                        {/* Subtitle / Description */}
                        <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed font-sans">
                          {movie.subtitle}
                        </p>
                      </div>

                      {/* Arrow link: '→' on the right side of the entry */}
                      <div className="flex items-center justify-center shrink-0 w-8 h-8 self-center">
                        <span
                          className={`text-xl font-mono transition-all duration-200 ${
                            isActive
                              ? "text-aot-blood translate-x-1"
                              : "text-aot-grey-dark group-hover:text-aot-blood group-hover:translate-x-1"
                          }`}
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MovieGalleryTimeline;
