"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ImageData } from '@/components/ImageCard';

interface GridGalleryProps {
  images: ImageData[];
  onSelectImage?: (image: ImageData) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } }
};

export default function GridGallery({ images, onSelectImage }: GridGalleryProps) {
  return (
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {images.map((image) => (
        <motion.div
          key={image.id}
          variants={itemVariants}
          className="group relative aspect-square border border-aot-border bg-aot-parchment overflow-hidden cursor-pointer transition-all duration-300 hover:border-aot-blood hover:shadow-[0_0_12px_rgba(138,3,3,0.15)]"
          onClick={() => onSelectImage?.(image)}
        >
          {/* Image */}
          <img
            src={image.url}
            alt={image.caption || 'Gallery Image'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Caption Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-aot-parchment via-aot-parchment/85 to-transparent flex flex-col justify-end min-h-[50%]">
            {image.caption && (
              <p className="text-aot-dark text-sm font-medium line-clamp-2" style={{ fontFamily: 'var(--font-inter, sans-serif)' }}>
                {image.caption}
              </p>
            )}
            {image.eventName && (
              <p className="text-text-secondary text-xs mt-1 uppercase tracking-wider font-semibold" style={{ fontFamily: 'var(--font-cinzel, serif)' }}>
                {image.eventName}
              </p>
            )}
          </div>

          {/* Faction Labels (Hover) */}
          <div className="absolute inset-x-0 top-0 p-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-aot-parchment/90 to-transparent">
            {image.labels.map((label, index) => (
              <span 
                key={index} 
                className="px-2 py-0.5 text-[10px] uppercase tracking-wide bg-aot-blood text-white border border-aot-blood"
              >
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
