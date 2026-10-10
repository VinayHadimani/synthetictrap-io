/**
 * Gemini-powered persona generation.
 *
 * Strategy:
 *   - Gemini invents the human-facing fields (name, address, backstory, etc.)
 *   - We DO NOT trust the LLM for card numbers — we generate them ourselves
 *     with lib/luhn.ts so they always pass the Luhn checksum.
 *   - Each persona gets a UUID trap_signature so it's traceable back to us.
 *
 * Rate limits (Gemini 1.5 Flash free tier): 15 requests/min, 1500/day.
 * We batch 5 concurrent requests then pause 5s between batches, which keeps
 * us well under 15 RPM.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { randomUUID } from "node:crypto";
import { generateLuhnCard, generateCVV, generateExpiry } from "./luhn";

export interface Persona {
  name: string;
  email: string;
  phone: string;
  card_number: string;
  card_cvv: string;
  card_expiry: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  date_of_birth: string;
  backstory: string;
  trap_signature: string;
  is_active: boolean;
}

const PROMPT = `You are generating a synthetic customer record for a security honeypot database.
The record must look 100% realistic to an attacker but is entirely synthetic.

Generate STRICT JSON ONLY — no markdown fences, no commentary, no preamble.

JSON shape (all fields required):
{
  "name": "realistic Indian full name, e.g. 'Aarav Mehta' or 'Priya Sharma'",
  "email": "firstname.lastname.NNN@gmail.com — NNN is a random 2-3 digit number",
  "phone": "+91 9XXXXXXXXX — Indian mobile, starts with 9, then 9 more digits",
  "address": "realistic Indian street address, e.g. 'Flat 402, Lakshmi Residency, MG Road'",
  "city": "one of: Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad, Jaipur, Lucknow, Nagpur, Indore",
  "state": "matching Indian state for the chosen city",
  "pincode": "6-digit Indian pincode that plausibly matches the city",
  "date_of_birth": "YYYY-MM-DD between 1980-01-01 and 2000-12-31",
  "backstory": "2-sentence plausible persona: job, family situation, one interest"
}

Rules:
- Output ONE JSON object only.
- Use double quotes for all keys and string values.
- No trailing commas.
- Do not wrap in an array.
- Do not prefix with "json" or any label.`;

interface RawPersona {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  date_of_birth: string;
  backstory: string;
}

function stripCodeFences(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }
  return t.trim();
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function validateRaw(raw: unknown): RawPersona {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Gemini returned a non-object");
  }
  const r = raw as Record<string, unknown>;
  const required: (keyof RawPersona)[] = [
    "name",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "pincode",
    "date_of_birth",
    "backstory",
  ];
  for (const key of required) {
    if (!isNonEmptyString(r[key])) {
      throw new Error(`Gemini response missing/empty field: ${key}`);
    }
  }
  return {
    name: (r.name as string).trim(),
    email: (r.email as string).trim(),
    phone: (r.phone as string).trim(),
    address: (r.address as string).trim(),
    city: (r.city as string).trim(),
    state: (r.state as string).trim(),
    pincode: (r.pincode as string).trim(),
    date_of_birth: (r.date_of_birth as string).trim(),
    backstory: (r.backstory as string).trim(),
  };
}

let cachedModel: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

function getModel() {
  if (cachedModel) return cachedModel;
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from .env.local");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  cachedModel = genAI.getGenerativeModel({ model: modelName });
  return cachedModel;
}

export async function generatePersona(): Promise<Persona> {
  const model = getModel();
  const result = await model.generateContent(PROMPT);
  const text = stripCodeFences(result.response.text());

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error(
      `Gemini returned non-JSON. First 200 chars: ${text.slice(0, 200)}`
    );
  }

  const raw = validateRaw(parsed);

  // CRITICAL: card fields come from us, never from the LLM.
  return {
    ...raw,
    card_number: generateLuhnCard(),
    card_cvv: generateCVV(),
    card_expiry: generateExpiry(),
    trap_signature: randomUUID(),
    is_active: true,
  };
}

/**
 * Generate N personas in batches of 5 with a 5s pause between batches.
 * Individual persona failures are logged and skipped — we return whatever
 * succeeded. Callers should check the length of the returned array.
 */
export async function generatePersonas(n: number): Promise<Persona[]> {
  const results: Persona[] = [];
  const batchSize = 5;
  const pauseMs = 5000;

  for (let i = 0; i < n; i += batchSize) {
    const thisBatch = Math.min(batchSize, n - i);
    const settled = await Promise.allSettled(
      Array.from({ length: thisBatch }, () => generatePersona())
    );

    for (const s of settled) {
      if (s.status === "fulfilled") {
        results.push(s.value);
      } else {
        console.error("[persona-gen] one persona failed:", s.reason);
      }
    }

    console.log(`[persona-gen] generated ${results.length}/${n}`);

    if (i + batchSize < n) {
      await new Promise((r) => setTimeout(r, pauseMs));
    }
  }

  return results;
}
