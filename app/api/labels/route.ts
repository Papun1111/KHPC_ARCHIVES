import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/labels — List all labels
export async function GET() {
  try {
    const labels = await prisma.label.findMany({
      include: { _count: { select: { images: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(labels);
  } catch (error) {
    console.error("Failed to fetch labels:", error);
    return NextResponse.json(
      { error: "Failed to fetch labels" },
      { status: 500 }
    );
  }
}

// POST /api/labels — Create a new label
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Label name is required" },
        { status: 400 }
      );
    }

    const label = await prisma.label.create({
      data: {
        name: body.name,
        color: body.color || "#d4a843",
      },
    });

    return NextResponse.json(label, { status: 201 });
  } catch (error) {
    console.error("Label creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create label (name may already exist)" },
      { status: 400 }
    );
  }
}
