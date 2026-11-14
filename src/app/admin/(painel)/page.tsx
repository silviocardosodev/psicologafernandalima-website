import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { DailyChart } from "@/components/admin/DailyChart";
import { BarList, Card, PageTitle, PeriodTabs, SetupNotice, Stat } from "@/components/admin/ui";
import { getStats, parseDays } from "@/lib/admin/data";
import { deviceLabel, nf, pageLabel, pct, sourceLabel, targetLabel, zoneLabel } from "@/lib/admin/labels";

export const metadata: Metadata = { title: "Visão geral" };

export default async function OverviewPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const days = parseDays((await searchParams).dias);
  const stats = await getStats(days);

  if (!stats) {
    return (
      <div className="space-y-6">
        <PageTitle title="Visão geral" />
        <SetupNotice />
      </div>
    );
  }

  const f = stats.funnel;
  const funnel = [
    { key: "visitou", label: "Abriu a página inicial", count: f.visitou },
    { key: "sobre", label: "Chegou em “Sobre mim”", count: f.sobre },
    { key: "como", label: "Chegou em “Como funciona”", count: f.como_funciona },
    { key: "agendar", label: "Chegou em “Agendar”", count: f.agendar },
    { key: "contato", label: "Chamou no WhatsApp ou deixou contato", count: f.contato },
  ];
  const funnelTop = Math.max(f.visitou, 1);

  return (
    <div className="space-y-6">
      <PageTitle title="Visão geral" description={`Como o site foi usado nos últimos ${days} dias.`}>
        <PeriodTabs days={days} base="/admin" />
      </PageTitle>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Visitas" value={stats.visits} hint={`${nf.format(stats.pageviews)} páginas vistas`} />
        <Stat
          label="Chamaram no WhatsApp"
          value={stats.whatsappVisits}
          hint={`${pct(stats.whatsappVisits, stats.visits)} das visitas`}
        />
        <Stat
          label="Contatos recebidos"
          value={stats.leads}
          hint={
            stats.leadsNew > 0 ? (
              <Link href="/admin/contatos" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                {stats.leadsNew} esperando retorno <ArrowRight aria-hidden className="size-3.5" />
              </Link>
            ) : (
              "Nenhum esperando retorno"
            )
          }
        />
        <Stat
          label="Pelo celular"
          value={pct(stats.devices.find((d) => d.label === "mobile")?.count ?? 0, stats.visits)}
          hint="das visitas"
        />
      </div>

      <Card title="Visitas por dia" description="Cada visita é uma aba aberta no site; recarregar a página não conta de novo.">
        <DailyChart data={stats.daily} days={days} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <Card title="Caminho até o contato" description="Quantas visitas à página inicial chegaram a cada parte.">
          <ol className="space-y-3">
            {funnel.map((step, i) => (
              <li key={step.key}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-ink">
                    <span className="mr-2 text-ink-muted tabular-nums">{i + 1}.</span>
                    {step.label}
                  </span>
                  <span className="shrink-0 text-ink tabular-nums">
                    <span className="font-medium">{nf.format(step.count)}</span>
                    <span className="ml-2 text-ink-muted">{pct(step.count, funnelTop)}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-tint-lilac">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(1, (step.count / funnelTop) * 100)}%` }} />
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="De onde vieram">
          <BarList rows={stats.sources.map((s) => ({ key: s.label, label: sourceLabel(s.label), sub: s.label !== sourceLabel(s.label) ? s.label : undefined, count: s.count }))} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="O que mais clicam" className="lg:col-span-2">
          <BarList
            rows={stats.targets.map((t) => ({
              key: `${t.label}-${t.zone}`,
              label: targetLabel(t.label),
              sub: `em ${zoneLabel(t.zone)}`,
              count: t.count,
            }))}
          />
        </Card>
        <div className="space-y-6">
          <Card title="Páginas mais vistas">
            <BarList rows={stats.pages.map((p) => ({ key: p.label, label: pageLabel(p.label), count: p.count }))} />
          </Card>
          <Card title="Aparelhos">
            <BarList rows={stats.devices.map((d) => ({ key: d.label, label: deviceLabel(d.label), count: d.count }))} />
          </Card>
        </div>
      </div>

      <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-muted">
        <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
        Contagem anônima, sem cookies e sem IP. O que a pessoa marca em “Parece que fala de você?” e no assistente de
        mensagem não é registrado.
      </p>
    </div>
  );
}
