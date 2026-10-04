"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageData } from '@/components/ImageCard';

interface CarouselGalleryProps {
  images: ImageData[];
  onSelectImage?: (image: ImageData) => void;
}

export default function CarouselGallery({ images, onSelectImage }: CarouselGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage]);

  // Auto-play
  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextImage, images.length]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      className="relative w-full flex flex-col group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image Container */}
      <div 
        className="relative w-full overflow-hidden bg-[#0a0b10] border-2 border-[#3a3830] max-h-[50vh] md:max-h-[70vh] flex items-center justify-center cursor-pointer"
        style={{ aspectRatio: currentImage.aspectRatio || 16/9 }}
        onClick={() => onSelectImage?.(currentImage)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage.id}
            src={currentImage.url}
            alt={currentImage.caption || 'Carousel Image'}
            className="w-full h-full object-contain"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Counter */}
        <div 
          className="absolute top-4 right-4 bg-[#1a1d26]/90 text-[#e8e6e1] px-3 py-1 text-sm border border-[#3a3830] font-mono tracking-widest z-10 uppercase shadow-lg"
          style={{ fontFamily: 'var(--font-cinzel, serif)' }}
        >
          LOG: {(currentIndex + 1).toString().padStart(2, '0')} / {images.length.toString().padStart(2, '0')}
        </div>

        {/* Prev / Next Buttons */}
        <button
          onClick={(e) => { e.stopPropagation(); prevImage(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[#1a1d26] border border-[#3a3830] text-[#b0b3c5] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#3a5a40] hover:text-[#e8e6e1] hover:border-[#4a7c59] z-10 shadow-md odm-trigger"
          aria-label="Previous Image"
        >
          <svg className="w-6 h-6 aot-metallic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); nextImage(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-[#1a1d26] border border-[#3a3830] text-[#b0b3c5] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#3a5a40] hover:text-[#e8e6e1] hover:border-[#4a7c59] z-10 shadow-md odm-trigger"
          aria-label="Next Image"
        >
          <svg className="w-6 h-6 aot-metallic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`carousel-dot w-2.5 h-2.5 rounded-full border border-[#3a3830] transition-colors duration-300 ${
                idx === currentIndex ? 'bg-[#bc2020] active' : 'bg-[#1a1d26] hover:bg-[#4a7c59]'
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Caption Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage.id + '-caption'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-4 md:p-6 bg-[#b0a07a] border-2 border-[#8a8275] shadow-inner text-[#0a0b10] flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex-1">
            <p className="font-semibold text-lg" style={{ fontFamily: 'var(--font-cinzel, serif)' }}>
              {currentImage.caption || 'Classified Document'}
            </p>
            {currentImage.eventName && (
              <p className="text-sm opacity-80 uppercase tracking-widest mt-1 font-bold" style={{ fontFamily: 'var(--font-inter, sans-serif)' }}>
                Op: {currentImage.eventName}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 shrink-0">
            {currentImage.labels.map((label, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 bg-[#1a1d26] text-[#e8e6e1] text-xs uppercase tracking-widest border border-[#3a3830]"
                style={{ fontFamily: 'var(--font-inter, sans-serif)' }}
              >
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
