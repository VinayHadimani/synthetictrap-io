import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Diagnostic endpoint. Reports which env vars are configured (as booleans,
 * never values) and whether the admin Supabase client can reach the DB.
 * Also returns current table counts so we can spot an unseeded database.
 */
export async function GET() {
  const envFlags = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: !!process.env.TELEGRAM_CHAT_ID,
  };

  try {
    const supabase = createAdminClient();
    const [personas, customers, breaches] = await Promise.all([
      supabase.from("personas").select("*", { count: "exact", head: true }),
      supabase.from("customers").select("*", { count: "exact", head: true }),
      supabase.from("breach_events").select("*", { count: "exact", head: true }),
    ]);

    const dbError = personas.error || customers.error || breaches.error;

    return NextResponse.json({
      ok: !dbError,
      service: "synthetictrap",
      timestamp: new Date().toISOString(),
      env: envFlags,
      db: dbError
        ? { connected: false, error: dbError.message }
        : {
            connected: true,
            counts: {
              personas: personas.count ?? 0,
              customers: customers.count ?? 0,
              breaches: breaches.count ?? 0,
            },
          },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { ok: false, service: "synthetictrap", error: msg, env: envFlags },
      { status: 500 }
    );
  }
}
