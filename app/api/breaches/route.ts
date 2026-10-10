import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * List breach events, newest first, with the persona details that triggered
 * each one. The FK from breach_events.persona_id -> personas.id lets PostgREST
 * embed the persona object automatically via the select string below.
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("breach_events")
      .select(
        "id, persona_id, source_ip, user_agent, trigger_type, trigger_url, attacker_location, occurred_at, payload, detected_within_ms, personas(name, email, city, card_number)"
      )
      .order("occurred_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ breaches: data ?? [] });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/** Wipe the breach_events table. Used before a fresh demo. */
export async function DELETE() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("breach_events")
      .delete()
      .not("id", "is", null);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
