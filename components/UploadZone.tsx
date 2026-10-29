"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INSIGNIA_CONFIG, type InsigniaType } from "@/lib/constants";
import { FactionCrest } from "./FactionCrest";

// ─── Types ──────────────────────────────────────────────────────────────

interface UploadZoneProps {
  onUpload: (files: File[], caption: string, eventName: string, labels: InsigniaType[]) => Promise<void>;
}

// ═══════════════════════════════════════════════════════════════════════════
// UploadZone — Brutalist Parchment Military Document Scanner
// ═══════════════════════════════════════════════════════════════════════════

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showLightning, setShowLightning] = useState(false);

  // Form states
  const [caption, setCaption] = useState("");
  const [eventName, setEventName] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<InsigniaType[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleLabel = (label: InsigniaType) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.heic', '.heif', '.tiff', '.tif', '.raw', '.avif'];
      const imageFiles = Array.from(files).filter((f) => {
        if (f.type.startsWith("image/")) return true;
        const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
        return validExtensions.includes(ext);
      });
      if (imageFiles.length === 0) return;

      setIsUploading(true);

      try {
        await onUpload(imageFiles, caption, eventName, selectedLabels);
        // Titan transformation lightning flash
        setShowLightning(true);
        setTimeout(() => setShowLightning(false), 800);

        // Reset form
        setCaption("");
        setEventName("");
        setSelectedLabels([]);
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, caption, eventName, selectedLabels]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* ── Documentation Log Form ── */}
      <div className="flex-1 aot-border bg-aot-parchment p-6 space-y-5 crosshair-corners">
        <h4
          className="text-xl font-bold uppercase tracking-widest text-aot-blood mb-4"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          DOCUMENTATION LOG
        </h4>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase">
            Operation / Event Name
          </label>
          <input
            type="text"
            placeholder="e.g. Puri Trip, Shiganshina Operation..."
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full aot-border bg-white p-3 text-sm text-aot-dark placeholder:text-text-muted focus:outline-none focus:border-aot-blood transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase">
            Report Details (Caption)
          </label>
          <textarea
            placeholder="Add military records..."
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full aot-border bg-white p-3 text-sm text-aot-dark placeholder:text-text-muted focus:outline-none focus:border-aot-blood resize-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase block">
            Assign Factions
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(INSIGNIA_CONFIG) as InsigniaType[]).map((key) => {
              const isActive = selectedLabels.includes(key);
              const config = INSIGNIA_CONFIG[key];
              return (
                <button
                  key={key}
                  onClick={() => toggleLabel(key)}
                  className="aot-border px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 flex items-center gap-1.5 odm-trigger"
                  style={{
                    backgroundColor: isActive ? config.color : "#edeade",
                    color: isActive ? "#ffffff" : config.color,
                    borderColor: isActive ? config.color : "#c8c8c4",
                  }}
                >
                  <FactionCrest type={key} size={12} />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Drop Zone — Military Scanner ── */}
      <div className="flex-1 relative">
        {/* Titan transformation flash */}
        <AnimatePresence>
          {showLightning && (
            <motion.div
              className="pointer-events-none fixed inset-0 z-50"
              style={{
                background: "linear-gradient(180deg, rgba(255,200,0,0.3) 0%, rgba(255,100,0,0.2) 50%, rgba(138,3,3,0.3) 100%)",
                mixBlendMode: "screen",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.3, 0.9, 0] }}
              transition={{ duration: 0.8, ease: "easeOut", times: [0, 0.1, 0.2, 0.4, 1] }}
            />
          )}
        </AnimatePresence>

        <motion.div
          className="relative h-full min-h-[300px] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-white transition-all duration-300 group aot-scan-line crosshair-corners"
          style={{
            border: isDragOver ? "2px solid #8a0303" : "1px solid #c8c8c4",
            boxShadow: isDragOver
              ? "inset 0 0 50px rgba(138, 3, 3, 0.08), 0 0 20px rgba(138, 3, 3, 0.1)"
              : "none",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Pulse aura on drag over */}
          <AnimatePresence>
            {isDragOver && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-0"
                style={{ background: "radial-gradient(ellipse at center, rgba(138, 3, 3, 0.08), transparent)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.heic,.heif,.tiff,.tif,.raw,.avif"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {/* Uploading stripe animation */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                className="absolute inset-0 opacity-10 pointer-events-none z-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, #8a0303, #8a0303 10px, transparent 10px, transparent 20px)",
                  backgroundSize: "28px 28px",
                }}
                animate={{ backgroundPosition: ["0px 0px", "28px 28px"] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            )}
          </AnimatePresence>

          {/* Inner frame */}
          <div className="absolute inset-1 border border-[#c8c8c4] opacity-50 pointer-events-none z-0" />

          <div className="flex flex-col items-center justify-center px-6 py-16 relative z-10 w-full text-center">
            <motion.div
              className={`mb-6 h-12 w-12 flex items-center justify-center transition-colors duration-300 odm-trigger ${
                isDragOver
                  ? "bg-aot-blood text-white"
                  : "bg-aot-parchment text-aot-dark group-hover:bg-aot-blood group-hover:text-white"
              }`}
              style={{ border: "1px solid #c8c8c4" }}
              animate={{
                scale: isDragOver ? 1.2 : 1,
                rotate: isDragOver ? 90 : 0,
              }}
            >
              <span className="text-2xl font-light">+</span>
            </motion.div>

            {isUploading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-aot-blood">
                  Transmitting Data...
                </p>
                <div className="mx-auto mt-4 h-[2px] w-1/2 bg-aot-parchment-dark relative overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 bottom-0"
                    style={{ background: "linear-gradient(90deg, #8a0303, #c41e1e)" }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            ) : (
              <div>
                <h4
                  className={`text-xl font-bold uppercase tracking-widest transition-colors ${
                    isDragOver ? "text-aot-blood" : "text-aot-dark"
                  }`}
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {isDragOver ? "INITIATE TRANSFER" : "CONFIRM & APPEND"}
                </h4>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                  Fill details left, then click or drag images here.
                </p>
              </div>
            )}
          </div>

          {/* Corner marks */}
          <div className="absolute top-0 left-0 w-4 h-4 border-b border-r border-aot-blood/30 pointer-events-none opacity-50 z-10" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-t border-l border-aot-blood/30 pointer-events-none opacity-50 z-10" />
        </motion.div>
      </div>
    </div>
  );
}
