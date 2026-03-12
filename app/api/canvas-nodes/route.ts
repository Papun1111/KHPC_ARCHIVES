import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/canvas-nodes — Load all persisted canvas nodes
export async function GET() {
  try {
    const nodes = await prisma.canvasNode.findMany({
      include: { image: { include: { labels: true } } },
    });

    return NextResponse.json(nodes);
  } catch (error) {
    console.error("Failed to fetch canvas nodes:", error);
    return NextResponse.json(
      { error: "Failed to fetch canvas state" },
      { status: 500 }
    );
  }
}

// PUT /api/canvas-nodes — Bulk save canvas node positions/edges
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body.nodes)) {
      return NextResponse.json(
        { error: "nodes array is required" },
        { status: 400 }
      );
    }

    // Upsert each node
    const results = await Promise.all(
      body.nodes.map(
        (node: { imageId: string; x: number; y: number; scale?: number; edges?: string[] }) =>
          prisma.canvasNode.upsert({
            where: { imageId: node.imageId },
            update: {
              x: node.x,
              y: node.y,
              scale: node.scale ?? 1,
              edges: node.edges ?? [],
            },
            create: {
              imageId: node.imageId,
              x: node.x,
              y: node.y,
              scale: node.scale ?? 1,
              edges: node.edges ?? [],
            },
          })
      )
    );

    return NextResponse.json({ saved: results.length });
  } catch (error) {
    console.error("Canvas save failed:", error);
    return NextResponse.json(
      { error: "Failed to save canvas state" },
      { status: 500 }
    );
  }
}
