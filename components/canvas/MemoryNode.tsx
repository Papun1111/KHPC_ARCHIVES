"use client";

import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { motion } from "framer-motion";

export type MemoryNodeData = {
  imageUrl: string;
  caption?: string;
  isFavorite?: boolean;
};

type MemoryNodeType = Node<MemoryNodeData, "memory">;

function MemoryNodeComponent({ data, selected }: NodeProps<MemoryNodeType>) {
  return (
    <motion.div
      className="group relative cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Sharp Border Frame */}
      <div
        className="relative bg-white sharp-border p-2 shadow-xl"
        style={{
          width: "180px",
          height: "180px",
          outline: selected ? "3px solid #8a0303" : "none",
          outlineOffset: "2px",
        }}
      >
        {/* Grey noise overlay */ }
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-0"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.imageUrl}
          alt={data.caption || "Archive element"}
          className="h-full w-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 sharp-border"
        />

        {/* Aggressive Red Overlay on Hover */}
        <motion.div
          className="absolute inset-0 bg-[#8a0303] mix-blend-multiply z-10"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.2 }}
        />

        {/* Hover Caption Overlay (Stark White Block) */}
        <motion.div
          className="absolute bottom-2 left-2 right-2 bg-white sharp-border z-20 overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {data.caption && (
            <div className="flex">
               <div className="w-1 bg-[#8a0303] shrink-0" />
               <p
                 className="p-2 text-[8px] leading-tight text-black font-bold uppercase tracking-widest break-words"
                 style={{ fontFamily: "var(--font-cinzel)" }}
               >
                 {data.caption.slice(0, 45)}
                 {data.caption.length > 45 ? "..." : ""}
               </p>
            </div>
          )}
        </motion.div>

        {/* Favorite marker */}
        {data.isFavorite && (
          <div className="absolute top-1 right-1 w-6 h-6 bg-[#8a0303] text-white flex items-center justify-center sharp-border z-30 shadow-sm transition-transform hover:scale-110">
            <span className="text-[10px] font-serif">★</span>
          </div>
        )}
      </div>

      {/* Invisible Handles for React Flow Layout */}
      <Handle
        type="target"
        position={Position.Top}
        className="opacity-0" // Hide the dots completely, just keep logic
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="opacity-0"
      />
    </motion.div>
  );
}

export const MemoryNode = memo(MemoryNodeComponent);
