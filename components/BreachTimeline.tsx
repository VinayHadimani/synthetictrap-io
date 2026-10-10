"use client";

import { Activity, MapPin, Clock } from "lucide-react";

export interface BreachRow {
  id: string;
  persona_id: string;
  source_ip: string;
  trigger_type: string;
  trigger_url: string;
  occurred_at: string;
  attacker_location: { city?: string; country?: string } | null;
  detected_within_ms: number;
  personas?: { name: string; email: string; city: string } | null;
}

function formatLatency(ms: number): string {
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  return `${Math.round(ms / 3_600_000)}h`;
}

export function BreachTimeline({ events }: { events: BreachRow[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
        <Activity className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
        <p className="text-zinc-500">No breaches detected yet.</p>
        <p className="text-xs text-zinc-600 mt-2">
          Trigger a breach from the marketplace to see live alerts here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <div className="border-b border-zinc-800 bg-zinc-900/80 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-semibold text-zinc-200">Breach Timeline</h3>
        </div>
        <span className="text-xs text-zinc-500">{events.length} events</span>
      </div>

      <div className="divide-y divide-zinc-800/50 max-h-[480px] overflow-y-auto">
        {events.map((e) => (
          <div
            key={e.id}
            className="px-5 py-4 hover:bg-zinc-900/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="font-mono text-sm font-medium text-white truncate">
                    {e.personas?.name || "Unknown persona"}
                  </p>
                  <span className="text-xs text-zinc-600">·</span>
                  <span className="text-xs text-zinc-500 font-mono uppercase">
                    {e.trigger_type}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-4 text-xs text-zinc-500 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {e.attacker_location
                      ? `${e.attacker_location.city || "?"}, ${e.attacker_location.country || "?"}`
                      : e.source_ip}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(e.occurred_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-zinc-500">detected in</p>
                <p className="font-mono text-sm font-bold text-emerald-400">
                  {formatLatency(e.detected_within_ms || 0)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
