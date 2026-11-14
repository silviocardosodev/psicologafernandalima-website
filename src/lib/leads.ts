/** Shared between the contact form (client) and /api/leads (server). */

export const LEAD_PERIODS = ["Manhã", "Tarde", "Noite", "Flexível"] as const;
export type LeadPeriod = (typeof LEAD_PERIODS)[number];

/** Bump when the consent text below changes, so each lead records which text was accepted. */
export const CONSENT_VERSION = "2026-11";

export const CONSENT_TEXT =
  "Autorizo a Fernanda Lima a usar meu nome e WhatsApp apenas para entrar em contato comigo sobre a terapia.";

export type LeadInput = {
  name: string;
  whatsapp: string;
  period: LeadPeriod | "";
  consent: boolean;
  /** Honeypot: real people never see or fill this. */
  website?: string;
  /** ms the form was open before sending (bots send instantly). */
  elapsed?: number;
  path?: string;
  utmSource?: string;
  utmCampaign?: string;
};

/** Keeps digits only; accepts BR numbers with or without +55, and international ones. */
export function normalizeWhatsapp(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  // BR number typed without country code: DDD (2) + 8/9 digits.
  if ((digits.length === 10 || digits.length === 11) && !raw.trim().startsWith("+")) digits = `55${digits}`;
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

export function validateLead(input: Partial<LeadInput>) {
  const errors: Partial<Record<"name" | "whatsapp" | "consent", string>> = {};
  const name = (input.name ?? "").replace(/\s+/g, " ").trim();
  if (!name) errors.name = "Conte como posso te chamar.";
  else if (name.length > 60) errors.name = "Use até 60 caracteres.";
  const whatsapp = normalizeWhatsapp(input.whatsapp ?? "");
  if (!whatsapp) errors.whatsapp = "Confira o número, com DDD.";
  if (!input.consent) errors.consent = "Preciso da sua autorização para entrar em contato.";
  return { errors, name, whatsapp };
}
