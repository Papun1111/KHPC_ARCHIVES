"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & DATA DEFINITION
// ═══════════════════════════════════════════════════════════════════════════

export interface PickUpItem {
  id: string;
  title: string;
  date: string;
  category: "MOVIE" | "EVENT";
  description: string;
  subtitle?: string;
  imageUrl?: string;
  badge?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT: PickUpCarousel
// ═══════════════════════════════════════════════════════════════════════════

interface PickUpCarouselProps {
  items?: PickUpItem[];
  onSelectItem?: (item: PickUpItem) => void;
  className?: string;
}

export default function PickUpCarousel({
  items = [],
  onSelectItem,
  className = "",
}: PickUpCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [dragLimit, setDragLimit] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailItem, setDetailItem] = useState<PickUpItem | null>(null);

  const x = useMotionValue(0);
  const isDraggingRef = useRef(false);

  // Compute card step width (card width + flex gap)
  const getCardStep = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return 280 + 24; // mobile: 280px width + 24px gap (gap-6)
    }
    return 350 + 32; // desktop: 350px width + 32px gap (gap-8)
  }, []);

  // Calculate drag boundaries based on container vs content dimensions
  const updateConstraints = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = contentRef.current.scrollWidth;
      const maxScroll = Math.max(0, contentWidth - containerWidth);
      setDragLimit(maxScroll);

      // Clamp if current translation is beyond new limit
      const currentX = x.get();
      if (currentX < -maxScroll) {
        x.set(-maxScroll);
      }
    }
  }, [x]);

  // Update on window resize and element mutation
  useEffect(() => {
    updateConstraints();

    const handleResize = () => {
      updateConstraints();
    };

    window.addEventListener("resize", handleResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        updateConstraints();
      });
      if (containerRef.current) ro.observe(containerRef.current);
      if (contentRef.current) ro.observe(contentRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      ro?.disconnect();
    };
  }, [updateConstraints]);

  // Sync active index with motionValue changes
  useEffect(() => {
    const unsubscribe = x.on("change", (latestX) => {
      const step = getCardStep();
      const currentIdx = Math.round(Math.abs(latestX) / step);
      const clampedIdx = Math.max(0, Math.min(items.length - 1, currentIdx));
      setActiveIndex(clampedIdx);
    });

    return () => unsubscribe();
  }, [getCardStep, items.length, x]);

  // Navigation handlers
  const scrollToIndex = useCallback(
    (index: number) => {
      const step = getCardStep();
      const targetX = Math.max(-dragLimit, Math.min(0, -index * step));

      animate(x, targetX, {
        type: "spring",
        stiffness: 350,
        damping: 35,
        mass: 0.8,
      });

      setActiveIndex(index);
    },
    [dragLimit, getCardStep, x]
  );

  const handlePrev = useCallback(() => {
    const newIndex = Math.max(0, activeIndex - 1);
    scrollToIndex(newIndex);
  }, [activeIndex, scrollToIndex]);

  const handleNext = useCallback(() => {
    const newIndex = Math.min(items.length - 1, activeIndex + 1);
    scrollToIndex(newIndex);
  }, [activeIndex, items.length, scrollToIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  const handleCardClick = (item: PickUpItem, index: number) => {
    if (isDraggingRef.current) return;
    scrollToIndex(index);
    if (onSelectItem) {
      onSelectItem(item);
    }
    setDetailItem(item);
  };

  const activeItem = items[activeIndex] || items[0];

  if (items.length === 0) {
    return (
      <section className={`relative w-full bg-aot-parchment text-aot-dark py-12 md:py-20 overflow-hidden crack-overlay ${className}`}>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-[2px] bg-aot-blood" />
            <span className="text-mono-xs text-aot-blood tracking-[0.25em] font-bold font-mono">
              TOPICS &amp; ARCHIVE // 特集
            </span>
          </div>
          <h2
            className="heading-brutal heading-brutal-xl text-aot-dark tracking-tighter"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            PICK UP
          </h2>
        </div>
        <div className="section-divider mt-4" />
        <div className="flex min-h-[300px] flex-col items-center justify-center text-center mx-auto max-w-7xl px-4 md:px-8 py-12">
          <div className="mb-6 relative w-16 h-16 opacity-20">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-aot-dark -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-aot-dark -translate-x-1/2" />
            <div className="absolute inset-2 border border-aot-dark rounded-full" />
          </div>
          <h3
            className="mb-2 text-2xl font-bold tracking-widest text-aot-dark uppercase"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            NO FEATURED ITEMS
          </h3>
          <p className="max-w-md text-xs text-text-muted uppercase tracking-wider mt-2 px-4">
            Featured topics and archive entries will appear here once added.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative w-full bg-aot-parchment text-aot-dark py-12 md:py-20 overflow-hidden crack-overlay ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Pick Up Carousel Section"
    >
      {/* ── Heading Block ── */}
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 md:pb-6">
          <div>
            {/* Monospace Sub-header */}
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-[2px] bg-aot-blood" />
              <span className="text-mono-xs text-aot-blood tracking-[0.25em] font-bold font-mono">
                TOPICS &amp; ARCHIVE // 特集
              </span>
            </div>

            {/* Massive Brutalist Heading */}
            <h2
              className="heading-brutal heading-brutal-xl text-aot-dark tracking-tighter"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              PICK UP
            </h2>
          </div>

          {/* Right Status Indicator */}
          <div className="flex items-center gap-4 text-mono-xs text-aot-grey-dark uppercase tracking-widest pb-2 font-mono">
            <span>
              LOGS: {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
            <span className="text-aot-border">|</span>
            <span className="hidden sm:inline">DRAG OR USE ARROWS</span>
          </div>
        </div>
      </div>

      {/* ── 1px Horizontal Divider Line Below Heading ── */}
      <div className="section-divider" />

      {/* ── Carousel Container (Partial cards visible on edges) ── */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none py-8 md:py-12"
      >
        <motion.div
          ref={contentRef}
          drag="x"
          dragConstraints={{ left: -dragLimit, right: 0 }}
          dragElastic={0.1}
          dragMomentum={true}
          style={{ x }}
          onDragStart={() => {
            isDraggingRef.current = true;
          }}
          onDragEnd={() => {
            // Buffer to prevent click firing right after drag release
            setTimeout(() => {
              isDraggingRef.current = false;
            }, 120);

            const step = getCardStep();
            const currentX = x.get();
            const nearestIdx = Math.max(
              0,
              Math.min(items.length - 1, Math.round(Math.abs(currentX) / step))
            );
            setActiveIndex(nearestIdx);
          }}
          className="flex gap-6 md:gap-8 px-4 md:px-8 lg:px-16 w-max cursor-grab active:cursor-grabbing"
        >
          {items.map((item, index) => {
            const isCurrent = activeIndex === index;

            return (
              <motion.article
                key={item.id}
                onClick={() => handleCardClick(item, index)}
                className={`w-[280px] md:w-[350px] shrink-0 aot-border bg-aot-parchment flex flex-col crosshair-corners group cursor-pointer transition-all duration-300 ${
                  isCurrent
                    ? "ring-1 ring-aot-blood/60 shadow-lg"
                    : "hover:shadow-md"
                }`}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {/* Image Area with 3:4 Aspect Ratio and Cinematic Hover */}
                <div className="cinematic-hover aspect-[3/4] w-full relative overflow-hidden bg-aot-dark border-b border-aot-border">
                  {/* Poster Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />

                  {/* Dark overlay with centered + icon via globals.css */}
                  <div className="hover-overlay">
                    <div className="plus-icon" />
                  </div>

                  {/* Category tag badge over top-left */}
                  <div className="absolute top-3 left-3 z-10 bg-aot-dark/90 text-aot-parchment px-2.5 py-1 text-mono-xs tracking-wider aot-border border-white/20 uppercase font-mono font-bold backdrop-blur-xs">
                    {item.category}
                  </div>

                  {/* Card Index Badge over top-right */}
                  <div className="absolute top-3 right-3 z-10 bg-aot-parchment/90 text-aot-dark px-2 py-0.5 text-mono-xs font-mono font-bold aot-border">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Card Content Structure */}
                <div className="p-4 md:p-5 flex flex-col flex-1 justify-between bg-aot-parchment">
                  <div>
                    {/* Top Row: Date & Category */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-aot-border/60">
                      <span className="text-mono-xs text-aot-grey-dark font-mono font-medium">
                        {item.date}
                      </span>
                      <span className="text-mono-xs text-aot-blood font-bold tracking-widest font-mono uppercase">
                        {item.category}
                      </span>
                    </div>

                    {/* Title in Serif Font (Cinzel) */}
                    <h3
                      className="font-serif font-black text-aot-dark text-base md:text-lg mt-3 line-clamp-2 leading-snug group-hover:text-aot-blood transition-colors duration-200"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {item.title}
                    </h3>

                    {/* Brief Description Paragraph */}
                    <p className="text-xs text-text-secondary mt-2.5 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Bottom Meta Bar */}
                  <div className="mt-5 pt-3 border-t border-aot-border/50 flex items-center justify-between text-mono-xs text-aot-grey-dark font-mono">
                    <span>SPEC #{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-aot-dark font-bold group-hover:text-aot-blood transition-colors flex items-center gap-1.5">
                      DETAILS <span className="text-aot-blood">→</span>
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      {/* ── Bottom Section: Date, Description, Category & Arrow Buttons ── */}
      <div className="mx-auto max-w-7xl px-4 md:px-8 mt-4 md:mt-8">
        <div className="aot-border bg-aot-parchment p-4 md:p-6 crosshair-corners relative">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
            {/* Left: Shows Date */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-aot-blood animate-pulse shrink-0" />
              <div>
                <span className="text-mono-xs text-aot-grey-dark block font-mono">
                  ARCHIVE DATE
                </span>
                <span className="text-mono-xs md:text-mono-sm text-aot-dark font-bold font-mono tracking-wider">
                  {activeItem.date}
                </span>
              </div>
            </div>

            {/* Center: Has Description Paragraph */}
            <div className="flex-1 lg:border-x border-aot-border lg:px-8 py-2 lg:py-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-mono-xs text-aot-blood font-bold tracking-wider font-mono uppercase">
                  ACTIVE LOG // {activeItem.title}
                </span>
              </div>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed line-clamp-2">
                {activeItem.description}
              </p>
            </div>

            {/* Right: Category Text & Arrow Buttons */}
            <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 border-t lg:border-t-0 border-aot-border/60 pt-3 lg:pt-0">
              <div className="text-left lg:text-right">
                <span className="text-mono-xs text-aot-grey-dark block font-mono">
                  CATEGORY
                </span>
                <span className="text-mono-xs md:text-mono-sm text-aot-blood font-bold tracking-widest font-mono uppercase">
                  {activeItem.category}
                </span>
              </div>

              {/* Arrow Buttons: Use ← and → characters in bordered boxes */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={activeIndex === 0}
                  aria-label="Previous slide"
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center aot-border bg-aot-parchment text-aot-dark hover:bg-aot-dark hover:text-aot-parchment transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-lg md:text-xl font-mono select-none odm-trigger"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={activeIndex >= items.length - 1}
                  aria-label="Next slide"
                  className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center aot-border bg-aot-parchment text-aot-dark hover:bg-aot-dark hover:text-aot-parchment transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-lg md:text-xl font-mono select-none odm-trigger"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail Modal for Selected Card ── */}
      <AnimatePresence>
        {detailItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-aot-dark/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetailItem(null)}
          >
            <motion.div
              className="relative w-full max-w-2xl bg-aot-parchment aot-border p-6 md:p-8 crosshair-corners shadow-2xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center aot-border bg-aot-parchment text-aot-dark hover:bg-aot-blood hover:text-white transition-colors text-xs font-mono font-bold odm-trigger"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Modal Content */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/2 aspect-[3/4] aot-border overflow-hidden bg-aot-dark shrink-0">
                  <img
                    src={detailItem.imageUrl}
                    alt={detailItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-mono-xs font-mono mb-2">
                      <span className="text-aot-blood font-bold tracking-widest uppercase">
                        {detailItem.category}
                      </span>
                      <span className="text-aot-border">•</span>
                      <span className="text-aot-grey-dark">{detailItem.date}</span>
                    </div>

                    <h3
                      className="text-xl md:text-2xl font-black text-aot-dark leading-tight mt-1"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {detailItem.title}
                    </h3>

                    {detailItem.subtitle && (
                      <p className="text-mono-xs text-aot-grey-dark font-mono mt-1">
                        {detailItem.subtitle}
                      </p>
                    )}

                    <div className="w-full h-[1px] bg-aot-border my-4" />

                    <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                      {detailItem.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-aot-border flex items-center justify-between">
                    <span className="text-mono-xs text-aot-grey-dark font-mono">
                      CLASSIFIED STATUS // UNRESTRICTED
                    </span>
                    <button
                      type="button"
                      onClick={() => setDetailItem(null)}
                      className="px-4 py-2 bg-aot-dark text-aot-parchment text-mono-xs font-mono font-bold tracking-wider hover:bg-aot-blood transition-colors odm-trigger"
                    >
                      ACKNOWLEDGE
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

export { PickUpCarousel };
