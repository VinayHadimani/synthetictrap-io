"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  ShoppingCart,
  Skull,
} from "lucide-react";

interface Persona {
  id: string;
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
}

const SKETCHY_ITEMS = [
  { id: 1, name: "iPhone 15 Pro Max (sealed)", price: "$899", emoji: "📱" },
  { id: 2, name: "Rolex Submariner (used)", price: "$5,200", emoji: "⌚" },
  { id: 3, name: "Sony A7 IV Camera Body", price: "$1,400", emoji: "📷" },
  { id: 4, name: "Bitcoin Hardware Wallet (preloaded)", price: "$2,800", emoji: "💼" },
  { id: 5, name: 'MacBook Pro 16" M3 Max', price: "$3,499", emoji: "💻" },
];

export default function TrapPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selected, setSelected] = useState<Persona | null>(null);
  const [item, setItem] = useState(SKETCHY_ITEMS[0]);
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [txnId, setTxnId] = useState("");

  useEffect(() => {
    fetch("/api/personas", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const list: Persona[] = data.personas ?? [];
        setPersonas(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch((e) => console.error("[trap-page] personas load failed:", e));
  }, []);

  async function attemptTransaction() {
    if (!selected || status === "processing") return;
    setStatus("processing");

    try {
      const res = await fetch("/api/trap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona_id: selected.id,
          trigger_type: "payment",
          source_url: "darknet-marketplace.onion/checkout",
          amount: item.price,
          item: item.name,
        }),
      });
      const data = await res.json();
      setTxnId(data.transaction_id || "");
    } catch (e) {
      console.error("[trap-page] transaction failed:", e);
      setTxnId("");
    }

    setTimeout(() => setStatus("success"), 1800);
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b border-ink/8 bg-cream/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15">
              <Skull className="h-5 w-5 text-red-600" />
            </span>
            <div>
              <h1 className="text-lg font-bold tracking-tight font-mono">
                D4RKNET_MARKETPLACE.onion
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-ink/40 font-mono">
                Tor hidden service · no logs · encrypted
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/60 hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-3.5 w-3.5 text-amber-600" />
            <p className="text-[11px] uppercase tracking-wider text-amber-700 font-mono font-semibold">
              System message
            </p>
          </div>
          <p className="text-sm text-ink">
            New drop: <span className="font-mono font-semibold">{personas.length}</span>{" "}
            customer records from{" "}
            <span className="font-mono text-red-600 font-semibold">
              synthetic-trap.app
            </span>{" "}
            database
          </p>
          <p className="text-xs text-ink/50 mt-1">
            Cards verified Luhn-valid · Emails confirmed · Fresh data, never
            sold before
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-[11px] uppercase tracking-wider text-ink/50 mb-3 font-mono">
              Stolen credentials — {personas.length} records
            </h2>

            {personas.length === 0 ? (
              <div className="rounded-xl border border-ink/8 bg-white p-8 text-center">
                <p className="text-sm text-ink/60">
                  No records for sale right now.
                </p>
                <p className="text-xs text-ink/40 mt-1">
                  Check back after the next drop.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
                {personas.map((p) => {
                  const isSelected = selected?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelected(p)}
                      className={`w-full text-left p-4 rounded-xl border transition-colors ${
                        isSelected
                          ? "border-red-500 bg-red-50"
                          : "border-ink/8 bg-white hover:border-ink/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-ink">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-ink/40 font-mono">
                          {p.city}, {p.state}
                        </span>
                      </div>
                      <div className="mt-1.5 text-xs text-ink/60 font-mono">
                        {p.card_number.slice(0, 4)} •••• ••••{" "}
                        {p.card_number.slice(-4)} · {p.card_expiry} · CVV:{" "}
                        {p.card_cvv}
                      </div>
                      <div className="mt-0.5 text-[10px] text-ink/30 font-mono truncate">
                        {p.email}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-[11px] uppercase tracking-wider text-ink/50 mb-3 font-mono">
              Checkout
            </h2>

            <div className="rounded-xl border border-ink/8 bg-white p-5 space-y-5">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-ink/50 font-mono">
                  Item to purchase
                </label>
                <select
                  value={item.id}
                  onChange={(e) =>
                    setItem(
                      SKETCHY_ITEMS.find(
                        (i) => i.id === Number(e.target.value)
                      ) ?? SKETCHY_ITEMS[0]
                    )
                  }
                  className="mt-1.5 w-full rounded-lg border border-ink/10 bg-cream-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/30"
                >
                  {SKETCHY_ITEMS.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.emoji} {i.name} — {i.price}
                    </option>
                  ))}
                </select>
              </div>

              {selected ? (
                <div className="text-xs space-y-1 border-t border-ink/8 pt-4">
                  <p className="text-[10px] uppercase tracking-wider text-ink/50 font-mono">
                    Paying with
                  </p>
                  <p className="text-ink font-semibold">{selected.name}</p>
                  <p className="text-ink/60 font-mono">
                    {selected.card_number.slice(0, 4)} •••• ••••{" "}
                    {selected.card_number.slice(-4)}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-ink/40 border-t border-ink/8 pt-4">
                  Select a stolen card from the list →
                </p>
              )}

              <button
                type="button"
                disabled={!selected || status === "processing"}
                onClick={attemptTransaction}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm transition-colors"
              >
                {status === "processing" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    PROCESSING…
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    BUY NOW · {item.price}
                  </>
                )}
              </button>

              {status === "success" && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-50 p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <p className="text-sm text-emerald-700 font-semibold">
                      Transaction successful
                    </p>
                  </div>
                  <p className="text-[10px] text-ink/50 mt-1.5 font-mono">
                    TXN ID: {txnId.slice(0, 18)}…
                  </p>
                  <p className="text-[10px] text-ink/50 mt-2">
                    Order will be shipped to fraudulent address within 24h.
                    Thanks for using D4RKNET.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 text-[10px] text-ink/40 font-mono space-y-0.5">
              <p>&gt; All transactions final</p>
              <p>&gt; No refunds, no support</p>
              <p>&gt; Use Monero or Bitcoin only</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
