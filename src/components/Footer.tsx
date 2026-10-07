"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer({ showDemo = true }: { showDemo?: boolean }) {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "done">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || subStatus === "loading") return;
    setSubStatus("loading");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // silent fail
    } finally {
      setSubStatus("done");
    }
  }

  const navGroups = [
    {
      label: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      label: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Blog", href: "/blog" },
        ...(showDemo ? [{ label: "Book a Demo", href: "#demo" }] : []),
      ],
    },
  ];

  const handleScroll = (href: string) => {
    if (!href.startsWith("#")) {
      window.location.href = href;
      return;
    }
    if (pathname === "/") {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/${href}`;
    }
  };

  return (
    <footer className="bg-navy px-6 py-16" aria-label="Site footer">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            {/* Logo */}
            <div className="mb-4">
              <Image
                src="/logo-white.svg"
                alt="tlbr.io"
                width={110}
                height={38}
              />
            </div>
            <p
              className="text-sm max-w-xs mb-6"
              style={{
                fontFamily: '"General Sans", sans-serif',
                fontWeight: 400,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              A bespoke PowerPoint toolbar for firms who can&apos;t afford to look off-brand.
            </p>
            {showDemo && (
              <a
                href="#demo"
                className="inline-flex px-5 py-2.5 rounded-full text-sm font-medium bg-green text-navy hover:bg-green-light transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
                onClick={(e) => { e.preventDefault(); handleScroll("#demo"); }}
              >
                Book a Demo
              </a>
            )}
          </div>

          {/* Nav groups */}
          {navGroups.map((group) => (
            <div key={group.label}>
              <p
                className="section-label mb-4"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {group.label}
              </p>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleScroll(link.href)}
                      className="text-sm cursor-pointer transition-colors duration-200 hover:text-white"
                      style={{
                        fontFamily: '"General Sans", sans-serif',
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.45)",
                        background: "none",
                        border: "none",
                        padding: 0,
                      }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mb-10 pt-10 border-t border-white/8 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">
          {/* Left: label + heading */}
          <div className="flex-shrink-0">
            <p
              className="text-[10px] uppercase tracking-widest mb-1.5"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500, color: "rgba(148,229,97,0.6)" }}
            >
              Weekly insights
            </p>
            <p
              className="text-base leading-snug"
              style={{ fontFamily: '"Cal Sans", sans-serif', fontWeight: 700, color: "#fff" }}
            >
              Presentation tips,{" "}
              <span style={{ color: "#94E561" }}>every Tuesday.</span>
            </p>
          </div>

          {/* Right: form */}
          <div className="flex-1 min-w-0">
            {subStatus === "done" ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#94E561" }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#0A1A2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-sm" style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>
                  You&apos;re on the list. See you Tuesday.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email"
                  required
                  className="flex-1 px-4 py-2.5 rounded-full text-sm border text-white placeholder:text-white/30 outline-none transition-colors duration-200 min-w-0"
                  style={{
                    fontFamily: '"General Sans", sans-serif',
                    fontWeight: 400,
                    background: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(148,229,97,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="submit"
                  disabled={subStatus === "loading"}
                  className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border transition-colors duration-200 hover:bg-white hover:text-navy disabled:opacity-60 cursor-pointer"
                  style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500, background: "transparent", color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.2)" }}
                >
                  {subStatus === "loading" ? "…" : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-xs"
            style={{
              fontFamily: '"General Sans", sans-serif',
              fontWeight: 400,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            © {year} tlbr.io. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms"].map((label) => (
              <a
                key={label}
                href={`/${label.toLowerCase()}`}
                className="text-xs transition-colors duration-200 hover:text-white/60"
                style={{
                  fontFamily: '"General Sans", sans-serif',
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
