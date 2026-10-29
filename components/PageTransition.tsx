"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PageTransitionProps {
  onComplete: () => void;
}

interface ScribblePath {
  id: string;
  d: string;
  strokeWidth: number;
  color: string;
  delay: number;
  duration: number;
}

// 10 violent, jagged, razor-sharp scribble paths spread across the screen
const SCRIBBLE_PATHS: ScribblePath[] = [
  // 1. Primary diagonal downward laceration (top-left to bottom-right)
  {
    id: "slash-1",
    d: "M -30,50 L 70,130 Q 95,150 60,175 L 180,270 Q 210,300 160,315 L 320,430 L 280,400 Q 370,490 330,520 L 500,620 L 460,590 Q 570,690 530,720 L 710,810 L 670,780 Q 810,870 770,900 L 930,950 L 890,920 L 1030,980",
    strokeWidth: 5.5,
    color: "#8a0303",
    delay: 0.0,
    duration: 0.38,
  },
  // 2. Counter diagonal violent gash (top-right to bottom-left)
  {
    id: "slash-2",
    d: "M 1030,80 L 910,180 L 940,210 Q 830,310 860,335 L 720,440 L 760,470 Q 620,560 655,595 L 510,690 L 540,720 Q 390,810 425,845 L 260,910 L 290,940 L 120,980 L 150,960 L -30,1020",
    strokeWidth: 4,
    color: "#c41e1e",
    delay: 0.12,
    duration: 0.36,
  },
  // 3. Heavy central brutal laceration tearing across mid-screen
  {
    id: "slash-3",
    d: "M -20,520 L 110,460 L 80,530 Q 210,450 170,540 L 320,465 L 280,550 Q 430,470 380,565 L 540,460 L 490,570 Q 650,480 610,560 L 760,470 L 720,555 Q 880,480 840,560 L 970,490 L 940,550 L 1040,500",
    strokeWidth: 7.5,
    color: "#8a0303",
    delay: 0.24,
    duration: 0.42,
  },
  // 4. Erratic upper horizontal scratch with jagged spikes
  {
    id: "slash-4",
    d: "M -30,230 L 90,260 L 120,190 L 160,280 L 270,210 L 300,280 Q 410,200 440,270 L 550,210 L 580,280 Q 690,195 730,275 L 840,220 L 870,290 L 960,230 L 1030,260",
    strokeWidth: 3,
    color: "#c41e1e",
    delay: 0.36,
    duration: 0.34,
  },
  // 5. Deep lower horizontal claw strike slashing leftward
  {
    id: "slash-5",
    d: "M 1030,730 L 920,800 L 940,720 Q 830,810 860,740 L 730,830 L 760,750 Q 640,840 670,760 L 530,830 L 560,760 Q 420,845 450,770 L 310,830 L 340,765 Q 190,830 220,770 L 80,820 L -30,790",
    strokeWidth: 6,
    color: "#8a0303",
    delay: 0.48,
    duration: 0.4,
  },
  // 6. Steep vertical/diagonal cleave cutting from top center to bottom center
  {
    id: "slash-6",
    d: "M 480,-20 L 540,110 L 500,160 Q 570,280 520,330 L 580,460 L 530,510 Q 610,640 560,690 L 620,820 L 580,870 Q 640,940 600,980 L 650,1030",
    strokeWidth: 4.5,
    color: "#c41e1e",
    delay: 0.61,
    duration: 0.38,
  },
  // 7. Aggressive upward berserk slash from bottom-left to top-right
  {
    id: "slash-7",
    d: "M -20,880 L 120,770 L 90,730 Q 250,610 220,560 L 380,450 L 340,400 Q 510,300 470,240 L 640,160 L 600,110 Q 770,70 740,20 L 900,-10 L 1040,60",
    strokeWidth: 8,
    color: "#8a0303",
    delay: 0.73,
    duration: 0.44,
  },
  // 8. High-speed razor cross-scratch through mid-upper screen
  {
    id: "slash-8",
    d: "M -30,380 L 110,430 L 140,360 L 260,440 L 300,370 L 440,450 L 480,380 L 610,460 L 650,390 L 780,460 L 820,390 L 940,460 L 1040,410",
    strokeWidth: 2,
    color: "#c41e1e",
    delay: 0.85,
    duration: 0.32,
  },
  // 9. Jagged corner burst claw stroke across top-left into center
  {
    id: "slash-9",
    d: "M 80,40 L 220,180 L 180,210 Q 340,310 300,340 L 470,410 L 420,440 Q 600,490 560,530 L 750,580 L 710,620 L 880,680 L 1030,710",
    strokeWidth: 5,
    color: "#8a0303",
    delay: 0.98,
    duration: 0.36,
  },
  // 10. Deep jagged claw laceration across bottom quadrant
  {
    id: "slash-10",
    d: "M 150,990 L 290,860 L 260,890 Q 420,750 390,790 L 560,670 L 520,710 Q 690,600 650,640 L 820,540 L 790,580 L 970,510 L 1040,530",
    strokeWidth: 3.5,
    color: "#c41e1e",
    delay: 1.1,
    duration: 0.38,
  },
];

export function PageTransition({ onComplete }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(true);
  const completedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    // All scribbles finish drawing right at ~1.5s
    // At 1.5s, trigger overlay exit animation (scale: 1.2, opacity: 0 over 0.6s)
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    // Failsafe timer to guarantee onComplete is called even if animation listener drops
    const safetyTimer = setTimeout(() => {
      handleComplete();
    }, 2250);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(safetyTimer);
    };
  }, [handleComplete]);

  return (
    <AnimatePresence onExitComplete={handleComplete}>
      {isVisible && (
        <motion.div
          key="khpc-page-transition"
          className="fixed inset-0 z-[200] overflow-hidden bg-[#f4f4f0] select-none pointer-events-auto"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 1.2,
            transition: {
              duration: 0.6,
              ease: "easeInOut",
            },
          }}
        >
          {/* Subtle parchment texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Brutalist framing & corner crosshairs */}
          <div className="absolute inset-6 pointer-events-none border border-[#c8c8c4]/40">
            {/* Top-Left Corner */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#999996]" />
            {/* Top-Right Corner */}
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#999996]" />
            {/* Bottom-Left Corner */}
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#999996]" />
            {/* Bottom-Right Corner */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#999996]" />

            {/* Dossier Corner Tags */}
            <div className="absolute top-2 left-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[#999996] opacity-60">
              EXPEDITION RECORD // RECON
            </div>
            <div className="absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-[0.25em] text-[#999996] opacity-60">
              SECTOR 03 // TITAN ZONE
            </div>
          </div>

          {/* Subtle centered text 'KHPC ARCHIVES' in Cinzel font fading in and out */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{
                opacity: [0, 0.85, 0.85, 0],
                scale: [0.96, 1, 1, 1.03],
              }}
              transition={{
                duration: 1.4,
                times: [0, 0.25, 0.75, 1],
                ease: "easeInOut",
              }}
              className="text-center"
            >
              <div className="text-[9px] sm:text-[10px] tracking-[0.4em] font-mono text-[#8a0303] uppercase mb-2 font-semibold">
                SYSTEM LOAD // ARCHIVE RECORD
              </div>
              <h2
                className="text-3xl sm:text-5xl md:text-6xl font-black text-[#151515] uppercase tracking-[0.2em] font-serif leading-none"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                KHPC ARCHIVES
              </h2>
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="h-[1px] w-6 bg-[#8a0303]" />
                <span className="text-[8px] sm:text-[9px] tracking-[0.3em] font-mono text-[#999996] uppercase">
                  WALL ROSE // HUMANITY ARCHIVE
                </span>
                <div className="h-[1px] w-6 bg-[#8a0303]" />
              </div>
            </motion.div>
          </div>

          {/* Full-screen SVG for violent blood-red scribble marks */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
          >
            {SCRIBBLE_PATHS.map((path) => (
              <motion.path
                key={path.id}
                d={path.d}
                fill="none"
                stroke={path.color}
                strokeWidth={path.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="miter"
                strokeMiterlimit={4}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0.95 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: {
                    duration: path.duration,
                    delay: path.delay,
                    ease: [0.16, 1, 0.3, 1], // violent, sharp, aggressive snapping slash
                  },
                  opacity: {
                    duration: 0.1,
                    delay: path.delay,
                  },
                }}
              />
            ))}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PageTransition;
