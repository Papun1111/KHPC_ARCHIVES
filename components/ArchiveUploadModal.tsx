"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PickUpItem } from "@/components/PickUpCarousel";
import type { MovieEntry } from "@/components/MovieGalleryTimeline";
import type { AnimationPoster } from "@/components/AnimationGallery";

export type UploadTargetSection = "pickup" | "movie" | "animation";

interface ArchiveUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: UploadTargetSection;
  onAddPickUpItem: (item: PickUpItem) => void;
  onAddMovieItem: (item: MovieEntry) => void;
  onAddAnimationItem: (item: AnimationPoster) => void;
}

export default function ArchiveUploadModal({
  isOpen,
  onClose,
  initialSection = "pickup",
  onAddPickUpItem,
  onAddMovieItem,
  onAddAnimationItem,
}: ArchiveUploadModalProps) {
  const [section, setSection] = useState<UploadTargetSection>(initialSection);

  // Common fields
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
  });
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageMode, setImageMode] = useState<"file" | "url">("file");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PickUp specific
  const [category, setCategory] = useState<"MOVIE" | "EVENT">("EVENT");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("SPECIAL");

  // Movie specific
  const [version, setVersion] = useState("V1");
  const [runtime, setRuntime] = useState("120 MIN");
  const [format, setFormat] = useState("THEATRICAL SPECIAL VERSION // 5.1ch");

  // Animation specific
  const [titleJp, setTitleJp] = useState("");
  const [studio, setStudio] = useState("ARCHIVE CORPS");
  const [director, setDirector] = useState("SCOUT REGIMENT");
  const [episodeCount, setEpisodeCount] = useState("SPECIAL 01");
  const [classification, setClassification] = useState("CLASSIFIED MILITARY RECORD");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync section if initialSection changes when opening
  React.useEffect(() => {
    if (isOpen) {
      setSection(initialSection);
    }
  }, [isOpen, initialSection]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const activeImage =
      imageMode === "url" && imageUrlInput.trim()
        ? imageUrlInput.trim()
        : imagePreview || "/aot.jpg";

    const id = `user-record-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    if (section === "pickup") {
      const newItem: PickUpItem = {
        id,
        title: title.trim(),
        date: date.trim() || "2026.10.29",
        category,
        description: description.trim() || "No classified debriefing logged.",
        subtitle: subtitle.trim() || undefined,
        imageUrl: activeImage,
        badge: badge.trim() || undefined,
      };
      onAddPickUpItem(newItem);
    } else if (section === "movie") {
      const newMovie: MovieEntry = {
        id,
        version: version.trim() || "V1",
        date: date.trim() || "2026.10.29",
        category: "MOVIE",
        title: title.trim(),
        subtitle: description.trim() || subtitle.trim() || "Theatrical compilation entry.",
        runtime: runtime.trim() || undefined,
        format: format.trim() || undefined,
        posterUrl: activeImage,
      };
      onAddMovieItem(newMovie);
    } else if (section === "animation") {
      const newPoster: AnimationPoster = {
        id,
        title: title.trim(),
        titleJp: titleJp.trim() || undefined,
        releaseDate: date.trim() || "2026.10.29",
        episodeCount: episodeCount.trim() || "SPECIAL",
        studio: studio.trim() || "STUDIO ARCHIVE",
        director: director.trim() || "UNKNOWN",
        description: description.trim() || "Archive chronicle dossier.",
        badge: badge.trim() || "CHRONICLE",
        classification: classification.trim() || "MILITARY ARCHIVE",
        posterUrl: activeImage,
      };
      onAddAnimationItem(newPoster);
    }

    // Reset and close
    setTitle("");
    setDescription("");
    setImagePreview(null);
    setImageUrlInput("");
    setSubtitle("");
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-3xl aot-border bg-aot-parchment text-aot-dark shadow-2xl p-6 sm:p-8 overflow-hidden crosshair-corners my-auto max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b aot-border pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 bg-aot-blood" />
                <span className="text-mono-xs text-aot-blood font-bold tracking-widest uppercase">
                  MANUAL ARCHIVE ENTRY // 手動追加
                </span>
              </div>
              <h3
                className="heading-brutal text-2xl sm:text-3xl text-aot-dark uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                APPEND CUSTOM RECORD
              </h3>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center aot-border bg-aot-parchment hover:bg-aot-blood hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Section Selection Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              type="button"
              onClick={() => setSection("pickup")}
              className={`px-4 py-2 text-mono-xs font-bold uppercase transition-all ${
                section === "pickup"
                  ? "bg-aot-dark text-white border-2 border-aot-blood shadow-sm"
                  : "bg-aot-parchment-dark text-aot-dark border border-aot-border hover:bg-aot-dark/10"
              }`}
            >
              ★ PICK UP CAROUSEL
            </button>
            <button
              type="button"
              onClick={() => setSection("movie")}
              className={`px-4 py-2 text-mono-xs font-bold uppercase transition-all ${
                section === "movie"
                  ? "bg-aot-dark text-white border-2 border-aot-blood shadow-sm"
                  : "bg-aot-parchment-dark text-aot-dark border border-aot-border hover:bg-aot-dark/10"
              }`}
            >
              🎬 MOVIE GALLERY
            </button>
            <button
              type="button"
              onClick={() => setSection("animation")}
              className={`px-4 py-2 text-mono-xs font-bold uppercase transition-all ${
                section === "animation"
                  ? "bg-aot-dark text-white border-2 border-aot-blood shadow-sm"
                  : "bg-aot-parchment-dark text-aot-dark border border-aot-border hover:bg-aot-dark/10"
              }`}
            >
              🎞 ANIMATION GALLERY
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image / Poster Upload */}
            <div className="aot-border p-4 bg-aot-parchment-dark/40">
              <div className="flex items-center justify-between mb-2">
                <label className="text-mono-xs font-bold text-aot-dark uppercase">
                  Poster / Picture Upload
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageMode("file")}
                    className={`text-[10px] px-2 py-0.5 uppercase font-bold ${
                      imageMode === "file" ? "bg-aot-blood text-white" : "bg-white/80"
                    }`}
                  >
                    File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("url")}
                    className={`text-[10px] px-2 py-0.5 uppercase font-bold ${
                      imageMode === "url" ? "bg-aot-blood text-white" : "bg-white/80"
                    }`}
                  >
                    URL
                  </button>
                </div>
              </div>

              {imageMode === "file" ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-aot-border hover:border-aot-blood cursor-pointer p-6 flex flex-col items-center justify-center text-center bg-white/40 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative group max-h-48 overflow-hidden aot-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 object-contain"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                        CLICK TO REPLACE
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 border border-aot-dark flex items-center justify-center mb-2 font-mono text-xl">
                        +
                      </div>
                      <p className="text-mono-xs font-bold uppercase text-aot-dark">
                        Drag & drop your picture or click to browse
                      </p>
                      <p className="text-[10px] text-text-muted mt-1 uppercase">
                        Supports PNG, JPG, WEBP, GIF
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="https://example.com/poster.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  />
                  {imageUrlInput && (
                    <div className="max-h-36 overflow-hidden aot-border p-1 bg-white inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrlInput}
                        alt="URL Preview"
                        className="max-h-32 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/aot.jpg";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Core Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Battle of Shiganshina"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood font-bold"
                />
              </div>

              <div>
                <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                  Date / Era
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2026.10.29 or Year 854"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                />
              </div>
            </div>

            {/* Section Specific Inputs */}
            {section === "pickup" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as "MOVIE" | "EVENT")}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  >
                    <option value="EVENT">EVENT</option>
                    <option value="MOVIE">MOVIE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SPECIAL, EXHIBITION"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  />
                </div>

                <div>
                  <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                    Subtitle / Catchphrase
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4K HDR MASTER ARCHIVE"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  />
                </div>
              </div>
            )}

            {section === "movie" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                    Version / Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. V1, PART 1"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  />
                </div>

                <div>
                  <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                    Runtime
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 145 MIN, 90 MIN"
                    value={runtime}
                    onChange={(e) => setRuntime(e.target.value)}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  />
                </div>

                <div>
                  <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                    Theatrical Format
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. THEATRICAL 4K // 5.1ch"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  />
                </div>
              </div>
            )}

            {section === "animation" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                    Sub / Japanese Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 進撃の巨人 完結編"
                    value={titleJp}
                    onChange={(e) => setTitleJp(e.target.value)}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  />
                </div>

                <div>
                  <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                    Format / Episode
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SEASON 1 // 25 EPS"
                    value={episodeCount}
                    onChange={(e) => setEpisodeCount(e.target.value)}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  />
                </div>

                <div>
                  <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                    Studio / Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MAPPA, WIT STUDIO"
                    value={studio}
                    onChange={(e) => setStudio(e.target.value)}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  />
                </div>

                <div>
                  <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                    Director / Author
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tetsuro Araki"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  />
                </div>

                <div>
                  <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                    Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CHRONICLE, FINAL"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  />
                </div>

                <div>
                  <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                    Classification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MILITARY RECORD"
                    value={classification}
                    onChange={(e) => setClassification(e.target.value)}
                    className="w-full aot-border bg-white px-3 py-2 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood"
                  />
                </div>
              </div>
            )}

            {/* Story / Description */}
            <div>
              <label className="block text-mono-xs font-bold text-aot-dark uppercase mb-1">
                Story / Synopsis / Lore Log *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write your story, expedition log, memory debriefing, or custom synopsis here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full aot-border bg-white p-3 text-xs font-mono text-aot-dark focus:outline-none focus:border-aot-blood leading-relaxed"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t aot-border">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 aot-border bg-white text-aot-dark hover:bg-aot-dark hover:text-white text-mono-xs font-bold tracking-widest uppercase transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="px-6 py-2.5 aot-border bg-aot-blood text-white hover:bg-aot-blood-bright text-mono-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <span>+ ARCHIVE DATA</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
