"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { deleteLead, setLeadStatus, type LeadStatus } from "@/lib/admin/data";
import { adminDemo, adminEmails, authConfigured } from "@/lib/supabase/env";
import { getAuthClient } from "@/lib/supabase/server";

export type LoginState = { error?: string };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  if (adminDemo) redirect("/admin");
  if (!authConfigured) return { error: "O login ainda não foi configurado (veja docs/ADMIN.md)." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Preencha e-mail e senha." };

  const supabase = await getAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "E-mail ou senha incorretos." };
  if (!adminEmails().includes(email)) {
    await supabase.auth.signOut();
    return { error: "Este e-mail não tem acesso ao painel." };
  }
  redirect("/admin");
}

export async function logout() {
  if (!adminDemo && authConfigured) {
    const supabase = await getAuthClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

const STATUSES = new Set<LeadStatus>(["novo", "contatado", "arquivado"]);

export async function updateLeadStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as LeadStatus;
  if (!id || !STATUSES.has(status)) return;
  await setLeadStatus(id, status);
  revalidatePath("/admin/contatos");
  revalidatePath("/admin");
}

export async function removeLead(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteLead(id);
  revalidatePath("/admin/contatos");
  revalidatePath("/admin");
}
