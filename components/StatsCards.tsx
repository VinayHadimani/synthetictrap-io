"use client";

import { Users, ShieldAlert, Bug, Clock } from "lucide-react";

export interface StatsShape {
  customers: number;
  personas: number;
  breaches: number;
  avg_detect_display: string;
}

interface Props {
  stats: StatsShape;
}

export function StatsCards({ stats }: Props) {
  const cards = [
    {
      label: "Total Records",
      value: stats.customers.toLocaleString(),
      sub: "in customer database",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Honeypots",
      value: stats.personas.toLocaleString(),
      sub: "AI-generated synthetic records",
      icon: Bug,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Breaches Detected",
      value: stats.breaches.toLocaleString(),
      sub: "via synthetic personas",
      icon: ShieldAlert,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      label: "Avg Time-to-Detect",
      value: stats.avg_detect_display || "—",
      sub: "industry avg: 197 days",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${c.bg}`}>
                <Icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <div className="text-2xl font-bold text-white">{c.value}</div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium text-zinc-200">{c.label}</p>
              <p className="text-xs text-zinc-500">{c.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
