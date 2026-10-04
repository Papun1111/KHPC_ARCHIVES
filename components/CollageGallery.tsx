"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ImageData } from "@/components/ImageCard";

interface CollageGalleryProps {
  images: ImageData[];
  onSelectImage?: (image: ImageData) => void;
}

// Deterministic pseudo-random number generator based on string
const seedRandom = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(741103597, h);
    return ((h >>> 0) / 4294967296);
  };
};

export default function CollageGallery({ images, onSelectImage }: CollageGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Compute deterministic positions/rotations for each image
  const scatterData = useMemo(() => {
    return images.map((image) => {
      const rng = seedRandom(image.id);
      const rotation = rng() * 8 - 4; // -4 to 4 degrees
      const offsetX = rng() * 24 - 12; // -12 to 12 px
      const offsetY = rng() * 24 - 12; // -12 to 12 px
      return {
        ...image,
        rotation,
        offsetX,
        offsetY,
      };
    });
  }, [images]);

  return (
    <div className="collage-desk relative w-full min-h-[600px] py-16 px-4 md:px-16 overflow-hidden bg-[#1a1d26]">
      {/* Vignette overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(10,11,16,0.95)_100%)] z-10" />
      
      {/* Scattered grid layout */}
      <div className="relative z-20 flex flex-wrap justify-center items-center gap-6 md:gap-10 max-w-[1400px] mx-auto">
        {scatterData.map((image, index) => {
          const isHovered = hoveredId === image.id;
          return (
            <motion.div
              key={image.id}
              className="relative cursor-pointer"
              style={{
                zIndex: isHovered ? 50 : index + 1,
                // Negative margins to create overlap
                margin: "-0.5rem",
              }}
              initial={{
                rotate: image.rotation,
                x: image.offsetX,
                y: image.offsetY,
              }}
              whileHover={{
                scale: 1.08,
                rotate: 0,
                x: 0,
                y: -16,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              onHoverStart={() => setHoveredId(image.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => onSelectImage?.(image)}
            >
              {/* Tape decoration */}
              <div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-7 bg-[#d4c5a0]/40 backdrop-blur-sm rotate-[-3deg] z-10 shadow-sm border border-[#b0a07a]/20" 
                style={{ clipPath: 'polygon(0% 10%, 100% 0%, 95% 90%, 5% 100%)' }} 
              />

              {/* Polaroid Card */}
              <div className="bg-[#e8e6e1] p-3 pb-16 rounded-sm shadow-xl shadow-black/80 border border-[#b0a07a] relative w-60 sm:w-64 md:w-72 lg:w-80 transition-shadow">
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm border border-[#3a3830]">
                  <img
                    src={image.url}
                    alt={image.caption || "Scattered intel"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                {/* Caption Area (Parchment color) */}
                <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center px-4 bg-[#d4c5a0] rounded-b-sm border-t border-[#b0a07a] shadow-inner">
                  <p 
                    className="text-center text-sm md:text-base font-semibold truncate w-full tracking-wide"
                    style={{ color: '#111318', fontFamily: 'var(--font-cinzel)' }}
                  >
                    {image.caption || image.labels[0] || "CLASSIFIED INTEL"}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
