"use client";

import React, { forwardRef } from "react";
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

const ScrollCardSection = forwardRef<HTMLElement, ScrollCardSectionProps>(
  ({ cards, stickyLabel, stickyTitle, stickySubtitle, className }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("w-full", className)}
        aria-label="Features"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-start">

          {/* ── LEFT: sticky section header ── */}
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

          {/* ── RIGHT: stacking feature cards ── */}
          <div className="flex-1">
            {cards.map((card, i) => (
              <figure
                key={i}
                className="lg:sticky lg:top-0 lg:h-[75vh] flex items-center justify-center lg:justify-start py-6 lg:py-0"
                style={{ zIndex: 10 + i }}
              >
                <article
                  className={cn(
                    "w-full rounded-3xl shadow-xl",
                    card.rotation
                  )}
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
      </section>
    );
  }
);

ScrollCardSection.displayName = "ScrollCardSection";
export { ScrollCardSection };
