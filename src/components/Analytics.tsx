"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

// Generate or retrieve a session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("tlbr_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("tlbr_sid", sid);
  }
  return sid;
}

// Detect device type from user agent
function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
    if (/iPad/i.test(ua)) return "tablet";
    return "mobile";
  }
  return "desktop";
}

// Detect browser
function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  return "Other";
}

// Detect OS
function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("Linux")) return "Linux";
  return "Other";
}

async function getLocation(): Promise<{ country: string; city: string }> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return { country: data.country_name || "", city: data.city || "" };
  } catch {
    return { country: "", city: "" };
  }
}

async function trackEvent(event: {
  event_type: string;
  section?: string;
  element_label?: string;
  duration_ms?: number;
}) {
  const { country, city } = await getLocation();
  await supabase.from("analytics_events").insert({
    ...event,
    page_url: window.location.pathname,
    country,
    city,
    device_type: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    referrer: document.referrer || null,
    session_id: getSessionId(),
  });
}

// Sections to track visibility/time on
const TRACKED_SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How It Works" },
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "About" },
  { id: "demo", label: "Demo" },
];

// CTA buttons to track clicks on
const TRACKED_CTAS = [
  "Book a Demo",
  "Get started",
  "View pricing",
  "See features",
  "Request demo",
];

export default function Analytics() {
  const sectionTimers = useRef<Record<string, number>>({});

  useEffect(() => {
    // Track page view
    trackEvent({ event_type: "pageview" });

    // Track section visibility using IntersectionObserver
    const observers: IntersectionObserver[] = [];

    TRACKED_SECTIONS.forEach(({ id, label }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              sectionTimers.current[id] = Date.now();
            } else {
              const start = sectionTimers.current[id];
              if (start) {
                const duration = Date.now() - start;
                if (duration > 1000) {
                  trackEvent({
                    event_type: "section_view",
                    section: label,
                    duration_ms: duration,
                  });
                }
                delete sectionTimers.current[id];
              }
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    // Track CTA clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const text = target.innerText?.trim();
      if (text && TRACKED_CTAS.some((cta) => text.includes(cta))) {
        trackEvent({ event_type: "click", element_label: text });
      }
      // Also track any link clicks
      const link = target.closest("a");
      if (link) {
        const label = link.innerText?.trim() || link.href;
        trackEvent({ event_type: "click", element_label: label.slice(0, 100) });
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      observers.forEach((o) => o.disconnect());
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
