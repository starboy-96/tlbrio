import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | tlbr.io",
  description: "This page doesn't exist. Head back to tlbr.io.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-navy flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(148,229,97,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Logo */}
      <Link href="/" className="mb-12 inline-block opacity-90 hover:opacity-100 transition-opacity">
        <Image
          src="/logo-white.svg"
          alt="tlbr.io"
          width={120}
          height={40}
          priority
        />
      </Link>

      {/* 404 number */}
      <div
        className="font-cal text-green leading-none mb-6 select-none"
        style={{ fontSize: "clamp(6rem, 20vw, 12rem)" }}
        aria-hidden="true"
      >
        404
      </div>

      {/* Heading */}
      <h1
        className="font-cal text-white mb-4"
        style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
      >
        This slide doesn&apos;t exist
      </h1>

      {/* Subtext */}
      <p className="text-white/60 max-w-sm mb-10 text-base leading-relaxed">
        The page you&apos;re looking for has been moved, deleted, or never existed.
        Let&apos;s get you back on track.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-green text-navy font-semibold px-7 py-3.5 rounded-full hover:bg-green-light transition-colors duration-200 text-sm"
        >
          ← Back to home
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 border border-white/20 text-white/80 font-medium px-7 py-3.5 rounded-full hover:border-white/40 hover:text-white transition-colors duration-200 text-sm"
        >
          Read the blog
        </Link>
      </div>
    </main>
  );
}
