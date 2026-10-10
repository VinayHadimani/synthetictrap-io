import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { sendTelegramAlert, formatBreachAlert, formatDuration } from "@/lib/telegram";
import { geolocateIp } from "@/lib/geo";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "nodejs";
export const maxDuration = 15;

interface TrapBody {
  persona_id?: string;
  trigger_type?: string;
  source_url?: string;
  amount?: string;
  item?: string;
}

/** The shape we return to the "attacker" — mimics a real payment API. */
function fakeSuccessResponse(amount: string, txnId?: string) {
  return NextResponse.json({
    ok: true,
    transaction_id: txnId || randomUUID(),
    status: "success",
    amount,
    message: "Payment authorized",
  });
}

/**
 * THE trap endpoint. Called when an attacker uses a synthetic persona
 * (e.g., enters a honeypot card on a checkout page).
 *
 * Always returns 200 — even on internal errors — so attackers cannot
 * fingerprint this endpoint.
 */
export async function POST(req: NextRequest) {
  // Parse body defensively — a malformed body should NOT break the trap.
  let body: TrapBody = {};
  try {
    body = (await req.json()) as TrapBody;
  } catch {
    body = {};
  }

  const amount = body.amount || "$0.00";

  try {
    // ---- Extract attacker metadata from headers ----
    const fwd = req.headers.get("x-forwarded-for");
    const sourceIp =
      (fwd ? fwd.split(",")[0].trim() : null) ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";
    const triggerType = body.trigger_type || "payment";
    const triggerUrl = body.source_url || "unknown";

    // ---- Look up persona (admin client, bypasses RLS) ----
    const supabase = createAdminClient();

    let persona: {
      id: string;
      name: string;
      email: string;
      created_at: string;
    } | null = null;

    if (body.persona_id) {
      const { data, error } = await supabase
        .from("personas")
        .select("id, name, email, created_at")
        .eq("id", body.persona_id)
        .maybeSingle();

      if (!error && data) {
        persona = data;
      }
    }

    // ---- Persona not found → fake success, no event logged ----
    // (We do NOT log this because it might be an attacker probing IDs.)
    if (!persona) {
      return fakeSuccessResponse(amount);
    }

    // ---- Geolocate (best-effort — returns null on failure, never throws) ----
    const location = await geolocateIp(sourceIp);

    // ---- Compute detection latency ----
    const occurredAt = new Date();
    const createdAt = new Date(persona.created_at);
    const detectedWithinMs = Math.max(
      0,
      occurredAt.getTime() - createdAt.getTime()
    );

    // ---- Insert breach event (critical path — dashboard reads this) ----
    const { data: insertedEvent, error: insertErr } = await supabase
      .from("breach_events")
      .insert({
        persona_id: persona.id,
        source_ip: sourceIp,
        user_agent: userAgent,
        trigger_type: triggerType,
        trigger_url: triggerUrl,
        attacker_location: location,
        occurred_at: occurredAt.toISOString(),
        payload: body as Record<string, unknown>,
        detected_within_ms: detectedWithinMs,
      })
      .select("id")
      .maybeSingle();

    if (insertErr) {
      console.error("[trap] breach_events insert failed:", insertErr.message);
    }

    // ---- Fire Telegram alert (fire-and-forget; MUST NOT block response) ----
    // sendTelegramAlert already has an internal 5s timeout and swallows errors.
    // We deliberately do NOT await — the phone-buzz is a side effect, not a
    // dependency. If Telegram is down, the dashboard still updates via Realtime.
    void sendTelegramAlert(
      formatBreachAlert({
        personaName: persona.name,
        personaEmail: persona.email,
        triggerType,
        sourceIp,
        location: location || undefined,
        occurredAt: occurredAt.toISOString(),
        timeToDetect: formatDuration(detectedWithinMs),
      })
    ).catch((e) => console.error("[trap] telegram alert error:", e));

    // ---- Return fake success to attacker ----
    return fakeSuccessResponse(amount, insertedEvent?.id);
  } catch (e) {
    // Absolute last resort — the trap must NEVER error visibly.
    console.error("[trap] unexpected error:", e);
    return fakeSuccessResponse(amount);
  }
}
