"use client";

import { useState, useEffect } from "react";
import { PathsCanvas } from "@/components/canvas/PathsCanvas";
import { Navbar } from "@/components/Navbar";
import type { ImageData } from "@/components/ImageCard";
import { useRouter } from "next/navigation";
import { DEMO_IMAGES } from "@/lib/constants";

// ─── The Paths — Mind Map Page ──────────────────────────────────────────

export default function PathsPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
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

  const handleNodeClick = (imageOrEventName: ImageData | string) => {
    if (typeof imageOrEventName === "string") {
      router.push(`/?event=${encodeURIComponent(imageOrEventName)}`);
    } else {
      router.push(`/?event=${encodeURIComponent(imageOrEventName.eventName || "Unknown Memory")}`);
    }
  };

  return (
    <div className="flex h-screen flex-col" style={{ background: "#050510" }}>
      <Navbar />
      <div className="relative flex-1">
        <PathsCanvas images={images} onNodeClick={handleNodeClick} />
      </div>
    </div>
  );
}
