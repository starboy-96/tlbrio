import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAllPosts } from "@/lib/blog";

export type Subscriber = { email: string; createdAt: string | null };

export type DeliveryCounts = {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  failed: number;
};

export type Issue = DeliveryCounts & {
  subject: string;
  slug: string | null;
  sentAt: string;
};

export type NewsletterStats = {
  subscribers: Subscriber[];
  subscribersError?: string;
  issues: Issue[];
  welcome: DeliveryCounts;
  emailsError?: string;
  emailsTruncated: boolean;
};

const WELCOME_SUBJECT = "Your slides are about to get a lot better";
const EDITOR_SUBJECT_PREFIX = "LinkedIn post ready";
const MAX_PAGES = 10;

type ResendEmail = {
  id: string;
  from: string;
  to: string[];
  subject: string;
  created_at: string;
  last_event: string | null;
};

const emptyCounts = (): DeliveryCounts => ({
  sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, complained: 0, failed: 0,
});

// Resend only reports each email's latest event, so a click implies an open and a delivery.
function tally(counts: DeliveryCounts, lastEvent: string | null) {
  counts.sent += 1;
  switch (lastEvent) {
    case "clicked":
      counts.clicked += 1;
      counts.opened += 1;
      counts.delivered += 1;
      break;
    case "opened":
      counts.opened += 1;
      counts.delivered += 1;
      break;
    case "delivered":
      counts.delivered += 1;
      break;
    case "complained":
      counts.complained += 1;
      counts.delivered += 1;
      break;
    case "bounced":
      counts.bounced += 1;
      break;
    case "failed":
    case "canceled":
      counts.failed += 1;
      break;
  }
}

async function loadSubscribers(): Promise<{ subscribers: Subscriber[]; error?: string }> {
  const { data, error } = await supabaseAdmin().from("newsletter_subscribers").select("*");
  if (error) return { subscribers: [], error: error.message };
  const subscribers = (data ?? []).map((row: Record<string, unknown>) => ({
    email: String(row.email ?? ""),
    createdAt: typeof row.created_at === "string" ? row.created_at : null,
  }));
  subscribers.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  return { subscribers };
}

async function loadEmails(): Promise<{ emails: ResendEmail[]; truncated: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { emails: [], truncated: false, error: "RESEND_API_KEY is not set." };

  const emails: ResendEmail[] = [];
  let after: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const url = new URL("https://api.resend.com/emails");
    url.searchParams.set("limit", "100");
    if (after) url.searchParams.set("after", after);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const restricted = res.status === 401 || body?.name === "restricted_api_key";
      return {
        emails,
        truncated: false,
        error: restricted
          ? "The Resend API key can only send emails. Add a full-access key in Vercel to see delivery and open stats."
          : `Resend returned ${res.status}${body?.message ? `: ${body.message}` : ""}`,
      };
    }
    const body = (await res.json()) as { data?: ResendEmail[]; has_more?: boolean };
    const batch = body.data ?? [];
    emails.push(...batch);
    if (!body.has_more || batch.length === 0) return { emails, truncated: false };
    after = batch[batch.length - 1].id;
    // Resend allows two requests per second.
    await new Promise((r) => setTimeout(r, 600));
  }
  return { emails, truncated: true };
}

export type ResendEmailSummary = ResendEmail;

export function summariseEmails(emails: ResendEmail[], posts: { title: string; slug: string }[]) {
  const slugByTitle = new Map(posts.map((p) => [p.title.trim().toLowerCase(), p.slug]));
  const welcome = emptyCounts();
  const issues = new Map<string, Issue>();

  for (const email of emails) {
    if (!email.from?.includes("newsletter.tlbr.io")) continue;
    const subject = (email.subject ?? "").trim();
    if (!subject || subject.startsWith(EDITOR_SUBJECT_PREFIX)) continue;
    if (subject === WELCOME_SUBJECT) {
      tally(welcome, email.last_event);
      continue;
    }
    let issue = issues.get(subject);
    if (!issue) {
      issue = {
        ...emptyCounts(),
        subject,
        slug: slugByTitle.get(subject.toLowerCase()) ?? null,
        sentAt: email.created_at,
      };
      issues.set(subject, issue);
    }
    if (email.created_at < issue.sentAt) issue.sentAt = email.created_at;
    tally(issue, email.last_event);
  }

  return {
    welcome,
    issues: [...issues.values()].sort((a, b) => b.sentAt.localeCompare(a.sentAt)),
  };
}

export async function getNewsletterStats(): Promise<NewsletterStats> {
  const [subs, mail] = await Promise.all([loadSubscribers(), loadEmails()]);
  const { welcome, issues } = summariseEmails(mail.emails, getAllPosts());
  return {
    subscribers: subs.subscribers,
    subscribersError: subs.error,
    issues,
    welcome,
    emailsError: mail.error,
    emailsTruncated: mail.truncated,
  };
}
