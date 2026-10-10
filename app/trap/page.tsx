"use client";

import { useEffect, useState } from "react";
import {
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
        if (list.length > 0 && !selected) setSelected(list[0]);
      })
      .catch((e) => console.error("[trap-page] personas load failed:", e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Fake delay so it feels like a real gateway is "processing"
    setTimeout(() => setStatus("success"), 1800);
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono scanlines">
      <header className="border-b border-green-900/50 bg-zinc-950">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skull className="h-6 w-6 text-green-500" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                D4RKNET_MARKETPLACE.onion
              </h1>
              <p className="text-[10px] text-zinc-600">
                [TOR HIDDEN SERVICE] · END-TO-END ENCRYPTED · NO LOGS
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-600">
            <Lock className="h-3 w-3" />
            <span>CONNECTION SECURE</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 border border-green-900/50 bg-zinc-950 p-4 rounded">
          <p className="text-xs text-zinc-500 mb-1">[SYSTEM MESSAGE]</p>
          <p className="text-sm text-green-400">
            &gt; NEW DROP: {personas.length} customer records from{" "}
            <span className="text-yellow-400">synthetic-trap.app</span> database
          </p>
          <p className="text-xs text-zinc-600 mt-1">
            &gt; Cards verified Luhn-valid · Emails confirmed · Fresh data,
            never sold before
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xs uppercase text-zinc-500 mb-3">
              [STOLEN CREDENTIALS — {personas.length} RECORDS]
            </h2>
            {personas.length === 0 ? (
              <div className="border border-zinc-800 bg-zinc-950 p-6 rounded text-center">
                <p className="text-xs text-zinc-600">
                  No records for sale right now. Check back after the next drop.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {personas.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selected?.id === p.id
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-800 bg-zinc-950 hover:border-green-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-400">{p.name}</span>
                      <span className="text-[10px] text-zinc-600">
                        {p.city}, {p.state}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {p.card_number.slice(0, 4)} •••• ••••{" "}
                      {p.card_number.slice(-4)} · {p.card_expiry} · CVV:{" "}
                      {p.card_cvv}
                    </div>
                    <div className="mt-0.5 text-[10px] text-zinc-700 truncate">
                      {p.email}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xs uppercase text-zinc-500 mb-3">[CHECKOUT]</h2>
            <div className="border border-zinc-800 bg-zinc-950 p-4 rounded space-y-4">
              <div>
                <label className="text-[10px] uppercase text-zinc-600">
                  Item to purchase
                </label>
                <select
                  value={item.id}
                  onChange={(e) =>
                    setItem(
                      SKETCHY_ITEMS.find((i) => i.id === Number(e.target.value)) ??
                        SKETCHY_ITEMS[0]
                    )
                  }
                  className="mt-1 w-full bg-black border border-zinc-800 px-2 py-2 text-sm text-green-400 outline-none focus:border-green-500"
                >
                  {SKETCHY_ITEMS.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.emoji} {i.name} — {i.price}
                    </option>
                  ))}
                </select>
              </div>

              {selected ? (
                <div className="text-xs space-y-1 border-t border-zinc-800 pt-3">
                  <p className="text-zinc-600">PAYING WITH:</p>
                  <p className="text-green-400">{selected.name}</p>
                  <p className="text-zinc-500">
                    {selected.card_number.slice(0, 4)} •••• ••••{" "}
                    {selected.card_number.slice(-4)}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-zinc-700 border-t border-zinc-800 pt-3">
                  Select a stolen card from the list →
                </p>
              )}

              <button
                type="button"
                disabled={!selected || status === "processing"}
                onClick={attemptTransaction}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-bold py-2.5 rounded text-sm transition-colors"
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
                <div className="border border-green-500/50 bg-green-500/10 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <p className="text-sm text-green-400 font-bold">
                      TRANSACTION SUCCESSFUL
                    </p>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    TXN ID: {txnId.slice(0, 18)}…
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-2">
                    Order will be shipped to fraudulent address within 24h.
                    Thanks for using D4RKNET.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 text-[10px] text-zinc-700 space-y-0.5">
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
