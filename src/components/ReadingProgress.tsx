"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

export default function ReadingProgress() {
  const rawProgress = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, { stiffness: 120, damping: 24, mass: 0.5 });
  const scaleX = useTransform(smoothProgress, [0, 100], [0, 1]);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      rawProgress.set(pct);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [rawProgress]);

  return (
    <motion.div
      className="fixed top-16 left-0 right-0 z-[100] h-[3px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #94e561 0%, #c9f5a6 100%)",
      }}
    />
  );
}
