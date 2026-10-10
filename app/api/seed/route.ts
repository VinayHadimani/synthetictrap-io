import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Seed 950 dummy "real" customer rows so the personas (5% of total) sit in a
 * realistic-looking 1000-record database. These customers use non-Luhn card
 * numbers on purpose — they're not the honeypots.
 *
 * POST -> insert 950 customers
 * DELETE -> wipe the customers table (fresh demo state)
 */

const FIRST_NAMES = [
  "Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Reyansh","Krishna",
  "Ishaan","Rohan","Ayaan","Kabir","Ananya","Aarohi","Saanvi","Priya",
  "Pari","Riya","Diya","Anika","Neha","Kavya","Pooja","Sneha","Meera",
];

const LAST_NAMES = [
  "Sharma","Verma","Gupta","Mehta","Patel","Reddy","Nair","Iyer",
  "Singh","Kaur","Kapoor","Chopra","Malhotra","Bose","Das","Banerjee",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone(): string {
  return "+91 9" + Math.floor(100_000_000 + Math.random() * 900_000_000).toString();
}

function randomEmail(name: string): string {
  const n = Math.floor(10 + Math.random() * 990);
  return `${name.toLowerCase().replace(/\s+/g, ".")}${n}@gmail.com`;
}

function randomNonLuhnCard(): string {
  // 16 random digits — deliberately NOT Luhn-valid (these are "real" customers)
  let card = "";
  for (let i = 0; i < 16; i++) card += Math.floor(Math.random() * 10).toString();
  return card;
}

export async function POST() {
  try {
    const supabase = createAdminClient();

    const rows = Array.from({ length: 950 }, () => {
      const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
      return {
        name,
        email: randomEmail(name),
        phone: randomPhone(),
        card_number: randomNonLuhnCard(),
      };
    });

    // Insert in 2 chunks of 475 — smaller payloads are safer than one 950-row insert.
    const chunks = [rows.slice(0, 475), rows.slice(475)];
    let inserted = 0;

    for (const chunk of chunks) {
      const { data, error } = await supabase.from("customers").insert(chunk).select("id");
      if (error) {
        return NextResponse.json(
          { error: error.message, inserted_so_far: inserted },
          { status: 500 }
        );
      }
      inserted += data?.length ?? 0;
    }

    return NextResponse.json({ ok: true, count: inserted });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("customers")
      .delete()
      .not("id", "is", null);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
