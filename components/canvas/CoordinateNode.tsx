"use client";

import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { motion } from "framer-motion";

type CoordinateNodeData = Record<string, never>;
type CoordinateNodeType = Node<CoordinateNodeData, "coordinate">;

function CoordinateNodeComponent({ selected }: NodeProps<CoordinateNodeType>) {
  return (
    <motion.div
      className="relative flex items-center justify-center cursor-pointer group"
      animate={{ scale: selected ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Outer glowing halo */}
      <div
        className="absolute w-[240px] h-[240px] rounded-full transition-all duration-700 opacity-50 group-hover:opacity-100 group-hover:scale-110 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,238,221,0.2) 0%, rgba(255,238,221,0) 70%)",
          filter: "blur(20px)"
        }}
      />
      
      {/* Inner glowing core */}
      <div className="relative flex h-[160px] w-[160px] flex-col items-center justify-center bg-[#050510] border-2 border-[#ffeedd]/80 rounded-full shadow-[0_0_30px_rgba(255,238,221,0.6)] transition-all duration-300 group-hover:shadow-[0_0_50px_rgba(255,238,221,1)] z-10">
        
        {/* Core light */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#ffeedd]/30 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Text Area */}
        <div className="relative z-10 flex flex-col items-center mt-2">
          <div
            className="text-6xl font-black mb-1 transition-all group-hover:text-white group-hover:scale-110 drop-shadow-[0_0_10px_rgba(255,238,221,0.8)]"
            style={{ color: "#ffeedd", fontFamily: "var(--font-cinzel)" }}
          >
            ✧
          </div>
          <span
            className="text-[11px] font-black uppercase tracking-[0.3em] text-[#ffeedd] group-hover:text-white transition-colors drop-shadow-md mt-1"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Coordinate
          </span>
        </div>
      </div>

      {/* Connection points */}
      <Handle type="target" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Top} className="opacity-0" />
    </motion.div>
  );
}

export const CoordinateNode = memo(CoordinateNodeComponent);
