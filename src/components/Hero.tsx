"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Gravity, MatterBody } from "@/components/ui/gravity";

// Stable constant — defined outside component so it never gets a new
// object reference on re-render, which would restart the physics engine.
const GRAVITY_CONFIG = { x: 0, y: 0.9 };

// Pills positioned relative to the full hero canvas width
const gravityPills = [
  { label: "Align & distribute", bg: "#0A1A2F", text: "#94E561", x: "42%", y: "3%",  angle: -8 },
  { label: "Brand colours",      bg: "#94E561", text: "#0A1A2F", x: "65%", y: "5%",  angle:  6 },
  { label: "2× faster",          bg: "#0A1A2F", text: "#94E561", x: "85%", y: "8%",  angle: -4 },
  { label: "Templates",          bg: "#C9F5A6", text: "#0A1A2F", x: "55%", y: "3%",  angle:  5 },
  { label: "Asset library",      bg: "#0A1A2F", text: "white",   x: "75%", y: "5%",  angle: -6 },
  { label: "100% on-brand",      bg: "#94E561", text: "#0A1A2F", x: "50%", y: "10%", angle:  3 },
  { label: "PowerPoint",         bg: "#F2F7EF", text: "#0A1A2F", x: "38%", y: "8%",  angle:  8 },
  { label: "No guesswork",       bg: "#0A1A2F", text: "#C9F5A6", x: "80%", y: "15%", angle: -5 },
  { label: "Resize & scale",     bg: "#C9F5A6", text: "#0A1A2F", x: "60%", y: "3%",  angle:  7 },
  { label: "Fewer clicks",       bg: "#94E561", text: "#0A1A2F", x: "70%", y: "10%", angle: -3 },
];

export default function Hero() {
  // Lazy initialiser reads localStorage synchronously on first client render
  // so the floor is correct before the physics engine ever starts — no
  // extra re-render, no restart of the physics simulation.
  const [floorOffset, setFloorOffset] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return localStorage.getItem("cookie-consent") ? 0 : window.innerHeight * 0.1;
  });

  // Keep a stable ref so the event listener never closes over a stale value.
  const floorOffsetRef = useRef(floorOffset);

  useEffect(() => {
    const onResolved = () => {
      floorOffsetRef.current = 0;
      setFloorOffset(0);
    };
    window.addEventListener("tlbr:cookie-resolved", onResolved);
    return () => window.removeEventListener("tlbr:cookie-resolved", onResolved);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col dot-grid overflow-hidden"
      aria-label="Hero section"
    >
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(148,229,97,0.09) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* ── Physics — full hero canvas, text column sits at z-10 above settled pills ── */}
      {/* While banner is visible: z-[65] + pointer-events-none so pills appear above
          the banner but clicks still reach its buttons.
          After banner dismissed: drop to z-[1] so navbar/hero buttons (z-10+) receive
          clicks normally, and pills can be dragged freely. */}
      <div className={`absolute inset-0 ${floorOffset > 0 ? "z-[65] pointer-events-none" : "z-[1]"}`} aria-hidden="true">
        <Gravity
          gravity={GRAVITY_CONFIG}
          grabCursor
          addTopWall={false}
          autoStart
          floorAtViewport
          floorOffset={floorOffset}
          className="w-full h-full absolute inset-0"
        >
          {gravityPills.map((pill, i) => (
            <MatterBody
              key={i}
              x={pill.x}
              y={pill.y}
              angle={pill.angle}
              matterBodyOptions={{ friction: 0.3, restitution: 0.25, density: 0.002 }}
            >
              <div
                className="px-4 py-2 md:px-6 md:py-3 lg:px-9 lg:py-4 rounded-full font-medium whitespace-nowrap select-none shadow-md"
                style={{
                  backgroundColor: pill.bg,
                  color: pill.text,
                  fontFamily: '"General Sans", sans-serif',
                  fontWeight: 500,
                  fontSize: "clamp(0.7rem, 1.2vw, 1.15rem)",
                  border:
                    pill.bg === "#F2F7EF" || pill.bg === "#C9F5A6"
                      ? "1px solid rgba(10,26,47,0.08)"
                      : "none",
                }}
              >
                {pill.label}
              </div>
            </MatterBody>
          ))}
        </Gravity>
      </div>

      {/* ── Foreground content ── */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* LEFT – text (z-10 so it sits above the physics canvas) */}
        <div className="relative z-10 flex flex-col justify-center pl-8 md:pl-14 lg:pl-20 pr-8 pt-28 pb-12 w-full lg:w-[56%] pointer-events-none">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-green/30 bg-green-xlight w-fit pointer-events-auto"
          >
            <span className="w-2 h-2 rounded-full bg-green animate-glow" aria-hidden="true" />
            <span className="section-label" style={{ color: "#0a1a2f", opacity: 0.7, fontSize: "clamp(0.58rem, 1.8vw, 0.72rem)", letterSpacing: "0.1em" }}>
              Bespoke PowerPoint add-in for everyone
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem] leading-[1.0] mb-7"
            style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
          >
            {["Stop formatting.", "Start presenting."].map((line, li) => (
              <span key={li} className="block">
                {line.split(" ").map((word, wi) => (
                  <motion.span
                    key={wi}
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.2 + li * 0.15 + wi * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block mr-[0.22em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-navy/65 max-w-lg mb-10 leading-relaxed"
          >
            tlbr.io is a toolbar that lives inside PowerPoint. It gives every person on
            your team – designer or not – the tools to format, align, and brand slides
            correctly, without the guesswork.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-start gap-4 pointer-events-auto"
          >
            <a
              href="#demo"
              className="px-8 py-4 rounded-full text-navy text-sm font-semibold bg-green hover:bg-green-light transition-all duration-200 shadow-[0_0_28px_rgba(148,229,97,0.4)] hover:shadow-[0_0_44px_rgba(148,229,97,0.58)] cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Book a Demo
            </a>
            <a
              href="#features"
              className="flex items-center gap-2 py-4 text-sm text-navy/60 hover:text-navy transition-colors duration-200 cursor-pointer group"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See what it does
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </motion.div>
        </div>

        {/* RIGHT – empty spacer so left column stays at 56% */}
        <div className="hidden lg:block lg:w-[44%]" />
      </div>
    </section>
  );
}
