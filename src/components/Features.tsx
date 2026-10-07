"use client";

import { ScrollCardSection } from "@/components/ui/scroll-card";

const features = [
  {
    number: "01",
    title: "Bespoke templates",
    description:
      "Every template is built to your firm's exact design. Your team starts every pitch, proposal and report from a foundation that is already on brand.",
    bg: "#0A1A2F",
    textColor: "#FFFFFF",
    accentColor: "#94E561",
    rotation: "rotate-2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    number: "02",
    title: "Brand colours & fonts",
    description:
      "Your firm's palette and approved typefaces are built into the toolbar. Apply them instantly – no hex codes, no brand guidelines PDF open on the side.",
    bg: "#94E561",
    textColor: "#0A1A2F",
    accentColor: "#0A1A2F",
    rotation: "-rotate-1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        <circle cx="8.5" cy="9" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="15.5" cy="9" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    number: "03",
    title: "Brand asset library",
    description:
      "Approved logos, icons and images are one click away. No hunting through shared drives or emailing the design team.",
    bg: "#F2F7EF",
    textColor: "#0A1A2F",
    accentColor: "#0A1A2F",
    rotation: "rotate-3",
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
    number: "04",
    title: "Edit graphs & tables",
    description:
      "Reformat charts and tables to your brand style in clicks. Consistent data visualisation across every deck, every time.",
    bg: "#0A1A2F",
    textColor: "#FFFFFF",
    accentColor: "#94E561",
    rotation: "-rotate-2",
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
    number: "05",
    title: "Formatting tools",
    description:
      "Align, resize, distribute and space objects in a click. All the fiddly formatting work that slows your team down, done in seconds.",
    bg: "#C9F5A6",
    textColor: "#0A1A2F",
    accentColor: "#0A1A2F",
    rotation: "rotate-1",
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
    number: "06",
    title: "Kept up to date",
    description:
      "When your brand evolves, we update the toolbar. Templates, colours and assets stay current without your team lifting a finger.",
    bg: "#0A1A2F",
    textColor: "#FFFFFF",
    accentColor: "#94E561",
    rotation: "-rotate-3",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
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
          className="text-5xl md:text-6xl mb-3 leading-[1.05]"
          style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
        >
          Your brand, <span className="gradient-text">built into PowerPoint</span>
        </h2>
        <p
          className="text-base text-navy/60"
          style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
        >
          A ribbon tab inside PowerPoint with everything your firm needs, one click away.
        </p>
      </div>

      <ScrollCardSection
        cards={features}
        stickyLabel="Features"
        stickyTitle={
          <>
            Your brand,
            <br />
            <span className="gradient-text">built into PowerPoint</span>
          </>
        }
        stickySubtitle="A ribbon tab inside PowerPoint with everything your firm needs, one click away."
      />
    </div>
  );
}
