"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "Tlbr!JS!2026";

type Event = {
  id: string;
  event_type: string;
  page_url: string;
  section: string | null;
  element_label: string | null;
  duration_ms: number | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
  session_id: string | null;
  created_at: string;
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-navy">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "events">("overview");

  useEffect(() => {
    if (sessionStorage.getItem("tlbr_admin") === "1") setAuthed(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("tlbr_admin", "1");
      setAuthed(true);
    } else {
      setError("Incorrect password.");
    }
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000)
      .then(({ data }) => {
        setEvents(data || []);
        setLoading(false);
      });
  }, [authed]);

  if (!authed) {
    return (
      <main className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">tlbr.io</p>
            <h1 className="text-2xl font-bold text-navy">Admin</h1>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy transition-colors"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="bg-navy text-white rounded-xl py-3 text-sm font-semibold hover:bg-navy/85 transition-colors"
            >
              Sign in
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Computed stats
  const pageviews = events.filter((e) => e.event_type === "pageview").length;
  const uniqueSessions = new Set(events.map((e) => e.session_id)).size;
  const clicks = events.filter((e) => e.event_type === "click").length;

  const topSections = Object.entries(
    events
      .filter((e) => e.event_type === "section_view")
      .reduce<Record<string, number>>((acc, e) => {
        const key = e.section || "Unknown";
        acc[key] = (acc[key] || 0) + (e.duration_ms || 0);
        return acc;
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topCountries = Object.entries(
    events
      .filter((e) => e.country)
      .reduce<Record<string, number>>((acc, e) => {
        acc[e.country!] = (acc[e.country!] || 0) + 1;
        return acc;
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const deviceBreakdown = Object.entries(
    events
      .filter((e) => e.device_type)
      .reduce<Record<string, number>>((acc, e) => {
        acc[e.device_type!] = (acc[e.device_type!] || 0) + 1;
        return acc;
      }, {})
  ).sort((a, b) => b[1] - a[1]);

  const topClicks = Object.entries(
    events
      .filter((e) => e.event_type === "click" && e.element_label)
      .reduce<Record<string, number>>((acc, e) => {
        acc[e.element_label!] = (acc[e.element_label!] || 0) + 1;
        return acc;
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy text-white px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50 mb-0.5">tlbr.io</p>
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem("tlbr_admin"); setAuthed(false); }}
          className="text-xs text-white/50 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(["overview", "events"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-navy text-white"
                  : "bg-white text-gray-500 hover:text-navy border border-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading analytics...</p>
        ) : activeTab === "overview" ? (
          <div className="space-y-8">
            {/* Top stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Total Page Views" value={pageviews} />
              <StatCard label="Unique Sessions" value={uniqueSessions} />
              <StatCard label="Total Clicks" value={clicks} />
            </div>

            {/* Sections */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-navy mb-4">Top Sections by Time</h2>
                {topSections.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {topSections.map(([section, ms]) => (
                      <div key={section} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{section}</span>
                        <span className="text-sm font-medium text-navy">
                          {Math.round(ms / 1000)}s
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-navy mb-4">Top Clicks</h2>
                {topClicks.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {topClicks.map(([label, count]) => (
                      <div key={label} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 truncate max-w-[200px]">{label}</span>
                        <span className="text-sm font-medium text-navy">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-navy mb-4">Top Countries</h2>
                {topCountries.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {topCountries.map(([country, count]) => (
                      <div key={country} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{country}</span>
                        <span className="text-sm font-medium text-navy">{count} visits</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-navy mb-4">Devices</h2>
                {deviceBreakdown.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {deviceBreakdown.map(([device, count]) => (
                      <div key={device} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700 capitalize">{device}</span>
                        <span className="text-sm font-medium text-navy">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Raw events table */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Type", "Page", "Section / Element", "Country", "Device", "Browser", "Time"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.slice(0, 100).map((e) => (
                    <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          e.event_type === "pageview" ? "bg-blue-50 text-blue-600" :
                          e.event_type === "click" ? "bg-green-50 text-green-600" :
                          "bg-purple-50 text-purple-600"
                        }`}>
                          {e.event_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{e.page_url || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                        {e.section || e.element_label || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{e.country || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{e.device_type || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{e.browser || "—"}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(e.created_at).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
