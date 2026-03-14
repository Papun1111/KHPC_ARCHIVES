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
        className="relative bg-[#050510] border border-[#ffeedd]/30 p-2 shadow-[0_0_15px_rgba(255,238,221,0.1)] transition-shadow group-hover:shadow-[0_0_25px_rgba(255,238,221,0.5)]"
        style={{
          width: "180px",
          height: "180px",
          outline: selected ? "2px solid #ffeedd" : "none",
          outlineOffset: "4px",
          borderRadius: "4px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.imageUrl}
          alt={data.caption || "Archive element"}
          className="h-full w-full object-cover filter brightness-75 sepia-[0.3] hover:sepia-0 group-hover:brightness-110 transition-all duration-500 rounded-sm"
        />

        {/* Ethereal Glow Overlay on Hover */}
        <motion.div
          className="absolute inset-0 bg-[#ffeedd] mix-blend-overlay z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.2 }}
          transition={{ duration: 0.3 }}
        />

        {/* Hover Caption Overlay (Dark Block with glowing text) */}
        <motion.div
          className="absolute bottom-2 left-2 right-2 bg-[#050510]/90 border border-[#ffeedd]/50 backdrop-blur-sm z-20 overflow-hidden rounded-sm"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {data.caption && (
            <div className="flex">
               <div className="w-1 bg-[#ffeedd] shrink-0 shadow-[0_0_5px_#ffeedd]" />
               <p
                 className="p-2 text-[8px] leading-tight text-[#ffeedd] font-bold uppercase tracking-widest break-words"
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
          <div className="absolute top-1 right-1 w-6 h-6 bg-[#ffeedd] text-[#050510] flex items-center justify-center rounded-sm z-30 shadow-[0_0_10px_rgba(255,238,221,0.8)] transition-transform hover:scale-110">
            <span className="text-[10px] font-serif">★</span>
          </div>
        )}
      </div>

      {/* Invisible Handles for React Flow Layout */}
      <Handle
        type="target"
        position={Position.Bottom}
        className="opacity-0"
      />
      <Handle
        type="source"
        position={Position.Top}
        className="opacity-0"
      />
    </motion.div>
  );
}

export const MemoryNode = memo(MemoryNodeComponent);
