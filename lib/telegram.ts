/**
 * Telegram alert delivery. Optional at runtime — if TELEGRAM_BOT_TOKEN or
 * TELEGRAM_CHAT_ID are blank, every function here degrades to a no-op + a
 * console.warn. The trap pipeline never blocks on Telegram.
 */

const TIMEOUT_MS = 5000;

function getConfig(): { token: string; chatId: string } | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return null;
  return { token, chatId };
}

export async function sendTelegramAlert(message: string): Promise<boolean> {
  const cfg = getConfig();
  if (!cfg) {
    console.warn("[telegram] disabled (missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID)");
    return false;
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${cfg.token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: cfg.chatId,
          text: message,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      }
    );
    if (!res.ok) {
      console.error("[telegram] send failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[telegram] error:", e);
    return false;
  }
}

export interface BreachAlertInput {
  personaName: string;
  personaEmail: string;
  triggerType: string;
  sourceIp: string;
  location?: { city?: string; country?: string };
  occurredAt: string;
  timeToDetect: string;
}

export function formatBreachAlert(opts: BreachAlertInput): string {
  const location = opts.location
    ? `${opts.location.city ?? "?"}, ${opts.location.country ?? "?"}`
    : "Unknown";

  return [
    "🚨 *BREACH DETECTED*",
    "",
    "*Synthetic persona used:*",
    `• Name: ${opts.personaName}`,
    `• Email: ${opts.personaEmail}`,
    "",
    "*Attack details:*",
    `• Trigger: ${opts.triggerType}`,
    `• Source IP: ${opts.sourceIp}`,
    `• Location: ${location}`,
    `• Time: ${new Date(opts.occurredAt).toISOString()}`,
    "",
    `*Time to detect:* ${opts.timeToDetect}`,
    "",
    "This record was a honeypot — no real customer data was compromised.",
    "But this confirms your database has been breached. Investigate now.",
  ].join("\n");
}

export function formatDuration(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)} seconds`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)} minutes`;
  if (ms < 86_400_000) return `${Math.round(ms / 3_600_000)} hours`;
  return `${Math.round(ms / 86_400_000)} days`;
}
