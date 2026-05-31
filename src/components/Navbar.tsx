"use client";

import { useEffect, useState } from "react";
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

function TlbrLogo() {
  return (
    <a href="/" className="flex items-center group" aria-label="tlbr.io home">
      <Image
        src="/logo.svg"
        alt="tlbr.io"
        width={110}
        height={38}
        priority
        className="transition-opacity duration-200 group-hover:opacity-80"
      />
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("/")) {
      window.location.href = href;
    } else if (pathname === "/") {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/${href}`;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-2xl backdrop-saturate-150 border-b ${
        scrolled
          ? "bg-white/75 border-black/8 shadow-sm"
          : "bg-white/50 border-white/20"
      }`}
    >
      <div className="w-full px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <TlbrLogo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-sm text-navy/65 hover:text-navy transition-colors duration-200 cursor-pointer font-medium"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleNavClick("#demo")}
            className="px-5 py-2.5 rounded-full text-sm bg-navy text-[#fafafa] hover:bg-navy/85 transition-all duration-200 cursor-pointer"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 600 }}
          >
            Book a Demo
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-navy rounded-full origin-center"
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-0.5 bg-navy rounded-full"
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-navy rounded-full origin-center"
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-white/80 backdrop-blur-2xl backdrop-saturate-150 border-t border-black/6 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-base text-navy/75 hover:text-navy py-1 cursor-pointer font-medium"
                  style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
                >
                  {link.label}
                </motion.button>
              ))}
              <button
                onClick={() => handleNavClick("#demo")}
                className="mt-2 px-5 py-3 rounded-full text-sm bg-navy text-[#fafafa] text-center cursor-pointer"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 600 }}
              >
                Book a Demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
