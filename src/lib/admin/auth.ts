import "server-only";

import { redirect } from "next/navigation";

import { adminDemo, adminEmails, authConfigured } from "@/lib/supabase/env";
import { getAuthClient } from "@/lib/supabase/server";

export type AdminUser = { email: string; demo: boolean };

/** Current admin, or null. Only e-mails listed in ADMIN_EMAILS count as admins. */
export async function getAdmin(): Promise<AdminUser | null> {
  if (adminDemo) return { email: "demonstração", demo: true };
  if (!authConfigured) return null;
  const supabase = await getAuthClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email || !adminEmails().includes(email)) return null;
  return { email, demo: false };
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
