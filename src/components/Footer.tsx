"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer({ showDemo = true }: { showDemo?: boolean }) {
  const year = new Date().getFullYear();
  const pathname = usePathname();

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
              Elevate every presentation. A bespoke PowerPoint add-in for teams who
              can&apos;t afford to look off-brand.
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
