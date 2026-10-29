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
  onAddMovie?: () => void;
  onDeleteMovie?: (id: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// Empty initial movies list (User uploads their own records)
// ═══════════════════════════════════════════════════════════════════════════

export const DEMO_MOVIES: MovieEntry[] = [];

// ═══════════════════════════════════════════════════════════════════════════
// MovieGalleryTimeline Component
// ═══════════════════════════════════════════════════════════════════════════

export function MovieGalleryTimeline({
  movies = [],
  className = "",
  onMovieSelect,
  onAddMovie,
  onDeleteMovie,
}: MovieGalleryTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (movies.length === 0) {
    return (
      <section
        id="movies"
        className={`relative w-full bg-aot-parchment text-aot-dark crack-overlay py-16 md:py-24 ${className}`}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-[2px] bg-aot-blood inline-block" />
                <span className="text-mono-xs text-aot-blood tracking-[0.3em] uppercase font-bold">
                  THEATRICAL ARCHIVE // 劇場版
                </span>
              </div>
              <h2 className="heading-brutal heading-brutal-xl">MOVIE GALLERY</h2>
            </div>
            {onAddMovie && (
              <button
                onClick={onAddMovie}
                className="group relative flex items-center justify-center overflow-hidden aot-border bg-aot-parchment px-5 py-2.5 text-mono-xs transition-colors odm-trigger font-bold"
              >
                <span className="absolute inset-0 bg-aot-blood transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2 text-aot-dark group-hover:text-white transition-colors">
                  + ADD MOVIE RECORD
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="section-divider mt-6 mb-10" />
        <div className="flex min-h-[300px] flex-col items-center justify-center text-center mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-6 relative w-16 h-16 opacity-20">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-aot-dark -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-aot-dark -translate-x-1/2" />
            <div className="absolute inset-2 border border-aot-dark rounded-full" />
          </div>
          <h3
            className="mb-2 text-2xl font-bold tracking-widest text-aot-dark uppercase"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            NO THEATRICAL RECORDS
          </h3>
          <p className="max-w-md text-xs text-text-muted uppercase tracking-wider mt-2 mb-6 px-4">
            No movie records or theatrical cuts have been added to the archive yet. Upload your custom theatrical posters and story debriefings.
          </p>
          {onAddMovie && (
            <button
              onClick={onAddMovie}
              className="px-6 py-3 aot-border bg-aot-blood text-white hover:bg-aot-blood-bright text-mono-xs tracking-widest font-bold uppercase transition-colors flex items-center gap-2 shadow-lg"
            >
              <span>+ UPLOAD THEATRICAL RECORD</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  const activeMovie = movies[activeIndex] || movies[0];

  return (
    <section
      id="movies"
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

          <div className="flex items-center gap-4">
            {onAddMovie && (
              <button
                onClick={onAddMovie}
                className="group relative flex items-center justify-center overflow-hidden aot-border bg-aot-parchment px-4 py-2 text-mono-xs transition-colors odm-trigger font-bold text-aot-dark"
              >
                <span className="absolute inset-0 bg-aot-blood transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-1.5 group-hover:text-white transition-colors">
                  + ADD MOVIE RECORD
                </span>
              </button>
            )}
            <div className="text-mono-xs text-aot-grey-dark uppercase tracking-widest sm:text-right pb-1">
              <span className="font-mono text-aot-dark font-bold">
                RECORDS: 0{movies.length} ENTRIES
              </span>
              <div className="text-[10px] text-text-secondary font-mono tracking-wider mt-0.5">
                TIMELINE // {movies[0]?.date?.split(".")[0] || "ARCHIVE"}
              </div>
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
                      <div className="flex items-center gap-3">
                        {onDeleteMovie && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete record "${activeMovie.title}"?`)) {
                                onDeleteMovie(activeMovie.id);
                              }
                            }}
                            className="px-2 py-0.5 border border-aot-blood text-aot-blood-bright hover:bg-aot-blood hover:text-white transition-colors text-[10px] uppercase font-bold"
                          >
                            DELETE RECORD
                          </button>
                        )}
                        <span className="text-aot-blood-bright tracking-wider flex items-center gap-1 font-mono">
                          HOVER TIMELINE TO INSPECT
                        </span>
                      </div>
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
