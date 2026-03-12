"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INSIGNIA_CONFIG, type InsigniaType } from "@/lib/constants";

// ─── Types ──────────────────────────────────────────────────────────────

interface UploadZoneProps {
  onUpload: (files: File[], caption: string, eventName: string, labels: InsigniaType[]) => Promise<void>;
}

// ─── UploadZone Component (Stark & Aggressive) ──────────────────────────

export function UploadZone({ onUpload }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showLightning, setShowLightning] = useState(false);
  
  // New Form states
  const [caption, setCaption] = useState("");
  const [eventName, setEventName] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<InsigniaType[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleLabel = (label: InsigniaType) => {
    setSelectedLabels(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const imageFiles = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (imageFiles.length === 0) return;

      setIsUploading(true);

      try {
        await onUpload(imageFiles, caption, eventName, selectedLabels);
        // Trigger the red blood/lightning flash effect
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
      {/* ── Optional Metadata Form ── */}
      <div className="flex-1 sharp-border bg-white p-6 space-y-5">
        <h4 className="text-xl font-bold uppercase tracking-widest text-[#8a0303] mb-4" style={{ fontFamily: "var(--font-cinzel)" }}>
          DOCUMENTATION LOG
        </h4>
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] text-black uppercase">Operation / Event Name</label>
          <input 
            type="text" 
            placeholder="e.g. Puri Trip, Shiganshina Operation..." 
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full sharp-border p-3 text-sm focus:outline-none focus:border-[#8a0303]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] text-black uppercase">Report Details (Caption)</label>
          <textarea 
            placeholder="Add military records..." 
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full sharp-border p-3 text-sm focus:outline-none focus:border-[#8a0303] resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.2em] text-black uppercase block">Assign Factions</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(INSIGNIA_CONFIG) as InsigniaType[]).map((key) => {
              const isActive = selectedLabels.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleLabel(key)}
                  className="sharp-border px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5"
                  style={{
                    backgroundColor: isActive ? "#000" : "#fff",
                    color: isActive ? "#fff" : "#000",
                    borderColor: isActive ? "#000" : "#ddd",
                  }}
                >
                  <div className="w-2 h-2" style={{ backgroundColor: INSIGNIA_CONFIG[key].color }} />
                  {INSIGNIA_CONFIG[key].label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Drop Zone ── */}
      <div className="flex-1 relative">
        <AnimatePresence>
          {showLightning && (
            <motion.div
              className="pointer-events-none fixed inset-0 z-50 bg-[#8a0303]"
              style={{ mixBlendMode: "multiply" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.3, 0.9, 0] }}
              transition={{ duration: 0.8, ease: "easeOut", times: [0, 0.1, 0.2, 0.4, 1] }}
            />
          )}
        </AnimatePresence>

        <motion.div
          className="relative h-full min-h-[300px] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#f4f4f4] transition-colors group"
          style={{ border: isDragOver ? "2px solid #8a0303" : "1px solid #000000" }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <AnimatePresence>
            {isUploading && (
              <motion.div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: "repeating-linear-gradient(-45deg, #000, #000 10px, transparent 10px, transparent 20px)",
                  backgroundSize: "28px 28px",
                }}
                animate={{ backgroundPosition: ["0px 0px", "28px 28px"] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            )}
          </AnimatePresence>

          <div className="absolute inset-1 border border-black opacity-20 pointer-events-none" />

          <div className="flex flex-col items-center justify-center px-6 py-16 relative z-10 w-full text-center">
            <motion.div
              className="mb-6 h-12 w-12 flex items-center justify-center bg-black text-white group-hover:bg-[#8a0303] transition-colors duration-300"
              animate={{ scale: isDragOver ? 1.1 : 1, rotate: isDragOver ? 90 : 0 }}
            >
              <span className="text-2xl font-light">+</span>
            </motion.div>

            {isUploading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8a0303]">
                  Transmitting Data...
                </p>
                <div className="mx-auto mt-4 h-[2px] w-1/2 bg-[#e5e5e5] relative overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 bottom-0 bg-[#8a0303]"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            ) : (
              <div>
                <h4 className="text-xl font-bold uppercase tracking-widest text-black transition-colors" style={{ fontFamily: "var(--font-cinzel)" }}>
                  {isDragOver ? "INITIATE TRANSFER" : "CONFIRM & APPEND"}
                </h4>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#888888]">
                  Fill details left, then click or drag images here.
                </p>
              </div>
            )}
          </div>
          
          <div className="absolute top-0 left-0 w-4 h-4 border-b border-r border-black pointer-events-none opacity-50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-t border-l border-black pointer-events-none opacity-50" />
        </motion.div>
      </div>
    </div>
  );
}
