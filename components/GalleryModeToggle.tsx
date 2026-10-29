"use client";

import { GALLERY_MODES, type GalleryMode } from "@/lib/constants";
import { motion } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════
// Gallery Mode Toggle — ODM Gear Control Panel (Brutalist Parchment)
// ═══════════════════════════════════════════════════════════════════════════

interface GalleryModeToggleProps {
  currentMode: GalleryMode;
  onModeChange: (mode: GalleryMode) => void;
}

export function GalleryModeToggle({ currentMode, onModeChange }: GalleryModeToggleProps) {
  return (
    <div className="relative">
      {/* ── Desktop: Full toggle bar ── */}
      <div className="hidden sm:flex items-stretch aot-border overflow-hidden bg-aot-parchment shadow-sm">
        {/* Decorative rivet left */}
        <div className="w-3 bg-aot-parchment-warm border-r border-aot-border flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-aot-grey-dark" />
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
                ${i > 0 ? "border-l border-aot-border" : ""}
              `}
              style={{
                background: isActive
                  ? "linear-gradient(180deg, #8a0303 0%, #5c0202 100%)"
                  : "transparent",
                color: isActive ? "#ffffff" : "#555555",
              }}
              whileHover={{
                backgroundColor: isActive ? undefined : "rgba(138, 3, 3, 0.08)",
                color: isActive ? "#ffffff" : "#151515",
              }}
              whileTap={{ scale: 0.96 }}
            >
              {/* Active glow indicator */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    background: "linear-gradient(90deg, transparent, #c41e1e, transparent)",
                    boxShadow: "0 0 8px rgba(196, 30, 30, 0.6)",
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
        <div className="w-3 bg-aot-parchment-warm border-l border-aot-border flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-aot-grey-dark" />
        </div>
      </div>

      {/* ── Mobile: Dropdown selector ── */}
      <div className="sm:hidden flex items-stretch aot-border bg-aot-parchment">
        <span className="px-3 py-2.5 text-[9px] font-bold uppercase border-r border-aot-border bg-aot-blood text-white flex items-center text-nowrap tracking-widest">
          VIEW
        </span>
        <select
          className="bg-transparent px-3 py-2 text-[10px] uppercase font-bold text-aot-dark focus:outline-none cursor-pointer w-full"
          value={currentMode}
          onChange={(e) => onModeChange(e.target.value as GalleryMode)}
        >
          {GALLERY_MODES.map((item) => (
            <option key={item.mode} value={item.mode} className="bg-aot-parchment text-aot-dark">
              {item.icon} {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
