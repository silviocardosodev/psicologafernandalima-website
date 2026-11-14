import type { Metadata } from "next";
import Link from "next/link";
import { Download, Trash2 } from "lucide-react";

import { removeLead, updateLeadStatus } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Card, PageTitle, SetupNotice } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { getLeads, type Lead, type LeadStatus } from "@/lib/admin/data";
import { pageLabel } from "@/lib/admin/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Contatos" };

const TABS: { key: LeadStatus | "todos"; label: string }[] = [
  { key: "novo", label: "Novos" },
  { key: "contatado", label: "Já chamei" },
  { key: "arquivado", label: "Arquivados" },
  { key: "todos", label: "Todos" },
];

const STATUS_LABEL: Record<LeadStatus, string> = { novo: "Novo", contatado: "Já chamei", arquivado: "Arquivado" };

const dateFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

function formatPhone(d: string) {
  if (d.startsWith("55") && (d.length === 12 || d.length === 13)) {
    const ddd = d.slice(2, 4);
    const rest = d.slice(4);
    return `(${ddd}) ${rest.slice(0, rest.length - 4)}-${rest.slice(-4)}`;
  }
  return `+${d}`;
}

function replyLink(lead: Lead) {
  const first = lead.name.split(" ")[0];
  const text = `Olá, ${first}! Aqui é a Fernanda Lima, psicóloga. Você deixou seu contato no meu site para conversarmos. Que bom que você chegou até aqui! Quando fica bom para você?`;
  return `https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(text)}`;
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const tabParam = String((await searchParams).status ?? "novo");
  const tab = TABS.some((t) => t.key === tabParam) ? (tabParam as LeadStatus | "todos") : "novo";
  const leads = await getLeads();

  if (!leads) {
    return (
      <div className="space-y-6">
        <PageTitle title="Contatos" />
        <SetupNotice />
      </div>
    );
  }

  const counts = { novo: 0, contatado: 0, arquivado: 0, todos: leads.length } as Record<LeadStatus | "todos", number>;
  leads.forEach((l) => (counts[l.status] += 1));
  const shown = tab === "todos" ? leads : leads.filter((l) => l.status === tab);

  return (
    <div className="space-y-6">
      <PageTitle title="Contatos" description="Quem pediu para você chamar no WhatsApp, pelo formulário “Prefere que eu te chame?”.">
        <a
          href="/admin/contatos/exportar"
          className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-full border border-line bg-white px-4 text-sm font-medium whitespace-nowrap text-ink-soft hover:border-line-hover hover:text-ink"
        >
          <Download aria-hidden className="size-4" />
          Exportar CSV
        </a>
      </PageTitle>

      <nav aria-label="Filtrar contatos" className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/contatos?status=${t.key}`}
            aria-current={t.key === tab ? "true" : undefined}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
              t.key === tab ? "border-primary bg-primary text-white" : "border-line bg-white text-ink-soft hover:border-line-hover hover:text-ink",
            )}
          >
            {t.label}
            <span className={cn("tabular-nums", t.key === tab ? "text-white/80" : "text-ink-muted")}>{counts[t.key]}</span>
          </Link>
        ))}
      </nav>

      {shown.length === 0 ? (
        <Card>
          <p className="py-6 text-center text-[15px] text-ink-soft">
            {tab === "novo" ? "Nenhum contato esperando retorno. 🎉" : "Nada por aqui."}
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {shown.map((lead) => (
            <li key={lead.id} className="rounded-3xl border border-line-soft bg-white p-5 shadow-[0_1px_2px_rgb(23_27_44/4%)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[17px] font-semibold text-ink">{lead.name}</p>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        lead.status === "novo" && "bg-primary-100 text-primary-deep",
                        lead.status === "contatado" && "bg-success-bg text-success",
                        lead.status === "arquivado" && "bg-surface-hover text-ink-muted",
                      )}
                    >
                      {STATUS_LABEL[lead.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-[15px] text-ink tabular-nums">{formatPhone(lead.whatsapp)}</p>
                  <p className="mt-1 text-[13px] text-ink-muted">
                    {dateFmt.format(new Date(lead.created_at))}
                    {lead.best_time && ` · prefere ${lead.best_time === "Flexível" ? "horário flexível" : lead.best_time.toLowerCase()}`}
                    {lead.source_path && ` · veio de ${pageLabel(lead.source_path)}`}
                    {lead.utm_source && ` (${lead.utm_source})`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={replyLink(lead)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-whatsapp px-4 text-sm font-medium text-white hover:bg-whatsapp-hover"
                  >
                    <WhatsAppIcon className="size-4" />
                    Chamar
                    <span className="sr-only"> {lead.name} no WhatsApp (abre em nova aba)</span>
                  </a>
                  {lead.status !== "contatado" && (
                    <form action={updateLeadStatus}>
                      <input type="hidden" name="id" value={lead.id} />
                      <input type="hidden" name="status" value="contatado" />
                      <button type="submit" className="h-10 rounded-full border border-line px-4 text-sm font-medium text-ink-soft hover:border-line-hover hover:text-ink">
                        Marcar como chamado
                      </button>
                    </form>
                  )}
                  {lead.status !== "arquivado" ? (
                    <form action={updateLeadStatus}>
                      <input type="hidden" name="id" value={lead.id} />
                      <input type="hidden" name="status" value="arquivado" />
                      <button type="submit" className="h-10 rounded-full px-3 text-sm font-medium text-ink-soft hover:bg-tint-mist hover:text-ink">
                        Arquivar
                      </button>
                    </form>
                  ) : (
                    <form action={updateLeadStatus}>
                      <input type="hidden" name="id" value={lead.id} />
                      <input type="hidden" name="status" value="novo" />
                      <button type="submit" className="h-10 rounded-full px-3 text-sm font-medium text-ink-soft hover:bg-tint-mist hover:text-ink">
                        Reabrir
                      </button>
                    </form>
                  )}
                  <form action={removeLead}>
                    <input type="hidden" name="id" value={lead.id} />
                    <ConfirmButton
                      message={`Apagar o contato de ${lead.name} de vez? Isso não pode ser desfeito.`}
                      className="grid size-10 place-items-center rounded-full text-ink-muted hover:bg-danger-bg hover:text-danger"
                    >
                      <Trash2 aria-hidden className="size-4" />
                      <span className="sr-only">Apagar contato de {lead.name}</span>
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-[13px] leading-relaxed text-ink-muted">
        LGPD: use estes contatos só para responder à pessoa. Se ela pedir, apague. Contatos arquivados são apagados
        sozinhos 6 meses depois (se a limpeza automática estiver ativa, veja docs/ADMIN.md).
      </p>
    </div>
  );
}
