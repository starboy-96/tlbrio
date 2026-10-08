"use client";

import { useState, useEffect, useRef, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="absolute" style={{ bottom: "3%", left: "10%", fontSize: "clamp(6px, 0.6em, 10px)", color: "rgba(148,229,97,0.6)", fontFamily: '"General Sans", sans-serif', fontWeight: 600 }}>
        ● {label}
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
export default function Hero() {
  const [activeBtn, setActiveBtn] = useState<BtnId | null>(null);
  const [slideKey,  setSlideKey]  = useState<BtnId | "before">("before");
  const [stepIdx,   setStepIdx]   = useState(-1);
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  return (
    <section id="hero" data-nav="dark" className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#0A1A2F" }}>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-[22%] -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(148,229,97,0.055) 0%, transparent 65%)" }} />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
        {/* ── LEFT: copy ─────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-col justify-center pl-8 md:pl-14 lg:pl-20 pr-8 pt-28 pb-12 w-full lg:w-[50%]">

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-green/20 w-fit"
            style={{ background: "rgba(148,229,97,0.07)" }}>
            <span className="w-2 h-2 rounded-full bg-green animate-glow" aria-hidden="true" />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.56rem,1.7vw,0.7rem)", letterSpacing: "0.1em", fontFamily: '"General Sans",sans-serif', fontWeight: 500 }}>
              The bespoke PowerPoint toolbar for accountancy and law firms
            </span>
          </motion.div>

          <h1 className="leading-[1.15] mb-7" style={{ fontFamily: '"Cal Sans",sans-serif', fontWeight: 700, fontSize: "clamp(2.4rem,4.5vw,5rem)", color: "#fff" }}>
            {["Stop formatting.", "Start presenting."].map((line, li) => (
              <span key={li} className="block">
                {line.split(" ").map((word, wi) => (
                  <motion.span key={wi}
                    initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 + li * 0.15 + wi * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className={`inline-block${wi < line.split(" ").length - 1 ? " mr-[0.22em]" : ""}`}>
                    {word}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl max-w-lg mb-10 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: '"General Sans",sans-serif' }}>
            tlbr.io puts your firm&apos;s templates, brand colours and approved assets inside the PowerPoint ribbon — so every pitch, proposal and client report goes out on-brand.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-start gap-4">
            <a href="#demo"
              className="px-8 py-4 rounded-full text-navy text-sm font-semibold bg-green hover:bg-green-light transition-all duration-200 shadow-[0_0_28px_rgba(148,229,97,0.38)] hover:shadow-[0_0_44px_rgba(148,229,97,0.55)] cursor-pointer"
              onClick={(e) => { e.preventDefault(); document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" }); }}>
              Book a Demo
            </a>
            <a href="#features"
              className="flex items-center gap-2 py-4 text-sm transition-colors duration-200 cursor-pointer group"
              style={{ color: "rgba(255,255,255,0.62)" }}
              onClick={(e) => { e.preventDefault(); document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" }); }}>
              See what it does
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </motion.div>
        </div>

        {/* ── RIGHT: mock-up ──────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:w-[50%] flex flex-col lg:min-h-screen"
          style={{ background: "#060d1a" }}>

          <div className="absolute inset-x-0 top-0 h-20 pointer-events-none z-10"
            style={{ background: "linear-gradient(to bottom, #060d1a, transparent)" }} />

          <div className="flex flex-col h-full flex-1 pt-24 pb-8 px-8 lg:px-10 gap-4">
            <div className="flex-1 flex flex-col rounded-2xl overflow-hidden border" style={{
              borderColor: "rgba(255,255,255,0.07)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(148,229,97,0.06)",
              minHeight: 0,
            }}>
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
                style={{ background: "#0d1f38", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex gap-1.5">
                  {["#ff5f57","#febc2e","#28c840"].map((c) => (
                    <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.85 }} />
                  ))}
                </div>
                <div className="flex-1 flex justify-center">
                  <p style={{ fontFamily: '"General Sans",sans-serif', fontSize: "0.68rem", color: "rgba(255,255,255,0.24)", fontWeight: 500 }}>
                    Q3 Financial Summary.pptx — PowerPoint
                  </p>
                </div>
              </div>

              {/* Ribbon */}
              <div className="flex-shrink-0" style={{ background: "#0A1A2F", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center px-4 pt-2 gap-1">
                  {["Home","Insert","Design","Transitions"].map((tab) => (
                    <div key={tab} className="px-3 py-1 rounded-t" style={{ fontFamily: '"General Sans",sans-serif', fontSize: "0.6rem", color: "rgba(255,255,255,0.18)", fontWeight: 500 }}>{tab}</div>
                  ))}
                  <div className="px-3 py-1 rounded-t border-t border-l border-r" style={{ fontFamily: '"General Sans",sans-serif', fontSize: "0.6rem", color: "#94E561", fontWeight: 700, borderColor: "rgba(148,229,97,0.22)", background: "rgba(148,229,97,0.06)", letterSpacing: "0.04em" }}>
                    tlbr.io
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 pb-3 pt-1 flex-wrap">
                  {BUTTONS.map(({ id, label }) => {
                    const isActive = activeBtn === id;
                    return (
                      <button key={id} onClick={() => handleBtnClick(id)}
                        className="relative px-3 py-1.5 rounded text-[11px] cursor-pointer transition-all duration-200"
                        style={{
                          fontFamily: '"General Sans",sans-serif',
                          fontWeight: isActive ? 600 : 400,
                          background: isActive ? "rgba(148,229,97,0.14)" : "rgba(255,255,255,0.04)",
                          color: isActive ? "#94E561" : "rgba(255,255,255,0.36)",
                          border: `1px solid ${isActive ? "rgba(148,229,97,0.3)" : "rgba(255,255,255,0.07)"}`,
                        }}>
                        {label}
                        {isActive && (
                          <motion.span key={`prog-${id}`}
                            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                            transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                            className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                            style={{ background: "#94E561", transformOrigin: "left" }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slide canvas */}
              <div className="flex-1 flex items-center justify-center p-4 min-h-0" style={{ background: "#1a2d45" }}>
                <div className="relative w-full" style={{ paddingBottom: "56.25%", maxHeight: "100%" }}>
                  <AnimatePresence mode="wait">
                    <motion.div key={slideKey}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 rounded-md overflow-hidden shadow-2xl">
                      <SlideContent />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-2 flex-shrink-0"
                style={{ background: "#0d1f38", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontFamily: '"General Sans",sans-serif', fontSize: "0.58rem", color: "rgba(255,255,255,0.16)" }}>Slide 1 of 24</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#94E561" }} />
                  <p style={{ fontFamily: '"General Sans",sans-serif', fontSize: "0.58rem", color: "rgba(148,229,97,0.42)", fontWeight: 500 }}>
                    {activeBtn ? `${BUTTONS.find((b) => b.id === activeBtn)?.label} applied` : "tlbr.io active"}
                  </p>
                </div>
              </div>
            </div>

            {/* Step dots */}
            <div className="flex items-center justify-center gap-2 pb-2">
              <button type="button" aria-label="Show original slide"
                onClick={() => { if (cycleRef.current) clearTimeout(cycleRef.current); setStepIdx(-1); setActiveBtn(null); setSlideKey("before"); scheduleNext(-1); }}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{ width: stepIdx === -1 ? "20px" : "6px", height: "6px", background: stepIdx === -1 ? "#94E561" : "rgba(255,255,255,0.14)" }} />
              {CYCLE.map((id, i) => (
                <button type="button" key={id} aria-label={`Show ${BUTTONS[i].label} step`} onClick={() => handleBtnClick(id)}
                  className="rounded-full transition-all duration-300 cursor-pointer"
                  style={{ width: stepIdx === i ? "20px" : "6px", height: "6px", background: stepIdx === i ? "#94E561" : "rgba(255,255,255,0.14)" }} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
