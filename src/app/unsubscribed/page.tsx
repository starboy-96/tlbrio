import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribed – tlbr.io",
  robots: { index: false },
};

export default function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "#f4f4f2" }}
    >
      <div
        className="rounded-3xl px-10 py-14 max-w-md w-full"
        style={{ background: "#fff", boxShadow: "0 1px 3px rgba(10,26,47,0.06)" }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "#0a1a2f" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10l4.5 4.5L16 6" stroke="#94e561" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1
          className="text-2xl mb-3"
          style={{ fontFamily: '"Cal Sans", sans-serif', color: "#0a1a2f" }}
        >
          You&apos;ve been unsubscribed
        </h1>
        <p
          className="text-sm mb-8"
          style={{ fontFamily: '"General Sans", sans-serif', color: "rgba(10,26,47,0.55)", lineHeight: 1.7 }}
        >
          You won&apos;t receive any more emails from tlbr.io. If this was a mistake, you can re-subscribe below.
        </p>
        <Link
          href="/#newsletter"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:opacity-90"
          style={{ fontFamily: '"General Sans", sans-serif', background: "#0a1a2f", color: "#94e561" }}
        >
          Re-subscribe
        </Link>
      </div>
    </main>
  );
}
