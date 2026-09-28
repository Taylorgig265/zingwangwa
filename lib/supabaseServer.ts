import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/** Server Components / Route Handlers client — reads the user's auth cookie session. */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  const cookieStore = cookies();
  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — safe to ignore (middleware refreshes sessions).
        }
      },
    },
  });
}

/**
 * Service-role client — bypasses RLS. SERVER ONLY (Stripe webhook, admin writes).
 * Never import from a Client Component.
 */
export function getSupabaseServiceClient(): SupabaseClient {
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
