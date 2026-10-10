import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

/**
 * Dashboard summary stats.
 *   customers   — count of "real" customer rows
 *   personas    — count of synthetic honeypot rows
 *   breaches    — count of breach_events rows
 *   avg_detect_ms / avg_detect_display — average time between persona creation
 *                                        and its triggering breach
 */
export async function GET() {
  try {
    const supabase = createAdminClient();

    const [customers, personas, breaches] = await Promise.all([
      supabase.from("customers").select("*", { count: "exact", head: true }),
      supabase.from("personas").select("*", { count: "exact", head: true }),
      supabase
        .from("breach_events")
        .select("detected_within_ms")
        .order("occurred_at", { ascending: false })
        .limit(100),
    ]);

    const err = customers.error || personas.error || breaches.error;
    if (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    const rows = breaches.data ?? [];
    const breachCount = rows.length;
    const avgMs =
      breachCount > 0
        ? Math.round(
            rows.reduce((sum, r) => sum + (r.detected_within_ms ?? 0), 0) /
              breachCount
          )
        : 0;

    const display =
      breachCount === 0
        ? "—"
        : avgMs < 60_000
        ? `${Math.round(avgMs / 1000)}s`
        : avgMs < 3_600_000
        ? `${Math.round(avgMs / 60_000)}m`
        : `${Math.round(avgMs / 3_600_000)}h`;

    return NextResponse.json({
      customers: customers.count ?? 0,
      personas: personas.count ?? 0,
      breaches: breachCount,
      avg_detect_ms: avgMs,
      avg_detect_display: display,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
