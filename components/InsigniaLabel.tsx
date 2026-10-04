"use client";

import { INSIGNIA_CONFIG, type InsigniaType } from "@/lib/constants";
import { FactionCrest } from "./FactionCrest";

export function InsigniaLabel({ type }: { type: InsigniaType }) {
  const config = INSIGNIA_CONFIG[type];
  if (!config) return null;

  return (
    <div
      className="flex items-center gap-2 aot-border bg-bg-card/90 backdrop-blur-sm px-2.5 py-1.5 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
      style={{ borderLeftColor: config.color, borderLeftWidth: "2px" }}
    >
      <div style={{ color: config.color }}>
        <FactionCrest type={type} size={14} />
      </div>
      <span
        className="text-[9px] font-black uppercase tracking-[0.2em] text-parchment"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {config.label}
      </span>
    </div>
  );
}
