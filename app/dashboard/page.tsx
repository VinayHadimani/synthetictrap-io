"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bug, RefreshCw, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { LiveAlertBanner, type BreachEvent } from "@/components/LiveAlertBanner";
import { StatsCards, type StatsShape } from "@/components/StatsCards";
import { BreachTimeline, type BreachRow } from "@/components/BreachTimeline";
import { PersonaGrid, type PersonaRow } from "@/components/PersonaGrid";

interface Stats extends StatsShape {
  avg_detect_ms: number;
}

interface RealtimeRow {
  id: string;
  persona_id: string;
  source_ip: string;
  trigger_type: string;
  trigger_url: string;
  occurred_at: string;
  attacker_location: { city?: string; country?: string } | null;
  detected_within_ms: number;
}

export default function DashboardPage() {
  const [breaches, setBreaches] = useState<BreachRow[]>([]);
  const [personas, setPersonas] = useState<PersonaRow[]>([]);
  const [stats, setStats] = useState<Stats>({
    customers: 0,
    personas: 0,
    breaches: 0,
    avg_detect_ms: 0,
    avg_detect_display: "—",
  });
  const [liveAlert, setLiveAlert] = useState<BreachEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const personasRef = useRef<
    Map<string, { name: string; email: string; city: string }>
  >(new Map());

  const supabase = createClient();

  const loadInitial = useCallback(async () => {
    try {
      const [b, p, s] = await Promise.all([
        fetch("/api/breaches", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/personas", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/stats", { cache: "no-store" }).then((r) => r.json()),
      ]);

      const personaList: PersonaRow[] = p.personas ?? [];
      setBreaches(b.breaches ?? []);
      setPersonas(personaList);
      setStats(s as Stats);

      const map = new Map<
        string,
        { name: string; email: string; city: string }
      >();
      for (const row of personaList) {
        map.set(row.id, { name: row.name, email: row.email, city: row.city });
      }
      personasRef.current = map;
    } catch (e) {
      console.error("[dashboard] initial load failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitial();

    const channel = supabase
      .channel("dashboard-breach-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "breach_events" },
        (payload) => {
          const row = payload.new as RealtimeRow;
          const personaMeta = personasRef.current.get(row.persona_id);

          const enriched: BreachRow = { ...row, personas: personaMeta ?? null };
          setBreaches((prev) => [enriched, ...prev]);

          const alertEvent: BreachEvent = {
            id: row.id,
            persona_id: row.persona_id,
            source_ip: row.source_ip,
            trigger_type: row.trigger_type,
            occurred_at: row.occurred_at,
            attacker_location: row.attacker_location,
            detected_within_ms: row.detected_within_ms,
            personas: personaMeta ?? null,
          };
          setLiveAlert(alertEvent);

          setStats((prev) => ({ ...prev, breaches: prev.breaches + 1 }));
        }
      )
      .subscribe((status) => {
        console.log("[dashboard] realtime status:", status);
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadInitial, supabase]);

  const clearBreaches = async () => {
    await fetch("/api/breaches", { method: "DELETE" });
    setBreaches([]);
    setStats((prev) => ({
      ...prev,
      breaches: 0,
      avg_detect_display: "—",
      avg_detect_ms: 0,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream text-ink flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-ink/40" />
          <p className="mt-3 text-sm text-ink/60">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <LiveAlertBanner event={liveAlert} onDismiss={() => setLiveAlert(null)} />

      <header className="border-b border-ink/8 bg-cream/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15">
              <Bug className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">SyntheticTrap</h1>
              <p className="text-xs text-ink/50">
                Breach detection via AI honeypots
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/trap"
              target="_blank"
              className="text-xs text-ink/60 hover:text-ink underline underline-offset-4 transition-colors font-medium"
            >
              Open marketplace →
            </Link>
            <button
              onClick={clearBreaches}
              className="flex items-center gap-1 text-xs text-ink/50 hover:text-ink transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Clear breaches
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BreachTimeline events={breaches} />
          <PersonaGrid personas={personas} />
        </div>

        <div className="rounded-xl border border-ink/8 bg-white p-4">
          <p className="text-xs text-ink/50 text-center">
            Industry average breach detection time:{" "}
            <span className="font-mono text-red-600 font-semibold">197 days</span>{" "}
            · Cost per breach:{" "}
            <span className="font-mono text-red-600 font-semibold">$4.45M</span> ·
            SyntheticTrap detects in{" "}
            <span className="font-mono text-emerald-600 font-semibold">seconds</span>
          </p>
        </div>
      </main>
    </div>
  );
}
