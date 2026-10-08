"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Consent = "pending" | "accepted" | "rejected";

export default function CookieBanner({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<Consent>("pending");
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent") as Consent | null;
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
    } else {
      setShowBanner(true);
    }
    setMounted(true);
  }, []);

  function resolve(value: "accepted" | "rejected") {
    localStorage.setItem("cookie-consent", value);
    setShowBanner(false);
    window.dispatchEvent(new CustomEvent("tlbr:cookie-resolved"));
    // Delay consent state update to let banner exit animation finish
    setTimeout(() => setConsent(value), 350);
  }

  // Always render the same wrapper div so React never unmounts children.
  // Only the padding and the fixed banner change – children are stable.
  return (
    <>
      <div
        style={{
          paddingBottom: mounted && showBanner ? "10vh" : "0px",
          transition: "padding-bottom 0.35s ease",
        }}
      >
        {children}
      </div>

      <AnimatePresence>
        {mounted && showBanner && (
          <motion.div
            key="cookie-banner"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="glass-dark fixed z-[60] bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: "rgba(10,26,47,0.98)" }}
            role="dialog"
            aria-label="Cookie consent"
            aria-modal="false"
          >
            {/* Text */}
            <p
              className="text-sm text-white/75 leading-relaxed"
              style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 400 }}
            >
              We use cookies to understand how you use our site and improve your experience.{" "}
              <a
                href="/cookie-policy"
                className="underline underline-offset-2 text-white/70 hover:text-white transition-colors whitespace-nowrap"
              >
                Learn more
              </a>
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => resolve("rejected")}
                className="px-4 py-2 rounded-full text-xs md:text-sm border border-white/20 text-white/60 hover:border-white/40 hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 500 }}
              >
                Reject
              </button>
              <button
                onClick={() => resolve("accepted")}
                className="px-4 py-2 rounded-full text-xs md:text-sm bg-green text-navy hover:bg-green-light transition-all duration-200 cursor-pointer whitespace-nowrap"
                style={{ fontFamily: '"General Sans", sans-serif', fontWeight: 600 }}
              >
                Accept
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
