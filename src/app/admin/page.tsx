import { isAdmin } from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Dashboard, { type Event } from "./Dashboard";
import LoginForm from "./LoginForm";

export default async function AdminPage() {
  if (!(await isAdmin())) return <LoginForm />;

  const { data, error } = await supabaseAdmin()
    .from("analytics_events")
    .select("*")
    .eq("site", "tlbr.io") // the table is shared with PitchX and Boulevard Construction
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) throw new Error(`Failed to load analytics: ${error.message}`);

  return <Dashboard events={(data ?? []) as Event[]} />;
}
