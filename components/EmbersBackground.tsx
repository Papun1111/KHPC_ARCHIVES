"use client";

import { useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// EmbersBackground: Subtle battlefield dust & ash — Brutalist Parchment Theme
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

      constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 2 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = -(Math.random() * 1.2 + 0.3);
        this.maxLife = Math.random() * 180 + 120;
        this.life = this.maxLife;
        this.opacity = Math.random() * 0.35 + 0.1;

        // Subtle cool/neutral grey dust colors
        const dustColors = [
          "rgba(153, 153, 150, OPACITY)",
          "rgba(200, 200, 196, OPACITY)",
          "rgba(175, 175, 170, OPACITY)",
        ];
        this.color = dustColors[Math.floor(Math.random() * dustColors.length)];
      }

      update() {
        this.x += this.speedX + Math.sin(this.life * 0.02) * 0.4;
        this.y += this.speedY;
        this.life--;

        // Fade out near the end
        if (this.life < 40) {
          this.opacity = (this.life / 40) * 0.35;
        }

        // Reset if it goes off top of screen or dies
        if (this.y < -30 || this.life <= 0) {
          this.reset();
        }
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 20;
        this.size = Math.random() * 2 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = -(Math.random() * 1.2 + 0.3);
        this.maxLife = Math.random() * 180 + 120;
        this.life = this.maxLife;
        this.opacity = Math.random() * 0.35 + 0.1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        const currentOpacity = Math.max(0, Math.min(0.4, this.opacity));
        const drawColor = this.color.replace("OPACITY", currentOpacity.toFixed(2));

        ctx.fillStyle = drawColor;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Subtler particle count for light theme
    const particleCount = Math.min(Math.floor((width * height) / 32000), 45);
    for (let i = 0; i < particleCount; i++) {
      const p = new Particle();
      p.y = Math.random() * height;
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

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
      style={{ opacity: 0.6 }}
    />
  );
}
