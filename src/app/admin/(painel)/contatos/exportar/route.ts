import { getAdmin } from "@/lib/admin/auth";
import { getLeads } from "@/lib/admin/data";

export const dynamic = "force-dynamic";

const cell = (v: string | null) => {
  const s = (v ?? "").replace(/"/g, '""');
  // Neutralize spreadsheet formulas (CSV injection).
  return `"${/^[=+\-@]/.test(s) ? `'${s}` : s}"`;
};

export async function GET() {
  if (!(await getAdmin())) return new Response("Não autorizado", { status: 401 });
  const leads = (await getLeads()) ?? [];
  const header = ["Data", "Nome", "WhatsApp", "Melhor período", "Situação", "Página", "Origem", "Consentimento em", "Versão do termo"];
  const rows = leads.map((l) =>
    [l.created_at, l.name, l.whatsapp, l.best_time, l.status, l.source_path, l.utm_source, l.consent_at, l.consent_version].map(cell).join(";"),
  );
  const csv = `﻿${header.map(cell).join(";")}\n${rows.join("\n")}\n`;
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="contatos-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
