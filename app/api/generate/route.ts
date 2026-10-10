import { NextRequest, NextResponse } from "next/server";
import { generatePersonas } from "@/lib/persona-generator";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Generate N synthetic personas via Gemini and insert them.
 *
 * POST body: { count?: number }  (default 5, capped at 50)
 * Returns:   { ok, requested, generated, inserted, personas: [...] }
 *
 * NOTE: 50 personas takes ~50s because of the 5s rate-limit pause between
 * batches of 5. This is why maxDuration is set to 300s.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { count?: number };
    const requested = Math.min(Math.max(Number(body.count) || 5, 1), 50);

    const personas = await generatePersonas(requested);
    if (personas.length === 0) {
      return NextResponse.json(
        { error: "Gemini returned zero valid personas" },
        { status: 500 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.from("personas").insert(personas).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      requested,
      generated: personas.length,
      inserted: data?.length ?? 0,
      personas: data ?? [],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
