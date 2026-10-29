"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
  PanInfo,
} from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════
// Types & Interfaces
// ═══════════════════════════════════════════════════════════════════════════

export interface AnimationPoster {
  id: string;
  title: string;
  titleJp: string;
  releaseDate: string;
  episodeCount: string;
  badge: string;
  description: string;
  classification: string;
  studio: string;
  director: string;
  gradient: string;
  accentColor?: string;
  kanjiWatermark: string;
  broadcastInfo?: string;
}

export interface AnimationGalleryProps {
  items?: AnimationPoster[];
  initialIndex?: number;
  onSelectPoster?: (poster: AnimationPoster) => void;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Demo Data — Official Attack on Titan Animation Portal Archives
// ═══════════════════════════════════════════════════════════════════════════

export const DEMO_ANIMATION_POSTERS: AnimationPoster[] = [
  {
    id: "fs-part4",
    title: "Attack on Titan - The Final Season Part 4",
    titleJp: "進撃の巨人 The Final Season 完結編（後編）",
    releaseDate: "2023.11.04",
    episodeCount: "SPECIAL 02 (EP. 89-90)",
    badge: "THE FINAL CHAPTER",
    classification: "CLASS-S // RUMBLING TERMINATION",
    studio: "MAPPA",
    director: "Yuichiro Hayashi",
    kanjiWatermark: "終尾の巨人",
    broadcastInfo: "NHK GENERAL TV / 85 MINUTE THEATRICAL SPECIAL",
    accentColor: "#c41e1e",
    gradient:
      "radial-gradient(ellipse at 50% 100%, rgba(138, 3, 3, 0.55) 0%, rgba(30, 8, 8, 0.95) 45%, #0d0d10 100%)",
    description:
      "The earth trembles under millions of Colossal Titans. Eren Yeager moves inexorably toward the obliteration of all life outside Paradis. The allied remnants of the Survey Corps and Marleyan Warriors launch their final desperate aerial assault atop Fort Salta.",
  },
  {
    id: "fs-part3",
    title: "Attack on Titan - The Final Season Part 3",
    titleJp: "進撃の巨人 The Final Season 完結編（前編）",
    releaseDate: "2023.03.03",
    episodeCount: "SPECIAL 01 (EP. 88)",
    badge: "THE RUMBLING",
    classification: "CLASS-S // EXTINCTION EVENT",
    studio: "MAPPA",
    director: "Yuichiro Hayashi",
    kanjiWatermark: "地鳴らし",
    broadcastInfo: "NHK GENERAL TV / 60 MINUTE SPECIAL BROADCAST",
    accentColor: "#8a0303",
    gradient:
      "radial-gradient(ellipse at 50% 100%, rgba(92, 2, 2, 0.6) 0%, rgba(20, 16, 24, 0.95) 50%, #0a0b10 100%)",
    description:
      "The Rumbling arrives at the mainland. Cities vanish under boiling steam and crushing steps. Hange Zoë makes the ultimate sacrifice to ensure the flying boat takes wing into the smoke-choked horizon.",
  },
  {
    id: "fs-part2",
    title: "The Final Season Part 2",
    titleJp: "進撃の巨人 The Final Season Part 2",
    releaseDate: "2022.01.09",
    episodeCount: "12 EPISODES (EP. 76-87)",
    badge: "FOUNDING TITAN",
    classification: "CLASS-A // PATHS TRANSCENDENCE",
    studio: "MAPPA",
    director: "Yuichiro Hayashi",
    kanjiWatermark: "始祖奪還",
    broadcastInfo: "NHK GENERAL TV / WEEKLY SUNDAY BROADCAST",
    accentColor: "#d4a843",
    gradient:
      "radial-gradient(ellipse at 50% 100%, rgba(212, 168, 67, 0.35) 0%, rgba(26, 21, 14, 0.9) 50%, #0a0a0f 100%)",
    description:
      "Shiganshina District becomes a tripartite warzone as Marley strikes Paradis from above. Within the ethereal Coordinates of the Paths, Eren and Zeke relive memories across 2,000 years of Eldian suffering.",
  },
  {
    id: "fs-part1",
    title: "The Final Season Part 1",
    titleJp: "進撃の巨人 The Final Season Part 1",
    releaseDate: "2020.12.06",
    episodeCount: "16 EPISODES (EP. 60-75)",
    badge: "WAR OF LIBERIO",
    classification: "CLASS-A // CONTINENTAL INVASION",
    studio: "MAPPA",
    director: "Yuichiro Hayashi",
    kanjiWatermark: "海の向こう",
    broadcastInfo: "NHK GENERAL TV / WINTER BROADCAST",
    accentColor: "#8c8fa3",
    gradient:
      "radial-gradient(ellipse at 50% 100%, rgba(140, 143, 163, 0.35) 0%, rgba(24, 25, 30, 0.95) 50%, #0c0d12 100%)",
    description:
      "Across the sea, the Marleyan Empire fights a grueling four-year war using Warrior candidates. The Survey Corps executes a surgical midnight assault on Liberio, signaling the dawn of the final battle.",
  },
  {
    id: "season3-part2",
    title: "Season 3 Part 2",
    titleJp: "進撃の巨人 Season 3 Part.2",
    releaseDate: "2019.04.28",
    episodeCount: "10 EPISODES (EP. 50-59)",
    badge: "RETAKE WALL MARIA",
    classification: "CLASS-S // BASEMENT REVELATION",
    studio: "WIT STUDIO",
    director: "Tetsuro Araki / Masashi Koizuka",
    kanjiWatermark: "奪還作戦",
    broadcastInfo: "NHK GENERAL TV / SPRING COUR",
    accentColor: "#4a7c59",
    gradient:
      "radial-gradient(ellipse at 50% 100%, rgba(74, 124, 89, 0.45) 0%, rgba(25, 32, 26, 0.95) 50%, #0b0f0d 100%)",
    description:
      "The decisive campaign to seal Wall Maria in Shiganshina. Erwin Smith leads the suicide charge against the Beast Titan while Levi strikes down Zeke. In the basement of the Yeager household, humanity discovers the photograph that changes everything.",
  },
  {
    id: "season3-part1",
    title: "Season 3 Part 1",
    titleJp: "進撃の巨人 Season 3 Part.1",
    releaseDate: "2018.07.22",
    episodeCount: "12 EPISODES (EP. 38-49)",
    badge: "UPRISING ARC",
    classification: "CLASS-B // ROYAL DYNASTY OVERTHROW",
    studio: "WIT STUDIO",
    director: "Tetsuro Araki / Masashi Koizuka",
    kanjiWatermark: "王政篇",
    broadcastInfo: "NHK GENERAL TV / SUMMER COUR",
    accentColor: "#6b6458",
    gradient:
      "radial-gradient(ellipse at 50% 100%, rgba(138, 130, 117, 0.35) 0%, rgba(28, 26, 23, 0.95) 50%, #0c0b0a 100%)",
    description:
      "Inside the walls, the Survey Corps is hunted by Kenny the Ripper and the Interior Military Police. Historia Reiss confronts her father beneath the crystal chapel, shattering generations of royal indoctrination.",
  },
  {
    id: "season2",
    title: "Season 2",
    titleJp: "進撃の巨人 Season 2",
    releaseDate: "2017.04.01",
    episodeCount: "12 EPISODES (EP. 26-37)",
    badge: "CLASH OF THE TITANS",
    classification: "CLASS-A // INFILTRATOR IDENTIFIED",
    studio: "WIT STUDIO",
    director: "Tetsuro Araki / Masashi Koizuka",
    kanjiWatermark: "咆哮",
    broadcastInfo: "TOKYO MX / MBS / NATIONWIDE",
    accentColor: "#8a0303",
    gradient:
      "radial-gradient(ellipse at 50% 100%, rgba(138, 3, 3, 0.45) 0%, rgba(26, 15, 20, 0.95) 50%, #0c0b0e 100%)",
    description:
      "Wall Rose is breached by Titans of mysterious origin. A desperate siege at Utgard Castle reveals Ymir's true identity, culminating in Reiner and Bertholdt's shocking rooftop betrayal atop Wall Rose.",
  },
  {
    id: "chronicle",
    title: "Attack on Titan - Chronicle",
    titleJp: "「進撃の巨人」〜クロニクル〜",
    releaseDate: "2020.07.17",
    episodeCount: "THEATRICAL FILM (122 MINS)",
    badge: "THEATRICAL ARCHIVE",
    classification: "CLASS-A // TOTAL MILITARY DIGEST",
    studio: "WIT STUDIO / PONY CANYON",
    director: "Masashi Koizuka",
    kanjiWatermark: "記録全編",
    broadcastInfo: "TOHO CINEMAS / NATIONWIDE THEATRICAL ROADSHOW",
    accentColor: "#3a5a40",
    gradient:
      "radial-gradient(ellipse at 50% 100%, rgba(58, 90, 64, 0.45) 0%, rgba(20, 26, 22, 0.95) 50%, #0a0d0b 100%)",
    description:
      "The definitive cinematic re-edit compiling the complete saga of Seasons 1 through 3. Remastered 5.1 surround sound and revised cuts chronicling humanity's struggle from the breach of Shiganshina to the shore of the ocean.",
  },
  {
    id: "oad-archive",
    title: "OAD Archive Collection",
    titleJp: "進撃の巨人 OAD アーカイブ",
    releaseDate: "2013-2018",
    episodeCount: "8 EPISODES (SPECIAL DISC)",
    badge: "OAD COLLECTION",
    classification: "CLASS-B // CLASSIFIED FIELD NOTES",
    studio: "WIT STUDIO",
    director: "Tetsuro Araki",
    kanjiWatermark: "外伝記録",
    broadcastInfo: "ORIGINAL ANIMATION DVD BUNDLED ARCHIVES",
    accentColor: "#b0a07a",
    gradient:
      "radial-gradient(ellipse at 50% 100%, rgba(176, 160, 122, 0.35) 0%, rgba(28, 24, 20, 0.95) 50%, #0c0b0a 100%)",
    description:
      "Declassified auxiliary operations including Ilse's Notebook, the two-part origins of Levi Ackermann in 'No Regrets', and Annie Leonhart's investigative assignment in 'Lost Girls'.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

function getWrappedDiff(index: number, activeIndex: number, total: number): number {
  let diff = index - activeIndex;
  while (diff > total / 2) diff -= total;
  while (diff < -total / 2) diff += total;
  return diff;
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Component: AnimationGallery
// ═══════════════════════════════════════════════════════════════════════════

export default function AnimationGallery({
  items = DEMO_ANIMATION_POSTERS,
  initialIndex = 0,
  onSelectPoster,
  className = "",
}: AnimationGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [selectedPoster, setSelectedPoster] = useState<AnimationPoster | null>(null);
  const [windowWidth, setWindowWidth] = useState(1200);

  // Framer Motion motion value for responsive dragging & transitions
  const dragX = useMotionValue(0);
  const galleryContainerRef = useRef<HTMLDivElement>(null);

  // Track responsive screen sizing
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute responsive card measurements
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const cardWidth = isMobile ? 270 : isTablet ? 330 : 390;
  const slotSpacing = isMobile ? 210 : isTablet ? 270 : 330;

  // Navigation handlers
  const navigate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setActiveIndex((prev) => {
        const next = (prev + newDirection + items.length) % items.length;
        return next;
      });

      // Smooth motion spring transition
      dragX.set(newDirection * 40);
      animate(dragX, 0, {
        type: "spring",
        stiffness: 280,
        damping: 24,
      });
    },
    [items.length, dragX]
  );

  const handleNext = useCallback(() => navigate(1), [navigate]);
  const handlePrev = useCallback(() => navigate(-1), [navigate]);

  const navigateTo = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndex) return;
      const diff = getWrappedDiff(targetIndex, activeIndex, items.length);
      setDirection(diff > 0 ? 1 : -1);
      setActiveIndex(targetIndex);

      dragX.set((diff > 0 ? 1 : -1) * 35);
      animate(dragX, 0, {
        type: "spring",
        stiffness: 280,
        damping: 24,
      });
    },
    [activeIndex, items.length, dragX]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is focused
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape" && selectedPoster) setSelectedPoster(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, selectedPoster]);

  // Handle Drag Gesture
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 40;
    const velocityThreshold = 250;

    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    } else {
      animate(dragX, 0, {
        type: "spring",
        stiffness: 350,
        damping: 28,
      });
    }
  };

  const currentPoster = items[activeIndex];

  const handleCardClick = (poster: AnimationPoster) => {
    setSelectedPoster(poster);
    if (onSelectPoster) onSelectPoster(poster);
  };

  return (
    <section
      ref={galleryContainerRef}
      className={`relative w-full bg-aot-parchment text-aot-dark overflow-hidden border-y aot-border py-12 md:py-20 select-none ${className}`}
      aria-label="Animation Gallery Carousel"
    >
      {/* ── Background Structural Framing Lines ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Structural Guide Vertical Lines */}
        <div className="absolute top-0 bottom-0 left-4 sm:left-8 md:left-16 w-[1px] bg-aot-border opacity-60" />
        <div className="absolute top-0 bottom-0 right-4 sm:right-8 md:right-16 w-[1px] bg-aot-border opacity-60" />

        {/* Decorative corner crosshairs */}
        <div className="absolute top-4 left-4 sm:left-8 md:left-16 w-3 h-3 border-t border-l border-aot-grey-dark" />
        <div className="absolute top-4 right-4 sm:right-8 md:right-16 w-3 h-3 border-t border-r border-aot-grey-dark" />
        <div className="absolute bottom-4 left-4 sm:left-8 md:left-16 w-3 h-3 border-b border-l border-aot-grey-dark" />
        <div className="absolute bottom-4 right-4 sm:right-8 md:right-16 w-3 h-3 border-b border-r border-aot-grey-dark" />

        {/* Crack overlay decoration on right */}
        <div className="crack-overlay absolute inset-0 opacity-40 pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 z-10">
        {/* ── Section Header Frame ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b aot-border">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 bg-aot-blood animate-pulse" />
              <span className="text-mono-xs text-aot-blood font-bold tracking-[0.25em] uppercase">
                ARCHIVE SECTION 04 // ANIME CHRONICLES
              </span>
              <span className="text-aot-border hidden sm:inline">|</span>
              <span className="text-mono-xs text-text-muted hidden sm:inline tracking-wider uppercase">
                CLASSIFIED MILITARY RECORD
              </span>
            </div>

            <h2
              className="heading-brutal heading-brutal-lg tracking-tight text-aot-dark"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              ANIMATION GALLERY
            </h2>
            <p className="text-xs md:text-sm text-text-secondary mt-1 font-serif tracking-widest opacity-80 uppercase">
              進撃の巨人 // BROADCAST & THEATRICAL RELEASES
            </p>
          </div>

          {/* Right Header: Index Meter & Status */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-mono-xs text-text-muted uppercase tracking-widest">
                ARCHIVE INDEX
              </p>
              <p
                className="text-2xl font-bold tracking-tight text-aot-dark font-mono"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {(activeIndex + 1).toString().padStart(2, "0")}{" "}
                <span className="text-sm font-normal text-aot-border font-mono">
                  / {items.length.toString().padStart(2, "0")}
                </span>
              </p>
            </div>

            <div className="h-10 w-[1px] bg-aot-border hidden sm:block" />

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-mono-xs text-text-muted">SIGNAL</span>
              <span className="text-mono-xs text-aot-blood font-bold tracking-wider">
                SYNCED 100%
              </span>
            </div>
          </div>
        </div>

        {/* ── Horizontal Poster Carousel Stage ── */}
        <div
          className="relative w-full h-[470px] sm:h-[540px] md:h-[620px] flex items-center justify-center overflow-hidden my-4 cursor-grab active:cursor-grabbing"
          style={{ perspective: 1200 }}
        >
          {/* Framer Motion drag container */}
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x: dragX }}
          >
            {items.map((item, index) => {
              const diff = getWrappedDiff(index, activeIndex, items.length);

              // Position calculations based on distance from center (diff = 0)
              let targetX = 0;
              let targetScale = 1;
              let targetOpacity = 1;
              let targetZIndex = 30;
              let targetFilter = "brightness(1) contrast(1.05)";

              if (diff === 0) {
                // CENTER CARD
                // full size (~400px wide, aspect-ratio 2/3), opacity 1
                targetX = 0;
                targetScale = 1;
                targetOpacity = 1;
                targetZIndex = 30;
                targetFilter = "brightness(1.05) contrast(1.05)";
              } else if (Math.abs(diff) === 1) {
                // ADJACENT CARDS
                // slightly smaller (~320px = ~0.8 scale), dimmed (opacity 0.7)
                targetX = diff * slotSpacing;
                targetScale = 0.82;
                targetOpacity = 0.7;
                targetZIndex = 20;
                targetFilter = "brightness(0.85) contrast(0.98)";
              } else if (Math.abs(diff) === 2) {
                // FAR CARDS
                // even smaller (~280px = ~0.7 scale), more dimmed (opacity 0.4)
                targetX = diff * (slotSpacing * 1.8);
                targetScale = 0.7;
                targetOpacity = 0.4;
                targetZIndex = 10;
                targetFilter = "brightness(0.7) contrast(0.9)";
              } else {
                // FAR-OFF HIDDEN CARDS
                targetX = (diff > 0 ? 1 : -1) * (slotSpacing * 2.6);
                targetScale = 0.55;
                targetOpacity = 0;
                targetZIndex = 0;
                targetFilter = "brightness(0.5)";
              }

              const isCenter = diff === 0;

              return (
                <motion.div
                  key={item.id}
                  animate={{
                    x: targetX,
                    scale: targetScale,
                    opacity: targetOpacity,
                    zIndex: targetZIndex,
                    filter: targetFilter,
                  }}
                  transition={{
                    x: { type: "spring", stiffness: 240, damping: 28 },
                    scale: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
                    opacity: { duration: 0.4 },
                    filter: { duration: 0.4 },
                  }}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-shadow duration-300 ${
                    isCenter ? "crosshair-corners" : "hover:opacity-90"
                  }`}
                  style={{
                    width: `${cardWidth}px`,
                    aspectRatio: "2/3",
                    pointerEvents: Math.abs(diff) > 2 ? "none" : "auto",
                  }}
                  onClick={() => {
                    if (isCenter) {
                      handleCardClick(item);
                    } else {
                      navigateTo(index);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${item.title} ${isCenter ? "(Selected)" : ""}`}
                >
                  {/* Card Structure: 1px grey border */}
                  <div
                    className={`relative w-full h-full border border-aot-border overflow-hidden bg-aot-dark cinematic-hover group shadow-2xl transition-all duration-300 ${
                      isCenter
                        ? "shadow-[0_20px_50px_rgba(21,21,21,0.25)] border-aot-grey-dark"
                        : "shadow-md"
                    }`}
                  >
                    {/* Poster Image Graphic Area (Dramatic dark gradient background) */}
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{ background: item.gradient }}
                    >
                      {/* Geometric Brutalist Grid / Texture Lines */}
                      <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                          backgroundImage:
                            "linear-gradient(rgba(200, 200, 196, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 200, 196, 0.2) 1px, transparent 1px)",
                          backgroundSize: "40px 40px",
                        }}
                      />

                      {/* Giant Kanji Watermark in Background */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                        <span
                          className="font-serif font-black text-white/[0.07] text-[5rem] sm:text-[6.5rem] md:text-[8rem] tracking-tighter leading-none select-none transform rotate-90 sm:rotate-0"
                          style={{ fontFamily: "var(--font-cinzel)" }}
                        >
                          {item.kanjiWatermark}
                        </span>
                      </div>

                      {/* Top Card Metadata Header */}
                      <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between text-white/70 z-10 border-b border-white/10 bg-black/30 backdrop-blur-[2px]">
                        <span className="text-mono-xs text-white/80 font-bold tracking-widest uppercase">
                          {item.badge}
                        </span>
                        <span className="text-mono-xs font-mono text-white/50 tracking-wider">
                          DOC: {index + 1}
                        </span>
                      </div>

                      {/* Decorative Diagonal Attack Slits */}
                      <div className="absolute -right-8 -top-8 w-28 h-28 border-r border-b border-white/10 pointer-events-none transform rotate-45 opacity-40" />

                      {/* Subtle Central Emblem Crest */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                        <svg
                          className="w-32 h-32 text-white"
                          viewBox="0 0 100 100"
                          fill="none"
                          stroke="currentColor"
                        >
                          <polygon
                            points="50,15 85,35 85,75 50,95 15,75 15,35"
                            strokeWidth="1"
                            strokeDasharray="2 3"
                          />
                          <circle cx="50" cy="55" r="22" strokeWidth="1" />
                          <line x1="50" y1="20" x2="50" y2="90" strokeWidth="0.5" />
                          <line x1="20" y1="55" x2="80" y2="55" strokeWidth="0.5" />
                        </svg>
                      </div>

                      {/* Accent Color Glowing Rim on Center Card */}
                      {isCenter && (
                        <div
                          className="absolute inset-0 border border-aot-blood/30 pointer-events-none"
                          style={{
                            boxShadow: "inset 0 0 25px rgba(138, 3, 3, 0.2)",
                          }}
                        />
                      )}
                    </div>

                    {/* Title Overlay at bottom of card (Dark gradient fade-up with white text) */}
                    <div className="absolute inset-x-0 bottom-0 pt-20 pb-5 px-5 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-10 flex flex-col justify-end">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-aot-blood" />
                        <span className="text-mono-xs text-aot-blood-bright tracking-widest font-bold uppercase">
                          {item.episodeCount}
                        </span>
                      </div>

                      <h3
                        className="font-serif text-white font-bold text-base sm:text-lg md:text-xl leading-tight drop-shadow-md uppercase line-clamp-2"
                        style={{ fontFamily: "var(--font-cinzel)" }}
                      >
                        {item.title}
                      </h3>

                      <p className="text-[11px] text-white/60 font-serif tracking-wider mt-1 truncate">
                        {item.titleJp}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-mono-xs text-white/50">
                        <span>REL: {item.releaseDate}</span>
                        <span>{item.studio}</span>
                      </div>
                    </div>

                    {/* On Hover: Dark overlay with centered + icon (use .cinematic-hover pattern) */}
                    <div className="hover-overlay">
                      <div className="plus-icon" />
                      <span className="text-mono-xs text-white tracking-[0.25em] uppercase mt-3 font-bold bg-black/60 px-3 py-1 border border-white/20">
                        INSPECT ARCHIVE
                      </span>
                    </div>

                    {/* Corner Crosshair Decoration for Cards */}
                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/30 pointer-events-none" />
                    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/30 pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/30 pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/30 pointer-events-none" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Prominent Center Item Title Dossier (Below Carousel) ── */}
        <div className="relative w-full max-w-5xl mx-auto mt-6 md:mt-10">
          <div className="aot-border bg-aot-parchment-dark/70 p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-sm">
            {/* Blood Accent Indicator Bar on Left */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-aot-blood" />

            {/* Subtle Crosshair in Top-Right */}
            <div className="absolute top-3 right-3 text-mono-xs text-aot-grey-dark font-mono opacity-60">
              [ REF: SHINGEKI-{currentPoster.id.toUpperCase()} ]
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPoster.id}
                custom={direction}
                variants={{
                  enter: (d: number) => ({
                    opacity: 0,
                    x: d > 0 ? 30 : -30,
                    filter: "blur(4px)",
                  }),
                  center: {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                  },
                  exit: (d: number) => ({
                    opacity: 0,
                    x: d > 0 ? -30 : 30,
                    filter: "blur(4px)",
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
              >
                <div className="flex-1">
                  {/* Category, Badge, & Classification */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2.5">
                    <span className="px-2 py-0.5 bg-aot-blood text-white text-mono-xs font-bold tracking-widest uppercase">
                      {currentPoster.badge}
                    </span>
                    <span className="text-mono-xs text-text-muted">|</span>
                    <span className="text-mono-xs text-aot-dark font-bold tracking-wider">
                      {currentPoster.classification}
                    </span>
                    <span className="text-mono-xs text-text-muted hidden sm:inline">
                      |
                    </span>
                    <span className="text-mono-xs text-text-muted tracking-wider hidden sm:inline">
                      {currentPoster.broadcastInfo}
                    </span>
                  </div>

                  {/* Prominent Center Item Title */}
                  <h3
                    className="heading-brutal text-2xl sm:text-3xl md:text-4xl text-aot-dark tracking-tight leading-none uppercase"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {currentPoster.title}
                  </h3>

                  {/* Japanese Subtitle */}
                  <p className="text-sm md:text-base text-text-secondary mt-1.5 font-serif tracking-widest">
                    {currentPoster.titleJp}
                  </p>

                  {/* Lore Description */}
                  <p className="text-xs sm:text-sm text-text-secondary mt-4 max-w-3xl leading-relaxed font-sans">
                    {currentPoster.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-mono-xs text-text-muted pt-3 border-t aot-border">
                    <div>
                      <span className="text-aot-dark font-bold">RELEASE:</span>{" "}
                      {currentPoster.releaseDate}
                    </div>
                    <div>
                      <span className="text-aot-dark font-bold">LENGTH:</span>{" "}
                      {currentPoster.episodeCount}
                    </div>
                    <div>
                      <span className="text-aot-dark font-bold">STUDIO:</span>{" "}
                      {currentPoster.studio}
                    </div>
                    <div>
                      <span className="text-aot-dark font-bold">DIRECTOR:</span>{" "}
                      {currentPoster.director}
                    </div>
                  </div>
                </div>

                {/* Inspect Action Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleCardClick(currentPoster)}
                    className="px-6 py-3.5 aot-border bg-aot-dark text-aot-parchment hover:bg-aot-blood hover:text-white text-mono-xs tracking-[0.2em] font-bold uppercase transition-all duration-200 odm-trigger flex items-center justify-center gap-3 shadow-md"
                  >
                    <span>OPEN DOSSIER</span>
                    <span className="text-aot-blood-bright group-hover:text-white">
                      ＋
                    </span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Navigation Bar: Left & Right 48px Square Arrow Buttons ── */}
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto mt-8 pt-4 border-t aot-border">
          {/* Left Arrow Button (←) at bottom-left in a bordered square box (48px square) */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="w-12 h-12 flex items-center justify-center aot-border bg-aot-parchment hover:bg-aot-dark hover:text-aot-parchment text-aot-dark transition-all duration-200 odm-trigger active:scale-95 shadow-sm group"
              aria-label="Previous Poster"
              title="Previous Archive (Left Arrow)"
            >
              <span className="text-xl font-light leading-none transform group-hover:-translate-x-0.5 transition-transform">
                ←
              </span>
            </button>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-mono-xs text-text-muted">NAVIGATE [←]</span>
              <span className="text-mono-xs text-aot-dark font-bold tracking-widest uppercase">
                PREVIOUS RECORD
              </span>
            </div>
          </div>

          {/* Centered Pagination Indicators / Bar */}
          <div className="flex items-center gap-2">
            {items.map((poster, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={poster.id}
                  onClick={() => navigateTo(idx)}
                  className={`h-2 transition-all duration-300 odm-trigger ${
                    isActive
                      ? "w-8 bg-aot-blood shadow-[0_0_8px_rgba(138,3,3,0.4)]"
                      : "w-2.5 bg-aot-border hover:bg-aot-grey-dark"
                  }`}
                  aria-label={`Jump to slide ${idx + 1}: ${poster.title}`}
                  title={`${idx + 1}. ${poster.title}`}
                />
              );
            })}
          </div>

          {/* Right Arrow Button (→) at bottom-right in a bordered square box (48px square) */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-mono-xs text-text-muted">NAVIGATE [→]</span>
              <span className="text-mono-xs text-aot-dark font-bold tracking-widest uppercase">
                NEXT RECORD
              </span>
            </div>
            <button
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center aot-border bg-aot-parchment hover:bg-aot-dark hover:text-aot-parchment text-aot-dark transition-all duration-200 odm-trigger active:scale-95 shadow-sm group"
              aria-label="Next Poster"
              title="Next Archive (Right Arrow)"
            >
              <span className="text-xl font-light leading-none transform group-hover:translate-x-0.5 transition-transform">
                →
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal / Lightbox Poster Dossier Preview ── */}
      <AnimatePresence>
        {selectedPoster && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPoster(null)}
          >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />

            {/* Modal Dialog Card */}
            <motion.div
              className="relative z-10 w-full max-w-4xl aot-border bg-aot-parchment text-aot-dark p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden crosshair-corners my-auto"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button — 48px square brutalist box */}
              <button
                onClick={() => setSelectedPoster(null)}
                className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center aot-border bg-aot-parchment hover:bg-aot-blood hover:text-white text-aot-dark transition-colors odm-trigger z-20"
                aria-label="Close Dossier"
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Poster Artwork Miniature on Left */}
                <div
                  className="w-full md:w-72 aspect-[2/3] shrink-0 border border-aot-border relative overflow-hidden shadow-lg"
                  style={{ background: selectedPoster.gradient }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="font-serif font-black text-white/[0.08] text-6xl select-none"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {selectedPoster.kanjiWatermark}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent text-white">
                    <span className="text-mono-xs text-aot-blood-bright font-bold uppercase">
                      {selectedPoster.badge}
                    </span>
                    <h4
                      className="font-serif font-bold text-sm leading-tight mt-1"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {selectedPoster.title}
                    </h4>
                  </div>
                </div>

                {/* Details Dossier on Right */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-aot-blood" />
                    <span className="text-mono-xs text-aot-blood font-bold tracking-widest uppercase">
                      DECLASSIFIED FILE // {selectedPoster.classification}
                    </span>
                  </div>

                  <h3
                    className="heading-brutal text-2xl sm:text-3xl text-aot-dark tracking-tight leading-tight uppercase"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {selectedPoster.title}
                  </h3>

                  <p className="text-sm text-text-secondary mt-1 font-serif tracking-widest">
                    {selectedPoster.titleJp}
                  </p>

                  <div className="mt-4 pt-4 border-t aot-border">
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {selectedPoster.description}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-mono-xs aot-border p-4 bg-aot-parchment-dark/50">
                    <div>
                      <span className="text-text-muted uppercase block">
                        Broadcast Era
                      </span>
                      <span className="text-aot-dark font-bold">
                        {selectedPoster.releaseDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted uppercase block">
                        Format
                      </span>
                      <span className="text-aot-dark font-bold">
                        {selectedPoster.episodeCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted uppercase block">
                        Animation Studio
                      </span>
                      <span className="text-aot-dark font-bold">
                        {selectedPoster.studio}
                      </span>
                    </div>
                    <div>
                      <span className="text-text-muted uppercase block">
                        Lead Director
                      </span>
                      <span className="text-aot-dark font-bold">
                        {selectedPoster.director}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-mono-xs text-text-muted">
                      PARADIS MILITARY INTELLIGENCE // DIVISION 04
                    </span>
                    <button
                      onClick={() => setSelectedPoster(null)}
                      className="px-5 py-2.5 aot-border bg-aot-dark text-aot-parchment hover:bg-aot-blood text-mono-xs tracking-widest font-bold uppercase transition-colors"
                    >
                      CLOSE ARCHIVE
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export { AnimationGallery };
