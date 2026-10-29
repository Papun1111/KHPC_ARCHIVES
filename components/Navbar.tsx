"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// Navbar — Brutalist Parchment Theme (AoT Portal Style)
// ═══════════════════════════════════════════════════════════════════════════

const navItems = [
  { href: "/", label: "OVERVIEW", hasDropdown: true },
  { href: "#news", label: "NEWS", hasDropdown: false },
  { href: "#pickup", label: "PRODUCT", hasDropdown: true },
  { href: "#gallery", label: "PROJECT", hasDropdown: true },
  { href: "#movies", label: "MOVIE GALLERY", hasDropdown: false },
  { href: "#special", label: "SPECIAL", hasDropdown: false },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
    },
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Track scroll for subtle shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`sticky top-0 z-50 bg-aot-parchment/95 backdrop-blur-sm transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_0_#c8c8c4]" : ""
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Top thin red accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-aot-blood via-aot-blood-bright to-aot-blood" />

        <div className="flex h-[64px] items-center justify-between w-full border-b border-aot-border">
          {/* ── Logo / Brand ── */}
          <Link
            href="/"
            className="flex h-full items-center gap-3 px-5 md:px-8 border-r border-aot-border hover:bg-aot-parchment-dark transition-colors duration-300 group shrink-0"
          >
            {/* Stylized Japanese brand mark */}
            <div className="flex flex-col">
              <h1
                className="text-lg md:text-xl font-black tracking-tighter text-aot-dark leading-none"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                進撃の巨人
              </h1>
              <p className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.25em] text-text-muted mt-0.5">
                KHPC Archives
              </p>
            </div>
          </Link>

          {/* ── Navigation Links (Desktop) ── */}
          <div className="hidden lg:flex h-full flex-1 items-center justify-center gap-1 xl:gap-2 px-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/" && pathname === "/");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative h-full flex items-center px-3 xl:px-4 group transition-colors duration-200 ${
                    isActive
                      ? "text-aot-dark"
                      : "text-text-secondary hover:text-aot-dark"
                  }`}
                >
                  <span
                    className="text-[11px] xl:text-[12px] font-medium tracking-[0.1em] uppercase whitespace-nowrap"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {item.label}
                  </span>

                  {/* Dropdown indicator circle */}
                  {item.hasDropdown && (
                    <span className="ml-1.5 w-[14px] h-[14px] rounded-full border border-current flex items-center justify-center text-[7px] leading-none opacity-60">
                      ＋
                    </span>
                  )}

                  {/* Active underline */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-aot-dark"
                      layoutId="nav-active-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right Side Controls ── */}
          <div className="flex h-full items-center ml-auto">
            {/* Language Switcher */}
            <div className="hidden md:flex items-center h-full px-4 border-l border-aot-border gap-1.5">
              <span className="text-[9px] text-text-muted uppercase tracking-wider mr-1">
                Language
              </span>
              <button className="text-[12px] font-semibold text-aot-dark hover:text-aot-blood transition-colors tracking-wider">
                EN
              </button>
              <span className="text-text-muted text-[10px]">|</span>
              <button className="text-[12px] font-semibold text-text-muted hover:text-aot-blood transition-colors tracking-wider">
                JP
              </button>
            </div>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hamburger-box h-full border-l border-aot-border w-[56px] md:w-[64px]"
              aria-label="Toggle navigation menu"
            >
              <motion.div
                className="hamburger-line"
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 6.5 : 0,
                  width: isMenuOpen ? 18 : 22,
                }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              />
              <motion.div
                className="hamburger-line"
                animate={{
                  opacity: isMenuOpen ? 0 : 1,
                  scaleX: isMenuOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="hamburger-line"
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? -6.5 : 0,
                  width: isMenuOpen ? 18 : 22,
                }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ═══ Fullscreen Navigation Overlay ═══ */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
            style={{ backgroundColor: "#151515" }}
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          >
            {/* Noise texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />

            {/* Blood-red accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-aot-blood to-transparent" />

            {/* Decorative structural lines */}
            <div className="absolute top-0 left-[10%] w-[1px] h-full bg-white/5" />
            <div className="absolute top-0 right-[10%] w-[1px] h-full bg-white/5" />

            {/* Close Button */}
            <button
              className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center justify-center h-12 w-12 border border-white/20 text-white/70 hover:text-white hover:border-aot-blood hover:bg-aot-blood/20 transition-all duration-300 z-10 text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              ✕
            </button>

            {/* Navigation Content */}
            <motion.div
              className="flex-1 flex flex-col items-center justify-center p-8 gap-6 md:gap-8 relative z-10"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Brand Mark */}
              <motion.div
                className="mb-6 md:mb-10 text-center"
                variants={staggerItem}
              >
                <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-white/30 uppercase">
                  KHPC Archives Portal
                </p>
              </motion.div>

              {/* Nav Links */}
              {navItems.map((item) => (
                <motion.div key={item.label} variants={staggerItem}>
                  <Link
                    href={item.href}
                    className="block text-center group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span
                      className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white/80 hover:text-white transition-colors duration-300 block"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {item.label}
                    </span>
                    <span className="block h-[1px] w-0 group-hover:w-full bg-aot-blood transition-all duration-500 mx-auto mt-2" />
                  </Link>
                </motion.div>
              ))}

              {/* Language Switcher (Mobile) */}
              <motion.div
                className="mt-8 md:mt-12 flex items-center gap-6 text-sm font-bold tracking-[0.2em] uppercase border-t border-white/10 pt-8"
                variants={staggerItem}
              >
                <span className="text-white/30 text-xs">Language</span>
                <button className="text-white hover:text-aot-blood-bright transition-colors">
                  EN
                </button>
                <span className="text-white/20">|</span>
                <button className="text-white/50 hover:text-aot-blood-bright transition-colors">
                  JP
                </button>
              </motion.div>
            </motion.div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
