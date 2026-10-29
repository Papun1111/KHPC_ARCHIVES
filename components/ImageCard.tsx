"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InsigniaLabel } from "./InsigniaLabel";
import { useTypewriter } from "@/hooks/useTypewriter";
import type { InsigniaType } from "@/lib/constants";

// ─── Types ──────────────────────────────────────────────────────────────

export interface ImageData {
  id: string;
  url: string;
  width: number;
  height: number;
  aspectRatio: number;
  caption?: string | null;
  eventName?: string | null;
  isFavorite: boolean;
  labels: string[]; // InsigniaType[]
}

interface ImageCardProps {
  image: ImageData;
  style: React.CSSProperties;
  onSelect?: (image: ImageData) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// ImageCard — Brutalist Parchment Theme with Crosshair Corners
// ═══════════════════════════════════════════════════════════════════════════

export function ImageCard({ image, style, onSelect }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const { displayedText, isTyping } = useTypewriter({
    text: image.caption || "",
    speed: 30,
    startDelay: 300,
    enabled: isHovered && !!image.caption,
  });

  return (
    <motion.div
      layoutId={`image-${image.id}`}
      className="absolute cursor-pointer overflow-hidden group aot-border bg-aot-parchment crosshair-corners"
      style={{
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(image)}
      whileHover={{ zIndex: 10 }}
      transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
    >
      {/* Container */}
      <motion.div className="relative h-full w-full overflow-hidden">
        {/* The actual image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.caption || "Gallery image"}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
          loading="lazy"
        />

        {/* ── Dark overlay on hover with + icon ── */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 bg-black/40 z-10 flex flex-col items-center justify-center"
            >
              {/* Plus icon */}
              <div className="relative w-8 h-8 mb-3">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white -translate-y-1/2" />
                <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white -translate-x-1/2" />
              </div>

              {/* Category text */}
              {image.eventName && (
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[10px] font-bold tracking-[0.2em] text-white/80 uppercase"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {image.eventName}
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Favorite Mark (Blood red triangle) ── */}
        <AnimatePresence>
          {image.isFavorite && (
            <motion.div
              className="absolute top-0 right-0 z-20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center bg-aot-blood text-white"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
              >
                <span className="absolute top-1.5 right-1.5 text-xs">★</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Insignia Labels (faction crests on hover) ── */}
        <AnimatePresence>
          {isHovered && image.labels.length > 0 && (
            <motion.div
              className="absolute left-3 top-3 flex flex-col gap-2 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {image.labels.map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <InsigniaLabel type={label as InsigniaType} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Typewriter Caption (parchment-styled box) ── */}
        <AnimatePresence>
          {isHovered && image.caption && (
            <motion.div
              className="absolute bottom-3 left-3 right-3 z-20"
              initial={{ opacity: 0, scaleY: 0, transformOrigin: "bottom" }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="aot-border bg-aot-parchment/95 backdrop-blur-sm w-full relative overflow-hidden">
                {/* Blood-red accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-aot-blood" />
                <div className="p-3 pl-4">
                  <p
                    className="text-[11px] leading-relaxed text-aot-dark font-medium"
                    style={{
                      fontFamily: "var(--font-cinzel), serif",
                    }}
                  >
                    &ldquo;{displayedText}
                    {isTyping && (
                      <span
                        className="animate-typewriter-blink ml-1 inline-block"
                        style={{
                          borderRight: "3px solid #8a0303",
                          height: "1em",
                        }}
                      />
                    )}
                    {!isTyping && displayedText.length > 0 && <>&rdquo;</>}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
