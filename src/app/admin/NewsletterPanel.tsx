"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { addSubscribers, removeSubscriber, type SubscriberActionState } from "./actions";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { NewsletterStats } from "@/lib/newsletter-stats";

const NAVY = "#0a1a2f";
const GREEN = "#94e561";
const DAY = 24 * 60 * 60 * 1000;

function pct(part: number, whole: number) {
  return whole > 0 ? `${Math.round((part / whole) * 100)}%` : "—";
}

function Card({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color: NAVY }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-xs mt-1 text-gray-400">{sub}</p>}
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl px-5 py-4">{children}</div>
  );
}

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2.5 rounded-full text-sm font-medium text-white disabled:opacity-60 cursor-pointer"
      style={{ background: NAVY }}
    >
      {pending ? "Adding…" : "Add"}
    </button>
  );
}

function AddSubscribersForm() {
  const [state, action] = useActionState<SubscriberActionState, FormData>(addSubscribers, undefined);
  return (
    <form action={action} className="px-6 py-5 border-b border-gray-50 space-y-3">
      <label htmlFor="new-subscribers" className="block text-xs text-gray-400 uppercase tracking-wide">Add people</label>
      <textarea
        key={state?.draft ?? "empty"}
        defaultValue={state?.draft}
        id="new-subscribers"
        name="emails"
        rows={2}
        required
        placeholder="name@firm.com — paste several, separated by commas or new lines"
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400 resize-y"
        style={{ color: NAVY }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
          <input type="checkbox" name="sendWelcome" defaultChecked className="accent-[#0a1a2f]" />
          Send them the welcome email
        </label>
        <AddButton />
      </div>
      <p className="text-xs text-gray-400">Only add people who have agreed to receive the newsletter.</p>
      {state?.message && <p className="text-sm text-green-700" role="status">{state.message}</p>}
      {state?.error && <p className="text-sm text-red-500" role="alert">{state.error}</p>}
    </form>
  );
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function NewsletterPanel({ stats }: { stats: NewsletterStats }) {
  const [showAll, setShowAll] = useState(false);
  const { subscribers, issues, welcome } = stats;
  const now = Date.now();

  const hasDates = subscribers.some((s) => s.createdAt);
  const newIn = (days: number) =>
    subscribers.filter((s) => s.createdAt && now - new Date(s.createdAt).getTime() <= days * DAY).length;

  const totals = useMemo(
    () => issues.reduce(
      (t, i) => ({ sent: t.sent + i.sent, delivered: t.delivered + i.delivered, opened: t.opened + i.opened, clicked: t.clicked + i.clicked, bounced: t.bounced + i.bounced }),
      { sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0 },
    ),
    [issues],
  );
  const trackingOff = totals.delivered > 0 && totals.opened === 0;

  const growth = useMemo(() => {
    const dated = subscribers.filter((s) => s.createdAt).map((s) => new Date(s.createdAt!).getTime()).sort((a, b) => a - b);
    if (dated.length === 0) return [];
    const undated = subscribers.length - dated.length;
    const weeks = new Map<string, number>();
    dated.forEach((t, i) => {
      const d = new Date(t);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      weeks.set(d.toISOString().slice(0, 10), undated + i + 1);
    });
    return [...weeks.entries()].map(([week, total]) => ({
      week: new Date(week).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      total,
    }));
  }, [subscribers]);

  const visibleSubs = showAll ? subscribers : subscribers.slice(0, 25);

  return (
    <div className="space-y-6">
      {stats.subscribersError && <Notice>Couldn&apos;t load subscribers: {stats.subscribersError}</Notice>}
      {stats.emailsError && <Notice>{stats.emailsError}</Notice>}
      {trackingOff && (
        <Notice>
          No opens or clicks have been recorded, which usually means open and click tracking is switched off in Resend.
          Turn it on for the newsletter.tlbr.io domain in Resend to see open and click rates for future issues.
        </Notice>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Subscribers" value={subscribers.length} sub={hasDates ? `${newIn(7)} new this week` : undefined} />
        <Card label="New in 30 days" value={hasDates ? newIn(30) : "—"} sub={hasDates ? undefined : "Sign-up dates not recorded"} />
        <Card label="Issues sent" value={issues.length} sub={`${totals.sent.toLocaleString()} emails in total`} />
        <Card
          label="Average open rate"
          value={trackingOff ? "—" : pct(totals.opened, totals.delivered)}
          sub={trackingOff ? "Tracking off" : `Click rate ${pct(totals.clicked, totals.delivered)}`}
        />
      </div>

      {growth.length > 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold mb-4" style={{ color: NAVY }}>Subscriber growth</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growth} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="subsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GREEN} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v) => [v ?? 0, "Subscribers"]} />
              <Area type="monotone" dataKey="total" stroke={NAVY} strokeWidth={2} fill="url(#subsFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
          <h2 className="text-sm font-semibold" style={{ color: NAVY }}>Issues</h2>
          {stats.emailsTruncated && <span className="text-xs text-gray-400">Showing the most recent 1,000 emails</span>}
        </div>
        {issues.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-400">No newsletter issues found in Resend yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-6 py-3 font-medium">Sent</th>
                  <th className="px-4 py-3 font-medium">Issue</th>
                  <th className="px-4 py-3 font-medium text-right">Recipients</th>
                  <th className="px-4 py-3 font-medium text-right">Delivered</th>
                  <th className="px-4 py-3 font-medium text-right">Opened</th>
                  <th className="px-4 py-3 font-medium text-right">Clicked</th>
                  <th className="px-6 py-3 font-medium text-right">Bounced</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((i) => (
                  <tr key={i.subject} className="border-t border-gray-50">
                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{fmtDate(i.sentAt)}</td>
                    <td className="px-4 py-3" style={{ color: NAVY }}>
                      {i.slug ? (
                        <a href={`/blog/${i.slug}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{i.subject}</a>
                      ) : i.subject}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">{i.sent}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{pct(i.delivered, i.sent)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{trackingOff ? "—" : pct(i.opened, i.delivered)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{trackingOff ? "—" : pct(i.clicked, i.delivered)}</td>
                    <td className={`px-6 py-3 text-right ${i.bounced ? "text-red-500" : "text-gray-400"}`}>{i.bounced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-sm font-semibold mb-4" style={{ color: NAVY }}>Welcome emails</h2>
          <dl className="space-y-3 text-sm">
            {[
              ["Sent", welcome.sent],
              ["Delivered", pct(welcome.delivered, welcome.sent)],
              ["Opened", trackingOff ? "—" : pct(welcome.opened, welcome.delivered)],
              ["Bounced", welcome.bounced],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="text-gray-400">{k}</dt>
                <dd className="font-medium" style={{ color: NAVY }}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold" style={{ color: NAVY }}>Subscribers</h2>
          </div>
          <AddSubscribersForm />
          {subscribers.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400">No subscribers yet.</p>
          ) : (
            <>
              <ul className="divide-y divide-gray-50 text-sm">
                {visibleSubs.map((s) => (
                  <li key={s.email} className="px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                    <span className="min-w-0 break-all sm:truncate" style={{ color: NAVY }}>{s.email}</span>
                    <span className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-gray-400 whitespace-nowrap">{s.createdAt ? fmtDate(s.createdAt) : "—"}</span>
                      <form action={removeSubscriber}>
                        <input type="hidden" name="email" value={s.email} />
                        <button
                          type="submit"
                          aria-label={`Remove ${s.email}`}
                          onClick={(e) => { if (!confirm(`Remove ${s.email} from the newsletter?`)) e.preventDefault(); }}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </form>
                    </span>
                  </li>
                ))}
              </ul>
              {subscribers.length > 25 && (
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="w-full px-6 py-3 text-sm text-gray-500 hover:text-gray-800 border-t border-gray-50"
                >
                  {showAll ? "Show fewer" : `Show all ${subscribers.length}`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
