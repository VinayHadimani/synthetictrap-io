/**
 * Best-effort IP geolocation via ipapi.co (free tier: 1000 req/day).
 * Never throws. Returns null for localhost / unknown / on any error.
 * The trap pipeline must not depend on this succeeding.
 */

const TIMEOUT_MS = 3000;

export interface GeoLocation {
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
}

const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

function isPrivateOrLocal(ip: string): boolean {
  if (!ip) return true;
  if (ip === "unknown") return true;
  return PRIVATE_IP_PATTERNS.some((re) => re.test(ip));
}

export async function geolocateIp(ip: string): Promise<GeoLocation | null> {
  if (isPrivateOrLocal(ip)) return null;

  try {
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "User-Agent": "SyntheticTrap/1.0" },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as Record<string, unknown>;
    if (data.error === true) return null;

    return {
      city: typeof data.city === "string" ? data.city : undefined,
      region: typeof data.region === "string" ? data.region : undefined,
      country: typeof data.country_name === "string" ? data.country_name : undefined,
      country_code: typeof data.country_code === "string" ? data.country_code : undefined,
    };
  } catch {
    return null;
  }
}
