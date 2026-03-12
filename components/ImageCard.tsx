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

// ─── ImageCard Component (Stark Minimalist) ─────────────────────────────

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
      className="absolute cursor-pointer overflow-hidden bg-white group sharp-border"
      style={{
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(image)}
      whileHover={{ zIndex: 10 }}
      transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
    >
      {/* Container to restrict image scale without breaking layout block */}
      <motion.div
        className="relative h-full w-full overflow-hidden"
      >
        {/* Grey noise overlay that fades on hover */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none opacity-20 group-hover:opacity-0 transition-opacity mix-blend-multiply"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* The actual image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.caption || "Gallery image"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 filter grayscale-[50%] group-hover:grayscale-0"
          loading="lazy"
        />

        {/* ── Favorite Mark (Aggressive red slash) ── */}
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
                className="flex h-10 w-10 items-center justify-center bg-[#8a0303] text-white"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
              >
                <span className="absolute top-1.5 right-1.5 text-xs">★</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Dark gradient overlay on hover ── */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/40 z-10"
            />
          )}
        </AnimatePresence>

        {/* ── Insignia Labels (top-left stark black stamps) ── */}
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

        {/* ── Typewriter Caption (bottom stark white box) ── */}
        <AnimatePresence>
          {isHovered && image.caption && (
            <motion.div
              className="absolute bottom-3 left-3 right-3 z-20"
              initial={{ opacity: 0, scaleY: 0, transformOrigin: "bottom" }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="sharp-border bg-white w-full relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8a0303]" />
                <div className="p-3 pl-4">
                  <p
                    className="text-[11px] leading-relaxed text-black font-medium"
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
