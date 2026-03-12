"use client";

import { useEffect, useRef, useState } from "react";

// ─── EmbersBackground: Battlefield floating embers effect ───────────────

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
        this.y = height + Math.random() * 200; // Start below screen
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = -(Math.random() * 3 + 1); // Float upwards
        this.maxLife = Math.random() * 100 + 50;
        this.life = this.maxLife;
        this.opacity = Math.random() * 0.8 + 0.2;
        
        // Ember colors: orange, red, yellow
        const colors = [
          "rgba(255, 100, 0, OPACITY)", // fiery orange
          "rgba(255, 50, 0, OPACITY)",  // red-orange
          "rgba(255, 200, 0, OPACITY)", // bright yellow
          "rgba(200, 200, 200, OPACITY)" // ash/smoke
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX + (Math.sin(this.life * 0.05) * 0.5); // Add slight drift
        this.y += this.speedY;
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
        this.x = Math.random() * width;
        this.y = height + 50;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = -(Math.random() * 3 + 1);
        this.maxLife = Math.random() * 100 + 100;
        this.life = this.maxLife;
        this.opacity = Math.random() * 0.8 + 0.2;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        const currentOpacity = Math.max(0, this.opacity);
        const drawColor = this.color.replace("OPACITY", currentOpacity.toString());
        
        // Add glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = drawColor;
        ctx.fillStyle = drawColor;
        
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Initialize particles based on screen size
    const particleCount = Math.floor((width * height) / 10000); // Responsive amount
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
      // Randomize initial vertical positions so they don't all start at bottom
      particles[i].y = Math.random() * height;
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Add a subtle dark battle smoke overlay at bottom
      const gradient = ctx.createLinearGradient(0, height - 200, 0, height);
      gradient.addColorStop(0, "rgba(10, 11, 16, 0)");
      gradient.addColorStop(1, "rgba(20, 10, 0, 0.3)"); // slight fiery glow
      ctx.fillStyle = gradient;
      ctx.fillRect(0, height - 200, width, 200);

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
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ opacity: 0.6 }}
    />
  );
}
