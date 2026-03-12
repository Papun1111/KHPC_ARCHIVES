"use client";

import { memo } from "react";
import {
  BaseEdge,
  getStraightPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

// ─── PathEdge: Jagged, chaotic black/blood connections ──────────────────

type PathEdgeData = Record<string, never>;
type PathEdgeType = Edge<PathEdgeData, "path">;

function PathEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
}: EdgeProps<PathEdgeType>) {
  // Use straight path so the line looks tense and pulled tight like a wire
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      {/* Thick jagged drop shadow/stroke like a sketchy ink line */}
      <BaseEdge
        id={`${id}-stroke`}
        path={edgePath}
        style={{
          ...style,
          stroke: "rgba(0, 0, 0, 0.1)",
          strokeWidth: 4,
          filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.1))",
        }}
      />

      {/* Main crisp black line */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: "#000000",
          strokeWidth: 1.5,
        }}
      />

      {/* Chaotic bleeding red dashes running along the wire */}
      <path
        d={edgePath}
        fill="none"
        stroke="#8a0303"
        strokeWidth="1.5"
        className="animate-path-flow mix-blend-multiply"
        style={{
          strokeDasharray: "2 15",
          strokeLinecap: "square",
        }}
      />
    </>
  );
}

export const PathEdge = memo(PathEdgeComponent);
