"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";

export interface BreachEvent {
  id: string;
  persona_id: string;
  source_ip: string;
  trigger_type: string;
  occurred_at: string;
  attacker_location: { city?: string; country?: string } | null;
  detected_within_ms: number;
  personas?: { name: string; email: string; city: string } | null;
}

interface Props {
  event: BreachEvent | null;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS = 10_000;
const FADE_MS = 300;

export function LiveAlertBanner({ event, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!event) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      const t2 = setTimeout(onDismiss, FADE_MS);
      return () => clearTimeout(t2);
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [event, onDismiss]);

  if (!event) return null;

  const ms = event.detected_within_ms || 0;
  const secs = (ms / 1000).toFixed(1);
  const speedup = ms > 0
    ? Math.round((197 * 86_400 * 1000) / ms).toLocaleString()
    : "—";

  const handleClose = () => {
    setVisible(false);
    setTimeout(onDismiss, FADE_MS);
  };

  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative w-full max-w-2xl rounded-2xl border-2 border-red-500 bg-zinc-950 p-8 shadow-[0_0_60px_rgba(239,68,68,0.6)] animate-glow">
        <button
          onClick={handleClose}
          aria-label="Dismiss alert"
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 animate-pulse-slow">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-red-500">BREACH DETECTED</h2>
            <p className="text-sm text-zinc-400">
              Synthetic persona triggered — database compromised
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 font-mono text-sm">
          <div>
            <p className="text-zinc-500">PERSONA</p>
            <p className="text-white">{event.personas?.name || "Unknown"}</p>
          </div>
          <div>
            <p className="text-zinc-500">EMAIL</p>
            <p className="text-white truncate">
              {event.personas?.email || "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">SOURCE IP</p>
            <p className="text-white">{event.source_ip}</p>
          </div>
          <div>
            <p className="text-zinc-500">LOCATION</p>
            <p className="text-white">
              {event.attacker_location
                ? `${event.attacker_location.city || "?"}, ${event.attacker_location.country || "?"}`
                : "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">TRIGGER</p>
            <p className="text-white uppercase">{event.trigger_type}</p>
          </div>
          <div>
            <p className="text-zinc-500">TIME TO DETECT</p>
            <p className="text-emerald-400 font-bold">{secs}s</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-red-500/10 p-3 text-center">
          <p className="text-sm text-red-300">
            Industry average: <span className="font-bold">197 days</span>
            {" · "}
            SyntheticTrap: <span className="font-bold text-emerald-400">{secs}s</span>
            {" · "}
            Improvement: <span className="font-bold text-emerald-400">{speedup}x</span>
          </p>
        </div>
      </div>
    </div>
  );
}
