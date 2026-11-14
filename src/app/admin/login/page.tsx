import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { BrandMark } from "@/components/ui/BrandMark";
import { getAdmin } from "@/lib/admin/auth";
import { authConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Entrar" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <main id="conteudo" className="grid min-h-dvh place-items-center bg-tint-lilac px-5 py-12">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-[0_20px_50px_rgb(79_70_229/12%)] sm:p-8">
        <BrandMark className="w-9" />
        <h1 className="mt-5 text-2xl font-[650] tracking-[-0.025em] text-ink">Painel do site</h1>
        <p className="mt-1.5 text-[15px] text-ink-soft">Visitas, mapa de calor e contatos recebidos.</p>
        {authConfigured ? (
          <LoginForm />
        ) : (
          <p className="mt-6 rounded-2xl bg-warning-bg px-4 py-3 text-sm leading-relaxed text-warning">
            O login ainda não foi configurado. Siga o passo a passo em docs/ADMIN.md.
          </p>
        )}
        <Link href="/" className="mt-6 inline-block text-sm text-ink-muted underline-offset-4 hover:text-primary hover:underline">
          Voltar ao site
        </Link>
      </div>
    </main>
  );
}
