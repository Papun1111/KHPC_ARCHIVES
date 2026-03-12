"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

// ─── Navbar Component ───────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "OVERVIEW", icon: "◫" },
    { href: "/paths", label: "PROJECT", icon: "◉" },
  ];

  return (
    <motion.nav
      className="sticky top-0 z-40 bg-white sharp-border-b"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex h-[72px] items-center justify-between w-full">
        {/* ── Logo / Brand ── */}
        <Link href="/" className="flex h-full items-center px-8 border-r border-black hover:bg-black group transition-colors duration-300">
          <div className="flex flex-col">
            <h1
              className="text-2xl font-black tracking-tighter group-hover:text-white transition-colors"
              style={{
                fontFamily: "var(--font-cinzel)",
                lineHeight: 1,
              }}
            >
              KHPC アーカイブ
            </h1>
            <p
              className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-black group-hover:text-white transition-colors"
            >
               KHPC Archives
            </p>
          </div>
        </Link>

        {/* ── Navigation Links ── */}
        <div className="flex h-full flex-1 items-center justify-center gap-8 px-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} className="relative h-full flex items-center">
                <motion.div
                  className="flex items-center gap-2 text-[13px] font-medium tracking-widest transition-colors uppercase"
                  style={{
                    color: isActive ? "#000000" : "#888888",
                  }}
                  whileHover={{
                    color: "#8a0303",
                  }}
                >
                  {item.label}
                  <span className="text-xs">↓</span>
                </motion.div>
                
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[3px] bg-black"
                    layoutId="nav-indicator"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right side / Language / Menu ── */}
        <div className="flex h-full items-center border-l border-black">
          <div className="flex items-center px-6 gap-2 text-xs font-medium tracking-wider">
            <span className="text-[9px] text-gray-400 mr-2 uppercase">Language</span>
            <button className="text-black">EN</button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-400 hover:text-black transition-colors">JP</button>
          </div>
          
          {/* Hamburger Menu Box */}
          <button className="flex h-full w-[72px] flex-col items-center justify-center gap-1.5 border-l border-black hover:bg-black group transition-colors">
            <div className="h-[1px] w-6 bg-black group-hover:bg-white transition-colors" />
            <div className="h-[1px] w-6 bg-black group-hover:bg-white transition-colors" />
            <div className="h-[1px] w-6 bg-black group-hover:bg-white transition-colors" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
