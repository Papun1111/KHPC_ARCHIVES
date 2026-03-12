import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/images/[id] — Update caption, favorite, or labels
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    if (typeof body.caption === "string") {
      updateData.caption = body.caption;
    }

    if (typeof body.isFavorite === "boolean") {
      updateData.isFavorite = body.isFavorite;
    }

    // Handle label connections
    if (Array.isArray(body.labelIds)) {
      updateData.labels = {
        set: body.labelIds.map((labelId: string) => ({ id: labelId })),
      };
    }

    const image = await prisma.image.update({
      where: { id },
      data: updateData,
      include: { labels: true },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json(
      { error: "Image not found or update failed" },
      { status: 404 }
    );
  }
}

// DELETE /api/images/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.image.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json(
      { error: "Image not found" },
      { status: 404 }
    );
  }
}
