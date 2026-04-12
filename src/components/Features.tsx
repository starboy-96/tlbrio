"use client";

import { ScrollCardSection } from "@/components/ui/scroll-card";

const features = [
  {
    number: "01",
    title: "Align & distribute",
    description:
      "Select any objects and align them perfectly – left, right, centre, or evenly spaced – in a single click. No more pixel-nudging.",
    bg: "#0A1A2F",
    textColor: "#FFFFFF",
    accentColor: "#94E561",
    rotation: "rotate-2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <rect x="6" y="10" width="4" height="8" rx="1"/>
        <rect x="14" y="10" width="4" height="8" rx="1"/>
        <line x1="3" y1="22" x2="21" y2="22"/>
      </svg>
    ),
  },
  {
    number: "02",
    title: "Resize & scale",
    description:
      "Match sizes across objects, lock aspect ratios, and scale elements consistently without breaking your layout.",
    bg: "#94E561",
    textColor: "#0A1A2F",
    accentColor: "#0A1A2F",
    rotation: "-rotate-1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
      </svg>
    ),
  },
  {
    number: "03",
    title: "Brand colours & fonts",
    description:
      "Your brand palette and approved fonts are built into the toolbar. Apply them instantly – no copy-pasting hex codes or checking brand guidelines separately.",
    bg: "#F2F7EF",
    textColor: "#0A1A2F",
    accentColor: "#0A1A2F",
    rotation: "rotate-3",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        <circle cx="8.5" cy="9" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="15.5" cy="9" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="6.5" cy="13" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    number: "04",
    title: "Bespoke templates",
    description:
      "Every template in the toolbar is built to your organisation's exact design. Your team starts every deck from a foundation that's already on brand.",
    bg: "#0A1A2F",
    textColor: "#FFFFFF",
    accentColor: "#94E561",
    rotation: "-rotate-2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    number: "05",
    title: "Edit graphs & tables",
    description:
      "Reformat charts and tables to match your brand style in clicks. Consistent data visualisation across every deck, every time.",
    bg: "#C9F5A6",
    textColor: "#0A1A2F",
    accentColor: "#0A1A2F",
    rotation: "rotate-1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="11" width="5" height="9" rx="1"/>
        <rect x="9.5" y="6" width="5" height="14" rx="1"/>
        <rect x="17" y="2" width="5" height="18" rx="1"/>
        <line x1="2" y1="22" x2="22" y2="22"/>
      </svg>
    ),
  },
  {
    number: "06",
    title: "Brand asset library",
    description:
      "Approved logos, icons, and images are one click away. No hunting through shared drives or emailing the design team.",
    bg: "#0A1A2F",
    textColor: "#FFFFFF",
    accentColor: "#94E561",
    rotation: "-rotate-3",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    number: "07",
    title: "Layout & spacing",
    description:
      "Set consistent margins, padding, and slide structure across your whole deck in seconds.",
    bg: "#94E561",
    textColor: "#0A1A2F",
    accentColor: "#0A1A2F",
    rotation: "rotate-2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M8 3v18M16 3v18M3 8h5M3 16h5M16 8h5M16 16h5"/>
      </svg>
    ),
  },
  {
    number: "08",
    title: "Built for everyone",
    description:
      "Designed for designers and non-designers alike. If you work in PowerPoint, tlbr.io makes your slides better – regardless of skill level.",
    bg: "#F2F7EF",
    textColor: "#0A1A2F",
    accentColor: "#0A1A2F",
    rotation: "-rotate-1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <div id="features">
      {/* Mobile heading */}
      <div className="lg:hidden px-6 pt-10 pb-4">
        <p className="section-label mb-3">Features</p>
        <h2
          className="text-3xl mb-3 leading-tight"
          style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
        >
          The formatting work, <span className="gradient-text">done for you</span>
        </h2>
        <p
          className="text-base text-navy/60"
          style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
        >
          A ribbon of smart buttons inside PowerPoint. Click once – your slide snaps into shape.
        </p>
      </div>

      <ScrollCardSection
        cards={features}
        stickyLabel="Features"
        stickyTitle={
          <>
            The formatting work,
            <br />
            <span className="gradient-text">done for you</span>
          </>
        }
        stickySubtitle="A ribbon of smart buttons inside PowerPoint. Click once – your slide snaps into shape."
      />
    </div>
  );
}
