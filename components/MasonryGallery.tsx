"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageCard, type ImageData } from "./ImageCard";

// ─── MasonryGallery Component ───────────────────────────────────────────

interface MasonryGalleryProps {
  images: ImageData[];
  onSelectImage?: (image: ImageData) => void;
  columns?: number;
}

export function MasonryGallery({ images, onSelectImage, columns = 3 }: MasonryGalleryProps) {
  
  const [effectiveColumns, setEffectiveColumns] = useState(columns);

  useEffect(() => {
    const updateCols = () => {
      setEffectiveColumns(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : columns);
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, [columns]);

  // Split images into columns
  const columnData = useMemo(() => {
    const cols: ImageData[][] = Array.from({ length: effectiveColumns }, () => []);
    const colHeights = Array.from({ length: effectiveColumns }, () => 0);

    images.forEach((img) => {
      // Find shortest column
      let shortestCol = 0;
      let minHeight = colHeights[0];
      for (let i = 1; i < effectiveColumns; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i];
          shortestCol = i;
        }
      }

      cols[shortestCol].push(img);
      // We don't know exact pixel height, but we know aspect ratio. 
      // Assuming equal width columns, height is proportional to 1/aspectRatio
      colHeights[shortestCol] += 1 / img.aspectRatio; 
    });

    return cols;
  }, [images, effectiveColumns]);

  if (images.length === 0) {
    return null; // Empty state handled by parent
  }

  return (
    <div className="flex w-full gap-4">
      {columnData.map((col, colIndex) => (
        <div key={`col-${colIndex}`} className="flex flex-1 flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {col.map((image, index) => (
              <motion.div
                key={image.id}
                layoutId={`masonry-wrapper-${image.id}`}
                className="relative w-full"
                // The aspect ratio determines the container's height naturally
                style={{ aspectRatio: image.aspectRatio }}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.5,
                  delay: (colIndex * 0.1) + (index * 0.05),
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {/* 
                  We override the absolute positioning of ImageCard for Masonry.
                  We pass a 100% style so it completely fills this relative wrapper.
                */}
                <ImageCard
                  image={image}
                  style={{ top: 0, left: 0, width: "100%", height: "100%" }}
                  onSelect={onSelectImage}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
