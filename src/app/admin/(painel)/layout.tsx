import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";

import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { BrandMark } from "@/components/ui/BrandMark";
import { requireAdmin } from "@/lib/admin/auth";
import { getLeads } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const leads = await getLeads().catch(() => null);
  const newLeads = leads?.filter((l) => l.status === "novo").length ?? 0;

  return (
    <div className="min-h-dvh bg-tint-mist lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 z-30 border-b border-line-soft bg-white/90 backdrop-blur-md lg:h-dvh lg:border-r lg:border-b-0 lg:bg-white">
        <div className="flex h-full flex-col gap-3 px-4 py-3 lg:gap-8 lg:px-4 lg:py-6">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="flex items-center gap-2.5 rounded-md px-1">
              <BrandMark className="w-7" />
              <span className="flex flex-col leading-none">
                <span className="text-[15px] font-medium text-ink">Painel do site</span>
                <span className="mt-1 text-[11px] text-ink-muted">Fernanda Lima</span>
              </span>
            </Link>
            <form action={logout} className="lg:hidden">
              <button type="submit" className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-ink-soft hover:bg-tint-mist hover:text-ink">
                <LogOut aria-hidden className="size-4" />
                Sair
              </button>
            </form>
          </div>

          <AdminNav newLeads={newLeads} />

          <div className="mt-auto hidden space-y-1 border-t border-line-soft pt-4 lg:block">
            <Link href="/" target="_blank" className="flex h-9 items-center gap-2 rounded-xl px-3 text-sm text-ink-soft hover:bg-tint-mist hover:text-ink">
              <ArrowUpRight aria-hidden className="size-4" />
              Ver o site
            </Link>
            <form action={logout}>
              <button type="submit" className="flex h-9 w-full items-center gap-2 rounded-xl px-3 text-sm text-ink-soft hover:bg-tint-mist hover:text-ink">
                <LogOut aria-hidden className="size-4" />
                Sair
              </button>
            </form>
            <p className="truncate px-3 pt-2 text-xs text-ink-muted" title={admin.email}>
              {admin.email}
            </p>
          </div>
        </div>
      </aside>

      <main id="conteudo" className="min-w-0 px-4 py-6 sm:px-8 sm:py-10">
        {admin.demo && (
          <p className="mb-6 rounded-2xl bg-warning-bg px-4 py-3 text-sm text-warning">
            Modo demonstração: dados de exemplo, sem banco e sem login. Só funciona no seu computador (ADMIN_DEMO=1).
          </p>
        )}
        <div className="mx-auto max-w-[1180px]">{children}</div>
      </main>
    </div>
  );
}
