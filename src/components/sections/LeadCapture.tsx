"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Loader2, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { CONSENT_TEXT, LEAD_PERIODS, validateLead, type LeadPeriod } from "@/lib/leads";
import { trackConversion } from "@/lib/tracker";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"name" | "whatsapp" | "consent", string>>;

const ease = [0.22, 1, 0.36, 1] as const;

const inputClass =
  "mt-1.5 h-12 w-full rounded-2xl border border-line-control bg-white px-4 text-[16px] text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-ink-muted hover:border-line-hover focus:border-primary focus:shadow-focus focus:outline-none aria-[invalid=true]:border-danger";

/**
 * "Prefere que eu te chame?": a short call-back form (name, WhatsApp, best period).
 * Asks nothing about why — no reasons, no symptoms — and records explicit consent.
 */
export function LeadCapture() {
  const reduce = useReducedMotion();
  const uid = useId();
  const panelId = `${uid}-painel`;
  const openedAt = useRef(0);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [period, setPeriod] = useState<LeadPeriod | "">("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const { errors: found } = validateLead({ name, whatsapp, consent });
    setErrors(found);
    if (found.name) return nameRef.current?.focus();
    if (found.whatsapp) return phoneRef.current?.focus();
    if (found.consent) return consentRef.current?.focus();

    setStatus("sending");
    setServerMessage("");
    try {
      const params = new URLSearchParams(location.search);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          whatsapp,
          period,
          consent,
          website,
          elapsed: Date.now() - openedAt.current,
          path: location.pathname,
          utmSource: params.get("utm_source") ?? undefined,
          utmCampaign: params.get("utm_campaign") ?? undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: Errors };
      if (res.ok && data.ok) {
        setStatus("sent");
        trackConversion("contato_enviado");
        return;
      }
      if (data.errors) setErrors(data.errors);
      setServerMessage(data.message ?? "Não consegui enviar agora. Tente de novo ou fale pelo WhatsApp.");
      setStatus("error");
    } catch {
      setServerMessage("Sem conexão no momento. Tente de novo ou fale pelo WhatsApp.");
      setStatus("error");
    }
  }

  const err = (field: keyof Errors) =>
    errors[field] ? (
      <p id={`${uid}-${field}-erro`} className="mt-1.5 text-sm text-danger">
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="mt-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (!open && !openedAt.current) openedAt.current = Date.now();
          setOpen(!open);
        }}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[15px] font-medium text-primary underline-offset-4 transition-colors hover:bg-white/70 hover:text-primary-hover hover:underline focus-visible:shadow-focus"
      >
        Prefere que eu te chame?
        <m.span aria-hidden animate={{ rotate: open ? 180 : 0 }} className="grid place-items-center">
          <ChevronDown className="size-4" />
        </m.span>
      </button>

      <div id={panelId}>
        <AnimatePresence initial={false}>
          {open && (
            <m.div
              key="lead"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.4, ease }}
              className="overflow-hidden"
            >
              <div className="mx-auto mt-6 max-w-xl rounded-3xl bg-white p-5 text-left shadow-[0_12px_40px_rgb(49_46_129/8%)] sm:p-8">
                {status === "sent" ? (
                  <div role="status" className="flex flex-col items-center py-4 text-center">
                    <span className="grid size-12 place-items-center rounded-full bg-primary-100 text-primary">
                      <Check aria-hidden className="size-6" strokeWidth={2.5} />
                    </span>
                    <p className="mt-4 text-xl font-semibold tracking-[-0.015em] text-ink">Recebi seu contato</p>
                    <p className="mt-1.5 max-w-sm text-[15px] leading-relaxed text-balance text-ink-soft">
                      Vou te chamar no WhatsApp{period && period !== "Flexível" ? `, no período da ${period.toLowerCase()}` : ""}. Até
                      já!
                    </p>
                  </div>
                ) : (
                  <form noValidate onSubmit={submit}>
                    <p className="text-[15px] leading-relaxed text-ink-soft">
                      Deixe seu nome e WhatsApp e eu te chamo para combinarmos a primeira conversa. Não precisa contar
                      nada agora.
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor={`${uid}-nome`} className="text-sm font-medium text-ink">
                          Como posso te chamar?
                        </label>
                        <input
                          ref={nameRef}
                          id={`${uid}-nome`}
                          name="name"
                          autoComplete="given-name"
                          maxLength={60}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? `${uid}-name-erro` : undefined}
                          className={inputClass}
                        />
                        {err("name")}
                      </div>
                      <div>
                        <label htmlFor={`${uid}-whats`} className="text-sm font-medium text-ink">
                          WhatsApp com DDD
                        </label>
                        <input
                          ref={phoneRef}
                          id={`${uid}-whats`}
                          name="whatsapp"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="(11) 91234-5678"
                          maxLength={22}
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          aria-invalid={Boolean(errors.whatsapp)}
                          aria-describedby={errors.whatsapp ? `${uid}-whatsapp-erro` : undefined}
                          className={inputClass}
                        />
                        {err("whatsapp")}
                      </div>
                    </div>

                    <fieldset className="mt-5">
                      <legend className="text-sm font-medium text-ink">
                        Melhor período para eu te chamar <span className="font-normal text-ink-muted">(opcional)</span>
                      </legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {LEAD_PERIODS.map((p) => (
                          <label key={p} className="relative">
                            <input
                              type="radio"
                              name={`${uid}-periodo`}
                              value={p}
                              checked={period === p}
                              onChange={() => setPeriod(p)}
                              className="peer sr-only"
                            />
                            <span
                              className={cn(
                                "inline-flex h-10 cursor-pointer items-center rounded-full border px-4 text-sm font-medium transition-colors duration-150 peer-focus-visible:shadow-focus",
                                period === p
                                  ? "border-primary bg-primary text-white"
                                  : "border-line-control bg-white text-ink-soft hover:border-line-hover hover:bg-tint-mist",
                              )}
                            >
                              {p}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    {/* Honeypot: hidden from people and screen readers. */}
                    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label>
                        Site
                        <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                      </label>
                    </div>

                    <div className="mt-5">
                      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
                        <input
                          ref={consentRef}
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          aria-invalid={Boolean(errors.consent)}
                          aria-describedby={errors.consent ? `${uid}-consent-erro` : undefined}
                          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-primary"
                        />
                        <span>
                          {CONSENT_TEXT} Posso pedir para apagar quando quiser.{" "}
                          <Link href="/privacidade" className="font-medium text-primary underline underline-offset-4">
                            Privacidade
                          </Link>
                        </span>
                      </label>
                      {err("consent")}
                    </div>

                    {serverMessage && (
                      <p role="alert" className="mt-4 rounded-2xl bg-danger-bg px-4 py-3 text-sm text-danger">
                        {serverMessage}
                      </p>
                    )}

                    <Button type="submit" variant="primary" data-track="enviar contato" disabled={status === "sending"} className="mt-6 w-full sm:w-auto">
                      {status === "sending" ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <PhoneCall aria-hidden className="size-4" />}
                      {status === "sending" ? "Enviando…" : "Quero que você me chame"}
                    </Button>
                  </form>
                )}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
