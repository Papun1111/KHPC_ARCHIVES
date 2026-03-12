"use client";

import { INSIGNIA_CONFIG, type InsigniaType } from "@/lib/constants";

export function InsigniaLabel({ type }: { type: InsigniaType }) {
  const config = INSIGNIA_CONFIG[type];
  if (!config) return null;

  return (
    <div className="flex items-center gap-2 sharp-border bg-white px-2 py-1 shadow-sm transition-transform hover:-translate-y-0.5">
      <div 
        className="h-[10px] w-[10px] relative overflow-hidden"
        style={{ background: config.color }}
      />
      <span
        className="text-[9px] font-black uppercase tracking-[0.2em] text-black"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {config.label}
      </span>
    </div>
  );
}
