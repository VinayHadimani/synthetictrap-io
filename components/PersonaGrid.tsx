"use client";

import { Bug, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export interface PersonaRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  card_number: string;
  card_cvv: string;
  card_expiry: string;
  city: string;
  state: string;
  backstory: string;
  created_at: string;
}

function maskCard(card: string): string {
  if (!card || card.length < 8) return card;
  return `${card.slice(0, 4)} •••• •••• ${card.slice(-4)}`;
}

export function PersonaGrid({ personas }: { personas: PersonaRow[] }) {
  const [reveal, setReveal] = useState(false);

  return (
    <div className="rounded-xl border border-ink/8 bg-white overflow-hidden">
      <div className="border-b border-ink/8 bg-cream-surface px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-ink">
            Synthetic Honeypots ({personas.length})
          </h3>
        </div>
        <button
          onClick={() => setReveal(!reveal)}
          className="flex items-center gap-1 text-xs text-ink/50 hover:text-ink transition-colors"
        >
          {reveal ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {reveal ? "Hide" : "Reveal"} cards
        </button>
      </div>

      {personas.length === 0 ? (
        <div className="p-8 text-center">
          <Bug className="mx-auto h-8 w-8 text-ink/20 mb-3" />
          <p className="text-ink/60">No honeypots generated yet.</p>
          <p className="text-xs text-ink/40 mt-2">
            Run POST /api/generate to create synthetic personas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 max-h-[480px] overflow-y-auto">
          {personas.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-emerald-500/30 bg-emerald-50/50 p-3"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink text-sm">{p.name}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  <Bug className="h-2.5 w-2.5" />
                  HONEYPOT
                </span>
              </div>
              <div className="mt-2 space-y-0.5 text-xs text-ink/60 font-mono">
                <p className="truncate">{p.email}</p>
                <p>{p.phone}</p>
                <p className={reveal ? "" : "blur-sm select-none"}>
                  {maskCard(p.card_number)} · CVV: {p.card_cvv} · {p.card_expiry}
                </p>
                <p className="text-ink/40">
                  {p.city}, {p.state}
                </p>
              </div>
              <p className="mt-2 text-[11px] italic text-ink/50 line-clamp-2">
                {p.backstory}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
