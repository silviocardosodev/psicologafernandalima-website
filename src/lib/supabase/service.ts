import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { supabaseUrl } from "@/lib/supabase/env";

let cached: SupabaseClient | null | undefined;

/**
 * Service-role client: bypasses RLS, so it only lives on the server (route handlers,
 * server components, server actions). The key never has the NEXT_PUBLIC_ prefix.
 */
export function getServiceClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  cached = supabaseUrl && key ? createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return cached;
}
