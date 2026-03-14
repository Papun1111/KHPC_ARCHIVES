"use client";

import { memo } from "react";
import {
  BaseEdge,
  getBezierPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

// ─── PathEdge: Ethereal glowing connections ──────────────────

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
  // Use a smooth bezier curve for the ethereal paths branching from the tree
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      {/* Outer Glow Halo 1 */}
      <BaseEdge
        id={`${id}-halo1`}
        path={edgePath}
        style={{
          ...style,
          stroke: "rgba(255, 238, 221, 0.15)",
          strokeWidth: 12,
          filter: "blur(6px)",
        }}
      />

      {/* Outer Glow Halo 2 */}
      <BaseEdge
        id={`${id}-halo2`}
        path={edgePath}
        style={{
          ...style,
          stroke: "rgba(255, 238, 221, 0.3)",
          strokeWidth: 6,
          filter: "blur(3px)",
        }}
      />

      {/* Main bright ethereal core */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: "#ffeedd",
          strokeWidth: 2,
        }}
      />

      {/* Flowing energy pulse moving along the branch */}
      <path
        d={edgePath}
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        className="animate-path-flow mix-blend-screen"
        style={{
          strokeDasharray: "2 25",
          strokeLinecap: "round",
          filter: "drop-shadow(0 0 4px #ffffff)",
        }}
      />
    </>
  );
}

export const PathEdge = memo(PathEdgeComponent);
