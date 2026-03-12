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
      {/* Outer jagged frame */}
      <div
        className="absolute w-[220px] h-[220px] border border-black transition-all duration-500 group-hover:border-[#8a0303] group-hover:rotate-45"
        style={{
          background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 11px)",
        }}
      />
      
      {/* Inner geometric core */}
      <div className="relative flex h-[140px] w-[140px] flex-col items-center justify-center bg-white sharp-border shadow-2xl transition-colors duration-300 z-10">
        
        {/* Grey noise and Red Corner */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-[#8a0303] z-0 transition-transform duration-300 group-hover:scale-150 origin-top-right" />
        
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 z-0"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Text Area */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="text-4xl font-black mb-2 transition-colors group-hover:text-white group-hover:drop-shadow-md"
            style={{ color: "#000", fontFamily: "var(--font-cinzel)" }}
          >
            ◉
          </div>
          <span
            className="text-[10px] font-black uppercase tracking-[0.25em] text-black group-hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Coordinate
          </span>
          <div className="mt-2 h-[1px] w-12 bg-black group-hover:bg-white transition-colors" />
        </div>
      </div>

      {/* Hidden Connection points */}
      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map(
        (pos) => (
          <Handle
            key={pos}
            type="source"
            position={pos}
            id={pos}
            className="opacity-0"
          />
        )
      )}
    </motion.div>
  );
}

export const CoordinateNode = memo(CoordinateNodeComponent);
