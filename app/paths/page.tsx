"use client";

import { useState, useEffect } from "react";
import { PathsCanvas } from "@/components/canvas/PathsCanvas";
import { Navbar } from "@/components/Navbar";
import type { ImageData } from "@/components/ImageCard";

// ─── The Paths — Mind Map Page ──────────────────────────────────────────

export default function PathsPage() {
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(
            data.map((img: any) => ({
              ...img,
              labels: img.labels?.map((l: any) => typeof l === "string" ? l : l.name) || [],
            }))
          );
        }
      })
      .catch((e) => console.log("Failed to load images from memory", e));
  }, []);

  const handleNodeClick = (image: ImageData) => {
    // In production: router.push(`/?image=${image.id}`) or open lightbox
    console.log("Node clicked:", image.id);
  };

  return (
    <div className="flex h-screen flex-col" style={{ background: "#0a0b10" }}>
      <Navbar />
      <div className="relative flex-1">
        <PathsCanvas images={images} onNodeClick={handleNodeClick} />
      </div>
    </div>
  );
}
