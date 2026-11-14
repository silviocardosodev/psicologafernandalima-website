"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { track } from "@/lib/analytics";
import { pains } from "@/lib/pains";
import { ctaLabel, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const cards = [
  {
    id: "mente",
    statement: "Minha mente não desliga",
    support: "Penso sem parar, antecipo problemas, não relaxo nem no fim de semana.",
  },
  {
    id: "cobranca",
    statement: "Me cobro o tempo todo",
    support: "Nunca parece suficiente. Descansar dá culpa.",
  },
  {
    id: "limite",
    statement: "Por fora tudo bem, por dentro no limite",
    support: "Um cansaço que ninguém vê.",
  },
  {
    id: "vida-boa",
    statement: "Minha vida é boa… por que me sinto assim?",
    support: "E ainda me sinto ingrata por isso.",
  },
] as const;

type CardId = (typeof cards)[number]["id"];

const BASE_MESSAGE = "Olá Fernanda! Cheguei pelo seu site e gostaria de conversar sobre terapia.";

function listPt(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

const spring = { type: "spring", stiffness: 420, damping: 22 } as const;
const ease = [0.22, 1, 0.36, 1] as const;

export function Identify() {
  const reduce = useReducedMotion();
  const uid = useId();
  const [selected, setSelected] = useState<CardId[]>([]);
  // LGPD: what she marked only goes into the message after an explicit opt-in.
  const [includeSigns, setIncludeSigns] = useState(false);

  const hasSelection = selected.length > 0;

  // Analytics (LGPD): only the count is sent, never which statements. Debounced so rapid
  // toggles send one event; starts at 0 so nothing fires on mount.
  const lastSentCount = useRef(0);
  useEffect(() => {
    const count = selected.length;
    if (count === lastSentCount.current) return;
    const timer = window.setTimeout(() => {
      lastSentCount.current = count;
      track("identify_select", { count });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [selected.length]);

  const message = useMemo(() => {
    if (!includeSigns || !hasSelection) return BASE_MESSAGE;
    const picked = cards.filter((c) => selected.includes(c.id)).map((c) => `“${c.statement}”`);
    return `Olá Fernanda! Cheguei pelo seu site e me identifiquei com: ${listPt(picked)}.\nGostaria de conversar sobre terapia.`;
  }, [includeSigns, hasSelection, selected]);

  function toggle(id: CardId) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const t = reduce ? { duration: 0 } : spring;

  return (
    <Section id="para-voce" aria-labelledby="para-voce-titulo">
      <Container>
        <SectionHeader
          id="para-voce-titulo"
          eyebrow="Pra você"
          title="Parece que fala de você?"
          description="Toque no que você reconhece. Sem certo ou errado."
          align="center"
        />

        <div className="mx-auto mt-12 max-w-4xl">
          <Reveal delay={0.05}>
            <ul className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {cards.map((card) => {
                const on = selected.includes(card.id);
                return (
                  <li key={card.id} className="flex">
                    <m.button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(card.id)}
                      whileTap={{ scale: 0.98 }}
                      transition={t}
                      className={cn(
                        "group flex w-full items-start gap-4 rounded-3xl border p-6 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 focus-visible:shadow-focus sm:p-7",
                        on
                          ? "border-primary bg-tint-violet shadow-[0_10px_30px_rgb(79_70_229/12%)]"
                          : "border-line-control bg-white hover:bg-tint-mist hover:shadow-raised",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[20px] leading-snug font-[550] tracking-[-0.015em] text-balance text-ink sm:text-[22px]">
                          {card.statement}
                        </span>
                        <span className="mt-2 block text-[15px] leading-relaxed text-ink-soft">{card.support}</span>
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "mt-1 grid size-7 shrink-0 place-items-center rounded-full border transition-colors duration-200",
                          on ? "border-primary bg-primary text-white" : "border-line-control bg-white",
                        )}
                      >
                        <AnimatePresence initial={false}>
                          {on && (
                            <m.span
                              key="check"
                              initial={{ scale: 0, rotate: -30 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0 }}
                              transition={t}
                              className="grid place-items-center"
                            >
                              <Check className="size-4" strokeWidth={3} />
                            </m.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </m.button>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* One short polite announcement when the result appears; the panel itself isn't live. */}
          <p className="sr-only" aria-live="polite">
            {hasSelection ? "Logo abaixo dos cartões há uma mensagem para você e um jeito de conversar comigo." : ""}
          </p>

          <AnimatePresence initial={false}>
            {hasSelection && (
              <m.div
                key="result"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.4, ease }}
                className="overflow-hidden"
              >
                <div className="mt-4 rounded-3xl bg-tint-lilac p-6 sm:p-8">
                  <p className="text-[22px] leading-snug font-[650] tracking-[-0.02em] text-balance text-ink sm:text-[24px]">
                    Você não está exagerando. Isso tem nome — e tem caminho.
                  </p>

                  <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
                    <div className="min-w-0">
                      <label
                        htmlFor={`${uid}-incluir`}
                        className="inline-flex cursor-pointer items-center gap-3 text-[15px] text-ink"
                      >
                        <input
                          id={`${uid}-incluir`}
                          type="checkbox"
                          checked={includeSigns}
                          onChange={(e) => {
                            setIncludeSigns(e.target.checked);
                            track("identify_optin", { enabled: e.target.checked });
                          }}
                          className="size-5 shrink-0 cursor-pointer rounded accent-primary"
                        />
                        Incluir o que marquei na mensagem
                      </label>

                      <figure className="mt-4">
                        <figcaption className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
                          Prévia da mensagem
                        </figcaption>
                        <div className="mt-2 max-w-xl rounded-2xl rounded-bl-md border border-primary-200 bg-white px-4 py-3 text-[14px] leading-relaxed whitespace-pre-line text-ink">
                          {message}
                        </div>
                      </figure>
                    </div>

                    <a
                      href={whatsappLink(message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-whatsapp px-8 text-base font-medium whitespace-nowrap text-white shadow-[0_8px_24px_rgb(15_122_59/24%)] transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-whatsapp-hover focus-visible:shadow-focus active:translate-y-px"
                    >
                      <WhatsAppIcon className="size-5" />
                      {ctaLabel}
                      <span className="sr-only"> no WhatsApp (abre em nova aba)</span>
                    </a>
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          <div className="mt-8 space-y-1.5 text-center text-sm leading-relaxed text-ink-muted">
            <p>Também acompanho: ansiedade, pânico, relacionamentos e luto.</p>
            <p>
              Quer ler mais?{" "}
              {pains.map((pain, index) => (
                <span key={pain.slug}>
                  {index > 0 && " · "}
                  <Link
                    href={`/${pain.slug}`}
                    className="rounded-sm font-medium text-primary underline decoration-primary-200 underline-offset-4 transition-colors duration-300 hover:decoration-primary"
                  >
                    {pain.name}
                  </Link>
                </span>
              ))}
            </p>
            <p>Sinais não são diagnóstico. Nada do que você marca é salvo.</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
