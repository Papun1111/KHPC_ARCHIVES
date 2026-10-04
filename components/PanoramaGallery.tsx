"use client";

import React, { useRef, useState, useEffect, MouseEvent as ReactMouseEvent } from "react";
import { motion } from "framer-motion";
import { ImageData } from "@/components/ImageCard";

interface PanoramaGalleryProps {
  images: ImageData[];
  onSelectImage?: (image: ImageData) => void;
}

export default function PanoramaGallery({ images, onSelectImage }: PanoramaGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    // Update progress bar
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    setScrollProgress(progress);

    // Calculate current index (rough estimation based on progress)
    const newIndex = Math.min(
      Math.max(1, Math.round(progress * (images.length - 1)) + 1),
      images.length
    );
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [images.length]);

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast multiplier
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scrollByAmount = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -500 : 500;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  if (!images || images.length === 0) {
    return <div className="text-[#9a978f] font-[family-name:var(--font-inter)]">No panorama images available.</div>;
  }

  return (
    <div className="relative group w-full bg-[#0a0b10] border-y border-[#3a3830] overflow-hidden font-[family-name:var(--font-inter)]">
      {/* Top Right Counter */}
      <div className="absolute top-4 right-4 z-10 bg-[#1a1d26]/80 text-[#e8e6e1] px-3 py-1 text-sm border border-[#3a3830] font-[family-name:var(--font-cinzel)] tracking-widest backdrop-blur-sm pointer-events-none">
        LOG: {currentIndex.toString().padStart(2, "0")} / {images.length.toString().padStart(2, "0")}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => scrollByAmount("left")}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-[#1a1d26]/60 border border-[#3a3830] text-[#b0b3c5] hover:bg-[#3a5a40] hover:text-[#e8e6e1] transition-all duration-300 opacity-0 group-hover:opacity-100 hover:shadow-[0_0_15px_rgba(74,124,89,0.5)] cursor-pointer"
        aria-label="Scroll Left"
      >
        <span className="text-2xl drop-shadow-md">←</span>
      </button>

      <button
        onClick={() => scrollByAmount("right")}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-[#1a1d26]/60 border border-[#3a3830] text-[#b0b3c5] hover:bg-[#3a5a40] hover:text-[#e8e6e1] transition-all duration-300 opacity-0 group-hover:opacity-100 hover:shadow-[0_0_15px_rgba(74,124,89,0.5)] cursor-pointer"
        aria-label="Scroll Right"
      >
        <span className="text-2xl drop-shadow-md">→</span>
      </button>

      {/* Scroll Container */}
      <motion.div
        ref={scrollRef}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={`panorama-scroll flex gap-1 overflow-x-auto overflow-y-hidden h-[300px] md:h-[500px] no-scrollbar ${
          isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory"
        }`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        {images.map((img) => (
          <motion.div
            key={img.id}
            variants={itemVariants}
            className="relative h-full shrink-0 snap-start group/item border-r-4 border-[#6b6458]"
            style={{ width: `calc(max(300px, 100vh) * ${img.aspectRatio > 0 ? img.aspectRatio : 1.5})`, maxWidth: '80vw' }}
            onClick={(e) => {
              if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
              } else if (onSelectImage) {
                onSelectImage(img);
              }
            }}
          >
            <div className="w-full h-full overflow-hidden">
              <img
                src={img.url}
                alt={img.caption || `Panorama ${img.id}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/item:scale-[1.02]"
                draggable={false}
              />
            </div>
            
            {/* Caption Overlay */}
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/70 to-transparent p-6 pt-12">
                <p className="text-[#d4c5a0] font-[family-name:var(--font-cinzel)] text-lg md:text-xl drop-shadow-md">
                  {img.caption}
                </p>
                {img.eventName && (
                  <p className="text-[#8c8fa3] text-sm mt-1 uppercase tracking-wider">
                    {img.eventName}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#111318]">
        <div
          className="h-full bg-gradient-to-r from-[#3a5a40] to-[#4a7c59] transition-all duration-100 ease-linear"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* CSS overrides for hiding scrollbar visually but keeping functionality */}
      <style dangerouslySetInnerHTML={{__html: `
        .panorama-scroll::-webkit-scrollbar {
          display: none;
        }
        .panorama-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
