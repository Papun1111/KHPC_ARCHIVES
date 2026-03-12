import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary.
// It will automatically pick up the CLOUDINARY_URL environment variable from .env,
// but we explicitly call config() just to be safe.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// GET /api/images — List all images with labels
export async function GET() {
  try {
    const images = await prisma.image.findMany({
      include: { labels: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST /api/images — Upload image(s) to Cloudinary
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const caption = formData.get("caption") as string | null;
    const eventName = formData.get("eventName") as string | null;
    
    const labelsJSON = formData.get("labels") as string;
    let labelNames: string[] = [];
    try {
      if (labelsJSON) labelNames = JSON.parse(labelsJSON);
    } catch (e) {
      console.error("Failed to parse labels", e);
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const results = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload the buffer to Cloudinary using a stream
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "aot-gallery", // Optional organizational folder
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        // Write the buffer to the stream
        uploadStream.end(buffer);
      });

      // Get image dimensions from Cloudinary's response directly
      // This is much safer than relying on the client
      const width = uploadResult.width;
      const height = uploadResult.height;
      const aspectRatio = width / height;
      const secureUrl = uploadResult.secure_url;

      // Ensure labels exist before connecting
      const connectLabels = await Promise.all(
        labelNames.map(async (name) => {
          // Upsert the label just in case it's not created
          const label = await prisma.label.upsert({
            where: { name },
            update: {},
            create: { name, color: "#000000" }, // Default stark black
          });
          return { id: label.id };
        })
      );

      // Create database record using the permanent Cloudinary URL
      const image = await prisma.image.create({
        data: {
          url: secureUrl,
          width,
          height,
          aspectRatio,
          caption: caption || null,
          eventName: eventName || null,
          labels: {
            connect: connectLabels,
          },
        },
        include: { labels: true },
      });

      results.push(image);
    }

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
