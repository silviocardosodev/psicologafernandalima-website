/**
 * Supabase settings for the site panel (analytics + leads). Everything is optional:
 * without these env vars the site keeps working, tracking is a no-op and /admin
 * shows the setup steps.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Auth (login) works with the public URL + anon key. */
export const authConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Local preview of the panel with sample data (no database, no login).
 * Never active in production builds.
 */
export const adminDemo = process.env.NODE_ENV !== "production" && process.env.ADMIN_DEMO === "1";

/** E-mails allowed into /admin (comma-separated). Logged-in users outside the list are refused. */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
