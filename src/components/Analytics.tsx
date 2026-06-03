"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

// ─── Session / identity helpers ──────────────────────────────────────────────

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem("tlbr_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("tlbr_sid", sid);
  }
  return sid;
}

// New visitor = no localStorage marker yet; sets the marker on first call
function checkIsNewUser(): boolean {
  const key = "tlbr_visitor";
  const isNew = !localStorage.getItem(key);
  if (isNew) localStorage.setItem(key, "1");
  return isNew;
}

// Count pages visited within this browser tab session
function getPagesInSession(): number {
  const key = "tlbr_pages";
  const count = parseInt(sessionStorage.getItem(key) || "0") + 1;
  sessionStorage.setItem(key, String(count));
  return count;
}

// ─── Device / browser helpers ─────────────────────────────────────────────────

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
    if (/iPad/i.test(ua)) return "tablet";
    return "mobile";
  }
  return "desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  return "Other";
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("Linux")) return "Linux";
  return "Other";
}

// ─── Location ─────────────────────────────────────────────────────────────────

async function getLocation(): Promise<{ country: string; city: string }> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return { country: data.country_name || "", city: data.city || "" };
  } catch {
    return { country: "", city: "" };
  }
}

// ─── Core event tracker ───────────────────────────────────────────────────────

type EventPayload = {
  event_type: string;
  section?: string;
  element_label?: string;
  duration_ms?: number;
  is_new_user?: boolean;
  scroll_depth?: number;
  screen_width?: number;
  screen_height?: number;
  timezone?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  pages_in_session?: number;
  session_duration_ms?: number;
};

export async function trackEvent(event: EventPayload) {
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

// Lightweight version used on page unload — skips geo (async would be cancelled)
function trackEventSync(event: EventPayload) {
  supabase.from("analytics_events").insert({
    ...event,
    page_url: window.location.pathname,
    device_type: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    referrer: document.referrer || null,
    session_id: getSessionId(),
  });
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TRACKED_SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How It Works" },
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "About" },
  { id: "demo", label: "Demo" },
];

const TRACKED_CTAS = [
  "Book a Demo",
  "Get started",
  "View pricing",
  "See features",
  "Request demo",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Analytics() {
  const sectionTimers = useRef<Record<string, number>>({});
  const sessionStart = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);

  useEffect(() => {
    const isNewUser = checkIsNewUser();
    const pagesInSession = getPagesInSession();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    // Parse UTM params from URL query string
    const params = new URLSearchParams(window.location.search);
    const utm_source = params.get("utm_source");
    const utm_medium = params.get("utm_medium");
    const utm_campaign = params.get("utm_campaign");

    // Track page view with enriched data
    trackEvent({
      event_type: "pageview",
      is_new_user: isNewUser,
      pages_in_session: pagesInSession,
      screen_width: screenWidth,
      screen_height: screenHeight,
      timezone,
      utm_source,
      utm_medium,
      utm_campaign,
    });

    // ── Scroll depth tracking ──
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.round((scrollTop / docHeight) * 100);
        if (pct > maxScrollDepth.current) {
          maxScrollDepth.current = Math.min(pct, 100);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ── Session end tracking ──
    // Fires when user navigates away — records scroll depth + total time on site
    const handleUnload = () => {
      const sessionDuration = Date.now() - sessionStart.current;
      trackEventSync({
        event_type: "session_end",
        scroll_depth: maxScrollDepth.current,
        session_duration_ms: sessionDuration,
        pages_in_session: parseInt(sessionStorage.getItem("tlbr_pages") || "1"),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    };
    window.addEventListener("beforeunload", handleUnload);

    // ── Section visibility / dwell time ──
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

    // ── Click tracking ──
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const text = target.innerText?.trim();
      if (text && TRACKED_CTAS.some((cta) => text.includes(cta))) {
        trackEvent({ event_type: "click", element_label: text });
      }
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
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return null;
}
