import "server-only";

import { adminDemo } from "@/lib/supabase/env";
import { getServiceClient } from "@/lib/supabase/service";

export type Count = { label: string; count: number };

export type SiteStats = {
  visits: number;
  pageviews: number;
  whatsappClicks: number;
  whatsappVisits: number;
  leads: number;
  leadsNew: number;
  daily: { day: string; visits: number }[];
  devices: Count[];
  pages: Count[];
  sources: Count[];
  targets: (Count & { zone: string })[];
  funnel: { visitou: number; sobre: number; como_funciona: number; agendar: number; contato: number };
};

export type HeatPoint = { zone: string; rx: number; ry: number; n: number };
export type HeatDevice = "mobile" | "tablet" | "desktop";

export type LeadStatus = "novo" | "contatado" | "arquivado";
export type Lead = {
  id: string;
  created_at: string;
  name: string;
  whatsapp: string;
  best_time: string | null;
  source_path: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  consent_at: string;
  consent_version: string;
  status: LeadStatus;
};

/** Pages that can be opened in the heatmap. */
export const HEAT_PAGES = [
  { path: "/", label: "Página inicial" },
  { path: "/mente-acelerada", label: "Mente acelerada" },
  { path: "/autocobranca", label: "Autocobrança" },
  { path: "/ansiedade", label: "Ansiedade" },
  { path: "/produtos", label: "Produtos (FL PsicoFlow)" },
] as const;

export const PERIODS = [7, 30, 90] as const;

export function parseDays(value: string | string[] | undefined): number {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return (PERIODS as readonly number[]).includes(n) ? n : 30;
}

const since = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

/** null = database not configured (the page shows the setup steps). */
export async function getStats(days: number): Promise<SiteStats | null> {
  if (adminDemo) return demoStats(days);
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db.rpc("admin_site_stats", { p_since: since(days) });
  if (error) throw new Error(`admin_site_stats: ${error.message}`);
  return data as SiteStats;
}

export async function getHeatmap(path: string, device: HeatDevice, days: number) {
  if (adminDemo) return demoHeatmap(path, device);
  const db = getServiceClient();
  if (!db) return null;
  const args = { p_path: path, p_device: device, p_since: since(days) };
  const [points, targets] = await Promise.all([db.rpc("admin_heatmap", args), db.rpc("admin_page_targets", args)]);
  if (points.error) throw new Error(`admin_heatmap: ${points.error.message}`);
  if (targets.error) throw new Error(`admin_page_targets: ${targets.error.message}`);
  return {
    points: (points.data ?? []) as HeatPoint[],
    targets: ((targets.data ?? []) as { target: string; zone: string; n: number }[]).map((t) => ({
      label: t.target,
      zone: t.zone,
      count: Number(t.n),
    })),
  };
}

export async function getLeads(): Promise<Lead[] | null> {
  if (adminDemo) return demoLeads;
  const db = getServiceClient();
  if (!db) return null;
  const { data, error } = await db.from("leads").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) throw new Error(`leads: ${error.message}`);
  return data as Lead[];
}

export async function setLeadStatus(id: string, status: LeadStatus) {
  if (adminDemo) {
    const lead = demoLeads.find((l) => l.id === id);
    if (lead) lead.status = status;
    return;
  }
  const db = getServiceClient();
  if (!db) throw new Error("Banco não configurado.");
  const { error } = await db.from("leads").update({ status, status_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteLead(id: string) {
  if (adminDemo) {
    const i = demoLeads.findIndex((l) => l.id === id);
    if (i >= 0) demoLeads.splice(i, 1);
    return;
  }
  const db = getServiceClient();
  if (!db) throw new Error("Banco não configurado.");
  const { error } = await db.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Demo data (ADMIN_DEMO=1, development only): lets the panel be reviewed
// without a database. Deterministic so screenshots are stable.
// ---------------------------------------------------------------------------

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function demoStats(days: number): SiteStats {
  const r = rng(days);
  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86_400_000);
    const weekday = d.getDay();
    const base = weekday === 0 || weekday === 6 ? 22 : 38;
    return { day: d.toISOString().slice(0, 10), visits: Math.round(base + r() * 24 + i * 0.3) };
  });
  const visits = daily.reduce((a, d) => a + d.visits, 0);
  const funnel = {
    visitou: Math.round(visits * 0.78),
    sobre: Math.round(visits * 0.52),
    como_funciona: Math.round(visits * 0.36),
    agendar: Math.round(visits * 0.24),
    contato: Math.round(visits * 0.071),
  };
  return {
    visits,
    pageviews: Math.round(visits * 1.6),
    whatsappClicks: Math.round(visits * 0.08),
    whatsappVisits: Math.round(visits * 0.065),
    leads: Math.round(days / 4),
    leadsNew: 3,
    daily,
    devices: [
      { label: "mobile", count: Math.round(visits * 0.81) },
      { label: "desktop", count: Math.round(visits * 0.15) },
      { label: "tablet", count: Math.round(visits * 0.04) },
    ],
    pages: [
      { label: "/", count: Math.round(visits * 0.95) },
      { label: "/mente-acelerada", count: Math.round(visits * 0.22) },
      { label: "/ansiedade", count: Math.round(visits * 0.18) },
      { label: "/autocobranca", count: Math.round(visits * 0.12) },
      { label: "/produtos", count: Math.round(visits * 0.05) },
    ],
    sources: [
      { label: "instagram", count: Math.round(visits * 0.46) },
      { label: "direto", count: Math.round(visits * 0.27) },
      { label: "google.com", count: Math.round(visits * 0.19) },
      { label: "youtube.com", count: Math.round(visits * 0.05) },
      { label: "l.facebook.com", count: Math.round(visits * 0.03) },
    ],
    targets: [
      { label: "whatsapp", zone: "inicio", count: Math.round(visits * 0.031) },
      { label: "whatsapp", zone: "agendar", count: Math.round(visits * 0.027) },
      { label: "link #como-funciona", zone: "header", count: Math.round(visits * 0.024) },
      { label: "botão Prefere que eu escreva a mensagem por você?", zone: "agendar", count: Math.round(visits * 0.02) },
      { label: "botão Assistir ao vídeo: Como você fala com você?", zone: "videos", count: Math.round(visits * 0.016) },
      { label: "instagram", zone: "instagram", count: Math.round(visits * 0.012) },
      { label: "whatsapp", zone: "page", count: Math.round(visits * 0.011) },
      { label: "link /ansiedade", zone: "para-voce", count: Math.round(visits * 0.008) },
    ],
    funnel,
  };
}

function demoHeatmap(path: string, device: HeatDevice) {
  const r = rng(path.length * 31 + device.length);
  const gauss = () => (r() + r() + r() - 1.5) / 1.5;
  const mobile = device === "mobile";
  const clusters: [string, number, number, number][] = path === "/"
    ? [
        ["inicio", mobile ? 0.5 : 0.27, mobile ? 0.47 : 0.66, 140],
        ["header", mobile ? 0.88 : 0.9, 0.5, 70],
        ["para-voce", 0.3, 0.45, 60],
        ["para-voce", 0.7, 0.6, 45],
        ["agendar", 0.5, mobile ? 0.3 : 0.35, 120],
        ["agendar", 0.5, mobile ? 0.45 : 0.52, 55],
        ["videos", mobile ? 0.5 : 0.18, 0.45, 50],
        ["duvidas", 0.5, 0.4, 40],
        ["instagram", mobile ? 0.5 : 0.3, mobile ? 0.25 : 0.6, 30],
        ["sobre", 0.6, 0.5, 20],
      ]
    : [
        ["inicio", 0.3, 0.7, 90],
        ["header", 0.9, 0.5, 40],
        ["sinais", 0.5, 0.4, 30],
      ];
  const points: HeatPoint[] = [];
  for (const [zone, cx, cy, total] of clusters) {
    for (let i = 0; i < total; i++) {
      const rx = Math.min(1, Math.max(0, cx + gauss() * 0.08));
      const ry = Math.min(1, Math.max(0, cy + gauss() * 0.06));
      points.push({ zone, rx, ry, n: 1 });
    }
  }
  const targets = [
    { label: "whatsapp", zone: "inicio", count: 96 },
    { label: "whatsapp", zone: "agendar", count: 81 },
    { label: "link #como-funciona", zone: "header", count: 44 },
    { label: "botão Prefere que eu escreva a mensagem por você?", zone: "agendar", count: 39 },
    { label: "(área sem link)", zone: "para-voce", count: 33 },
  ];
  return { points, targets };
}

const demoLeads: Lead[] = [
  ["Ana", "5511987654321", "Noite", "/", "instagram", "novo", 0.2],
  ["Juliana", "5511912345678", "Manhã", "/mente-acelerada", null, "novo", 1.4],
  ["Camila", "5521998765432", null, "/", "google", "novo", 2.8],
  ["Beatriz", "351912345678", "Tarde", "/ansiedade", null, "contatado", 5],
  ["Mariana", "5511955554444", "Flexível", "/", "instagram", "arquivado", 12],
].map(([name, whatsapp, best, path, utm, status, daysAgo], i) => ({
  id: `demo-${i}`,
  created_at: new Date(Date.now() - (daysAgo as number) * 86_400_000).toISOString(),
  name: name as string,
  whatsapp: whatsapp as string,
  best_time: best as string | null,
  source_path: path as string,
  utm_source: utm as string | null,
  utm_campaign: null,
  consent_at: new Date(Date.now() - (daysAgo as number) * 86_400_000).toISOString(),
  consent_version: "2026-11",
  status: status as LeadStatus,
}));
