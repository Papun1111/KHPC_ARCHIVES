"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { MangaGallery } from "@/components/MangaGallery";
import { MasonryGallery } from "@/components/MasonryGallery";
import CollageGallery from "@/components/CollageGallery";
import PanoramaGallery from "@/components/PanoramaGallery";
import GridGallery from "@/components/GridGallery";
import CarouselGallery from "@/components/CarouselGallery";
import { UploadZone } from "@/components/UploadZone";
import { GalleryModeToggle } from "@/components/GalleryModeToggle";
import { EmbersBackground } from "@/components/EmbersBackground";
import { FactionCrest } from "@/components/FactionCrest";
import { INSIGNIA_CONFIG, type InsigniaType, type GalleryMode } from "@/lib/constants";
import type { ImageData } from "@/components/ImageCard";

// ═══════════════════════════════════════════════════════════════════════════
// Cinematic Loader — Titan Transformation Sequence
// ═══════════════════════════════════════════════════════════════════════════

function CinematicLoader({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setTimeout(() => setStage(1), 500);
    setTimeout(() => setStage(2), 1500);
    setTimeout(() => {
      setStage(3);
      setTimeout(onComplete, 800);
    }, 2800);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: "#0a0b10" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === 3 ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={(definition: any) => {
        if (definition.opacity === 0) {
          document.body.style.overflow = "auto";
        }
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(58, 90, 64, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(58, 90, 64, 0.3) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
      />

      {/* Crack lines */}
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage >= 1 ? 0.6 : 0 }}
      >
        <motion.path
          d="M -10,30 Q 20,40 30,20 T 60,50 T 110,40"
          fill="none"
          stroke="#3a5a40"
          strokeWidth="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: stage >= 1 ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        <motion.path
          d="M 30,20 Q 40,0 50,-10"
          fill="none"
          stroke="#8a0303"
          strokeWidth="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: stage >= 1 ? 1 : 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        />
      </motion.svg>

      {/* Blood/Titan transformation flash */}
      <motion.div
        className="absolute w-[120vw] h-[50vh]"
        style={{
          background: "linear-gradient(180deg, rgba(138,3,3,0.8) 0%, rgba(188,32,32,0.6) 50%, rgba(212,168,67,0.4) 100%)",
          clipPath:
            "polygon(0% 45%, 15% 42%, 25% 48%, 35% 38%, 45% 55%, 55% 35%, 65% 50%, 75% 40%, 85% 52%, 100% 45%, 100% 55%, 85% 62%, 75% 50%, 65% 60%, 55% 45%, 45% 65%, 35% 48%, 25% 58%, 15% 52%, 0% 55%)",
          filter: "blur(2px) contrast(150%)",
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{
          scaleY: stage >= 2 ? 1 : 0,
          opacity: stage >= 2 ? 0.9 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />

      {/* Title */}
      <motion.div
        className="absolute z-10 text-center"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: stage >= 1 ? 1 : 0 }}
        transition={{ duration: 3, ease: "easeOut" }}
      >
        {/* Wings of Freedom */}
        <div className="flex justify-center mb-4 text-survey-green-bright opacity-60">
          <FactionCrest type="survey" size={48} />
        </div>
        <h1
          className="text-[clamp(2.5rem,8vw,6rem)] font-black text-text-primary tracking-tighter"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          KHPC アーカイブ
        </h1>
        <p className="mt-2 md:mt-4 text-[10px] sm:text-xs md:text-lg tracking-[0.4em] text-parchment-dark font-bold uppercase">
          KHPC Archives
        </p>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Gallery Page — Full AoT Dark-Fantasy Theme
// ═══════════════════════════════════════════════════════════════════════════

export default function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [layoutMode, setLayoutMode] = useState<GalleryMode>("manga");
  const [appLoaded, setAppLoaded] = useState(false);

  // Sorting/Filtering State
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<InsigniaType | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ev = params.get("event");
      if (ev) setSelectedEvent(ev);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Prevent scrolling during cinematic
  }, []);

  // Fetch from Prisma API (graceful fallback if Prisma isn't ready)
  useEffect(() => {
    fetch("/api/images")
      .then((res) => {
        if (!res.ok) throw new Error("API not ready");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(
            data.map((img: any) => ({
              ...img,
              labels: img.labels?.map((l: any) => l.name) || [],
            }))
          );
        }
      })
      .catch(() =>
        console.log("Prisma DB not connected; using local memory state.")
      );
  }, []);

  // Derive unique events for filters
  const availableEvents = useMemo(() => {
    const events = new Set<string>();
    images.forEach((img) => {
      if (img.eventName) events.add(img.eventName);
    });
    return Array.from(events);
  }, [images]);

  // Filter images based on selected event/label
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      if (selectedEvent && img.eventName !== selectedEvent) return false;
      if (selectedLabel && !img.labels.includes(selectedLabel)) return false;
      return true;
    });
  }, [images, selectedEvent, selectedLabel]);

  const handleUpload = useCallback(
    async (
      files: File[],
      caption: string,
      eventName: string,
      labels: InsigniaType[]
    ) => {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      formData.append("caption", caption);
      formData.append("eventName", eventName);
      formData.append("labels", JSON.stringify(labels));

      let createdImages: ImageData[] = [];

      try {
        const res = await fetch("/api/images", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const rawData = await res.json();
          createdImages = rawData.map((img: any) => ({
            ...img,
            labels:
              img.labels?.map((l: any) =>
                typeof l === "string" ? l : l.name
              ) || [],
          }));
        } else {
          throw new Error("API Upload failed");
        }
      } catch (e) {
        console.warn(
          "API Upload failed. Simulating upload in local memory state."
        );
        createdImages = await Promise.all(
          files.map(async (file, i) => {
            const url = URL.createObjectURL(file);
            const dims = await new Promise<{ w: number; h: number }>(
              (resolve) => {
                const img = new window.Image();
                img.onload = () =>
                  resolve({ w: img.width, h: img.height });
                img.src = url;
              }
            );

            return {
              id: `memory-upload-${Date.now()}-${i}`,
              url,
              width: dims.w,
              height: dims.h,
              aspectRatio: dims.w / dims.h,
              caption: caption || null,
              eventName: eventName || null,
              isFavorite: false,
              labels: labels,
            } as ImageData;
          })
        );
      }

      setImages((prev) => [...createdImages, ...prev]);
    },
    []
  );

  // ─── Render the active gallery mode ───
  const renderGallery = () => {
    if (filteredImages.length === 0) return null;

    switch (layoutMode) {
      case "manga":
        return (
          <MangaGallery
            images={filteredImages}
            onSelectImage={setSelectedImage}
          />
        );
      case "masonry":
        return (
          <MasonryGallery
            images={filteredImages}
            onSelectImage={setSelectedImage}
          />
        );
      case "collage":
        return (
          <CollageGallery
            images={filteredImages}
            onSelectImage={setSelectedImage}
          />
        );
      case "panorama":
        return (
          <PanoramaGallery
            images={filteredImages}
            onSelectImage={setSelectedImage}
          />
        );
      case "grid":
        return (
          <GridGallery
            images={filteredImages}
            onSelectImage={setSelectedImage}
          />
        );
      case "carousel":
        return (
          <CarouselGallery
            images={filteredImages}
            onSelectImage={setSelectedImage}
          />
        );
      default:
        return (
          <MangaGallery
            images={filteredImages}
            onSelectImage={setSelectedImage}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-background !overflow-x-hidden">
      {/* Cinematic Loader */}
      <AnimatePresence>
        {!appLoaded && (
          <CinematicLoader onComplete={() => setAppLoaded(true)} />
        )}
      </AnimatePresence>

      {/* ── Embers & Steam Background ── */}
      {appLoaded && <EmbersBackground />}

      {/* ── Background Image Layer (aot.jpg) ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: appLoaded ? 0.15 : 0,
          backgroundImage: "url('/aot.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "grayscale(50%) contrast(120%) brightness(0.4)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04] z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(58, 90, 64, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(58, 90, 64, 0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative vertical lines */}
      <div className="pointer-events-none fixed py-10 inset-y-0 left-[5%] md:left-[10%] w-[1px] bg-survey-green/10 z-0" />
      <div className="pointer-events-none fixed py-10 inset-y-0 right-[5%] md:right-[10%] w-[1px] bg-survey-green/10 z-0" />

      {/* ═══ Main Content ═══ */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        {/* ── Hero Section ── */}
        <motion.section
          className="relative overflow-hidden aot-border-b bg-bg-secondary/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: appLoaded ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Blood splatter glow — top right */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 bg-blood-red rounded-full mix-blend-multiply opacity-20 xl:opacity-30 pointer-events-none"
            style={{ filter: "blur(80px)" }}
          />
          {/* Survey Corps green glow — bottom left */}
          <div
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-survey-green rounded-full opacity-10 pointer-events-none"
            style={{ filter: "blur(60px)" }}
          />

          <div className="mx-auto max-w-7xl px-4 md:px-8 pb-12 pt-16 relative z-10 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8">
              <div>
                <motion.div
                  className="flex items-center gap-4 mb-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="h-[2px] w-8 md:w-12 bg-survey-green" />
                  <span className="text-[10px] md:text-xs font-bold tracking-widest text-survey-green-bright">
                    PROJECT FILE 01
                  </span>
                </motion.div>

                <motion.h2
                  className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter text-text-primary uppercase leading-[0.9] md:leading-none"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  MOVIE GALLERY
                </motion.h2>
              </div>

              {/* Action bar */}
              <motion.div
                className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-4 md:gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-left md:text-right flex-shrink-0">
                  <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-widest">
                    Total Records
                  </p>
                  <p className="text-xl md:text-2xl font-light text-parchment font-serif leading-none">
                    {images.length.toString().padStart(3, "0")}
                  </p>
                </div>

                <button
                  onClick={() => setShowUpload(!showUpload)}
                  className="group relative flex items-center justify-center overflow-hidden aot-border bg-bg-card px-4 md:px-8 py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors w-full sm:w-40 md:w-48 h-12 md:h-14 odm-trigger"
                >
                  {/* Hover fill — Survey Corps green */}
                  <span className="absolute inset-0 bg-survey-green transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

                  <span className="relative z-10 flex items-center gap-2 text-text-primary">
                    {showUpload ? "✕ CLOSE" : "+ APPEND DATA"}
                  </span>
                </button>
              </motion.div>
            </div>

            {/* Upload Zone */}
            <AnimatePresence>
              {showUpload && (
                <motion.div
                  className="mt-8 relative"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <UploadZone onUpload={handleUpload} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ── Filters & View Switcher ── */}
        <div className="mx-auto flex flex-col md:flex-row max-w-7xl items-start md:items-center justify-between px-4 md:px-8 py-6 md:py-8 relative z-10 w-full gap-4 md:gap-6">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Event Filter */}
            <div className="flex aot-border bg-bg-card w-full sm:w-auto relative group">
              <span className="px-3 md:px-4 py-2.5 text-[9px] md:text-[10px] font-bold uppercase border-r border-[#3a3830] bg-survey-green text-text-primary flex items-center text-nowrap tracking-widest">
                Event
              </span>
              <select
                className="bg-transparent px-3 py-2 text-[10px] uppercase font-bold text-text-primary focus:outline-none cursor-pointer w-full"
                value={selectedEvent || ""}
                onChange={(e) =>
                  setSelectedEvent(e.target.value || null)
                }
              >
                <option value="" className="bg-[#15171e]">
                  ALL EVENTS
                </option>
                {availableEvents.map((ev) => (
                  <option key={ev} value={ev} className="bg-[#15171e]">
                    {ev}
                  </option>
                ))}
              </select>
            </div>

            {/* Faction/Label Filter */}
            <div className="flex aot-border bg-bg-card w-full sm:w-auto relative group">
              <span className="px-3 md:px-4 py-2.5 text-[9px] md:text-[10px] font-bold uppercase border-r border-[#3a3830] bg-survey-green text-text-primary flex items-center text-nowrap tracking-widest">
                Faction
              </span>
              <select
                className="bg-transparent px-3 py-2 text-[10px] uppercase font-bold text-text-primary focus:outline-none cursor-pointer w-full"
                value={selectedLabel || ""}
                onChange={(e) =>
                  setSelectedLabel(
                    (e.target.value as InsigniaType) || null
                  )
                }
              >
                <option value="" className="bg-[#15171e]">
                  ALL FACTIONS
                </option>
                {(Object.keys(INSIGNIA_CONFIG) as InsigniaType[]).map(
                  (key) => (
                    <option key={key} value={key} className="bg-[#15171e]">
                      {INSIGNIA_CONFIG[key].label}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Gallery Mode Toggle */}
          <GalleryModeToggle
            currentMode={layoutMode}
            onModeChange={setLayoutMode}
          />
        </div>

        {/* ── Gallery Grid ── */}
        <section className="mx-auto w-full max-w-7xl px-4 md:px-8 pb-24 relative z-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={layoutMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="aot-border p-2 md:p-4 bg-bg-card/80 backdrop-blur-sm shadow-xl relative overflow-hidden"
            >
              {/* Internal Survey Corps green rim frame */}
              <div className="absolute inset-0 border-[3px] border-survey-green opacity-[0.06] pointer-events-none z-20 m-1" />

              {renderGallery()}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {filteredImages.length === 0 && (
            <div className="flex min-h-[500px] flex-col items-center justify-center text-center aot-border bg-bg-card/90 mt-4 backdrop-blur-sm">
              <div className="mb-4 text-survey-green opacity-20">
                <FactionCrest type="survey" size={80} />
              </div>
              <h3
                className="mb-2 text-2xl font-bold tracking-widest text-text-primary uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                NO DATA FOUND
              </h3>
              <p className="max-w-md text-xs text-text-muted uppercase tracking-wider mt-2 px-4">
                The archives are empty for these parameters. Append new
                memory segments to begin.
              </p>
            </div>
          )}
        </section>

        {/* ── Footer accent ── */}
        <div className="relative z-10 aot-border-b">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-survey-green/30 to-transparent" />
        </div>
      </div>

      {/* ═══ Lightbox / Selected Image ═══ */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            {/* Dark cinematic backdrop */}
            <div
              className="fixed inset-0"
              style={{
                background: "#0a0b10",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Blood red accent bars */}
            <div className="fixed top-0 left-0 w-32 md:w-64 h-1 md:h-1 bg-gradient-to-r from-blood-red to-transparent" />
            <div className="fixed bottom-0 right-0 w-32 md:w-64 h-1 md:h-1 bg-gradient-to-l from-blood-red to-transparent" />

            {/* Survey Corps green accent lines */}
            <div className="fixed top-0 right-0 h-32 md:h-64 w-1 bg-gradient-to-b from-survey-green/60 to-transparent" />
            <div className="fixed bottom-0 left-0 h-32 md:h-64 w-1 bg-gradient-to-t from-survey-green/60 to-transparent" />

            {/* Close Button */}
            <button
              className="fixed top-2 right-2 md:top-8 md:right-8 flex items-center gap-2 md:gap-3 text-text-primary hover:text-blood-bright transition-colors z-[110] group aot-border bg-bg-card p-2 md:p-3 shadow-lg odm-trigger"
              onClick={() => setSelectedImage(null)}
            >
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase hidden sm:block">
                Close
              </span>
              <div className="h-8 w-8 flex items-center justify-center group-hover:text-blood-bright transition-colors">
                ✕
              </div>
            </button>

            {/* Image Container */}
            <motion.div
              className="relative z-10 flex flex-col items-center w-full max-w-5xl my-auto"
              layoutId={`image-${selectedImage.id}`}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aot-border bg-bg-card p-2 shadow-2xl relative w-full flex justify-center mt-12 md:mt-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption || ""}
                  className="max-h-[65vh] md:max-h-[80vh] w-auto max-w-full object-contain"
                />

                {/* Event Name Tag */}
                {selectedImage.eventName && (
                  <div className="absolute top-6 -left-3 bg-survey-green text-text-primary text-[9px] font-bold tracking-[0.2em] px-3 py-1.5 uppercase aot-border transform -rotate-2 shadow-lg z-20">
                    {selectedImage.eventName}
                  </div>
                )}
              </div>

              {/* Caption — Parchment styled box */}
              {selectedImage.caption && (
                <motion.div
                  className="mt-6 aot-border bg-bg-card w-full max-w-2xl relative overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Survey Corps green accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-survey-green" />

                  <div className="px-6 py-5 md:px-8 flex flex-col sm:flex-row items-start gap-4">
                    <div className="mt-1 text-[9px] font-black text-survey-green-bright uppercase tracking-[0.3em] shrink-0 border-b-2 border-survey-green pb-1">
                      LOG ENTRY
                    </div>
                    <p
                      className="text-sm font-medium leading-relaxed text-parchment"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {selectedImage.caption}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
