"use client";

import { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { MemoryNode, type MemoryNodeData } from "./MemoryNode";
import { CoordinateNode } from "./CoordinateNode";
import { PathEdge } from "./PathEdge";
import type { ImageData } from "@/components/ImageCard";
import { CANVAS_CONFIG } from "@/lib/constants";

// ─── Types ──────────────────────────────────────────────────────────────

interface PathsCanvasProps {
  images: ImageData[];
  onNodeClick?: (image: ImageData) => void;
}

// ─── Node/Edge Type Registration (defined outside component to prevent re-renders) ──

const nodeTypes = {
  memory: MemoryNode,
  coordinate: CoordinateNode,
} as const;

const edgeTypes = {
  path: PathEdge,
} as const;

// ─── Radial Layout Generator ────────────────────────────────────────────

function generateRadialLayout(images: ImageData[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Central Coordinate node
  nodes.push({
    id: "coordinate",
    type: "coordinate",
    position: { x: 0, y: 0 },
    data: {},
    draggable: true,
  });

  // Distribute images in concentric rings
  const ringRadius = [300, 550, 800];
  let imageIndex = 0;

  for (let ring = 0; ring < ringRadius.length && imageIndex < images.length; ring++) {
    const radius = ringRadius[ring];
    const itemsInRing = Math.min(
      ring === 0 ? 6 : ring === 1 ? 10 : 14,
      images.length - imageIndex
    );
    const angleStep = (2 * Math.PI) / itemsInRing;
    const angleOffset = ring * (Math.PI / itemsInRing);

    for (let i = 0; i < itemsInRing; i++) {
      const image = images[imageIndex];
      if (!image) break;

      const angle = angleStep * i + angleOffset;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const nodeId = `memory-${image.id}`;

      const nodeData: MemoryNodeData = {
        imageUrl: image.url,
        caption: image.caption || undefined,
        isFavorite: image.isFavorite,
      };

      nodes.push({
        id: nodeId,
        type: "memory",
        position: { x: x - 70, y: y - 70 },
        data: nodeData,
        draggable: true,
      });

      edges.push({
        id: `edge-${nodeId}`,
        source: "coordinate",
        target: nodeId,
        type: "path",
        animated: true,
      });

      imageIndex++;
    }
  }

  return { nodes, edges };
}

// ─── PathsCanvas Component ──────────────────────────────────────────────

export function PathsCanvas({ images, onNodeClick }: PathsCanvasProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => generateRadialLayout(images),
    [images]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.type === "memory" && onNodeClick) {
        const imageId = node.id.replace("memory-", "");
        const image = images.find((img) => img.id === imageId);
        if (image) onNodeClick(image);
      }
    },
    [images, onNodeClick]
  );

  return (
    <div className="h-full w-full bg-[#f4f4f4] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={CANVAS_CONFIG.minZoom}
        maxZoom={CANVAS_CONFIG.maxZoom}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Cross}
          gap={60}
          size={10}
          color="#e5e5e5"
          lineWidth={1}
        />
        <Controls
          showInteractive={false}
          position="bottom-right"
          className="sharp-border !shadow-none"
        />
        <MiniMap
          className="sharp-border !shadow-none !bg-white"
          nodeColor={(node) => {
            if (node.type === "coordinate") return "#000000";
            return "#e5e5e5";
          }}
          maskColor="rgba(244, 244, 244, 0.7)"
          position="bottom-left"
        />
      </ReactFlow>

      {/* Canvas decorative corner text */}
      <div
        className="pointer-events-none absolute left-8 top-24 select-none z-10"
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="h-[2px] w-8 bg-[#8a0303]" />
          <span className="text-[10px] font-bold tracking-widest text-[#8a0303] uppercase">Sector 02</span>
        </div>
        <p
          className="text-5xl font-black tracking-tighter text-black"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          PROJECT MAP
        </p>
        <p className="mt-2 text-[10px] font-bold tracking-[0.4em] uppercase text-black">
          Architectural Layout Overview
        </p>
      </div>
      
      {/* Decorative vertical bounds */}
      <div className="pointer-events-none fixed inset-y-0 left-[5%] w-[1px] bg-black opacity-10 z-0" />
      <div className="pointer-events-none fixed inset-y-0 right-[5%] w-[1px] bg-black opacity-10 z-0" />
    </div>
  );
}
