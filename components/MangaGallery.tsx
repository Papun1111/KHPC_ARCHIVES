"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMangaLayout } from "@/hooks/useMangaLayout";
import { ImageCard, type ImageData } from "./ImageCard";

// ─── Types ──────────────────────────────────────────────────────────────

interface MangaGalleryProps {
  images: ImageData[];
  onSelectImage?: (image: ImageData) => void;
}

// ─── MangaGallery Component ─────────────────────────────────────────────

export function MangaGallery({ images, onSelectImage }: MangaGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Measure container width
  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateWidth]);

  // Compute layout
  const layoutItems = images.map((img) => ({
    id: img.id,
    aspectRatio: img.aspectRatio,
  }));

  const { layout, totalHeight } = useMangaLayout(layoutItems, containerWidth);

  // Build a map: id -> layout result
  const layoutMap = new Map(layout.map((l) => [l.id, l]));

  return (
    <div ref={containerRef} className="relative w-full">
      {containerWidth > 0 && (
        <motion.div
          className="relative w-full"
          style={{ height: totalHeight }}
          initial={false}
        >
          <AnimatePresence mode="popLayout">
            {images.map((image, index) => {
              const pos = layoutMap.get(image.id);
              if (!pos) return null;

              return (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    delay: index * 0.03,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <ImageCard
                    image={image}
                    style={{
                      left: pos.x,
                      top: pos.y,
                      width: pos.width,
                      height: pos.height,
                    }}
                    onSelect={onSelectImage}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty state */}
      {images.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <div
            className="mb-4 text-6xl opacity-20"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            ⬡
          </div>
          <h3
            className="mb-2 text-xl"
            style={{
              fontFamily: "var(--font-cinzel)",
              color: "#d4a843",
            }}
          >
            No Memories Yet
          </h3>
          <p className="max-w-md text-sm" style={{ color: "#6b7280" }}>
            Upload images to begin your expedition log. Each memory will be
            arranged in the manga panel layout.
          </p>
        </div>
      )}
    </div>
  );
}
