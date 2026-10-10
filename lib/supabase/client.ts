"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 * Uses the anon key. RLS policies allow SELECT on personas/customers/breach_events
 * and NOTHING ELSE. Used by the dashboard for realtime subscriptions.
 *
 * Do NOT use this client to write to personas or breach_events — those writes
 * require the service_role key (see lib/supabase/server.ts).
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createBrowserClient(url, anonKey);
}
