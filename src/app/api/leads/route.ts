import { NextResponse } from "next/server";

import { CONSENT_VERSION, LEAD_PERIODS, validateLead, type LeadInput } from "@/lib/leads";
import { clientKey, rateLimited } from "@/lib/rateLimit";
import { adminDemo } from "@/lib/supabase/env";
import { getServiceClient } from "@/lib/supabase/service";

const clip = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

/** Stores a "call me back" request. Only name, WhatsApp, best period and the consent record. */
export async function POST(request: Request) {
  let input: Partial<LeadInput>;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Pedido inválido." }, { status: 400 });
  }

  // Bots: honeypot filled or sent faster than a person can type. Pretend it worked.
  if (input.website || (typeof input.elapsed === "number" && input.elapsed < 2500)) {
    return NextResponse.json({ ok: true });
  }
  if (rateLimited(clientKey(request, "lead"), 5, 10 * 60_000)) {
    return NextResponse.json({ ok: false, message: "Muitas tentativas. Tente de novo em alguns minutos." }, { status: 429 });
  }

  const { errors, name, whatsapp } = validateLead(input);
  if (Object.keys(errors).length || !whatsapp) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const db = getServiceClient();
  if (!db) {
    if (adminDemo) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, message: "O formulário está indisponível agora. Fale pelo WhatsApp." }, { status: 503 });
  }

  const period = LEAD_PERIODS.includes(input.period as (typeof LEAD_PERIODS)[number]) ? input.period : null;
  const path = typeof input.path === "string" && input.path.startsWith("/") ? input.path.slice(0, 200) : null;

  const { error } = await db.from("leads").insert({
    name,
    whatsapp,
    best_time: period,
    consent_at: new Date().toISOString(),
    consent_version: CONSENT_VERSION,
    source_path: path,
    utm_source: clip(input.utmSource, 60),
    utm_campaign: clip(input.utmCampaign, 80),
  });
  if (error) {
    console.error("[leads] insert failed:", error.message);
    return NextResponse.json({ ok: false, message: "Não consegui enviar agora. Tente de novo ou fale pelo WhatsApp." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
