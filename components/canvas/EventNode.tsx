"use client";

import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { motion } from "framer-motion";

export type EventNodeData = {
  eventName: string;
};

type EventNodeType = Node<EventNodeData, "event">;

function EventNodeComponent({ data, selected }: NodeProps<EventNodeType>) {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center cursor-pointer group"
      animate={{ scale: selected ? 1.05 : 1 }}
      whileHover={{ scale: 1.1 }}
    >
      {/* Glowing branch node */}
      <div
        className="relative flex h-[60px] w-[220px] flex-col items-center justify-center bg-[#050510] border border-[#ffeedd]/60 shadow-[0_0_15px_rgba(255,238,221,0.5)] transition-shadow duration-300 group-hover:shadow-[0_0_25px_rgba(255,238,221,0.8)] z-10"
        style={{ borderRadius: "8px" }}
      >
        <div className="relative z-10 flex flex-col items-center px-4 text-center">
          <span
            className="text-sm font-black uppercase tracking-[0.2em] text-[#ffeedd] group-hover:text-white transition-colors drop-shadow-md"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {data.eventName}
          </span>
        </div>
      </div>

      <Handle type="target" position={Position.Bottom} className="opacity-0" />
      <Handle type="source" position={Position.Top} className="opacity-0" />
    </motion.div>
  );
}

export const EventNode = memo(EventNodeComponent);
