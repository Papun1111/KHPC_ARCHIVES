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
import PageTransition from "@/components/PageTransition";
import HeroParallax from "@/components/HeroParallax";
import PickUpCarousel from "@/components/PickUpCarousel";
import MovieGalleryTimeline from "@/components/MovieGalleryTimeline";
import AnimationGalleryComponent from "@/components/AnimationGallery";
import { INSIGNIA_CONFIG, type InsigniaType, type GalleryMode } from "@/lib/constants";
import type { ImageData } from "@/components/ImageCard";

// ═══════════════════════════════════════════════════════════════════════════
// Main Page — AoT Brutalist Portal
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
    document.body.style.overflow = "hidden"; // Prevent scrolling during transition
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
            data.map((img: Omit<ImageData, 'labels'> & { labels?: { name: string }[] }) => ({
              ...img,
              labels: img.labels?.map((l) => l.name) || [],
            }) as unknown as ImageData)
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
          createdImages = rawData.map((img: Omit<ImageData, 'labels'> & { labels?: ({ name: string } | string)[] }) => ({
            ...img,
            labels:
              img.labels?.map((l) =>
                typeof l === "string" ? l : l.name
              ) || [],
          }) as unknown as ImageData);
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
    <div className="relative min-h-screen bg-aot-parchment !overflow-x-hidden">
      {/* ═══ Page Transition (Blood Scribbles) ═══ */}
      <AnimatePresence>
        {!appLoaded && (
          <PageTransition onComplete={() => {
            setAppLoaded(true);
            document.body.style.overflow = "auto";
          }} />
        )}
      </AnimatePresence>

      {/* ── Subtle Dust Particles Background ── */}
      {appLoaded && <EmbersBackground />}

      {/* ── Noise texture is applied via body::before in globals.css ── */}

      {/* ── Decorative vertical structural lines ── */}
      <div className="pointer-events-none fixed py-10 inset-y-0 left-[5%] md:left-[8%] w-[1px] bg-aot-border/30 z-0" />
      <div className="pointer-events-none fixed py-10 inset-y-0 right-[5%] md:right-[8%] w-[1px] bg-aot-border/30 z-0" />

      {/* ═══ Main Content ═══ */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        {/* ── 1. Hero Parallax Section ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: appLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <HeroParallax />
        </motion.div>

        {/* ── Section Divider ── */}
        <div className="section-divider" />

        {/* ── 2. PICK UP Carousel Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <PickUpCarousel />
        </motion.div>

        {/* ── Section Divider ── */}
        <div className="section-divider" />

        {/* ── 3. MOVIE GALLERY Timeline Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <MovieGalleryTimeline />
        </motion.div>

        {/* ── Section Divider ── */}
        <div className="section-divider" />

        {/* ── 4. Animation Gallery Carousel Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <AnimationGalleryComponent />
        </motion.div>

        {/* ── Section Divider ── */}
        <div className="section-divider" />

        {/* ══════════════════════════════════════════════════════════════════
            5. User Gallery Section (Existing Functionality — Restyled)
           ══════════════════════════════════════════════════════════════════ */}
        <motion.section
          id="gallery"
          className="relative overflow-hidden bg-aot-parchment"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="mx-auto max-w-7xl px-4 md:px-8 pb-8 pt-16 relative z-10 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8">
              <div>
                <motion.div
                  className="flex items-center gap-4 mb-2"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="h-[1px] w-8 md:w-12 bg-aot-blood" />
                  <span className="text-mono-xs text-aot-blood">
                    ARCHIVES — PROJECT FILE
                  </span>
                </motion.div>

                <motion.h2
                  className="heading-brutal heading-brutal-lg"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  YOUR GALLERY
                </motion.h2>
              </div>

              {/* Action bar */}
              <motion.div
                className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-4 md:gap-6"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-left md:text-right flex-shrink-0">
                  <p className="text-mono-xs text-text-muted">
                    Total Records
                  </p>
                  <p
                    className="text-xl md:text-2xl font-light text-aot-dark leading-none mt-1"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {images.length.toString().padStart(3, "0")}
                  </p>
                </div>

                <button
                  onClick={() => setShowUpload(!showUpload)}
                  className="group relative flex items-center justify-center overflow-hidden aot-border bg-aot-parchment px-4 md:px-8 py-3 md:py-4 text-mono-xs transition-colors w-full sm:w-40 md:w-48 h-12 md:h-14 odm-trigger"
                >
                  {/* Hover fill — blood red */}
                  <span className="absolute inset-0 bg-aot-blood transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

                  <span className="relative z-10 flex items-center gap-2 text-aot-dark group-hover:text-white transition-colors">
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
            <div className="flex aot-border bg-aot-parchment w-full sm:w-auto relative group">
              <span className="px-3 md:px-4 py-2.5 text-mono-xs border-r border-aot-border bg-aot-blood text-white flex items-center text-nowrap">
                Event
              </span>
              <select
                className="bg-transparent px-3 py-2 text-[10px] uppercase font-bold text-aot-dark focus:outline-none cursor-pointer w-full"
                value={selectedEvent || ""}
                onChange={(e) =>
                  setSelectedEvent(e.target.value || null)
                }
              >
                <option value="" className="bg-aot-parchment">
                  ALL EVENTS
                </option>
                {availableEvents.map((ev) => (
                  <option key={ev} value={ev} className="bg-aot-parchment">
                    {ev}
                  </option>
                ))}
              </select>
            </div>

            {/* Faction/Label Filter */}
            <div className="flex aot-border bg-aot-parchment w-full sm:w-auto relative group">
              <span className="px-3 md:px-4 py-2.5 text-mono-xs border-r border-aot-border bg-aot-blood text-white flex items-center text-nowrap">
                Faction
              </span>
              <select
                className="bg-transparent px-3 py-2 text-[10px] uppercase font-bold text-aot-dark focus:outline-none cursor-pointer w-full"
                value={selectedLabel || ""}
                onChange={(e) =>
                  setSelectedLabel(
                    (e.target.value as InsigniaType) || null
                  )
                }
              >
                <option value="" className="bg-aot-parchment">
                  ALL FACTIONS
                </option>
                {(Object.keys(INSIGNIA_CONFIG) as InsigniaType[]).map(
                  (key) => (
                    <option key={key} value={key} className="bg-aot-parchment">
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
              className="aot-border p-2 md:p-4 bg-aot-parchment shadow-sm relative overflow-hidden"
            >
              {/* Blood-red inner rim accent */}
              <div className="absolute inset-0 border-[2px] border-aot-blood opacity-[0.04] pointer-events-none z-20 m-1" />

              {renderGallery()}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {filteredImages.length === 0 && (
            <div className="flex min-h-[500px] flex-col items-center justify-center text-center aot-border bg-aot-parchment mt-4">
              {/* Decorative crosshair */}
              <div className="mb-6 relative w-16 h-16 opacity-20">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-aot-dark -translate-y-1/2" />
                <div className="absolute left-1/2 top-0 w-[1px] h-full bg-aot-dark -translate-x-1/2" />
                <div className="absolute inset-2 border border-aot-dark rounded-full" />
              </div>
              <h3
                className="mb-2 text-2xl font-bold tracking-widest text-aot-dark uppercase"
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

        {/* ═══ Footer ═══ */}
        <footer className="relative z-10 border-t border-aot-border bg-aot-dark text-white">
          {/* Blood-red accent line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-aot-blood via-aot-blood-bright to-aot-blood" />

          <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              {/* Brand */}
              <div>
                <h2
                  className="text-2xl md:text-3xl font-black tracking-tighter text-white"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  進撃の巨人
                </h2>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mt-1">
                  KHPC Archives Portal
                </p>
              </div>

              {/* Links */}
              <div className="flex items-center gap-6 md:gap-8 text-[11px] font-medium tracking-[0.1em] uppercase text-white/50">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>

              {/* Copyright */}
              <p className="text-[10px] text-white/30 tracking-wider">
                © 2026 KHPC Archives. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
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
                background: "#151515",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Blood red accent bars */}
            <div className="fixed top-0 left-0 w-32 md:w-64 h-[2px] bg-gradient-to-r from-aot-blood to-transparent" />
            <div className="fixed bottom-0 right-0 w-32 md:w-64 h-[2px] bg-gradient-to-l from-aot-blood to-transparent" />

            {/* Thin structural lines */}
            <div className="fixed top-0 right-0 h-32 md:h-64 w-[1px] bg-gradient-to-b from-aot-blood/60 to-transparent" />
            <div className="fixed bottom-0 left-0 h-32 md:h-64 w-[1px] bg-gradient-to-t from-aot-blood/60 to-transparent" />

            {/* Close Button */}
            <button
              className="fixed top-2 right-2 md:top-8 md:right-8 flex items-center gap-2 md:gap-3 text-white hover:text-aot-blood-bright transition-colors z-[110] group border border-white/20 bg-aot-dark p-2 md:p-3 shadow-lg odm-trigger"
              onClick={() => setSelectedImage(null)}
            >
              <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase hidden sm:block">
                Close
              </span>
              <div className="h-8 w-8 flex items-center justify-center group-hover:text-aot-blood-bright transition-colors">
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
              <div className="border border-white/10 bg-aot-dark p-2 shadow-2xl relative w-full flex justify-center mt-12 md:mt-0 crosshair-corners">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption || ""}
                  className="max-h-[65vh] md:max-h-[80vh] w-auto max-w-full object-contain"
                />

                {/* Event Name Tag */}
                {selectedImage.eventName && (
                  <div className="absolute top-6 -left-3 bg-aot-blood text-white text-[9px] font-bold tracking-[0.2em] px-3 py-1.5 uppercase border border-aot-blood-bright transform -rotate-2 shadow-lg z-20">
                    {selectedImage.eventName}
                  </div>
                )}
              </div>

              {/* Caption */}
              {selectedImage.caption && (
                <motion.div
                  className="mt-6 border border-white/10 bg-aot-dark w-full max-w-2xl relative overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Blood-red accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-aot-blood" />

                  <div className="px-6 py-5 md:px-8 flex flex-col sm:flex-row items-start gap-4">
                    <div className="mt-1 text-[9px] font-black text-aot-blood-bright uppercase tracking-[0.3em] shrink-0 border-b-2 border-aot-blood pb-1">
                      LOG ENTRY
                    </div>
                    <p
                      className="text-sm font-medium leading-relaxed text-white/80"
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
