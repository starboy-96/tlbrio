"use client";

import { useState, useRef } from "react";
import {
  motion, useInView, useMotionValue, useSpring, useAnimationFrame,
} from "framer-motion";

// All icons used across the site
const icons = [
  <svg key="align" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>,
  <svg key="resize" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  <svg key="palette" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/><circle cx="8.5" cy="9" r="1.5" fill="currentColor" stroke="none"/><circle cx="15.5" cy="9" r="1.5" fill="currentColor" stroke="none"/></svg>,
  <svg key="layout" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  <svg key="chart" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="11" width="5" height="9" rx="1"/><rect x="9.5" y="6" width="5" height="14" rx="1"/><rect x="17" y="2" width="5" height="18" rx="1"/><line x1="2" y1="22" x2="22" y2="22"/></svg>,
  <svg key="image" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  <svg key="trending" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  <svg key="globe" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85"/></svg>,
  <svg key="users" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="star" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  <svg key="download" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  <svg key="lightning" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  <svg key="target" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  <svg key="home" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  <svg key="spacing" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 3H3"/><path d="M21 21H3"/><path d="M12 7v10"/><path d="M9 10l3-3 3 3"/><path d="M9 14l3 3 3-3"/></svg>,
];

type OrbitItem = [number, number, number, number, number, number, number];

const orbitItems: OrbitItem[] = [
  [8,  12, 0,  35, 9,   0,   0.07],
  [12, 8,  6,  28, 12,  90,  0.06],
  [5,  22, 11, 22, 7,   45,  0.08],
  [88, 10, 2,  32, 11,  180, 0.07],
  [93, 20, 9,  25, 8,   270, 0.06],
  [80, 6,  12, 30, 13,  60,  0.07],
  [6,  48, 7,  28, 10,  120, 0.06],
  [14, 55, 3,  20, 8,   200, 0.07],
  [92, 45, 4,  30, 9,   30,  0.07],
  [85, 58, 13, 24, 11,  150, 0.06],
  [9,  80, 5,  32, 10,  240, 0.07],
  [18, 88, 10, 22, 7,   310, 0.06],
  [4,  68, 14, 26, 12,  80,  0.07],
  [87, 82, 1,  30, 9,   170, 0.07],
  [94, 72, 8,  22, 8,   50,  0.06],
  [78, 92, 6,  28, 11,  220, 0.07],
  [35, 5,  11, 18, 8,   0,   0.05],
  [65, 5,  3,  18, 10,  180, 0.05],
  [30, 95, 9,  20, 9,   90,  0.06],
  [70, 95, 0,  18, 7,   270, 0.06],
  [22, 30, 2,  15, 8,   135, 0.05],
  [78, 35, 5,  18, 10,  315, 0.05],
  [18, 70, 12, 16, 9,   225, 0.05],
  [82, 65, 7,  20, 11,  45,  0.05],
];

const REPEL_RADIUS = 160;
const REPEL_STRENGTH = 70;

function OrbitIcon({
  cx, cy, iconIndex, radius, duration, startAngle, opacity,
  mouseX, mouseY, containerRef,
}: {
  cx: number; cy: number; iconIndex: number; radius: number;
  duration: number; startAngle: number; opacity: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const rad = (startAngle * Math.PI) / 180;
  const startX = Math.cos(rad) * radius;
  const startY = Math.sin(rad) * radius;

  const repelX = useMotionValue(0);
  const repelY = useMotionValue(0);
  const smoothX = useSpring(repelX, { stiffness: 180, damping: 22 });
  const smoothY = useSpring(repelY, { stiffness: 180, damping: 22 });

  useAnimationFrame(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const iconX = (cx / 100) * width;
    const iconY = (cy / 100) * height;
    const mx = mouseX.get();
    const my = mouseY.get();
    const dx = mx - iconX;
    const dy = my - iconY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < REPEL_RADIUS && dist > 0) {
      const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH;
      repelX.set(-(dx / dist) * force);
      repelY.set(-(dy / dist) * force);
    } else {
      repelX.set(0);
      repelY.set(0);
    }
  });

  return (
    <motion.div
      className="absolute text-white pointer-events-none select-none"
      style={{ left: `${cx}%`, top: `${cy}%`, opacity, x: smoothX, y: smoothY }}
    >
      <motion.div
        animate={{
          x: [
            startX,
            Math.cos(rad + Math.PI / 2) * radius,
            Math.cos(rad + Math.PI) * radius,
            Math.cos(rad + (3 * Math.PI) / 2) * radius,
            startX,
          ],
          y: [
            startY,
            Math.sin(rad + Math.PI / 2) * radius,
            Math.sin(rad + Math.PI) * radius,
            Math.sin(rad + (3 * Math.PI) / 2) * radius,
            startY,
          ],
        }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {icons[iconIndex % icons.length]}
      </motion.div>
    </motion.div>
  );
}

export default function Demo() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-80px" });

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    try {
      await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // still show success — don't block the user on a network error
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <section
      id="demo"
      ref={sectionRef}
      className="relative py-28 px-6 bg-navy dot-grid-dark overflow-hidden"
      aria-label="Book a demo"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating orbiting icons */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {orbitItems.map(([cx, cy, iconIndex, radius, duration, startAngle, opacity], i) => (
          <OrbitIcon
            key={i}
            cx={cx} cy={cy}
            iconIndex={iconIndex}
            radius={radius}
            duration={duration}
            startAngle={startAngle}
            opacity={opacity}
            mouseX={mouseX}
            mouseY={mouseY}
            containerRef={sectionRef}
          />
        ))}
      </div>

      {/* Glow behind form */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
        <div
          className="w-[600px] h-[300px] rounded-full animate-glow"
          style={{ background: "radial-gradient(ellipse, rgba(148,229,97,0.1) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div ref={headingRef}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="section-label mb-3"
          >
            Book a demo
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl text-white mb-4"
            style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700, color: "white" }}
          >
            See tlbr.io inside your PowerPoint
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-base mb-10"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(255,255,255,0.72)" }}
          >
            {"We'll walk you through the toolbar using a pre-loaded brand, so you can see exactly what it could look like for your team – in under 30 minutes."}
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-green/15 border border-green/30 flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94e561" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <p className="text-lg text-white mb-1" style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700, color: "white" }}>
                {"You're on the list"}
              </p>
              <p className="text-sm" style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(255,255,255,0.45)" }}>
                {"We'll be in touch within one business day to book your demo."}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className={`flex flex-row items-center gap-2 p-2 rounded-full transition-all duration-300 ${focused ? "ring-2 ring-green/40 bg-white/8" : "bg-white/5"} border border-white/10`}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Work email"
                  required
                  aria-label="Work email address"
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/35 outline-none min-w-0 w-0"
                  style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium bg-green text-navy hover:bg-green-light transition-all duration-200 shadow-[0_0_20px_rgba(148,229,97,0.3)] hover:shadow-[0_0_32px_rgba(148,229,97,0.45)] cursor-pointer whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
                >
                  {loading ? "Sending…" : "Book a Demo"}
                </button>
              </div>
            </form>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-5 text-xs"
          style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(255,255,255,0.3)" }}
        >
          30 minutes. No hard sell – just the product.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {[
            { icon: "🔒", text: "No spam, ever" },
            { icon: "⚡", text: "Response within 1 business day" },
            { icon: "🎯", text: "Tailored to your organisation" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs" style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(255,255,255,0.35)" }}>
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
