import Link from "next/link";
import type { ReactNode } from "react";

import { nf } from "@/lib/admin/labels";
import { PERIODS } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

export function PageTitle({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[26px] leading-tight font-[650] tracking-[-0.025em] text-ink sm:text-[30px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-xl text-[15px] text-ink-soft">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({ title, description, className, children }: { title?: string; description?: string; className?: string; children: ReactNode }) {
  return (
    <section className={cn("rounded-3xl border border-line-soft bg-white p-5 shadow-[0_1px_2px_rgb(23_27_44/4%)] sm:p-6", className)}>
      {title && <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>}
      {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      <div className={title || description ? "mt-5" : undefined}>{children}</div>
    </section>
  );
}

/** Segmented period switch (links, so it works without JS and keeps the URL shareable). */
export function PeriodTabs({ days, base, extra = {} }: { days: number; base: string; extra?: Record<string, string> }) {
  return (
    <nav aria-label="Período" className="inline-flex shrink-0 self-start rounded-full border border-line bg-white p-1">
      {PERIODS.map((p) => {
        const params = new URLSearchParams({ ...extra, dias: String(p) });
        const active = p === days;
        return (
          <Link
            key={p}
            href={`${base}?${params}`}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              active ? "bg-primary text-white" : "text-ink-soft hover:bg-tint-mist hover:text-ink",
            )}
          >
            {p} dias
          </Link>
        );
      })}
    </nav>
  );
}

export function Stat({ label, value, hint }: { label: string; value: number | string; hint?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-line-soft bg-white p-5 shadow-[0_1px_2px_rgb(23_27_44/4%)]">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-2 text-[32px] leading-none font-[650] tracking-[-0.03em] text-ink tabular-nums">
        {typeof value === "number" ? nf.format(value) : value}
      </p>
      {hint && <p className="mt-2 text-[13px] text-ink-muted">{hint}</p>}
    </div>
  );
}

/** Ranked list with a thin magnitude bar behind each row: one series, one hue. */
export function BarList({ rows, empty = "Ainda sem dados neste período." }: { rows: { label: ReactNode; sub?: ReactNode; count: number; key: string }[]; empty?: string }) {
  if (!rows.length) return <p className="text-sm text-ink-muted">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <ul className="space-y-1.5">
      {rows.map((row) => (
        <li key={row.key} className="relative overflow-hidden rounded-xl">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 rounded-xl bg-primary-100"
            style={{ width: `${Math.max(2, (row.count / max) * 100)}%` }}
          />
          <span className="relative flex items-center justify-between gap-4 px-3 py-2 text-sm">
            <span className="min-w-0">
              <span className="block truncate text-ink">{row.label}</span>
              {row.sub && <span className="block truncate text-xs text-ink-muted">{row.sub}</span>}
            </span>
            <span className="shrink-0 font-medium text-ink tabular-nums">{nf.format(row.count)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SetupNotice() {
  return (
    <Card title="Falta conectar o banco de dados" className="border-warning-bg bg-warning-bg/40">
      <p className="text-[15px] leading-relaxed text-ink-soft">
        O painel está pronto, mas ainda não há um projeto Supabase ligado ao site. Enquanto isso, nada é registrado e o
        formulário de contato fica desativado. O passo a passo (uns 15 minutos) está em <code className="rounded bg-white px-1.5 py-0.5 text-[13px]">docs/ADMIN.md</code>.
      </p>
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-ink-soft">
        <li>Criar um projeto no Supabase (região São Paulo).</li>
        <li>Rodar o arquivo <code>supabase/schema.sql</code> no SQL Editor.</li>
        <li>Criar o usuário da Fernanda em Authentication → Users.</li>
        <li>Colocar as 4 variáveis na Vercel e publicar de novo.</li>
      </ol>
    </Card>
  );
}
