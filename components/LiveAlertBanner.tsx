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
  const speedup =
    ms > 0 ? Math.round((197 * 86_400 * 1000) / ms).toLocaleString() : "—";

  const handleClose = () => {
    setVisible(false);
    setTimeout(onDismiss, FADE_MS);
  };

  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-ink/85 backdrop-blur-sm transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border-4 border-red-500 bg-cream p-8"
        style={{
          boxShadow:
            "0 0 0 1px rgba(239,68,68,0.3), 0 20px 60px rgba(239,68,68,0.4)",
        }}
      >
        <button
          onClick={handleClose}
          aria-label="Dismiss alert"
          className="absolute right-4 top-4 text-ink/40 hover:text-ink transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-red-600 tracking-tight">
              BREACH DETECTED
            </h2>
            <p className="text-sm text-ink/60">
              Synthetic persona triggered — database compromised
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Field label="PERSONA" value={event.personas?.name || "Unknown"} mono />
          <Field
            label="EMAIL"
            value={event.personas?.email || "Unknown"}
            mono
            truncate
          />
          <Field label="SOURCE IP" value={event.source_ip} mono />
          <Field
            label="LOCATION"
            value={
              event.attacker_location
                ? `${event.attacker_location.city || "?"}, ${event.attacker_location.country || "?"}`
                : "Unknown"
            }
            mono
          />
          <Field label="TRIGGER" value={event.trigger_type.toUpperCase()} mono />
          <div>
            <p className="text-[11px] uppercase tracking-wider text-ink/50 font-mono">
              TIME TO DETECT
            </p>
            <p className="font-mono text-sm font-bold text-emerald-600">
              {secs}s
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-red-50 border border-red-500/20 p-3 text-center">
          <p className="text-sm text-red-700">
            Industry average: <span className="font-bold">197 days</span>
            {" · "}
            SyntheticTrap: <span className="font-bold text-emerald-600">{secs}s</span>
            {" · "}
            Improvement: <span className="font-bold text-emerald-600">{speedup}x</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
  truncate = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  truncate?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-ink/50 font-mono">
        {label}
      </p>
      <p
        className={`text-sm text-ink ${mono ? "font-mono" : ""} ${
          truncate ? "truncate" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
