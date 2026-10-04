"use client";

import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// EmbersBackground: Battlefield floating embers & steam — Dark AoT Theme
// ═══════════════════════════════════════════════════════════════════════════

export function EmbersBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);
    resize();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;
      opacity: number;
      color: string;
      type: "ember" | "steam";

      constructor() {
        this.type = Math.random() > 0.7 ? "steam" : "ember";
        this.x = Math.random() * width;
        this.y = height + Math.random() * 200;
        this.size = this.type === "steam" ? Math.random() * 8 + 3 : Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * (this.type === "steam" ? 1 : 2);
        this.speedY = this.type === "steam" ? -(Math.random() * 1.5 + 0.5) : -(Math.random() * 2.5 + 1);
        this.maxLife = Math.random() * 120 + 60;
        this.life = this.maxLife;
        this.opacity = this.type === "steam" ? Math.random() * 0.15 + 0.05 : Math.random() * 0.7 + 0.2;

        if (this.type === "steam") {
          // Steam colors: white/gray translucent
          const steamColors = [
            "rgba(180, 180, 180, OPACITY)",
            "rgba(200, 200, 200, OPACITY)",
            "rgba(160, 160, 170, OPACITY)",
          ];
          this.color = steamColors[Math.floor(Math.random() * steamColors.length)];
        } else {
          // Ember colors: warm amber/orange/red (complementing dark theme)
          const emberColors = [
            "rgba(212, 168, 67, OPACITY)",  // titan amber
            "rgba(200, 100, 0, OPACITY)",   // deep orange
            "rgba(160, 60, 20, OPACITY)",   // ember red
            "rgba(140, 140, 140, OPACITY)", // ash/smoke
          ];
          this.color = emberColors[Math.floor(Math.random() * emberColors.length)];
        }
      }

      update() {
        if (this.type === "steam") {
          this.x += this.speedX + (Math.sin(this.life * 0.03) * 0.8);
          this.y += this.speedY;
          this.size += 0.02; // Steam expands
        } else {
          this.x += this.speedX + (Math.sin(this.life * 0.05) * 0.5);
          this.y += this.speedY;
        }
        this.life--;

        // Fade out near the end
        if (this.life < 30) {
          this.opacity = (this.life / 30) * this.opacity;
        }

        // Reset if it goes off top of screen or dies
        if (this.y < -50 || this.life <= 0) {
          this.reset();
        }
      }

      reset() {
        this.type = Math.random() > 0.7 ? "steam" : "ember";
        this.x = Math.random() * width;
        this.y = height + 50;
        this.size = this.type === "steam" ? Math.random() * 8 + 3 : Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * (this.type === "steam" ? 1 : 2);
        this.speedY = this.type === "steam" ? -(Math.random() * 1.5 + 0.5) : -(Math.random() * 2.5 + 1);
        this.maxLife = Math.random() * 120 + 100;
        this.life = this.maxLife;
        this.opacity = this.type === "steam" ? Math.random() * 0.15 + 0.05 : Math.random() * 0.7 + 0.2;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        const currentOpacity = Math.max(0, this.opacity);
        const drawColor = this.color.replace("OPACITY", currentOpacity.toString());

        if (this.type === "steam") {
          // Soft blurry circles for steam
          ctx.shadowBlur = 20;
          ctx.shadowColor = drawColor;
          ctx.fillStyle = drawColor;
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Sharp glowing dots for embers
          ctx.shadowBlur = 8;
          ctx.shadowColor = drawColor;
          ctx.fillStyle = drawColor;
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    // Initialize particles — fewer for performance on dark backgrounds
    const particleCount = Math.min(Math.floor((width * height) / 15000), 120);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
      // Randomize initial vertical positions
      particles[i].y = Math.random() * height;
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle bottom glow — emanating from below like fires burning
      const gradient = ctx.createLinearGradient(0, height - 250, 0, height);
      gradient.addColorStop(0, "rgba(10, 11, 16, 0)");
      gradient.addColorStop(0.5, "rgba(30, 15, 5, 0.1)");
      gradient.addColorStop(1, "rgba(40, 20, 0, 0.2)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, height - 250, width, 250);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
      style={{ opacity: 0.5 }}
    />
  );
}
