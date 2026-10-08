"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import Ambient from "@/components/Ambient";

const NAVY = "#0A1A2F";
const GREEN = "#94E561";
const ADVANCE_MS = 6000;

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Vignettes: each one shows the tool doing its job on a slide ─────────── */

function TemplatesVignette() {
  const thumbs = [
    { label: "Pitch", rot: -8, x: "-58%" },
    { label: "Proposal", rot: 0, x: "0%" },
    { label: "Report", rot: 8, x: "58%" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {thumbs.map((t, i) => {
        const selected = i === 1;
        return (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: "30%", rotate: 0, x: "0%" }}
            animate={{ opacity: 1, y: selected ? "-6%" : "0%", rotate: t.rot, x: t.x }}
            transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease }}
            className="absolute bg-white"
            style={{
              width: "34%", aspectRatio: "16/9", borderRadius: "0.35em",
              border: selected ? `2px solid ${GREEN}` : "1px solid rgba(10,26,47,0.1)",
              boxShadow: selected ? "0 1.2em 2.4em rgba(10,26,47,0.18)" : "0 0.6em 1.4em rgba(10,26,47,0.1)",
              zIndex: selected ? 2 : 1,
            }}
          >
            <div style={{ height: "28%", background: NAVY, borderRadius: "0.3em 0.3em 0 0" }} />
            <div style={{ padding: "8%" }}>
              <div style={{ height: "0.45em", width: "60%", background: "rgba(10,26,47,0.75)", borderRadius: 2 }} />
              <div style={{ height: "0.3em", width: "85%", background: "rgba(10,26,47,0.12)", borderRadius: 2, marginTop: "0.5em" }} />
              <div style={{ height: "0.3em", width: "70%", background: "rgba(10,26,47,0.12)", borderRadius: 2, marginTop: "0.35em" }} />
            </div>
            {selected && (
              <span
                className="absolute whitespace-nowrap"
                style={{ bottom: "-2em", left: "50%", transform: "translateX(-50%)", fontSize: "0.7em", color: NAVY, fontWeight: 600 }}
              >
                {t.label} template — current
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function ColoursVignette() {
  const swatches = [
    { c: NAVY, n: "Navy", h: "#0A1A2F" },
    { c: GREEN, n: "Green", h: "#94E561" },
    { c: "#C9F5A6", n: "Mint", h: "#C9F5A6" },
    { c: "#5C6B7F", n: "Slate", h: "#5C6B7F" },
    { c: "#F2F7EF", n: "Mist", h: "#F2F7EF" },
  ];
  return (
    <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: "8% 9%" }}>
      <div className="flex" style={{ gap: "3%" }}>
        {swatches.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: "-40%" }}
            animate={{ opacity: 1, y: "0%" }}
            transition={{ duration: 0.55, delay: 0.08 * i, ease }}
            className="flex-1"
          >
            <div style={{ aspectRatio: "1", background: s.c, borderRadius: "0.3em", border: "1px solid rgba(10,26,47,0.08)" }} />
            <p style={{ fontSize: "0.68em", color: NAVY, fontWeight: 600, marginTop: "0.6em" }}>{s.n}</p>
            <p style={{ fontSize: "0.6em", color: "rgba(10,26,47,0.45)", fontFamily: "ui-monospace, monospace" }}>{s.h}</p>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex items-end"
        style={{ marginTop: "7%", gap: "6%", borderTop: "1px solid rgba(10,26,47,0.08)", paddingTop: "5%" }}
      >
        <span style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: "3.2em", lineHeight: 0.9, color: NAVY }}>Aa</span>
        <div style={{ fontSize: "0.68em", lineHeight: 1.6, color: "rgba(10,26,47,0.55)" }}>
          <p><span style={{ color: NAVY, fontWeight: 600 }}>Headings</span> — Cal Sans</p>
          <p><span style={{ color: NAVY, fontWeight: 600 }}>Body</span> — General Sans</p>
        </div>
      </motion.div>
    </div>
  );
}

function AssetsVignette() {
  const tiles = [
    <span key="logo" style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: "1.6em", color: GREEN }}>t</span>,
    <svg key="chart" viewBox="0 0 24 24" width="40%" fill="none" stroke={NAVY} strokeWidth="1.8"><rect x="3" y="11" width="4" height="9" /><rect x="10" y="6" width="4" height="14" /><rect x="17" y="3" width="4" height="17" /></svg>,
    <svg key="people" viewBox="0 0 24 24" width="40%" fill="none" stroke={NAVY} strokeWidth="1.8"><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" /><circle cx="17" cy="9" r="2.5" /></svg>,
    <svg key="globe" viewBox="0 0 24 24" width="40%" fill="none" stroke={NAVY} strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>,
    <svg key="pin" viewBox="0 0 24 24" width="40%" fill="none" stroke={NAVY} strokeWidth="1.8"><path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>,
    <svg key="shield" viewBox="0 0 24 24" width="40%" fill="none" stroke={NAVY} strokeWidth="1.8"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></svg>,
  ];
  return (
    <div className="absolute inset-0 grid grid-cols-3" style={{ padding: "8% 12%", gap: "5%" }}>
      {tiles.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={i === 0 ? { opacity: 1, scale: [0.85, 1, 1.12, 1.08] } : { opacity: 1, scale: 1 }}
          transition={{ duration: i === 0 ? 1.4 : 0.45, delay: 0.06 * i, ease, times: i === 0 ? [0, 0.3, 0.7, 1] : undefined }}
          className="flex items-center justify-center"
          style={{
            borderRadius: "0.4em",
            background: i === 0 ? NAVY : "#F4F6F8",
            border: i === 0 ? `2px solid ${GREEN}` : "1px solid rgba(10,26,47,0.06)",
            boxShadow: i === 0 ? "0 1em 2em rgba(10,26,47,0.2)" : "none",
            zIndex: i === 0 ? 2 : 1,
          }}
        >
          {t}
        </motion.div>
      ))}
    </div>
  );
}

function ChartsVignette() {
  const bars = [42, 58, 51, 74, 88];
  return (
    <div className="absolute inset-0 flex flex-col" style={{ padding: "8% 10% 9%" }}>
      <p style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: "1.05em", color: NAVY }}>Fee income, £m</p>
      <div className="flex-1 flex items-end" style={{ gap: "5%", marginTop: "5%", borderBottom: "1px solid rgba(10,26,47,0.15)" }}>
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 + i * 0.05 }}
              style={{ fontSize: "0.6em", color: "rgba(10,26,47,0.6)", marginBottom: "0.4em", fontWeight: 600 }}
            >
              {(h / 10).toFixed(1)}
            </motion.span>
            <motion.div
              initial={{ height: "8%", backgroundColor: "#c4c4c4", borderRadius: 0 }}
              animate={{ height: `${h}%`, backgroundColor: i === bars.length - 1 ? GREEN : NAVY, borderRadius: "0.25em 0.25em 0 0" }}
              transition={{
                height: { duration: 0.8, delay: 0.1 + i * 0.06, ease },
                backgroundColor: { duration: 0.4, delay: 0.85 + i * 0.05 },
                borderRadius: { duration: 0.4, delay: 0.85 },
              }}
              className="w-full"
            />
          </div>
        ))}
      </div>
      <div className="flex" style={{ gap: "5%", marginTop: "0.6em" }}>
        {["FY21", "FY22", "FY23", "FY24", "FY25"].map((y) => (
          <span key={y} className="flex-1 text-center" style={{ fontSize: "0.6em", color: "rgba(10,26,47,0.45)" }}>{y}</span>
        ))}
      </div>
    </div>
  );
}

function FormattingVignette() {
  const boxes = [
    { from: { x: "-14%", y: "-22%", rotate: -4 }, label: "Revenue" },
    { from: { x: "9%", y: "18%", rotate: 3 }, label: "Margin" },
    { from: { x: "-6%", y: "-8%", rotate: -2 }, label: "Clients" },
  ];
  return (
    <div className="absolute inset-0 flex items-center" style={{ padding: "0 9%", gap: "5%" }}>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="absolute"
        style={{ left: "6%", right: "6%", top: "50%", height: 1, borderTop: `1px dashed ${GREEN}`, transformOrigin: "left" }}
      />
      {boxes.map((b, i) => (
        <motion.div
          key={b.label}
          initial={{ ...b.from }}
          animate={{ x: "0%", y: "0%", rotate: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.5 + i * 0.07 }}
          className="relative flex-1 flex flex-col justify-center bg-white"
          style={{
            aspectRatio: "1.15", borderRadius: "0.35em", padding: "6%",
            border: "1px solid rgba(10,26,47,0.12)", boxShadow: "0 0.5em 1.2em rgba(10,26,47,0.07)",
          }}
        >
          <p style={{ fontSize: "0.62em", color: "rgba(10,26,47,0.5)" }}>{b.label}</p>
          <p style={{ fontFamily: '"Cal Sans", sans-serif', fontSize: "1.5em", color: NAVY, lineHeight: 1.1 }}>
            {["+14%", "32.4%", "1,208"][i]}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function UpdatesVignette() {
  const log = [
    { t: "Brand refresh applied", d: "Colours and fonts updated for every user", tag: "v3.0" },
    { t: "New logo lockup added", d: "Available in the asset library", tag: "v3.1" },
    { t: "FY25 report template", d: "Live for all users", tag: "v3.2" },
  ];
  return (
    <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: "6% 10%" }}>
      {log.map((l, i) => (
        <motion.div
          key={l.t}
          initial={{ opacity: 0, x: "-6%" }}
          animate={{ opacity: 1, x: "0%" }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.22, ease }}
          className="flex items-center"
          style={{ gap: "4%", padding: "4.5% 0", borderBottom: i < log.length - 1 ? "1px solid rgba(10,26,47,0.08)" : "none" }}
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.35 + i * 0.22 }}
            className="flex items-center justify-center flex-shrink-0 rounded-full"
            style={{ width: "1.6em", height: "1.6em", background: GREEN }}
          >
            <svg viewBox="0 0 12 12" width="55%" fill="none"><path d="M2.5 6.2l2.3 2.3 4.7-5" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </motion.span>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: "0.85em", color: NAVY, fontWeight: 600 }}>{l.t}</p>
            <p style={{ fontSize: "0.65em", color: "rgba(10,26,47,0.5)" }}>{l.d}</p>
          </div>
          <span style={{ fontSize: "0.6em", fontFamily: "ui-monospace, monospace", color: "rgba(10,26,47,0.45)" }}>{l.tag}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Data ─────────────────────────────────────────────────────────────────── */

const icon = (d: React.ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

const features = [
  {
    id: "templates", label: "Templates", title: "Bespoke templates",
    description: "Every template is built to your firm's exact design. Your team starts every pitch, proposal and report from a foundation that is already on brand.",
    icon: icon(<><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>),
    Vignette: TemplatesVignette,
  },
  {
    id: "colours", label: "Colours & fonts", title: "Brand colours & fonts",
    description: "Your firm's palette and approved typefaces are built into the toolbar. Apply them instantly — no hex codes, no brand guidelines PDF open on the side.",
    icon: icon(<><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.7 1.7-1.7h2c3 0 5.5-2.5 5.5-5.5C22 6 17.5 2 12 2z" /><circle cx="8.5" cy="9" r="1" fill="currentColor" /><circle cx="12" cy="6.5" r="1" fill="currentColor" /><circle cx="15.5" cy="9" r="1" fill="currentColor" /></>),
    Vignette: ColoursVignette,
  },
  {
    id: "assets", label: "Asset library", title: "Brand asset library",
    description: "Approved logos, icons and images are one click away. No hunting through shared drives or emailing the design team.",
    icon: icon(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>),
    Vignette: AssetsVignette,
  },
  {
    id: "charts", label: "Charts & tables", title: "Edit graphs & tables",
    description: "Reformat charts and tables to your brand style in clicks. Consistent data visualisation across every deck, every time.",
    icon: icon(<><rect x="3" y="11" width="4" height="9" rx="0.5" /><rect x="10" y="6" width="4" height="14" rx="0.5" /><rect x="17" y="3" width="4" height="17" rx="0.5" /></>),
    Vignette: ChartsVignette,
  },
  {
    id: "formatting", label: "Align & space", title: "Formatting tools",
    description: "Align, resize, distribute and space objects in a click. All the fiddly formatting work that slows your team down, done in seconds.",
    icon: icon(<><line x1="3" y1="12" x2="21" y2="12" strokeDasharray="2 2" /><rect x="4" y="7" width="5" height="10" rx="1" /><rect x="15" y="7" width="5" height="10" rx="1" /></>),
    Vignette: FormattingVignette,
  },
  {
    id: "updates", label: "Updates", title: "Kept up to date",
    description: "When your brand evolves, we update the toolbar. Templates, colours and assets stay current without your team lifting a finger.",
    icon: icon(<><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>),
    Vignette: UpdatesVignette,
  },
];

/* ── Section ──────────────────────────────────────────────────────────────── */

export default function Features() {
  const [index, setIndex] = useState(0);
  const [userDriven, setUserDriven] = useState(false);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(sectionRef, { margin: "-25% 0px -25% 0px" });
  const headerInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  const autoplay = inView && !userDriven && !paused && !reduceMotion;

  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % features.length), ADVANCE_MS);
    return () => clearTimeout(t);
  }, [autoplay, index]);

  function select(i: number, focus = false) {
    setUserDriven(true);
    setIndex(i);
    const tab = tabRefs.current[i];
    if (!tab) return;
    if (focus) tab.focus({ preventScroll: true });
    const list = tab.parentElement;
    if (list && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const n = features.length;
    const map: Record<string, number> = { ArrowRight: (index + 1) % n, ArrowLeft: (index - 1 + n) % n, Home: 0, End: n - 1 };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key], true);
    }
  }

  const f = features[index];

  return (
    <section
      id="features"
      ref={sectionRef}
      aria-label="Features"
      className="relative px-6 md:px-12 py-24 md:py-32 bg-[#fafafa] overflow-hidden"
    >
      <Ambient blobs={[
        { color: "rgba(148,229,97,0.42)", size: "48vw", top: "20%", right: "-12%" },
        { color: "rgba(90,150,255,0.26)", size: "42vw", bottom: "-10%", left: "-12%", drift: "b" },
      ]} />
      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 md:mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="section-label mb-4"
            >
              Features
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08, ease }}
              className="text-[2.4rem] sm:text-5xl md:text-6xl leading-[1.05]"
            >
              Your brand,<br />
              <span className="gradient-text">built into PowerPoint</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-base text-navy/60 max-w-xs lg:text-right leading-relaxed"
            style={{ fontWeight: 400 }}
          >
            One ribbon tab with everything your firm needs. Pick a tool to see what it does.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease }}
          className="glass rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 30px 80px -40px rgba(10,26,47,0.35)" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {/* Ribbon */}
          <div className="border-b border-navy/[0.08] bg-white/30">
            <div className="flex items-center gap-5 px-5 pt-2.5 text-[11px] text-navy/40" aria-hidden="true">
              <span>Home</span><span>Insert</span><span className="hidden sm:inline">Design</span><span className="hidden sm:inline">Review</span>
              <span className="relative text-navy font-semibold pb-1.5 -mb-px">
                tlbr.io
                <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-green rounded-full" />
              </span>
            </div>
            <div
              role="tablist"
              aria-label="tlbr.io tools"
              onKeyDown={onKeyDown}
              className="flex overflow-x-auto mobile-carousel border-t border-navy/[0.06] bg-white/45 px-2 sm:px-3"
              style={{ scrollbarWidth: "none" }}
            >
              {features.map((feat, i) => {
                const selected = i === index;
                return (
                  <button
                    key={feat.id}
                    ref={(el) => { tabRefs.current[i] = el; }}
                    role="tab"
                    id={`tab-${feat.id}`}
                    aria-selected={selected}
                    aria-controls="feature-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(i)}
                    className={`group relative flex-shrink-0 flex flex-col items-center gap-1.5 px-4 sm:px-5 pt-3.5 pb-3 min-w-[92px] cursor-pointer transition-colors duration-200 ${
                      selected ? "text-navy" : "text-navy/45 hover:text-navy hover:bg-navy/[0.03]"
                    }`}
                  >
                    <span className={`transition-transform duration-300 ${selected ? "scale-110" : "group-hover:-translate-y-0.5"}`}>{feat.icon}</span>
                    <span className="text-[11px] whitespace-nowrap" style={{ fontWeight: selected ? 600 : 500 }}>{feat.label}</span>
                    {selected && (
                      <motion.span
                        layoutId="ribbon-active"
                        className="absolute inset-x-2 bottom-0 h-[2px] bg-navy/10 overflow-hidden rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 36 }}
                      >
                        <motion.span
                          key={`${index}-${autoplay}`}
                          className="absolute inset-0 bg-green origin-left"
                          initial={{ scaleX: autoplay ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: autoplay ? ADVANCE_MS / 1000 : 0, ease: "linear" }}
                        />
                      </motion.span>
                    )}
                  </button>
                );
              })}
              <span className="flex-shrink-0 self-end ml-auto pl-6 pr-3 pb-1.5 text-[10px] text-navy/30 hidden md:block" aria-hidden="true">
                tlbr.io for your firm
              </span>
            </div>
          </div>

          {/* Stage */}
          <div
            id="feature-panel"
            role="tabpanel"
            aria-labelledby={`tab-${f.id}`}
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
          >
            <div className="order-2 lg:order-1 p-7 md:p-10 lg:p-12 flex flex-col justify-between gap-10 lg:border-r border-navy/[0.07]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <p className="text-xs text-navy/40 tabular-nums mb-5" style={{ fontWeight: 500 }}>
                    {String(index + 1).padStart(2, "0")} <span className="text-navy/20">/ {String(features.length).padStart(2, "0")}</span>
                  </p>
                  <h3 className="text-3xl md:text-4xl leading-[1.1] mb-4">{f.title}</h3>
                  <p className="text-base text-navy/65 leading-relaxed max-w-md" style={{ fontWeight: 400 }}>
                    {f.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2">
                {[-1, 1].map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => select((index + dir + features.length) % features.length)}
                    aria-label={dir < 0 ? "Previous tool" : "Next tool"}
                    className="w-10 h-10 rounded-full border border-navy/12 flex items-center justify-center text-navy/60 hover:text-navy hover:border-navy/40 hover:bg-navy/[0.03] transition-colors duration-200 cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ transform: dir < 0 ? "scaleX(-1)" : undefined }}>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 relative bg-navy/[0.035] p-5 sm:p-8 lg:p-12 flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none opacity-60"
                style={{ backgroundImage: "radial-gradient(circle, rgba(10,26,47,0.08) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
                aria-hidden="true"
              />
              <div
                className="relative w-full bg-white rounded-md"
                style={{ aspectRatio: "16 / 10", maxWidth: 560, fontSize: "clamp(9px, 1.5vw, 15px)", boxShadow: "0 20px 50px -20px rgba(10,26,47,0.35), 0 0 0 1px rgba(10,26,47,0.06)" }}
                aria-hidden="true"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={f.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <f.Vignette />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full list for scanning, screen readers and search engines */}
        <ul className="sr-only">
          {features.map((feat) => (
            <li key={feat.id}>{feat.title}: {feat.description}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
