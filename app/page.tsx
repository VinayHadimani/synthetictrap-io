import Link from "next/link";
import {
  ArrowRight,
  Bug,
  ShieldOff,
  Clock,
  Zap,
  AlertCircle,
  Radio,
  Database,
  Fingerprint,
} from "lucide-react";
import { Logo } from "@/components/Logo";

// ---------------------------------------------------------------------------
// Cream Island landing page
// Palette: cream bg, ink text, ONE violet device mockup, coral-soft highlight.
// ---------------------------------------------------------------------------

export default function Home() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* ===================== NAVBAR ===================== */}
      <nav className="sticky top-0 z-40 bg-cream/80 backdrop-blur border-b border-ink/5">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo variant="cream" size={28} />
            <span className="font-bold tracking-tight text-[15px]">
              SyntheticTrap
            </span>
            <span className="ml-1 rounded-full border border-ink/10 px-2 py-0.5 text-[10px] font-medium text-ink/60">
              v1.0
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link
              href="/dashboard"
              className="text-ink/60 hover:text-ink transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/trap"
              className="text-ink/60 hover:text-ink transition-colors"
            >
              Marketplace
            </Link>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-cream-surface px-4 py-2 text-sm font-medium text-ink hover:bg-white transition-colors"
          >
            Try the demo
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* ===================== HERO ===================== */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream-surface px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-ink/60 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-coral animate-pulse" />
          Inverting cybersecurity
        </div>

        <h1
          className="font-bold text-ink"
          style={{
            fontSize: "clamp(40px, 8vw, 96px)",
            lineHeight: 1,
            letterSpacing: "-0.025em",
          }}
        >
          Don&apos;t prevent breaches.
          <br />
          Catch them in{" "}
          <span className="inline-block bg-coral-soft px-3 -mx-1 rounded-sm">
            seconds
          </span>
          .
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-ink/70">
          Industry average breach detection time:{" "}
          <span className="font-semibold text-ink">197 days</span>. Average cost:{" "}
          <span className="font-semibold text-ink">$4.45M</span>. We don&apos;t
          prevent breaches — we assume they happen, seed your database with
          AI-generated honeypot records, and catch the moment attackers touch
          one.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-deep text-cream px-6 h-12 text-sm font-semibold hover:bg-black transition-colors w-full sm:w-auto"
          >
            View live dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/trap"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cream-surface border border-ink/10 text-ink px-6 h-12 text-sm font-semibold hover:bg-white transition-colors w-full sm:w-auto"
          >
            See the attacker view
          </Link>
        </div>

        <p className="mt-6 text-xs text-ink/40">
          Built entirely on free-tier infrastructure · Next.js · Supabase ·
          Gemini · Telegram
        </p>
      </section>

      {/* ===================== DEVICE MOCKUP (the ONE violet surface) ===================== */}
      <section className="relative mt-8 md:mt-14">
        {/* soft coral-soft radial glow BEHIND the mockup */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[600px] -z-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, rgba(245, 208, 254, 0.55), rgba(245, 208, 254, 0) 60%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-6">
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, #301860 0%, #4830A8 55%, #301860 100%)",
              boxShadow:
                "0 20px 25px -5px rgba(28,25,23,0.25), 0 8px 10px -6px rgba(28,25,23,0.25)",
            }}
          >
            {/* top dark glaze */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-40"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0) 100%)",
              }}
            />

            {/* glass status pill */}
            <div className="relative flex justify-center pt-6">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white/90"
                style={{ backdropFilter: "blur(20px) saturate(1.15)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                BREACH DETECTED
              </div>
            </div>

            {/* fake dashboard content */}
            <div className="relative px-8 md:px-14 pt-8 pb-16 md:pb-24">
              <div className="text-center text-white/60 text-xs tracking-widest uppercase mb-6 font-mono">
                SyntheticTrap · Operations
              </div>

              <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
                <MockStat value="1,000" label="Records" />
                <MockStat value="50" label="Honeypots" />
                <MockStat value="1" label="Breach" accent />
              </div>

              <div className="mt-10 md:mt-14 text-center">
                <div className="font-mono text-white/50 text-[11px] uppercase tracking-[0.2em] mb-3">
                  Time to detect
                </div>
                <div
                  className="font-bold text-white"
                  style={{
                    fontSize: "clamp(48px, 9vw, 110px)",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  <span className="text-white/30 line-through decoration-white/40 decoration-2 mr-4">
                    197d
                  </span>
                  <span className="text-[#B8F5D0]">4s</span>
                </div>
                <div className="mt-3 text-white/50 text-xs md:text-sm">
                  A ~4,000,000× improvement on the metric that matters
                </div>
              </div>

              <div className="mt-10 md:mt-14 flex flex-wrap items-center justify-center gap-2">
                <Chip>source ip · 103.21.44.17</Chip>
                <Chip>mumbai, india</Chip>
                <Chip>payment</Chip>
                <Chip>persona · rakesh k.</Chip>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURE GRID (flat, no chrome) ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-28">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-ink/40 mb-3">
            How it works
          </div>
          <h2 className="text-3xl md:text-[40px] font-bold tracking-tight leading-tight">
            Detection loses the arms race.
            <br />
            So we stopped playing it.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          <Feature
            icon={<Bug className="h-6 w-6" />}
            title="AI personas"
            sub="LLM-generated, indistinguishable from real"
          />
          <Feature
            icon={<Database className="h-6 w-6" />}
            title="Seeded at 5%"
            sub="Injected directly into your customer DB"
          />
          <Feature
            icon={<Fingerprint className="h-6 w-6" />}
            title="Luhn-valid cards"
            sub="Pass every client-side validator"
          />
          <Feature
            icon={<Radio className="h-6 w-6" />}
            title="Trap webhooks"
            sub="Emails and cards route to us"
          />
          <Feature
            icon={<AlertCircle className="h-6 w-6" />}
            title="Instant alerts"
            sub="Telegram + dashboard, sub-5s"
          />
          <Feature
            icon={<Clock className="h-6 w-6" />}
            title="Time-to-detect"
            sub="Recorded to the millisecond"
          />
          <Feature
            icon={<Zap className="h-6 w-6" />}
            title="Real-time"
            sub="Live breach feed via WebSocket"
          />
          <Feature
            icon={<ShieldOff className="h-6 w-6" />}
            title="Assume breached"
            sub="Zero-prevention philosophy"
          />
        </div>
      </section>

      {/* ===================== REPEAT CTA ===================== */}
      <section className="mx-auto max-w-4xl px-6 pb-24 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
          The average company finds out
          <br />
          197 days <span className="text-ink/40">too late.</span>
        </h2>
        <p className="mt-6 text-ink/60 max-w-xl mx-auto">
          Open the dashboard and watch a live breach land in under five seconds.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-deep text-cream px-7 h-12 text-sm font-semibold hover:bg-black transition-colors"
          >
            View live dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="relative overflow-hidden border-t border-ink/5">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-ink/60 hover:text-ink transition-colors">
              Dashboard
            </Link>
            <Link href="/trap" className="text-ink/60 hover:text-ink transition-colors">
              Marketplace
            </Link>
            <Link href="/api/health" className="text-ink/60 hover:text-ink transition-colors">
              Health
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <SocialIcon href="https://github.com" label="GitHub">
              <Github className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://twitter.com" label="Twitter">
              <Twitter className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://linkedin.com" label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </SocialIcon>
          </div>
        </div>

        {/* Giant low-contrast wordmark as signature */}
        <div
          aria-hidden
          className="select-none pointer-events-none text-center leading-none font-bold tracking-tighter whitespace-nowrap"
          style={{
            fontSize: "clamp(80px, 18vw, 260px)",
            color: "rgba(41, 37, 36, 0.05)",
            marginBottom: "-0.15em",
          }}
        >
          SYNTHETICTRAP
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components (kept local to page.tsx on purpose — this is the only page
// that uses them; extracting to /components would add files with no reuse.)
// ---------------------------------------------------------------------------

function MockStat({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`font-bold tracking-tight ${
          accent ? "text-[#FFB4A8]" : "text-white"
        }`}
        style={{ fontSize: "clamp(28px, 4vw, 44px)", lineHeight: 1 }}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] md:text-xs uppercase tracking-widest text-white/50">
        {label}
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-full border border-white/20 px-3 py-1 text-[10px] md:text-[11px] text-white/80 font-mono"
      style={{ backdropFilter: "blur(20px) saturate(1.15)" }}
    >
      {children}
    </span>
  );
}

function Feature({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-ink mb-4">{icon}</div>
      <div className="text-sm font-semibold text-ink">{title}</div>
      <div className="mt-1 text-xs text-ink/50 leading-snug max-w-[180px]">
        {sub}
      </div>
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink/10 bg-cream-surface text-ink/70 hover:bg-white hover:text-ink transition-colors"
    >
      {children}
    </a>
  );
}

function Github(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function Twitter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
