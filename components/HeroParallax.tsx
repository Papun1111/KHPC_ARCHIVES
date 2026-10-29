"use client";

import { useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════
// BACKGROUND VISUAL: CSS Red Ink Splash / Blood Stain
// Generated using pure CSS radial gradients and complex organic clip-paths
// ═══════════════════════════════════════════════════════════════════════════

function RedInkSplatter() {
  return (
    <div className="relative flex items-center justify-center w-full h-full pointer-events-none select-none">
      {/* Ambient blood mist wash */}
      <div
        className="absolute w-[80vw] max-w-[900px] h-[70vh] max-h-[700px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(138, 3, 3, 0.18) 0%, rgba(92, 2, 2, 0.08) 45%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Primary Organic Ink Splash */}
      <div
        className="relative w-[340px] h-[340px] sm:w-[520px] sm:h-[480px] lg:w-[720px] lg:h-[620px] mix-blend-multiply opacity-80"
        style={{
          background:
            "radial-gradient(ellipse at 48% 46%, rgba(138, 3, 3, 0.75) 0%, rgba(92, 2, 2, 0.58) 35%, rgba(196, 30, 30, 0.32) 58%, rgba(138, 3, 3, 0.12) 72%, transparent 88%)",
          clipPath:
            "polygon(48% 0%, 57% 12%, 69% 6%, 73% 20%, 86% 16%, 83% 32%, 96% 36%, 88% 50%, 98% 64%, 82% 70%, 88% 85%, 72% 82%, 68% 97%, 52% 86%, 44% 98%, 32% 88%, 18% 96%, 22% 78%, 6% 82%, 14% 64%, 2% 50%, 15% 38%, 5% 24%, 22% 20%, 24% 6%, 39% 14%)",
          filter: "contrast(135%) blur(1px)",
        }}
      >
        {/* Secondary Inner Clot Layer */}
        <div
          className="absolute inset-[15%] opacity-85"
          style={{
            background:
              "radial-gradient(circle at 45% 50%, rgba(92, 2, 2, 0.88) 0%, rgba(138, 3, 3, 0.6) 45%, transparent 75%)",
            clipPath:
              "polygon(50% 5%, 65% 25%, 90% 30%, 75% 55%, 92% 75%, 65% 80%, 48% 95%, 32% 78%, 8% 82%, 20% 55%, 10% 28%, 35% 25%)",
          }}
        />
      </div>

      {/* Satellite Ink Droplet: Top-Right */}
      <div
        className="absolute -top-6 right-[18%] sm:right-[26%] w-20 h-20 sm:w-28 sm:h-28 mix-blend-multiply opacity-75"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(138, 3, 3, 0.7) 0%, rgba(138, 3, 3, 0.3) 50%, transparent 75%)",
          clipPath:
            "polygon(40% 0%, 90% 20%, 100% 70%, 65% 100%, 15% 85%, 0% 30%)",
        }}
      />

      {/* Satellite Ink Droplet: Bottom-Left Run */}
      <div
        className="absolute -bottom-8 left-[16%] sm:left-[24%] w-24 h-36 sm:w-32 sm:h-48 mix-blend-multiply opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 25%, rgba(138, 3, 3, 0.75) 0%, rgba(196, 30, 30, 0.35) 55%, transparent 80%)",
          clipPath:
            "polygon(35% 0%, 75% 8%, 68% 42%, 82% 64%, 55% 100%, 45% 96%, 34% 68%, 20% 38%)",
        }}
      />

      {/* Micro-Splatter Droplet Cluster */}
      <div
        className="absolute top-[22%] left-[20%] w-5 h-5 rounded-full mix-blend-multiply opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(138, 3, 3, 0.85) 0%, rgba(138, 3, 3, 0.2) 70%, transparent 100%)",
        }}
      />
      <div
        className="absolute bottom-[28%] right-[22%] w-7 h-7 rounded-full mix-blend-multiply opacity-65"
        style={{
          background:
            "radial-gradient(circle, rgba(138, 3, 3, 0.8) 0%, rgba(138, 3, 3, 0.2) 70%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-[35%] right-[14%] w-3 h-3 rounded-full mix-blend-multiply opacity-80"
        style={{ background: "#8a0303" }}
      />
      <div
        className="absolute bottom-[20%] left-[28%] w-4 h-4 rounded-full mix-blend-multiply opacity-75"
        style={{ background: "#8a0303" }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MIDGROUND VISUAL: Titan Skeleton Geometric Lines & Blueprint Grid (SVG)
// Intricate vector architectural lines depicting spinal column and ribcage
// ═══════════════════════════════════════════════════════════════════════════

function TitanSkeletonSVG() {
  return (
    <svg
      viewBox="0 0 1400 900"
      className="w-full h-full max-w-[1500px] max-h-[950px] pointer-events-none select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Subtle grid pattern for blueprint aesthetics */}
        <pattern
          id="titan-blueprint-grid"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 100 0 L 0 0 0 100"
            fill="none"
            stroke="#c8c8c4"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
          <circle cx="0" cy="0" r="1.5" fill="#999996" fillOpacity="0.5" />
        </pattern>
      </defs>

      {/* Blueprint Grid Background */}
      <rect
        width="1400"
        height="900"
        fill="url(#titan-blueprint-grid)"
        opacity="0.65"
      />

      {/* Diagonal Tension Guide Lines */}
      <g stroke="#c8c8c4" strokeWidth="0.8" strokeOpacity="0.45" strokeDasharray="3 6">
        <line x1="0" y1="0" x2="700" y2="450" />
        <line x1="1400" y1="0" x2="700" y2="450" />
        <line x1="0" y1="900" x2="700" y2="450" />
        <line x1="1400" y1="900" x2="700" y2="450" />
      </g>

      {/* Concentric Cranial / Coordinate Halo at Center */}
      <g stroke="#151515" strokeOpacity="0.16" strokeWidth="1">
        <circle cx="700" cy="220" r="60" strokeDasharray="4 4" />
        <circle cx="700" cy="220" r="140" strokeOpacity="0.12" />
        <circle cx="700" cy="220" r="240" strokeDasharray="2 6" strokeOpacity="0.1" />
        <circle cx="700" cy="220" r="360" strokeOpacity="0.08" />
        {/* Crosshair reticles */}
        <line x1="700" y1="40" x2="700" y2="400" strokeOpacity="0.25" />
        <line x1="420" y1="220" x2="980" y2="220" strokeOpacity="0.25" />
      </g>

      {/* Central Spinal Column & Vertebral Axis */}
      <g>
        {/* Main Spinal Rod */}
        <line
          x1="700"
          y1="80"
          x2="700"
          y2="840"
          stroke="#151515"
          strokeWidth="1.5"
          strokeOpacity="0.35"
        />
        <line
          x1="693"
          y1="100"
          x2="693"
          y2="820"
          stroke="#151515"
          strokeWidth="0.8"
          strokeOpacity="0.2"
        />
        <line
          x1="707"
          y1="100"
          x2="707"
          y2="820"
          stroke="#151515"
          strokeWidth="0.8"
          strokeOpacity="0.2"
        />

        {/* Vertebral Blocks (V-01 to V-10) */}
        {[130, 190, 250, 310, 370, 430, 490, 550, 610, 670, 730].map(
          (yPos, i) => (
            <g key={`vert-${yPos}`}>
              {/* Vertebra block casing */}
              <rect
                x="682"
                y={yPos - 9}
                width="36"
                height="18"
                rx="2"
                fill="#f4f4f0"
                stroke="#151515"
                strokeWidth="1"
                strokeOpacity="0.4"
              />
              {/* Diamond marrow coordinate node */}
              <polygon
                points={`700,${yPos - 7} 706,${yPos} 700,${yPos + 7} 694,${yPos}`}
                fill="#8a0303"
                fillOpacity="0.35"
                stroke="#8a0303"
                strokeWidth="0.8"
              />
              {/* Lateral nerve ticks */}
              <line
                x1="664"
                y1={yPos}
                x2="682"
                y2={yPos}
                stroke="#151515"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              <line
                x1="718"
                y1={yPos}
                x2="736"
                y2={yPos}
                stroke="#151515"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              {/* Vertebral label */}
              <text
                x="724"
                y={yPos + 3}
                fontFamily="monospace"
                fontSize="6"
                fill="#151515"
                fillOpacity="0.3"
                letterSpacing="1"
              >
                {`V-0${i + 1}`}
              </text>
            </g>
          )
        )}
      </g>

      {/* Titan Ribcage Arches (Sweeping Colossal Biomechanical Curves) */}
      <g stroke="#151515" strokeWidth="1.2" strokeOpacity="0.28" fill="none">
        {/* Rib Pair 1 (Cervical / Upper Arch) */}
        <path d="M 700 190 C 580 140 450 160 350 230 C 290 270 250 330 230 400" />
        <path d="M 700 190 C 820 140 950 160 1050 230 C 1110 270 1150 330 1170 400" />

        {/* Rib Pair 2 */}
        <path d="M 700 250 C 550 190 410 220 290 300 C 220 350 170 430 150 510" />
        <path d="M 700 250 C 850 190 990 220 1110 300 C 1180 350 1230 430 1250 510" />

        {/* Rib Pair 3 (Broad Thoracic) */}
        <path d="M 700 310 C 520 240 370 280 230 380 C 150 440 100 540 80 640" />
        <path d="M 700 310 C 880 240 1030 280 1170 380 C 1250 440 1300 540 1320 640" />

        {/* Rib Pair 4 (Maximum Colossal Expanse) */}
        <path
          d="M 700 370 C 500 290 320 350 180 470 C 100 540 50 650 30 760"
          stroke="#8a0303"
          strokeOpacity="0.32"
          strokeWidth="1.4"
        />
        <path
          d="M 700 370 C 900 290 1080 350 1220 470 C 1300 540 1350 650 1370 760"
          stroke="#8a0303"
          strokeOpacity="0.32"
          strokeWidth="1.4"
        />

        {/* Rib Pair 5 */}
        <path d="M 700 430 C 520 370 340 440 210 570 C 140 650 110 750 90 840" />
        <path d="M 700 430 C 880 370 1060 440 1190 570 C 1260 650 1290 750 1310 840" />

        {/* Rib Pair 6 */}
        <path d="M 700 490 C 540 440 380 520 270 650 C 210 730 180 810 170 880" />
        <path d="M 700 490 C 860 440 1020 520 1130 650 C 1190 730 1220 810 1230 880" />

        {/* Rib Pair 7 (Base Structure) */}
        <path d="M 700 550 C 570 520 440 610 350 730 C 300 800 280 860 270 900" />
        <path d="M 700 550 C 830 520 960 610 1050 730 C 1100 800 1120 860 1130 900" />
      </g>

      {/* Intercostal Muscle / Tension Cable Dashes */}
      <g stroke="#151515" strokeWidth="0.7" strokeOpacity="0.18" strokeDasharray="3 4">
        <line x1="350" y1="230" x2="290" y2="300" />
        <line x1="290" y1="300" x2="230" y2="380" />
        <line x1="230" y1="380" x2="180" y2="470" />
        <line x1="1050" y1="230" x2="1110" y2="300" />
        <line x1="1110" y1="300" x2="1170" y2="380" />
        <line x1="1170" y1="380" x2="1220" y2="470" />
      </g>

      {/* Architectural Typography & Survey Stamps */}
      <g fontFamily="monospace" fontSize="7" fill="#151515" fillOpacity="0.4" letterSpacing="2">
        <text x="715" y="105">AXIS.VERTEBRA // ORIGIN-01</text>
        <text x="715" y="375" fill="#8a0303" fillOpacity="0.6">
          MAX.THORACIC // EXPANSION 164.2%
        </text>
        <text x="715" y="735">LUMBAR.BASE // SECTOR-854</text>
        <text x="60" y="745" fill="#8a0303" fillOpacity="0.5">
          SPAN: 1340M // COLOSSAL CLASS
        </text>
        <text x="1140" y="745">PARADIS.GRID // WALL MARIA</text>
      </g>

      {/* Coordinate Crosshairs at Key Joints */}
      {[
        [350, 230],
        [1050, 230],
        [290, 300],
        [1110, 300],
        [230, 380],
        [1170, 380],
        [180, 470],
        [1220, 470],
      ].map(([x, y]) => (
        <g key={`cross-${x}-${y}`} stroke="#8a0303" strokeWidth="0.8" strokeOpacity="0.4">
          <line x1={x - 4} y1={y} x2={x + 4} y2={y} />
          <line x1={x} y1={y - 4} x2={x} y2={y + 4} />
          <circle cx={x} cy={y} r="1" fill="#8a0303" fillOpacity="0.5" />
        </g>
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

export interface HeroParallaxProps {
  className?: string;
  onExploreClick?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT: HeroParallax
// Attack on Titan brutalist hero with multi-tiered mouse and scroll parallax
// ═══════════════════════════════════════════════════════════════════════════

export function HeroParallax({ className = "", onExploreClick }: HeroParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Framer Motion Mouse Tracking ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse physics spring (avoids jitter, creates fluid cinematic momentum)
  const springConfig = { damping: 28, stiffness: 140, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax Intensities (Mouse):
  // Background layer: moves 10px in response to mouse
  const bgMouseX = useTransform(smoothMouseX, [-1, 1], [-10, 10]);
  const bgMouseY = useTransform(smoothMouseY, [-1, 1], [-10, 10]);

  // Midground layer: moves 20px in response to mouse
  const midMouseX = useTransform(smoothMouseX, [-1, 1], [-20, 20]);
  const midMouseY = useTransform(smoothMouseY, [-1, 1], [-20, 20]);

  // Foreground layer: moves 35px in response to mouse
  const fgMouseX = useTransform(smoothMouseX, [-1, 1], [-35, 35]);
  const fgMouseY = useTransform(smoothMouseY, [-1, 1], [-35, 35]);

  // ── Framer Motion Scroll Parallax ──
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Vertical Parallax rates on Scroll (layers move at different rates as user scrolls)
  const bgScrollY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const midScrollY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const fgScrollY = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const fgOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.4, 0]);

  // Mouse Move Event Handler (calculates normalized offset: -1 to 1)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  // Mouse Leave: gracefully reset motion values back to center (0, 0)
  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Smooth Scroll Down Action
  const handleScrollDown = useCallback(() => {
    if (onExploreClick) {
      onExploreClick();
    } else if (containerRef.current) {
      const targetY = containerRef.current.offsetHeight;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }, [onExploreClick]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full min-h-screen overflow-hidden bg-aot-parchment text-aot-dark flex flex-col justify-between crack-overlay select-none ${className}`}
      aria-label="Attack on Titan Brutalist Hero"
    >
      {/* ── 1. Blood Splatter Edge Decorations ── */}
      {/* Utilizing the designated .blood-splatter-left and .blood-splatter-right classes */}
      <div className="absolute inset-0 pointer-events-none z-20 blood-splatter-left blood-splatter-right" />

      {/* ── 2. Structural 1px Framing Grid & Viewfinder Elements ── */}
      <div className="section-divider absolute top-0 left-0 right-0 z-30" />
      <div className="section-divider absolute bottom-0 left-0 right-0 z-30" />

      {/* Vertical grid guide lines */}
      <div className="section-divider-vertical absolute top-0 bottom-0 left-6 sm:left-12 lg:left-20 z-10 pointer-events-none opacity-40 hidden sm:block" />
      <div className="section-divider-vertical absolute top-0 bottom-0 right-6 sm:right-12 lg:right-20 z-10 pointer-events-none opacity-40 hidden sm:block" />

      {/* Viewfinder Crosshairs in the Four Corners */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 crosshair-corners w-5 h-5 pointer-events-none z-30" />
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 crosshair-corners w-5 h-5 pointer-events-none z-30" />
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 crosshair-corners w-5 h-5 pointer-events-none z-30" />
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 crosshair-corners w-5 h-5 pointer-events-none z-30" />

      {/* ── Top Header Rail: Monospace Archival Metadata ── */}
      <div className="relative z-30 w-full px-6 sm:px-12 lg:px-20 pt-6 sm:pt-8 flex items-center justify-between text-mono-xs text-text-muted">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-aot-blood animate-pulse" />
          <span className="tracking-[0.25em] font-medium text-text-secondary">
            RECORD NO. 854-KHPC // DIV-SCOUT
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6 tracking-[0.25em]">
          <span>WALL SYSTEM: 3-TIER AXIS</span>
          <span className="text-aot-border">•</span>
          <span className="text-aot-blood-bright font-semibold">
            STATUS: UNSEALED
          </span>
        </div>
      </div>

      {/* ── LAYER 1: Background Parallax Layer ── */}
      {/* Moves 10px with mouse, moves 70px with scroll */}
      <motion.div
        style={{ y: bgScrollY }}
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{ x: bgMouseX, y: bgMouseY }}
          className="w-full h-full flex items-center justify-center"
        >
          <RedInkSplatter />
        </motion.div>
      </motion.div>

      {/* ── LAYER 2: Midground Parallax Layer ── */}
      {/* Moves 20px with mouse, moves 150px with scroll */}
      <motion.div
        style={{ y: midScrollY }}
        className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center p-4 sm:p-8"
      >
        <motion.div
          style={{ x: midMouseX, y: midMouseY }}
          className="w-full h-full flex items-center justify-center"
        >
          <TitanSkeletonSVG />
        </motion.div>
      </motion.div>

      {/* ── LAYER 3: Foreground Parallax Layer & Center Content ── */}
      {/* Moves 35px with mouse, moves 250px with scroll */}
      <motion.div
        style={{ y: fgScrollY, opacity: fgOpacity }}
        className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12"
      >
        <motion.div
          style={{ x: fgMouseX, y: fgMouseY }}
          className="relative flex flex-col items-center max-w-5xl mx-auto w-full"
        >
          {/* Decorative Kanji Flanking Columns (Hidden on narrow screens) */}
          <div className="hidden lg:block absolute left-[-60px] xl:left-[-110px] top-1/2 -translate-y-1/2 text-aot-dark/[0.08] font-bold [writing-mode:vertical-rl] text-6xl tracking-[0.4em] select-none pointer-events-none">
            進撃の巨人
          </div>
          <div className="hidden lg:block absolute right-[-60px] xl:right-[-110px] top-1/2 -translate-y-1/2 text-aot-dark/[0.08] font-bold [writing-mode:vertical-rl] text-6xl tracking-[0.4em] select-none pointer-events-none">
            自由の翼
          </div>

          {/* Archival Classification Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 mb-5 sm:mb-6 border border-aot-border bg-aot-parchment/90 backdrop-blur-sm text-mono-xs tracking-[0.25em] text-text-secondary shadow-sm"
          >
            <span className="w-1.5 h-1.5 bg-aot-blood animate-pulse" />
            <span className="font-semibold text-aot-blood">CLASSIFIED // EYES ONLY</span>
            <span className="text-aot-border">|</span>
            <span>EXPEDITION ARCHIVE 845–854</span>
          </motion.div>

          {/* Center Main Title: KHPC ARCHIVES in Massive Cinzel Font */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="heading-brutal heading-brutal-xl text-center tracking-tight text-aot-dark relative uppercase drop-shadow-sm"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            KHPC ARCHIVES
          </motion.h1>

          {/* Subtitle with Brutalist Framing Dividers */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-6 w-full max-w-3xl"
          >
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-aot-border" />
            <p className="text-center font-mono text-mono-sm sm:text-xs md:text-sm tracking-[0.22em] sm:tracking-[0.32em] text-text-secondary uppercase">
              Wall System Expedition Logs &amp; Titan Research
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-aot-border" />
          </motion.div>

          {/* Secondary Japanese Traditional Inscription */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-2.5 sm:mt-3 text-center text-[10px] sm:text-xs md:text-sm tracking-[0.38em] text-aot-grey-dark uppercase font-serif"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            人類の記憶 • 壁内調査記録 • 始祖の座標
          </motion.p>

          {/* Structural Framing Metadata Ribbon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-mono-xs tracking-[0.2em] text-text-muted border-t border-b border-aot-border/80 py-2 sm:py-2.5 px-4 sm:px-8 bg-aot-parchment-dark/40 backdrop-blur-xs w-full max-w-2xl"
          >
            <span>SECTOR: 01–854</span>
            <span className="text-aot-border">•</span>
            <span className="text-aot-blood font-semibold">THREAT: OMNICIDE</span>
            <span className="text-aot-border">•</span>
            <span>CLEARANCE: REGIMENT</span>
            <span className="text-aot-border">•</span>
            <span>COORDINATE: 34°N 109°E</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Bottom Section: Scroll Indicator & Footer Stamps ── */}
      <div className="relative z-30 w-full px-6 sm:px-12 lg:px-20 pb-6 sm:pb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Bottom Left Technical Annotation */}
        <div className="text-mono-xs text-text-muted tracking-[0.2em] hidden sm:block">
          <div>LOC: PARADIS ISLAND</div>
          <div className="text-aot-grey-dark">EST. YEAR 845</div>
        </div>

        {/* Center Animated Scroll Indicator (Clickable) */}
        <motion.button
          onClick={handleScrollDown}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col items-center gap-2 group cursor-pointer odm-trigger focus:outline-none"
          aria-label="Scroll downward to explore archive"
        >
          <span className="text-mono-xs text-text-muted group-hover:text-aot-blood transition-colors tracking-[0.28em] uppercase">
            Scroll To Explore
          </span>
          <div className="relative w-[1px] h-9 sm:h-11 bg-aot-border group-hover:bg-aot-blood/50 transition-colors overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-3 bg-aot-blood"
              animate={{
                y: [-12, 44],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <svg
            className="w-3.5 h-3.5 text-text-muted group-hover:text-aot-blood transition-colors -mt-1 transform group-hover:translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>

        {/* Bottom Right Technical Stamp */}
        <div className="text-mono-xs text-text-muted tracking-[0.2em] text-right hidden sm:block">
          <div>RESTRICTED ARCHIVES</div>
          <div className="text-aot-blood font-semibold">DIV-01 // ACTIVE</div>
        </div>
      </div>
    </section>
  );
}

export default HeroParallax;
