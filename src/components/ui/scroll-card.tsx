"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ScrollCardData {
  number: string;
  title: string;
  description: string;
  bg: string;
  textColor: string;
  accentColor: string;
  rotation: string;
  icon: React.ReactNode;
}

interface ScrollCardSectionProps {
  cards: ScrollCardData[];
  stickyLabel: string;
  stickyTitle: React.ReactNode;
  stickySubtitle: string;
  className?: string;
}

// ── Mobile swipe carousel — native scroll-snap for butter-smooth swiping ──────
function MobileCarousel({ cards }: { cards: ScrollCardData[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);

  // Watch scroll position to keep dots in sync
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function onScroll() {
      if (!track) return;
      const index = Math.round(track.scrollLeft / track.offsetWidth);
      setActiveIndex(index);
      if (!hasScrolled && track.scrollLeft > 10) setHasScrolled(true);
    }
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [hasScrolled]);

  // Mouse wheel → horizontal scroll (must be non-passive to preventDefault)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      track!.scrollLeft += e.deltaY || e.deltaX;
    }
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  // Release drag if mouse leaves the window
  useEffect(() => {
    function onMouseUp() {
      if (!isDragging.current) return;
      isDragging.current = false;
      const track = trackRef.current;
      if (!track) return;
      track.style.cursor = "grab";
      track.style.scrollSnapType = "x mandatory";
      const index = Math.round(track.scrollLeft / track.offsetWidth);
      track.scrollTo({ left: index * track.offsetWidth, behavior: "smooth" });
    }
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, []);

  function onMouseDown(e: React.MouseEvent) {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartLeft.current = track.scrollLeft;
    track.style.cursor = "grabbing";
    track.style.scrollSnapType = "none"; // disable snap during drag for smoothness
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = scrollStartLeft.current + (dragStartX.current - e.clientX);
  }

  // Tap a dot → smooth-scroll to that card
  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.offsetWidth, behavior: "smooth" });
  }

  const dotAccent = cards[activeIndex]?.accentColor === "#0A1A2F" ? "#0A1A2F" : "#94E561";

  return (
    <div className="lg:hidden pb-6 pt-2">
      {/* ── Track ── */}
      <div
        ref={trackRef}
        className="mobile-carousel flex overflow-x-auto pt-3 pb-12"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          touchAction: "pan-x",
          cursor: "grab",
          userSelect: "none",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      >
        {cards.map((c, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-full px-6"
            style={{ scrollSnapAlign: "start" }}
          >
            <article
              className="w-full rounded-3xl shadow-xl select-none"
              style={{ backgroundColor: c.bg, padding: "1.6rem" }}
            >
              {/* Icon + Number */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className="rounded-2xl flex items-center justify-center"
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor:
                      c.bg === "#0A1A2F"
                        ? "rgba(148,229,97,0.15)"
                        : "rgba(10,26,47,0.08)",
                  }}
                >
                  <span style={{ color: c.accentColor }}>{c.icon}</span>
                </div>
                <span
                  style={{
                    fontFamily: '"Cal Sans", sans-serif',
                    fontSize: "2.4rem",
                    color: c.accentColor,
                    opacity: 0.18,
                    lineHeight: 1,
                    fontWeight: 700,
                  }}
                >
                  {c.number}
                </span>
              </div>

              {/* Title */}
              <h3
                className="leading-tight mb-3"
                style={{
                  fontFamily: '"Cal Sans", sans-serif',
                  fontSize: "1.4rem",
                  color: c.textColor,
                  fontWeight: 700,
                }}
              >
                {c.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: '"General Sans", sans-serif',
                  fontWeight: 400,
                  fontSize: "0.9rem",
                  color:
                    c.bg === "#0A1A2F"
                      ? "rgba(255,255,255,0.68)"
                      : "rgba(10,26,47,0.68)",
                  lineHeight: 1.75,
                }}
              >
                {c.description}
              </p>

              <div className="mt-4" />
            </article>
          </div>
        ))}
      </div>

      {/* ── Dots + Arrows ── */}
      <div className="flex items-center justify-center gap-4 mt-5">
        {/* Prev arrow */}
        <button
          onClick={() => goTo((activeIndex - 1 + cards.length) % cards.length)}
          aria-label="Previous feature"
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ backgroundColor: dotAccent }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7.5 2L3.5 6L7.5 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {cards.map((_, di) => (
            <button
              key={di}
              onClick={() => goTo(di)}
              aria-label={`Go to feature ${di + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: di === activeIndex ? "20px" : "6px",
                height: "6px",
                backgroundColor: di === activeIndex ? dotAccent : "rgba(10,26,47,0.15)",
              }}
            />
          ))}
        </div>

        {/* Next arrow */}
        <button
          onClick={() => goTo((activeIndex + 1) % cards.length)}
          aria-label="Next feature"
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          style={{ backgroundColor: dotAccent }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 2L8.5 6L4.5 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Hint */}
      {!hasScrolled && (
        <p
          className="text-center mt-3 text-xs text-navy/35"
          style={{ fontFamily: '"General Sans", sans-serif' }}
        >
          Swipe or drag to explore
        </p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const ScrollCardSection = forwardRef<HTMLElement, ScrollCardSectionProps>(
  ({ cards, stickyLabel, stickyTitle, stickySubtitle, className }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("w-full", className)}
        aria-label="Features"
      >
        {/* Mobile: swipe carousel */}
        <MobileCarousel cards={cards} />

        {/* Desktop: sticky scroll layout */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row lg:items-start">

              {/* LEFT: sticky section header */}
              <div className="hidden lg:flex sticky top-0 h-[55vh] items-center justify-center lg:w-[55%] flex-shrink-0 pr-10">
                <div className="w-full">
                  <p className="section-label mb-4">{stickyLabel}</p>
                  <h2
                    className="text-5xl xl:text-6xl mb-4 leading-[1.08]"
                    style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700 }}
                  >
                    {stickyTitle}
                  </h2>
                  <p
                    className="text-sm text-navy/55 leading-relaxed"
                    style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
                  >
                    {stickySubtitle}
                  </p>
                </div>
              </div>

              {/* RIGHT: stacking feature cards */}
              <div className="flex-1">
                {cards.map((card, i) => (
                  <figure
                    key={i}
                    className="lg:sticky lg:top-0 lg:h-[75vh] flex items-center justify-center lg:justify-start py-6 lg:py-0"
                    style={{ zIndex: 10 + i }}
                  >
                    <article
                      className={cn("w-full rounded-3xl shadow-xl", card.rotation)}
                      style={{
                        backgroundColor: card.bg,
                        maxWidth: "520px",
                        padding: "2.5rem",
                      }}
                    >
                      {/* Icon + Number row */}
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className="rounded-2xl flex items-center justify-center"
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor:
                              card.bg === "#0A1A2F"
                                ? "rgba(148,229,97,0.15)"
                                : "rgba(10,26,47,0.08)",
                          }}
                        >
                          <span style={{ color: card.accentColor }}>
                            {card.icon}
                          </span>
                        </div>
                        <span
                          style={{
                            fontFamily: '"Cal Sans", sans-serif',
                            fontSize: "2.8rem",
                            color: card.accentColor,
                            opacity: 0.18,
                            lineHeight: 1,
                            fontWeight: 700,
                          }}
                        >
                          {card.number}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className="leading-tight mb-3"
                        style={{
                          fontFamily: '"Cal Sans", sans-serif',
                          fontSize: "1.55rem",
                          color: card.textColor,
                          fontWeight: 700,
                        }}
                      >
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p
                        style={{
                          fontFamily: '"General Sans", sans-serif',
                          fontWeight: 400,
                          fontSize: "0.93rem",
                          color:
                            card.bg === "#0A1A2F"
                              ? "rgba(255,255,255,0.68)"
                              : "rgba(10,26,47,0.68)",
                          lineHeight: 1.75,
                        }}
                      >
                        {card.description}
                      </p>

                      {/* Progress dots */}
                      <div className="flex gap-1.5 mt-7">
                        {cards.map((_, di) => (
                          <span
                            key={di}
                            className="rounded-full transition-all duration-300"
                            style={{
                              width: di === i ? "20px" : "6px",
                              height: "6px",
                              backgroundColor:
                                di === i
                                  ? card.accentColor
                                  : card.bg === "#0A1A2F"
                                  ? "rgba(255,255,255,0.12)"
                                  : "rgba(10,26,47,0.12)",
                            }}
                          />
                        ))}
                      </div>
                    </article>
                  </figure>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }
);

ScrollCardSection.displayName = "ScrollCardSection";
export { ScrollCardSection };
