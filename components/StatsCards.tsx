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
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Honeypots",
      value: stats.personas.toLocaleString(),
      sub: "AI-generated synthetic records",
      icon: Bug,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Breaches Detected",
      value: stats.breaches.toLocaleString(),
      sub: "via synthetic personas",
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Avg Time-to-Detect",
      value: stats.avg_detect_display || "—",
      sub: "industry avg: 197 days",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="rounded-xl border border-ink/8 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${c.bg}`}>
                <Icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <div className="font-mono text-2xl font-bold text-ink">
                {c.value}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium text-ink">{c.label}</p>
              <p className="text-xs text-ink/50">{c.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
