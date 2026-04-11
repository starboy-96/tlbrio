"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function fmt(n: number) {
  return n >= 1000 ? n.toLocaleString() : String(n);
}

function runFlipbook(el: HTMLSpanElement, target: number) {
  const totalSteps = 22;
  const randomSteps = Math.floor(totalSteps * 0.6);
  const countSteps = totalSteps - randomSteps;
  const magnitude = Math.pow(10, String(target).length);
  let step = 0;
  let timer: ReturnType<typeof setTimeout>;

  function getDelay(s: number) {
    // exponential ease: 35ms → 220ms
    const t = s / totalSteps;
    return 35 + Math.pow(t, 2.2) * 185;
  }

  function tick() {
    if (step >= totalSteps) {
      el.textContent = fmt(target);
      return;
    }
    if (step < randomSteps) {
      // random phase — same digit-count as target
      const rand = Math.floor(Math.random() * (magnitude - 1)) + 1;
      el.textContent = fmt(Math.min(rand, magnitude - 1));
    } else {
      // count-up phase — interpolate from 30% of target → target
      const p = (step - randomSteps) / countSteps;
      const start = Math.floor(target * 0.3);
      el.textContent = fmt(Math.floor(start + (target - start) * p));
    }
    step++;
    timer = setTimeout(tick, getDelay(step));
  }

  tick();
  return () => clearTimeout(timer);
}

function CountUp({
  target,
  className,
  style,
}: {
  target: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cleanup: (() => void) | undefined;
    let startTimer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          observer.disconnect();
          // Small delay so the card fade-in completes before numbers start scrambling
          startTimer = setTimeout(() => {
            cleanup = runFlipbook(el, target);
          }, 350);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(startTimer);
      cleanup?.();
    };
  }, [target]);

  return (
    <span className={className} style={style} ref={ref} />
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 14 },
  },
};

export default function Stats() {
  return (
    <section
      aria-label="Key statistics"
      className="bg-[#fafafa] px-6 md:px-12" style={{ paddingTop: "200px", paddingBottom: "200px" }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(180px,auto)] gap-4"
      >
        {/* ── Card 1: 2× faster — tall, spans 2 rows ── */}
        <motion.div
          variants={itemVariants}
          className="sm:row-span-2 relative overflow-hidden rounded-3xl bg-navy p-8 flex flex-col justify-between group"
          style={{
            background:
              "radial-gradient(ellipse at 80% 10%, rgba(148,229,97,0.12) 0%, transparent 60%), #0A1A2F",
          }}
        >
          {/* Dot grid accent */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative z-10">
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-green/30 text-green/80 mb-6"
              style={{ fontFamily: '"General Sans", sans-serif' }}
            >
              Speed
            </span>
            <span
              className="block text-[5.5rem] leading-none text-green"
              style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
            >
              <CountUp target={2} />×
            </span>
          </div>
          <div className="relative z-10">
            <p
              className="text-2xl text-white mb-2 leading-tight"
              style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
            >
              Faster slide creation
            </p>
            <p
              className="text-sm text-white/50 leading-relaxed"
              style={{ fontFamily: '"General Sans", sans-serif' }}
            >
              Your team builds decks in half the time – without sacrificing
              quality or brand standards.
            </p>
          </div>
        </motion.div>

        {/* ── Card 2: 100% brand consistency ── */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between"
          style={{ backgroundColor: "#94E561" }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-navy/20 text-navy/70 w-fit"
            style={{ fontFamily: '"General Sans", sans-serif' }}
          >
            Brand
          </span>
          <div>
            <span
              className="block text-[4rem] leading-none text-navy"
              style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
            >
              <CountUp target={100} />%
            </span>
            <p
              className="text-base text-navy/75 mt-2 leading-snug"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
            >
              Brand consistency,<br />every time
            </p>
          </div>
        </motion.div>

        {/* ── Card 3: 2,000+ users ── */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-[#F2F7EF] p-8 flex flex-col justify-between border border-navy/6"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-navy/15 text-navy/50 w-fit"
            style={{ fontFamily: '"General Sans", sans-serif' }}
          >
            Users
          </span>
          <div>
            <span
              className="block text-[4rem] leading-none text-navy"
              style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
            >
              <CountUp target={2000} />+
            </span>
            <p
              className="text-base text-navy/60 mt-2 leading-snug"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
            >
              Users supported<br />across in-house teams
            </p>
          </div>
        </motion.div>

        {/* ── Card 4: 10-40× ROI ── */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-navy p-8 flex flex-col justify-between"
        >
          <span
            className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-white/15 text-white/50 w-fit"
            style={{ fontFamily: '"General Sans", sans-serif' }}
          >
            ROI
          </span>
          <div>
            <span
              className="block text-[4rem] leading-none"
              style={{
                fontFamily: '"Cal Sans", sans-serif',
                fontWeight: 700,
                background: "linear-gradient(135deg, #94e561 0%, #c9f5a6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              10-40×
            </span>
            <p
              className="text-base text-white/60 mt-2 leading-snug"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
            >
              Return on investment<br />within the first year
            </p>
          </div>
        </motion.div>

        {/* ── Card 5: Wide bottom — "Built for your brand" CTA ── */}
        <motion.div
          variants={itemVariants}
          className="sm:col-span-2 lg:col-span-1 relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between border border-navy/8"
          style={{ backgroundColor: "#C9F5A6" }}
        >
          {/* Decorative t.svg */}
          <img
            src="/t.svg"
            alt=""
            aria-hidden="true"
            className="absolute -right-6 -bottom-4 w-40 opacity-20 pointer-events-none select-none"
          />
          <span
            className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-navy/20 text-navy/60 w-fit"
            style={{ fontFamily: '"General Sans", sans-serif' }}
          >
            Bespoke
          </span>
          <div className="relative z-10">
            <p
              className="text-xl text-navy leading-snug mb-4"
              style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
            >
              Custom-built to your brand guidelines
            </p>
            <a
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 text-sm text-navy/70 hover:text-navy transition-colors font-medium cursor-pointer"
              style={{ fontFamily: '"General Sans", sans-serif' }}
            >
              See how it works →
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
