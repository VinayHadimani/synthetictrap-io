import "server-only";
import { createServerClient } from "@supabase/ssr";

/**
 * Server-only Supabase admin client.
 * Uses the SERVICE_ROLE key — bypasses RLS. Never import this file from
 * a client component. Only use inside app/api/** /route.ts handlers.
 *
 * @supabase/ssr expects a cookies adapter; since we are not using auth
 * sessions for this app (no user login), we provide a no-op adapter.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Check .env.local and restart the dev server."
    );
  }

  return createServerClient(url, serviceKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // no-op — this app has no auth session to persist
      },
    },
  });
}
