"use client";

import { useState, useEffect, useRef, type ReactElement } from "react";
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Ambient from "@/components/Ambient";

const BUTTONS = [
  { id: "colours", label: "Brand Colours" },
  { id: "fonts",   label: "Typography"    },
  { id: "table",   label: "Format Table"  },
  { id: "graph",   label: "Format Graph"  },
] as const;
type BtnId = typeof BUTTONS[number]["id"];
const CYCLE: BtnId[] = ["colours", "fonts", "table", "graph"];
const STEP_MS = 2800;
const ease = [0.22, 1, 0.36, 1] as const;

const T_HEAD = ["Quarter", "Revenue", "Growth"];
const T_ROWS = [
  ["Q1 2024", "£2.1m", "+12%"],
  ["Q2 2024", "£2.4m", "+14%"],
  ["Q3 2024", "£2.8m", "+17%"],
];

const UGLY_SEGS = [
  { pct: 40, color: "#00ff44" },
  { pct: 25, color: "#ff2200" },
  { pct: 20, color: "#ffee00" },
  { pct: 15, color: "#00eeff" },
];
const NICE_SEGS = [
  { pct: 40, color: "#94E561" },
  { pct: 25, color: "#2a5298" },
  { pct: 20, color: "#1a3a5c" },
  { pct: 15, color: "#4a90d9" },
];
const CHART_LABELS = ["Advisory", "M&A", "Restructuring", "Other"];
const CHART_PCTS   = ["40%", "25%", "20%", "15%"];

// ── Donut SVG ─────────────────────────────────────────────────────────────────
function DonutChart({
  segs,
  bgStroke = "rgba(255,255,255,0.07)",
}: {
  segs: { pct: number; color: string }[];
  bgStroke?: string;
}) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  let cum = 0;
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" style={{ display: "block" }}>
      <circle cx="40" cy="40" r={r} fill="none" stroke={bgStroke} strokeWidth="12" />
      {segs.map((s, i) => {
        const len = (s.pct / 100) * circ;
        const off = circ / 4 - cum;
        cum += len;
        return (
          <circle key={i} cx="40" cy="40" r={r} fill="none"
            stroke={s.color} strokeWidth="12"
            strokeDasharray={`${len} ${circ}`}
            strokeDashoffset={off}
          />
        );
      })}
    </svg>
  );
}

// ── Shared slide container — scales all text via root em ───────────────────────
// fontSize on outer div = clamp(8px, 1.8vw, 14px) so inner em values
// render proportionally at any viewport/pane width.

const SLIDE_STYLE: React.CSSProperties = {
  position: "absolute", inset: 0, overflow: "hidden",
  display: "flex", flexDirection: "column",
  fontSize: "clamp(8px, 1.8vw, 14px)",
  padding: "5% 5% 8% 8%",
};

// ── SLIDE: BEFORE ─────────────────────────────────────────────────────────────
function SlideBefore() {
  return (
    <div style={{ ...SLIDE_STYLE, background: "#f4efe6" }}>
      {/* Title — red, centered, serif */}
      <div style={{
        flexShrink: 0, textAlign: "center",
        color: "#cc1100", fontFamily: '"Georgia", serif',
        fontSize: "1.4em", fontWeight: 400, lineHeight: 1.2,
        marginBottom: "3%",
      }}>Q3 Financial Summary</div>

      {/* Content row */}
      <div style={{ flex: 1, display: "flex", gap: "5%", minHeight: 0 }}>
        {/* Left: subtitle + table */}
        <div style={{ flex: "0 0 54%", display: "flex", flexDirection: "column", gap: "6%" }}>
          <div style={{ color: "#8800cc", fontFamily: '"Courier New", monospace', fontSize: "0.65em" }}>
            Corporate Finance Division
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              {T_HEAD.map((h, i) => (
                <th key={i} style={{
                  fontFamily: '"Arial", sans-serif', fontSize: "0.65em",
                  fontWeight: 400, color: "#cc1100", textAlign: "left",
                  padding: "0 4px 6px 0", border: "none",
                }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {T_ROWS.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{
                      fontFamily: '"Arial", sans-serif', fontSize: "0.62em",
                      color: ci === 2 ? "#8800cc" : "#777",
                      padding: "3px 4px 3px 0", border: "none", textAlign: "left",
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: ugly donut */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6%" }}>
          <div style={{ width: "75%", aspectRatio: "1" }}>
            <DonutChart segs={UGLY_SEGS} bgStroke="rgba(0,0,0,0.08)" />
          </div>
          <div style={{ fontSize: "0.58em", fontFamily: '"Arial", sans-serif', color: "#777", lineHeight: 1.6, width: "100%" }}>
            {CHART_LABELS.map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: UGLY_SEGS[i].color, flexShrink: 0 }} />
                {label} {CHART_PCTS[i]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared shell for steps 1-5 ─────────────────────────────────────────────────
type StepSlideProps = {
  titleStyle?: React.CSSProperties;
  subtitleStyle?: React.CSSProperties;
  showRule?: boolean;
  tableContent: React.ReactNode;
  chartContent: React.ReactNode;
  label: string;
  motions?: React.ReactNode; // extra motion divs (guide lines etc)
};

function StepSlide({ titleStyle, subtitleStyle, showRule = true, tableContent, chartContent, label, motions }: StepSlideProps) {
  const defaultTitle: React.CSSProperties = {
    color: "#fff", fontFamily: '"Cal Sans", sans-serif', fontWeight: 700,
    fontSize: "1.4em", lineHeight: 1.15,
  };
  const defaultSub: React.CSSProperties = {
    color: "rgba(255,255,255,0.42)", fontFamily: '"General Sans", sans-serif',
    fontWeight: 500, fontSize: "0.62em",
    textTransform: "uppercase", letterSpacing: "0.08em",
  };
  return (
    <div style={{ ...SLIDE_STYLE, background: "#0A1A2F" }}>
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0" style={{ width: "3px", background: "#94E561" }} />
      {motions}

      {/* Header */}
      <div style={{ flexShrink: 0, marginBottom: "3%", paddingLeft: "2%" }}>
        <div style={{ ...defaultTitle, ...titleStyle }}>Q3 Financial Summary</div>
        {showRule && (
          <div style={{ marginTop: "5%", marginBottom: "4%", width: "38%", height: "1.5px", background: "#94E561" }} />
        )}
        <div style={{ ...defaultSub, ...subtitleStyle }}>Corporate Finance Division</div>
      </div>

      {/* Content row */}
      <div style={{ flex: 1, display: "flex", gap: "5%", minHeight: 0, paddingLeft: "2%" }}>
        {/* Left: table */}
        <div style={{ flex: "0 0 52%", overflow: "hidden" }}>
          {tableContent}
        </div>
        {/* Right: chart */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5%" }}>
          {chartContent}
        </div>
      </div>

      {/* Footer label */}
      <div className="absolute flex items-center" style={{
        bottom: "4.5%", left: "10%", gap: "0.45em", padding: "0.4em 0.85em 0.4em 0.5em",
        fontSize: "clamp(8px, 0.82em, 13px)", color: "#94E561", fontFamily: '"General Sans", sans-serif', fontWeight: 600,
        background: "rgba(148,229,97,0.12)", border: "1px solid rgba(148,229,97,0.4)", borderRadius: "0.55em",
        boxShadow: "0 0.4em 1.2em rgba(0,0,0,0.25)",
      }}>
        <span className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: "1.35em", height: "1.35em", background: "#94E561" }}>
          <svg viewBox="0 0 16 16" width="62%" fill="none" aria-hidden="true"><path d="M3.5 8.4l2.8 2.8 6.2-6.4" stroke="#0A1A2F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        {label}
      </div>
    </div>
  );
}

// ── Table renderers ────────────────────────────────────────────────────────────
function UglyTable() {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead><tr>
        {T_HEAD.map((h, i) => (
          <th key={i} style={{
            fontFamily: '"Arial", sans-serif', fontSize: "0.65em",
            fontWeight: 600, color: "#94E561", textAlign: "left",
            padding: "0 4px 6px 0", border: "none",
          }}>{h}</th>
        ))}
      </tr></thead>
      <tbody>
        {T_ROWS.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci} style={{
                fontFamily: '"Arial", sans-serif', fontSize: "0.62em",
                color: "rgba(255,255,255,0.65)", padding: "3px 4px 3px 0",
                border: "none", textAlign: "left",
              }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GoodTable({ fontFamily = '"General Sans", sans-serif', bordered = false }: { fontFamily?: string; bordered?: boolean }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", ...(bordered ? { border: "1px solid rgba(148,229,97,0.2)" } : {}) }}>
      <thead>
        <tr style={bordered ? { background: "rgba(148,229,97,0.12)" } : {}}>
          {T_HEAD.map((h, i) => (
            <th key={i} style={{
              fontFamily, fontSize: "0.65em", fontWeight: 700, color: "#94E561",
              textAlign: i === 0 ? "left" : "right",
              padding: bordered ? "4px 6px" : "0 4px 6px 0",
              border: bordered ? "1px solid rgba(148,229,97,0.18)" : "none",
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {T_ROWS.map((row, ri) => (
          <tr key={ri} style={bordered && ri % 2 === 1 ? { background: "rgba(255,255,255,0.03)" } : {}}>
            {row.map((cell, ci) => (
              <td key={ci} style={{
                fontFamily, fontSize: "0.62em",
                fontWeight: ci === 2 ? 600 : 400,
                color: ci === 2 ? "#94E561" : "rgba(255,255,255,0.8)",
                padding: bordered ? "4px 6px" : "3px 4px 3px 0",
                border: bordered ? "1px solid rgba(255,255,255,0.07)" : "none",
                textAlign: ci === 0 ? "left" : "right",
              }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Chart renderers ────────────────────────────────────────────────────────────
function UglyChartContent() {
  return (
    <>
      <div style={{ width: "72%", aspectRatio: "1" }}>
        <DonutChart segs={UGLY_SEGS} />
      </div>
      <div style={{ fontSize: "0.55em", fontFamily: '"General Sans", sans-serif', color: "rgba(255,255,255,0.45)", lineHeight: 1.6, width: "100%" }}>
        {CHART_LABELS.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: UGLY_SEGS[i].color, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </>
  );
}

function NiceChartContent() {
  return (
    <>
      <div style={{ fontSize: "0.52em", fontFamily: '"General Sans", sans-serif', color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, textAlign: "center" }}>
        Revenue Mix
      </div>
      <motion.div initial={{ scale: 0.8, opacity: 0.1 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.36, 0.64, 1] }}
        style={{ width: "72%", aspectRatio: "1" }}>
        <DonutChart segs={NICE_SEGS} />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ fontSize: "0.55em", fontFamily: '"General Sans", sans-serif', color: "#fff", lineHeight: 1.7, width: "100%" }}>
        {CHART_LABELS.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: NICE_SEGS[i].color, flexShrink: 0 }} />
              {label}
            </div>
            <span style={{ color: "rgba(255,255,255,0.75)" }}>{CHART_PCTS[i]}</span>
          </div>
        ))}
      </motion.div>
    </>
  );
}

// ── Five step slides ───────────────────────────────────────────────────────────
function SlideColours() {
  return (
    <StepSlide
      titleStyle={{ fontFamily: '"Georgia", serif', fontWeight: 400, color: "#fff" }}
      subtitleStyle={{ fontFamily: '"Courier New", monospace', letterSpacing: "0.04em" }}
      tableContent={<UglyTable />}
      chartContent={<UglyChartContent />}
      label="Brand colours applied"
      motions={
        <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 0.4, ease }}
          className="absolute left-0 top-0 bottom-0" style={{ width: "3px", background: "#94E561", transformOrigin: "top", zIndex: 1 }} />
      }
    />
  );
}

function SlideFonts() {
  return (
    <StepSlide
      titleStyle={{ fontFamily: '"Cal Sans", sans-serif' }}
      subtitleStyle={{ fontFamily: '"General Sans", sans-serif', letterSpacing: "0.1em" }}
      tableContent={<GoodTable />}
      chartContent={<UglyChartContent />}
      label="Typography applied"
    />
  );
}


function SlideFormatTable() {
  return (
    <StepSlide
      tableContent={
        <motion.div initial={{ opacity: 0.3, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.36, 0.64, 1] }}>
          <GoodTable bordered />
        </motion.div>
      }
      chartContent={<UglyChartContent />}
      label="Table formatted"
    />
  );
}

function SlideFormatGraph() {
  return (
    <StepSlide
      tableContent={<GoodTable bordered />}
      chartContent={<NiceChartContent />}
      label="Slide ready to present"
    />
  );
}

const SLIDES: Record<BtnId | "before", () => ReactElement> = {
  before:  SlideBefore,
  colours: SlideColours,
  fonts:   SlideFonts,
  table:   SlideFormatTable,
  graph:   SlideFormatGraph,
};

// ── HERO ──────────────────────────────────────────────────────────────────────
const ROTATING_WORDS = ["pitch", "proposal", "tender", "report", "board pack"];

function RotatingWord() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((n) => (n + 1) % ROTATING_WORDS.length), 2400);
    return () => clearInterval(t);
  }, [reduce]);
  return (
    <span className="relative inline-block overflow-hidden align-top" style={{ height: "1.22em", marginBottom: "-0.1em" }}>
      <span className="invisible whitespace-nowrap">{ROTATING_WORDS[i]},</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={ROTATING_WORDS[i]}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 whitespace-nowrap"
        >
          <span className="gradient-text">{ROTATING_WORDS[i]}</span>,
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const [activeBtn, setActiveBtn] = useState<BtnId | null>(null);
  const [slideKey,  setSlideKey]  = useState<BtnId | "before">("before");
  const [stepIdx,   setStepIdx]   = useState(-1);
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();
  const [wide, setWide] = useState(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltSpring = { stiffness: 120, damping: 20, mass: 0.6 };
  const tiltY = useSpring(useTransform(px, (v) => (wide && !reduceMotion ? -7 + v * 10 : 0)), tiltSpring);
  const tiltX = useSpring(useTransform(py, (v) => (wide && !reduceMotion ? 4 - v * 8 : 0)), tiltSpring);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => { setWide(mq.matches); px.set(px.get() + 0.0001); };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [px]);

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onPointerLeave() { px.set(0); py.set(0); }

  function goToStep(idx: number) {
    if (idx >= CYCLE.length) {
      setStepIdx(-1); setActiveBtn(null); setSlideKey("before");
      scheduleNext(-1);
    } else {
      setStepIdx(idx); setActiveBtn(CYCLE[idx]); setSlideKey(CYCLE[idx]);
      scheduleNext(idx);
    }
  }

  function scheduleNext(current: number) {
    if (cycleRef.current) clearTimeout(cycleRef.current);
    cycleRef.current = setTimeout(() => goToStep(current + 1), STEP_MS);
  }

  useEffect(() => {
    const t = setTimeout(() => goToStep(0), 1600);
    return () => { clearTimeout(t); if (cycleRef.current) clearTimeout(cycleRef.current); };
  }, []);

  function handleBtnClick(id: BtnId) {
    if (cycleRef.current) clearTimeout(cycleRef.current);
    const idx = CYCLE.indexOf(id);
    setStepIdx(idx); setActiveBtn(id); setSlideKey(id);
    scheduleNext(idx);
  }

  const SlideContent = SLIDES[slideKey];

  function showUnformatted() {
    if (cycleRef.current) clearTimeout(cycleRef.current);
    setStepIdx(-1); setActiveBtn(null); setSlideKey("before");
    scheduleNext(-1);
  }

  const ribbon: { id: BtnId | "before"; label: string }[] = [{ id: "before", label: "Unformatted" }, ...BUTTONS];

  return (
    <section id="hero" data-nav="dark" className="on-dark relative min-h-screen overflow-hidden"
      style={{ background: "#0A1A2F" }}
      onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>

      {/* Ambient light */}
      <Ambient blobs={[
        { color: "rgba(148,229,97,0.30)", size: "62vw", top: "-18%", right: "-14%" },
        { color: "rgba(70,130,255,0.22)", size: "54vw", bottom: "-30%", right: "8%", drift: "b" },
        { color: "rgba(201,245,166,0.10)", size: "46vw", top: "-20%", left: "-16%", drift: "b" },
        { color: "rgba(64,200,190,0.12)", size: "30vw", bottom: "-8%", left: "18%" },
      ]} />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse 70% 60% at 60% 45%, black 20%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 60% 45%, black 20%, transparent 75%)",
      }} />
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none" aria-hidden="true"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(10,26,47,0.9))" }} />

      <div className="relative z-10 max-w-[1480px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] items-center gap-14 lg:gap-12 px-6 md:px-12 pt-28 lg:pt-24 pb-16">
        {/* ── Copy ─────────────────────────────────────────────── */}
        <div className="flex flex-col">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-dark inline-flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-full mb-7 w-fit">
            <span className="relative flex w-2 h-2" aria-hidden="true">
              <span className="absolute inset-0 rounded-full bg-green animate-ping opacity-60" />
              <span className="relative w-2 h-2 rounded-full bg-green" />
            </span>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.62rem,1.7vw,0.74rem)", letterSpacing: "0.06em", fontFamily: '"General Sans",sans-serif', fontWeight: 500 }}>
              The PowerPoint toolbar for firms of 100–1,500 people
            </span>
          </motion.div>

          <h1 className="leading-[1.04] mb-7" style={{ fontFamily: '"Cal Sans",sans-serif', fontWeight: 700, fontSize: "clamp(2.6rem,4.6vw,5rem)", color: "#fff", letterSpacing: "-0.02em" }}>
            <span className="sr-only">Every pitch, proposal, tender and report, perfectly on brand.</span>
            <span aria-hidden="true" className="block">
              <motion.span
                initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block">
                Every
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="block">
                <RotatingWord />
              </motion.span>
            </span>
            <span aria-hidden="true" className="block">
              {["perfectly", "on", "brand."].map((word, wi, arr) => (
                <motion.span key={word}
                  initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.45 + wi * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`inline-block${wi < arr.length - 1 ? " mr-[0.22em]" : ""}`}>
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl max-w-[34rem] mb-10 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.72)", fontFamily: '"General Sans",sans-serif' }}>
            Your templates, colours and approved assets, built into the PowerPoint ribbon your team already uses. Whoever makes the deck, it looks like your design team made it.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-3">
            <a href="#demo"
              className="group inline-flex items-center gap-3 pl-7 pr-2 py-2 rounded-full text-navy text-[15px] font-semibold bg-green hover:bg-green-light transition-all duration-300 shadow-[0_10px_40px_-8px_rgba(148,229,97,0.6)] hover:shadow-[0_14px_50px_-6px_rgba(148,229,97,0.75)] cursor-pointer"
              onClick={(e) => { e.preventDefault(); document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" }); }}>
              Book a Demo
              <span className="w-10 h-10 rounded-full bg-navy text-green flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </a>
            <a href="#features"
              className="glass-dark inline-flex items-center gap-2 px-6 py-[1.05rem] rounded-full text-[15px] text-white/85 hover:text-white transition-colors duration-200 cursor-pointer group"
              onClick={(e) => { e.preventDefault(); document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" }); }}>
              See what it does
              <span className="transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true">↓</span>
            </a>
          </motion.div>

          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-12 flex flex-wrap gap-x-7 gap-y-3 max-w-xl"
            style={{ fontFamily: '"General Sans",sans-serif' }}>
            {["Live in around 4 weeks", "Built and maintained for you", "Slides never leave your machines"].map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px]" style={{ color: "rgba(255,255,255,0.66)" }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.4l2.8 2.8 6.2-6.4" stroke="#94E561" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* ── Mock-up ──────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1800 }}>
        <motion.div
          className="rounded-2xl overflow-hidden border border-white/10"
          style={{ rotateX: tiltX, rotateY: tiltY, background: "rgba(13,31,56,0.72)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 40px 100px -30px rgba(0,0,0,0.65)" }}>

          {/* Window bar + ribbon */}
          <div className="flex items-center gap-x-4 px-3 sm:px-4 py-3 border-b border-white/[0.07]">
            <div className="hidden xl:flex gap-1.5 mr-1" aria-hidden="true">
              {["#ff5f57","#febc2e","#28c840"].map((c) => (
                <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.8 }} />
              ))}
            </div>
            <div className="flex gap-1.5 lg:gap-1 xl:gap-1.5 overflow-x-auto mobile-carousel" style={{ scrollbarWidth: "none" }} role="group" aria-label="Formatting steps">
              {ribbon.map(({ id, label }) => {
                const isActive = slideKey === id;
                const unformatted = id === "before";
                return (
                  <button key={id} type="button"
                    onClick={() => (unformatted ? showUnformatted() : handleBtnClick(id))}
                    aria-pressed={isActive}
                    className="relative flex-shrink-0 px-2.5 lg:px-2 xl:px-2.5 py-1.5 rounded-md text-[11px] lg:text-[10.5px] xl:text-[11px] whitespace-nowrap cursor-pointer transition-colors duration-200 overflow-hidden"
                    style={{
                      fontFamily: '"General Sans",sans-serif',
                      fontWeight: isActive ? 600 : 500,
                      background: isActive ? (unformatted ? "rgba(255,255,255,0.12)" : "rgba(148,229,97,0.16)") : "transparent",
                      color: isActive ? (unformatted ? "#fff" : "#94E561") : "rgba(255,255,255,0.5)",
                      border: `1px solid ${isActive ? (unformatted ? "rgba(255,255,255,0.2)" : "rgba(148,229,97,0.35)") : "rgba(255,255,255,0.08)"}`,
                    }}>
                    {label}
                    {isActive && (
                      <motion.span key={`prog-${id}-${stepIdx}`}
                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                        transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ background: unformatted ? "rgba(255,255,255,0.6)" : "#94E561", transformOrigin: "left" }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slide */}
          <div className="p-3 sm:p-4">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <AnimatePresence mode="wait">
                <motion.div key={slideKey}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.01 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl">
                  <SlideContent />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
