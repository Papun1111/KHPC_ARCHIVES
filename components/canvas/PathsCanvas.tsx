"use client";

import { useEffect, useCallback } from "react";
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
import { EventNode, type EventNodeData } from "./EventNode";
import type { ImageData } from "@/components/ImageCard";
import { CANVAS_CONFIG } from "@/lib/constants";

// ─── Types ──────────────────────────────────────────────────────────────

interface PathsCanvasProps {
  images: ImageData[];
  onNodeClick?: (identifier: ImageData | string) => void;
}

// ─── Node/Edge Type Registration ────────────────────────────────────────

const nodeTypes = {
  memory: MemoryNode,
  coordinate: CoordinateNode,
  event: EventNode,
} as const;

const edgeTypes = {
  path: PathEdge,
} as const;

// ─── Tree Layout Generator ──────────────────────────────────────────────

function generateTreeLayout(images: ImageData[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Group images by eventName
  const eventsMap = new Map<string, ImageData[]>();
  const defaultEvent = "Unknown Memory";
  
  images.forEach(img => {
    // some images might have null eventName in the DB
    const ev = img.eventName || defaultEvent;
    if (!eventsMap.has(ev)) eventsMap.set(ev, []);
    eventsMap.get(ev)!.push(img);
  });

  const eventNames = Array.from(eventsMap.keys());

  // Central Coordinate node at the bottom
  nodes.push({
    id: "coordinate",
    type: "coordinate",
    position: { x: 0, y: 1500 },
    data: {},
    draggable: true,
  });

  // Calculate event branch positions
  const eventSpacingX = 500;
  const numEvents = eventNames.length;
  // center evenly around x=0
  const startX = numEvents > 1 ? -((numEvents - 1) * eventSpacingX) / 2 : 0;

  eventNames.forEach((eventName, eventIndex) => {
    const eventX = startX + eventIndex * eventSpacingX;
    const eventY = 1000; // Above Coordinate
    
    const eventNodeId = `event-${eventName}`;

    nodes.push({
      id: eventNodeId,
      type: "event",
      position: { x: eventX - 110, y: eventY }, // center the 220px wide node
      data: { eventName },
      draggable: true,
    });

    // edge from coordinate to event
    edges.push({
      id: `edge-coord-${eventNodeId}`,
      source: "coordinate",
      target: eventNodeId,
      type: "path",
    });

    const eventImages = eventsMap.get(eventName) || [];
    
    // Distribute memory nodes growing upwards from this event branch
    eventImages.forEach((img, imgIndex) => {
      // Alternate left and right, move upwards
      const isLeft = imgIndex % 2 === 0;
      const verticalOffset = Math.floor(imgIndex / 2) * 250;
      
      const memX = eventX + (isLeft ? -150 : 150) + (Math.random() * 40 - 20);
      const memY = eventY - 250 - verticalOffset + (Math.random() * 40 - 20);

      const nodeId = `memory-${img.id}`;
      nodes.push({
        id: nodeId,
        type: "memory",
        position: { x: memX - 90, y: memY - 90 },
        data: {
          imageUrl: img.url,
          caption: img.caption || undefined,
          isFavorite: img.isFavorite,
        },
        draggable: true,
      });

      // Chain memories or connect to event base
      const edgeTarget = nodeId;
      const edgeSource = imgIndex >= 2 ? `memory-${eventImages[imgIndex - 2].id}` : eventNodeId;

      edges.push({
        id: `edge-${edgeSource}-${edgeTarget}`,
        source: edgeSource,
        target: edgeTarget,
        type: "path",
      });
    });
  });

  return { nodes, edges };
}

// ─── PathsCanvas Component ──────────────────────────────────────────────

export function PathsCanvas({ images, onNodeClick }: PathsCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const { nodes: layoutNodes, edges: layoutEdges } = generateTreeLayout(images);
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [images, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (onNodeClick) {
        if (node.type === "memory") {
          const imageId = node.id.replace("memory-", "");
          const image = images.find((img) => img.id === imageId);
          if (image) onNodeClick(image);
        } else if (node.type === "event") {
          const eventName = (node.data as EventNodeData).eventName;
          onNodeClick(eventName);
        }
      }
    },
    [images, onNodeClick]
  );

  return (
    <div className="h-full w-full bg-[#050510] relative overflow-hidden">
      {/* Ymir Background Layer */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000"
        style={{
          opacity: 0.7, 
          backgroundImage: "url('/ymir.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "grayscale(10%) contrast(110%) brightness(0.8)",
        }}
      />

      {/* Starry/Dusty background overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-20 z-0"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          mixBlendMode: "screen",
        }}
      />
      
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
        fitViewOptions={{ padding: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.8 : 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={40}
          size={1.5}
          color="rgba(255, 238, 221, 0.15)"
        />
        <Controls
          showInteractive={false}
          position="bottom-right"
          className="sharp-border !shadow-none !bg-[#050510] !border-[#ffeedd]/30"
          style={{
             fill: "#ffeedd",
          }}
        />
        <MiniMap
          className="sharp-border !shadow-none !bg-[#050510] border !border-[#ffeedd]/30 hidden md:block"
          nodeColor={(node) => {
            if (node.type === "coordinate") return "#ffeedd";
            if (node.type === "event") return "rgba(255,238,221,0.5)";
            return "rgba(255,238,221,0.2)";
          }}
          maskColor="rgba(5, 5, 16, 0.8)"
          position="bottom-left"
        />
      </ReactFlow>

      {/* Canvas decorative corner text */}
      <div
        className="pointer-events-none absolute left-4 md:left-8 top-16 md:top-24 select-none z-10"
      >
        <div className="flex items-center gap-2 md:gap-4 mb-1 md:mb-2">
          <div className="h-[2px] w-4 md:w-8 bg-[#ffeedd]" />
          <span className="text-[8px] md:text-[10px] font-bold tracking-widest text-[#ffeedd] uppercase">Sector 02</span>
        </div>
        <p
          className="text-3xl md:text-5xl font-black tracking-tighter text-[#ffeedd] drop-shadow-md leading-none"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          THE PATHS
        </p>
        <p className="mt-1 md:mt-2 text-[8px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase text-[#ffeedd]/70">
          Coordinate Connection Overview
        </p>
      </div>
      
      {/* Decorative vertical bounds */}
      <div className="pointer-events-none fixed inset-y-0 left-[5%] w-[1px] bg-[#ffeedd] opacity-10 z-0" />
      <div className="pointer-events-none fixed inset-y-0 right-[5%] w-[1px] bg-[#ffeedd] opacity-10 z-0" />
    </div>
  );
}
