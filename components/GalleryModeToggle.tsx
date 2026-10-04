"use client";

import { GALLERY_MODES, type GalleryMode } from "@/lib/constants";
import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════
// Gallery Mode Toggle — ODM Gear Control Panel
// ═══════════════════════════════════════════════════════════════════════════

interface GalleryModeToggleProps {
  currentMode: GalleryMode;
  onModeChange: (mode: GalleryMode) => void;
}

export function GalleryModeToggle({ currentMode, onModeChange }: GalleryModeToggleProps) {
  return (
    <div className="relative">
      {/* ── Desktop: Full toggle bar ── */}
      <div className="hidden sm:flex items-stretch aot-border overflow-hidden bg-bg-card shadow-lg">
        {/* Decorative rivet left */}
        <div className="w-3 bg-gradient-to-b from-[#3a3830] via-[#2a2820] to-[#3a3830] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#5a584f]" />
        </div>

        {GALLERY_MODES.map((item, i) => {
          const isActive = currentMode === item.mode;
          return (
            <motion.button
              key={item.mode}
              onClick={() => onModeChange(item.mode)}
              className={`
                relative flex items-center gap-1.5 px-3 lg:px-4 py-2.5
                text-[10px] font-bold uppercase tracking-widest
                transition-colors duration-200 odm-trigger aot-metallic
                ${i > 0 ? "border-l border-[#3a3830]" : ""}
              `}
              style={{
                background: isActive
                  ? "linear-gradient(180deg, #3a5a40 0%, #2a4530 100%)"
                  : "transparent",
                color: isActive ? "#e8e6e1" : "#9a978f",
              }}
              whileHover={{
                backgroundColor: isActive ? undefined : "rgba(58, 90, 64, 0.15)",
                color: "#e8e6e1",
              }}
              whileTap={{ scale: 0.96 }}
            >
              {/* Active glow indicator */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    background: "linear-gradient(90deg, transparent, #4a7c59, transparent)",
                    boxShadow: "0 0 8px rgba(74, 124, 89, 0.6)",
                  }}
                  layoutId="mode-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <span className="text-sm leading-none">{item.icon}</span>
              <span className="hidden lg:inline">{item.label}</span>
            </motion.button>
          );
        })}

        {/* Decorative rivet right */}
        <div className="w-3 bg-gradient-to-b from-[#3a3830] via-[#2a2820] to-[#3a3830] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#5a584f]" />
        </div>
      </div>

      {/* ── Mobile: Dropdown selector ── */}
      <div className="sm:hidden flex items-stretch aot-border bg-bg-card">
        <span className="px-3 py-2.5 text-[9px] font-bold uppercase border-r border-[#3a3830] bg-survey-green text-text-primary flex items-center text-nowrap tracking-widest">
          VIEW
        </span>
        <select
          className="bg-transparent px-3 py-2 text-[10px] uppercase font-bold text-text-primary focus:outline-none cursor-pointer w-full"
          value={currentMode}
          onChange={(e) => onModeChange(e.target.value as GalleryMode)}
        >
          {GALLERY_MODES.map((item) => (
            <option key={item.mode} value={item.mode} className="bg-[#15171e] text-[#e8e6e1]">
              {item.icon} {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
