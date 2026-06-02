"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const ADMIN_PASSWORD = "Tlbr!JS!2026";
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NAVY = "#0a1a2f";
const GREEN = "#94e561";
const COLORS = [GREEN, "#60a5fa", "#f472b6", "#fb923c", "#a78bfa", "#34d399"];

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

type TimeRange = "1h" | "12h" | "24h" | "5d" | "10d" | "30d" | "1y";

const TIME_RANGES: { label: string; value: TimeRange }[] = [
  { label: "1h", value: "1h" },
  { label: "12h", value: "12h" },
  { label: "24h", value: "24h" },
  { label: "5 days", value: "5d" },
  { label: "10 days", value: "10d" },
  { label: "Month", value: "30d" },
  { label: "Year", value: "1y" },
];

function getStartDate(range: TimeRange): Date {
  const now = new Date();
  const map: Record<TimeRange, number> = {
    "1h": 1, "12h": 12, "24h": 24, "5d": 120, "10d": 240, "30d": 720, "1y": 8760,
  };
  return new Date(now.getTime() - map[range] * 60 * 60 * 1000);
}

function bucketKey(date: Date, range: TimeRange): string {
  if (range === "1h") return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  if (range === "12h" || range === "24h") return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:00`;
  if (range === "1y") return `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

function StatCard({ label, value, delta }: { label: string; value: number; delta?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color: NAVY }}>{value.toLocaleString()}</p>
      {delta !== undefined && (
        <p className={`text-xs mt-1 font-medium ${delta >= 0 ? "text-green-500" : "text-red-400"}`}>
          {delta >= 0 ? "+" : ""}{delta} vs prev period
        </p>
      )}
    </div>
  );
}

// Country name → ISO 3166-1 numeric code mapping (subset for common countries)
const COUNTRY_CODES: Record<string, string> = {
  "United Kingdom": "826", "United States": "840", "Germany": "276",
  "France": "250", "Netherlands": "528", "Ireland": "372",
  "Australia": "036", "Canada": "124", "India": "356",
  "Singapore": "702", "UAE": "784", "South Africa": "710",
  "Spain": "724", "Italy": "380", "Sweden": "752", "Norway": "578",
  "Denmark": "208", "Belgium": "056", "Switzerland": "756",
  "New Zealand": "554", "Japan": "392", "Brazil": "076",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [filterDevice, setFilterDevice] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [activeTab, setActiveTab] = useState<"overview" | "map" | "events">("overview");

  useEffect(() => {
    if (sessionStorage.getItem("tlbr_admin") === "1") setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5000)
      .then(({ data }) => { setAllEvents(data || []); setLoading(false); });
  }, [authed]);

  const startDate = useMemo(() => getStartDate(timeRange), [timeRange]);

  const events = useMemo(() => {
    return allEvents.filter((e) => {
      const d = new Date(e.created_at);
      if (d < startDate) return false;
      if (filterDevice !== "all" && e.device_type !== filterDevice) return false;
      if (filterCountry !== "all" && e.country !== filterCountry) return false;
      return true;
    });
  }, [allEvents, startDate, filterDevice, filterCountry]);

  const prevEvents = useMemo(() => {
    const duration = Date.now() - startDate.getTime();
    const prevStart = new Date(startDate.getTime() - duration);
    return allEvents.filter((e) => {
      const d = new Date(e.created_at);
      return d >= prevStart && d < startDate;
    });
  }, [allEvents, startDate]);

  // Computed stats
  const pageviews = events.filter((e) => e.event_type === "pageview").length;
  const prevPageviews = prevEvents.filter((e) => e.event_type === "pageview").length;
  const sessions = new Set(events.map((e) => e.session_id)).size;
  const prevSessions = new Set(prevEvents.map((e) => e.session_id)).size;
  const clicks = events.filter((e) => e.event_type === "click").length;
  const prevClicks = prevEvents.filter((e) => e.event_type === "click").length;

  // Chart: page views over time
  const viewsOverTime = useMemo(() => {
    const buckets: Record<string, number> = {};
    events.filter((e) => e.event_type === "pageview").forEach((e) => {
      const key = bucketKey(new Date(e.created_at), timeRange);
      buckets[key] = (buckets[key] || 0) + 1;
    });
    return Object.entries(buckets).map(([t, v]) => ({ t, v })).reverse();
  }, [events, timeRange]);

  // Top sections by time
  const topSections = useMemo(() => {
    const acc: Record<string, number> = {};
    events.filter((e) => e.event_type === "section_view").forEach((e) => {
      const k = e.section || "Unknown";
      acc[k] = (acc[k] || 0) + (e.duration_ms || 0);
    });
    return Object.entries(acc).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([name, ms]) => ({ name, value: Math.round(ms / 1000) }));
  }, [events]);

  // Device breakdown
  const deviceData = useMemo(() => {
    const acc: Record<string, number> = {};
    events.filter((e) => e.device_type).forEach((e) => {
      acc[e.device_type!] = (acc[e.device_type!] || 0) + 1;
    });
    return Object.entries(acc).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
  }, [events]);

  // Countries
  const countryData = useMemo(() => {
    const acc: Record<string, number> = {};
    events.filter((e) => e.country).forEach((e) => {
      acc[e.country!] = (acc[e.country!] || 0) + 1;
    });
    return Object.entries(acc).sort((a, b) => b[1] - a[1]);
  }, [events]);

  const allDevices = useMemo(() => {
    const s = new Set(allEvents.map((e) => e.device_type).filter(Boolean));
    return Array.from(s) as string[];
  }, [allEvents]);

  const allCountries = useMemo(() => {
    const s = new Set(allEvents.map((e) => e.country).filter(Boolean));
    return Array.from(s) as string[];
  }, [allEvents]);

  const maxCountry = countryData[0]?.[1] || 1;

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ background: NAVY }}>
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">tlbr.io</p>
            <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Admin</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (password === ADMIN_PASSWORD) { sessionStorage.setItem("tlbr_admin", "1"); setAuthed(true); } else setError("Incorrect password."); }} className="flex flex-col gap-4">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy transition-colors" autoFocus />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" className="text-white rounded-xl py-3 text-sm font-semibold transition-colors" style={{ background: NAVY }}>
              Sign in
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-8 py-5 flex items-center justify-between" style={{ background: NAVY }}>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-0.5">tlbr.io</p>
          <h1 className="text-lg font-bold text-white">Analytics</h1>
        </div>
        <button onClick={() => { sessionStorage.removeItem("tlbr_admin"); setAuthed(false); }}
          className="text-xs text-white/40 hover:text-white transition-colors">Sign out</button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Time range */}
          <div className="flex bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {TIME_RANGES.map(({ label, value }) => (
              <button key={value} onClick={() => setTimeRange(value)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${timeRange === value ? "text-white" : "text-gray-500 hover:text-navy"}`}
                style={timeRange === value ? { background: NAVY } : {}}>
                {label}
              </button>
            ))}
          </div>

          {/* Device filter */}
          <select value={filterDevice} onChange={(e) => setFilterDevice(e.target.value)}
            className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm text-gray-600 shadow-sm outline-none">
            <option value="all">All devices</option>
            {allDevices.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>

          {/* Country filter */}
          <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}
            className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm text-gray-600 shadow-sm outline-none">
            <option value="all">All regions</option>
            {allCountries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <span className="text-xs text-gray-400 ml-auto">{events.length} events</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["overview", "map", "events"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? "text-white" : "bg-white text-gray-500 hover:text-navy border border-gray-200"}`}
              style={activeTab === tab ? { background: NAVY } : {}}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Loading analytics...</div>
        ) : activeTab === "overview" ? (
          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Page Views" value={pageviews} delta={pageviews - prevPageviews} />
              <StatCard label="Unique Sessions" value={sessions} delta={sessions - prevSessions} />
              <StatCard label="Clicks" value={clicks} delta={clicks - prevClicks} />
            </div>

            {/* Area chart: views over time */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-semibold mb-5" style={{ color: NAVY }}>Page Views Over Time</h2>
              {viewsOverTime.length === 0 ? (
                <p className="text-gray-400 text-sm">No data for this period</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={viewsOverTime}>
                    <defs>
                      <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GREEN} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={GREEN} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="t" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
                    <Area type="monotone" dataKey="v" stroke={GREEN} strokeWidth={2} fill="url(#greenGrad)" name="Views" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Sections + Devices row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Section time bar chart */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-sm font-semibold mb-5" style={{ color: NAVY }}>Time Spent Per Section</h2>
                {topSections.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={topSections} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="s" />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} width={90} />
                      <Tooltip formatter={(v) => [`${v}s`, "Time"]} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
                      <Bar dataKey="value" fill={GREEN} radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Device pie */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-sm font-semibold mb-5" style={{ color: NAVY }}>Devices</h2>
                {deviceData.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data yet</p>
                ) : (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width="50%" height={180}>
                      <PieChart>
                        <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                          {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-2">
                      {deviceData.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                          <span className="text-sm text-gray-600">{d.name}</span>
                          <span className="text-sm font-semibold ml-auto" style={{ color: NAVY }}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Top countries bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-semibold mb-5" style={{ color: NAVY }}>Visitors by Country</h2>
              {countryData.length === 0 ? (
                <p className="text-gray-400 text-sm">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {countryData.slice(0, 8).map(([country, count]) => (
                    <div key={country} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-32 shrink-0">{country}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${(count / maxCountry) * 100}%`, background: GREEN }} />
                      </div>
                      <span className="text-sm font-semibold w-8 text-right" style={{ color: NAVY }}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        ) : activeTab === "map" ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-sm font-semibold mb-6" style={{ color: NAVY }}>Visitor Map</h2>
            <ComposableMap projectionConfig={{ scale: 140 }} style={{ width: "100%", height: "auto" }}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = Object.entries(COUNTRY_CODES).find(([, code]) => code === geo.id)?.[0];
                    const count = countryName ? (countryData.find(([c]) => c === countryName)?.[1] || 0) : 0;
                    const intensity = count > 0 ? Math.min(0.2 + (count / maxCountry) * 0.8, 1) : 0;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={count > 0 ? `rgba(148, 229, 97, ${intensity})` : "#f3f4f6"}
                        stroke="#e5e7eb"
                        strokeWidth={0.5}
                        style={{ hover: { fill: GREEN, outline: "none" }, pressed: { outline: "none" } }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
            {/* Country list below map */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {countryData.slice(0, 8).map(([country, count]) => (
                <div key={country} className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-2">
                  <span className="text-sm text-gray-600">{country}</span>
                  <span className="text-sm font-bold" style={{ color: NAVY }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

        ) : (
          /* Events table */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Type", "Page", "Detail", "Country", "Device", "Browser", "Time"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.slice(0, 200).map((e) => (
                    <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${e.event_type === "pageview" ? "bg-blue-50 text-blue-600" : e.event_type === "click" ? "bg-green-50 text-green-600" : "bg-purple-50 text-purple-600"}`}>
                          {e.event_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{e.page_url || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{e.section || e.element_label || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{e.country || "—"}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{e.device_type || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{e.browser || "—"}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
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
