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
        <div className="mb-10 pt-10 border-t border-white/8">
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500, color: "rgba(255,255,255,0.3)" }}
          >
            Weekly insights
          </p>
          {subStatus === "done" ? (
            <p className="text-sm" style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400, color: "rgba(255,255,255,0.45)" }}>
              You&apos;re on the list. Every Tuesday.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email"
                required
                className="flex-1 px-4 py-2.5 rounded-full text-sm bg-white/8 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-green/40 transition-colors min-w-0"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
              />
              <button
                type="submit"
                disabled={subStatus === "loading"}
                className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium bg-green text-navy hover:bg-green-light transition-colors duration-200 disabled:opacity-60"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
              >
                {subStatus === "loading" ? "…" : "Subscribe"}
              </button>
            </form>
          )}
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
