"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "/blog" },
];

const HEADER_H = 64;

export default function Navbar() {
  const [dark, setDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 20);
      const delta = y - lastY.current;
      if (y < 600 || delta < -6) setHidden(false);
      else if (delta > 6) setHidden(true);
      if (Math.abs(delta) > 6) lastY.current = y;

      const probe = HEADER_H / 2;
      const darkSections = document.querySelectorAll<HTMLElement>('[data-nav="dark"]');
      let overDark = false;
      darkSections.forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) overDark = true;
      });
      setDark(overDark);

      const mid = window.innerHeight * 0.4;
      let current: string | null = null;
      navLinks.forEach(({ href }) => {
        if (!href.startsWith("#")) return;
        const el = document.querySelector(href);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) current = href;
      });
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("/")) {
      window.location.href = href;
    } else if (pathname === "/") {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/${href}`;
    }
  };

  const onDark = dark && !menuOpen;

  return (
    <motion.header
      animate={{ y: hidden && !menuOpen ? -HEADER_H - 8 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-500 backdrop-blur-2xl backdrop-saturate-[1.8] ${
        onDark
          ? scrolled ? "bg-navy/45 border-white/[0.08]" : "bg-transparent border-transparent"
          : "bg-white/55 border-white/70 shadow-[0_8px_30px_-12px_rgba(10,26,47,0.18)]"
      }`}
    >
      <div className="w-full px-6 md:px-8 h-16 flex items-center justify-between">
        <a href="/" className="relative flex items-center" aria-label="tlbr.io home">
          <Image src="/logo.svg" alt="" width={110} height={38} priority
            className={`transition-opacity duration-500 ${onDark ? "opacity-0" : "opacity-100"}`} />
          <Image src="/logo-white.svg" alt="" width={110} height={38} priority
            className={`absolute inset-0 transition-opacity duration-500 ${onDark ? "opacity-100" : "opacity-0"}`} />
        </a>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = active === link.href;
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                aria-current={isActive ? "location" : undefined}
                className={`relative px-3.5 py-2 text-sm cursor-pointer transition-colors duration-300 ${
                  onDark
                    ? isActive ? "text-white" : "text-white/60 hover:text-white"
                    : isActive ? "text-navy" : "text-navy/55 hover:text-navy"
                }`}
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-marker"
                    className="absolute left-1/2 -translate-x-1/2 bottom-0.5 w-1 h-1 rounded-full bg-green"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center">
          <button
            onClick={() => handleNavClick("#demo")}
            className={`group inline-flex items-center gap-2 pl-5 pr-4 py-2.5 rounded-full text-sm cursor-pointer transition-colors duration-300 ${
              onDark ? "bg-green text-navy hover:bg-green-light" : "bg-navy text-white hover:bg-[#13294a]"
            }`}
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 600 }}
          >
            Book a Demo
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </button>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {[
            menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 },
            menuOpen ? { opacity: 0 } : { opacity: 1 },
            menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 },
          ].map((anim, i) => (
            <motion.span key={i} animate={anim} transition={{ duration: 0.2 }}
              className={`block w-6 h-0.5 rounded-full origin-center transition-colors duration-300 ${onDark ? "bg-white" : "bg-navy"}`} />
          ))}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-navy/[0.06]"
          >
            <div className="px-6 pt-2 pb-6 flex flex-col">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + i * 0.04 }}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-baseline justify-between text-left py-3 border-b border-navy/[0.06] cursor-pointer"
                >
                  <span className="text-2xl text-navy" style={{ fontFamily: '"Cal Sans", sans-serif' }}>{link.label}</span>
                  <span className="text-xs text-navy/35 tabular-nums">0{i + 1}</span>
                </motion.button>
              ))}
              <button
                onClick={() => handleNavClick("#demo")}
                className="mt-6 px-5 py-3.5 rounded-full text-sm bg-navy text-white text-center cursor-pointer"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 600 }}
              >
                Book a Demo
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
