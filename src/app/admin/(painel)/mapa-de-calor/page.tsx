import type { Metadata } from "next";
import Link from "next/link";

import { HeatmapViewer } from "@/components/admin/HeatmapViewer";
import { BarList, Card, PageTitle, PeriodTabs, SetupNotice } from "@/components/admin/ui";
import { getHeatmap, HEAT_PAGES, parseDays, type HeatDevice } from "@/lib/admin/data";
import { deviceLabel, targetLabel, zoneLabel } from "@/lib/admin/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mapa de calor" };

const DEVICES: HeatDevice[] = ["mobile", "desktop", "tablet"];

const chip = (active: boolean) =>
  cn(
    "inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
    active ? "border-primary bg-primary text-white" : "border-line bg-white text-ink-soft hover:border-line-hover hover:text-ink",
  );

export default async function HeatmapPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const days = parseDays(params.dias);
  const pathParam = String(params.pagina ?? "/");
  const path = HEAT_PAGES.some((p) => p.path === pathParam) ? pathParam : "/";
  const deviceParam = String(params.aparelho ?? "mobile") as HeatDevice;
  const device = DEVICES.includes(deviceParam) ? deviceParam : "mobile";

  const data = await getHeatmap(path, device, days);
  const href = (next: Record<string, string>) =>
    `/admin/mapa-de-calor?${new URLSearchParams({ pagina: path, aparelho: device, dias: String(days), ...next })}`;

  return (
    <div className="space-y-6">
      <PageTitle title="Mapa de calor" description="Onde as pessoas tocam e clicam em cada página. Quanto mais quente a cor, mais cliques.">
        <PeriodTabs days={days} base="/admin/mapa-de-calor" extra={{ pagina: path, aparelho: device }} />
      </PageTitle>

      {!data ? (
        <SetupNotice />
      ) : (
        <>
          <div className="space-y-3">
            <nav aria-label="Página" className="flex gap-2 overflow-x-auto pb-1">
              {HEAT_PAGES.map((p) => (
                <Link key={p.path} href={href({ pagina: p.path })} aria-current={p.path === path ? "true" : undefined} className={chip(p.path === path)}>
                  {p.label}
                </Link>
              ))}
            </nav>
            <nav aria-label="Aparelho" className="flex gap-2">
              {DEVICES.map((d) => (
                <Link key={d} href={href({ aparelho: d })} aria-current={d === device ? "true" : undefined} className={chip(d === device)}>
                  {deviceLabel(d)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[1fr_340px]">
            <Card>
              <HeatmapViewer key={`${path}-${device}-${days}`} path={path} device={device} points={data.points} />
            </Card>
            <div className="space-y-6">
              <Card title="Mais clicados nesta página">
                <BarList
                  rows={data.targets.map((t) => ({
                    key: `${t.label}-${t.zone}`,
                    label: targetLabel(t.label),
                    sub: `em ${zoneLabel(t.zone)}`,
                    count: t.count,
                  }))}
                />
              </Card>
              <Card title="Como ler">
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
                  <li>Manchas sobre botões e links: o que mais chama atenção.</li>
                  <li>“Área sem link” com muitos cliques: algo parece clicável e não é. Bom candidato a virar botão.</li>
                  <li>Os cartões de “Parece que fala de você?” e o assistente de mensagem não aparecem: por privacidade, não são registrados.</li>
                </ul>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
