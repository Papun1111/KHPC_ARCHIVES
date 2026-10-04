"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FactionCrest } from "./FactionCrest";

// ═══════════════════════════════════════════════════════════════════════════
// Navbar — Dark AoT Theme with Wings of Freedom
// ═══════════════════════════════════════════════════════════════════════════

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/", label: "OVERVIEW", icon: "◫" },
    { href: "/paths", label: "PROJECT", icon: "◉" },
  ];

  return (
    <>
      <motion.nav
        className="sticky top-0 z-40 bg-bg-secondary/95 backdrop-blur-md aot-border-b"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex h-[72px] items-center justify-between w-full">
          {/* ── Logo / Brand with Wings of Freedom ── */}
          <Link
            href="/"
            className="flex h-full items-center gap-3 px-4 md:px-8 border-r border-[#3a3830] hover:bg-survey-green/20 group transition-colors duration-300"
          >
            {/* Wings of Freedom Crest */}
            <div className="text-survey-green-bright group-hover:text-parchment transition-colors">
              <FactionCrest type="survey" size={28} />
            </div>
            <div className="flex flex-col">
              <h1
                className="text-lg md:text-2xl font-black tracking-tighter text-text-primary group-hover:text-parchment transition-colors"
                style={{
                  fontFamily: "var(--font-cinzel)",
                  lineHeight: 1,
                }}
              >
                KHPC アーカイブ
              </h1>
              <p className="mt-1 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted group-hover:text-survey-green-bright transition-colors">
                KHPC Archives
              </p>
            </div>
          </Link>

          {/* ── Navigation Links (Desktop) ── */}
          <div className="hidden md:flex h-full flex-1 items-center justify-center gap-8 px-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href} className="relative h-full flex items-center group">
                  <motion.div
                    className={`flex items-center gap-2 text-[13px] font-medium tracking-widest transition-colors uppercase ${
                      isActive ? "text-survey-green-bright" : "text-text-muted"
                    } hover-glow-text`}
                  >
                    {item.label}
                    <span className="text-xs opacity-50">↓</span>
                  </motion.div>

                  {/* Active indicator bar — Survey Corps green */}
                  {isActive && (
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-[3px]"
                      style={{
                        background: "linear-gradient(90deg, transparent, #3a5a40, #4a7c59, #3a5a40, transparent)",
                        boxShadow: "0 0 10px rgba(58, 90, 64, 0.5)",
                      }}
                      layoutId="nav-indicator"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right side / Language / Menu Toggle ── */}
          <div className="flex h-full items-center border-l border-[#3a3830] ml-auto md:ml-0">
            <div className="hidden md:flex items-center px-6 gap-2 text-xs font-medium tracking-wider">
              <span className="text-[9px] text-text-muted mr-2 uppercase">Language</span>
              <button className="text-text-primary hover:text-survey-green-bright transition-colors">EN</button>
              <span className="text-text-muted">|</span>
              <button className="text-text-muted hover:text-survey-green-bright transition-colors">JP</button>
            </div>

            {/* Hamburger Menu Box */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-full w-[60px] md:w-[72px] flex-col items-center justify-center gap-1.5 md:border-l border-[#3a3830] hover:bg-survey-green/20 group transition-colors odm-trigger"
            >
              <motion.div
                className="h-[1px] w-6 bg-text-secondary group-hover:bg-survey-green-bright transition-colors"
                animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 7 : 0 }}
              />
              <motion.div
                className="h-[1px] w-6 bg-text-secondary group-hover:bg-survey-green-bright transition-colors"
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
              />
              <motion.div
                className="h-[1px] w-6 bg-text-secondary group-hover:bg-survey-green-bright transition-colors"
                animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -7 : 0 }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
            style={{ background: "#0a0b10" }}
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          >
            {/* Background texture */}
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
              }}
            />
            {/* Survey Corps green accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-survey-green to-transparent" />

            {/* Close Button */}
            <button
              className="absolute top-8 right-8 flex items-center justify-center h-12 w-12 aot-border bg-bg-card text-text-primary hover:bg-blood-red hover:text-white transition-colors z-10 odm-trigger"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ✕
            </button>

            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 relative z-10">
              {/* Decorative Wings */}
              <div className="text-survey-green opacity-20 mb-4">
                <FactionCrest type="survey" size={80} />
              </div>

              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  <Link
                    href={item.href}
                    className="text-4xl sm:text-6xl font-black uppercase tracking-widest text-text-primary hover-glow-text"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Language Switcher for Mobile */}
              <motion.div
                className="mt-12 flex items-center gap-4 text-sm font-bold tracking-widest uppercase border-t border-[#3a3830] pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-text-muted">Lang / 言語</span>
                <button className="text-text-primary hover:text-survey-green-bright transition-colors">EN</button>
                <button className="text-text-muted hover:text-survey-green-bright transition-colors">JP</button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
