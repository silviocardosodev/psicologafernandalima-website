"use client";

import { Fragment, useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Activity, Check, CloudRain, Lock, Plus, RotateCcw, Users, Wind, type LucideIcon } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

type Area = {
  id: string;
  title: string;
  line: string;
  icon: LucideIcon;
  tint: string;
  signs: string[];
  text: string;
  message: string;
  crisis?: boolean;
};

const areas: Area[] = [
  {
    id: "ansiedade",
    title: "Ansiedade",
    line: "Quando a preocupação não desliga.",
    icon: Wind,
    tint: "bg-tint-lilac",
    signs: ["Preocupação constante", "Tensão no corpo", "Coração acelerado", "Falta de ar", "Dificuldade de concentração"],
    text: "Juntas, encontramos formas mais leves de lidar.",
    message: "Olá Fernanda! Cheguei pelo seu site e gostaria de conversar sobre ansiedade.",
  },
  {
    id: "relacionamentos",
    title: "Relacionamentos",
    line: "Vínculos que pesam ou machucam.",
    icon: Users,
    tint: "bg-tint-violet",
    signs: ["Término", "Luto", "Conflitos familiares", "Dificuldade com limites", "Relação abusiva"],
    text: "Um espaço para cuidar de como você se sente nos seus vínculos.",
    message: "Olá Fernanda! Cheguei pelo seu site e gostaria de conversar sobre meus relacionamentos.",
  },
  {
    id: "depressao",
    title: "Depressão",
    line: "Quando tudo parece perder a cor.",
    icon: CloudRain,
    tint: "bg-tint-orchid",
    signs: ["Cansaço constante", "Perda de interesse", "Alterações no sono", "Culpa", "Indecisão"],
    text: "Você não precisa esperar piorar para buscar cuidado.",
    message: "Olá Fernanda! Cheguei pelo seu site e gostaria de conversar sobre depressão.",
    crisis: true,
  },
  {
    id: "panico",
    title: "Pânico",
    line: "Crises que chegam sem aviso.",
    icon: Activity,
    tint: "bg-tint-indigo",
    signs: ["Medo intenso", "Coração acelerado", "Tremores", "Falta de ar", "Medo de perder o controle"],
    text: "No seu ritmo, construímos novas formas de lidar com as crises.",
    message: "Olá Fernanda! Cheguei pelo seu site e gostaria de conversar sobre crises de pânico.",
  },
];

/** A sign is identified by area + label, since some labels repeat across areas. */
const key = (areaId: string, sign: string) => `${areaId}::${sign}`;
const totalSigns = areas.reduce((n, a) => n + a.signs.length, 0);

/*
 * Visual order: cards sit at even `order` slots; the open panel takes the slot right after the
 * row that contains its card (1 col → after the card, 2 cols → after the row, 4 cols → after all).
 * DOM order keeps the panel right after its trigger, so keyboard flow goes card → details.
 */
const cardOrder = ["order-0", "order-2", "order-4", "order-6"];
const panelOrder = [
  "order-1 sm:order-3 lg:order-7",
  "order-3 sm:order-3 lg:order-7",
  "order-5 sm:order-7 lg:order-7",
  "order-7 sm:order-7 lg:order-7",
];

const spring = { type: "spring", stiffness: 300, damping: 22 } as const;
const ease = [0.22, 1, 0.36, 1] as const;

function joinPt(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

export function Help() {
  const [open, setOpen] = useState<string | null>(null);
  const [marked, setMarked] = useState<string[]>([]);
  const reduce = useReducedMotion();
  const uid = useId();

  const count = marked.length;

  const waHref = useMemo(() => {
    const labels: string[] = [];
    for (const area of areas) {
      for (const sign of area.signs) {
        const label = sign.toLowerCase();
        if (marked.includes(key(area.id, sign)) && !labels.includes(label)) labels.push(label);
      }
    }
    return whatsappLink(
      `Olá Fernanda! Cheguei pelo seu site e me reconheci em alguns sinais: ${joinPt(labels)}. Gostaria de conversar sobre isso.`,
    );
  }, [marked]);

  function toggle(k: string) {
    setMarked((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  }

  return (
    <Section id="ajuda" aria-labelledby="ajuda-titulo">
      <Container>
        <SectionHeader
          id="ajuda-titulo"
          eyebrow="Como posso ajudar"
          title="Você não precisa passar por isso sozinha"
          description="Abra um tema e marque o que você reconhece."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {areas.map((area, i) => {
            const Icon = area.icon;
            const isOpen = open === area.id;
            const btnId = `${uid}-${area.id}-btn`;
            const panelId = `${uid}-${area.id}-panel`;
            const areaCount = area.signs.filter((s) => marked.includes(key(area.id, s))).length;

            return (
              <Fragment key={area.id}>
                <Reveal delay={i * 0.06} className={cn("h-full", cardOrder[i])}>
                  <motion.button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? panelId : undefined}
                    onClick={() => setOpen(isOpen ? null : area.id)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    transition={reduce ? { duration: 0 } : spring}
                    className={cn(
                      "group flex h-full w-full flex-col items-start rounded-3xl p-6 text-left transition-shadow duration-200 focus-visible:shadow-focus sm:p-7",
                      area.tint,
                      isOpen && "ring-1 ring-primary/25",
                    )}
                  >
                    <span className="flex w-full items-start justify-between">
                      <span className="grid size-11 place-items-center rounded-full bg-white text-primary">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="flex items-center gap-2">
                        <AnimatePresence initial={false}>
                          {areaCount > 0 && (
                            <motion.span
                              key="badge"
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.6 }}
                              transition={reduce ? { duration: 0 } : spring}
                              className="grid h-6 min-w-6 place-items-center rounded-full bg-primary px-1.5 text-xs font-semibold text-white tabular-nums"
                            >
                              {areaCount}
                              <span className="sr-only"> {areaCount === 1 ? "sinal marcado" : "sinais marcados"}</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <motion.span
                          aria-hidden
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={reduce ? { duration: 0 } : spring}
                          className={cn("grid", isOpen ? "text-primary" : "text-ink-muted")}
                        >
                          <Plus className="size-5" />
                        </motion.span>
                      </span>
                    </span>
                    <span className="mt-8 text-xl font-semibold tracking-[-0.015em] text-ink">{area.title}</span>
                    <span className="mt-1.5 text-[15px] leading-snug text-ink-soft">{area.line}</span>
                  </motion.button>
                </Reveal>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={area.id}
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      initial={{ height: 0, opacity: 0, marginTop: -16 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 0 }}
                      exit={{ height: 0, opacity: 0, marginTop: -16 }}
                      transition={reduce ? { duration: 0 } : { duration: 0.38, ease }}
                      className={cn("col-span-full overflow-hidden", panelOrder[i])}
                    >
                      <div className={cn("rounded-3xl p-6 sm:p-8", area.tint)}>
                        <p id={`${panelId}-label`} className="text-sm font-semibold tracking-[-0.01em] text-ink">
                          Você se reconhece?
                        </p>
                        <ul
                          role="group"
                          aria-labelledby={`${panelId}-label`}
                          aria-describedby={`${uid}-privacy`}
                          className="mt-3 flex flex-wrap gap-2"
                        >
                          {area.signs.map((sign, j) => {
                            const k = key(area.id, sign);
                            const on = marked.includes(k);
                            return (
                              <motion.li
                                key={sign}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={reduce ? { duration: 0 } : { duration: 0.3, delay: 0.08 + j * 0.035, ease }}
                              >
                                <motion.button
                                  type="button"
                                  aria-pressed={on}
                                  onClick={() => toggle(k)}
                                  whileTap={{ scale: 0.95 }}
                                  transition={reduce ? { duration: 0 } : spring}
                                  className={cn(
                                    "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors duration-150 focus-visible:shadow-focus",
                                    on ? "bg-primary text-white" : "bg-white text-ink-soft hover:text-ink",
                                  )}
                                >
                                  <AnimatePresence initial={false}>
                                    {on && (
                                      <motion.span
                                        aria-hidden
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: "auto", opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={reduce ? { duration: 0 } : { duration: 0.2, ease }}
                                        className="inline-flex overflow-hidden"
                                      >
                                        <Check className="size-3.5" strokeWidth={2.75} />
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                  {sign}
                                </motion.button>
                              </motion.li>
                            );
                          })}
                        </ul>
                        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                          <p className="max-w-xl text-base leading-relaxed text-ink">{area.text}</p>
                          <ButtonLink
                            href={whatsappLink(area.message)}
                            external
                            variant="whatsapp"
                            className="shrink-0 self-start sm:self-auto"
                          >
                            <WhatsAppIcon className="size-4" />
                            Falar sobre {area.title.toLowerCase()}
                          </ButtonLink>
                        </div>
                        {area.crisis && (
                          <p className="mt-5 text-sm text-ink-soft">
                            Pensamentos de morte?{" "}
                            <a
                              href="tel:188"
                              className="font-semibold text-ink underline underline-offset-2 hover:no-underline"
                            >
                              Ligue CVV 188
                            </a>
                            , 24h.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Fragment>
            );
          })}
        </div>

        <p id={`${uid}-privacy`} className="mt-8 flex items-center justify-center gap-1.5 text-center text-sm text-ink-muted">
          <Lock aria-hidden className="size-3.5 shrink-0" />
          Nada do que você marcar é salvo. Sinais não são diagnóstico.
        </p>

        {/* Live summary: always in the DOM so screen readers hear changes; visual bar appears with ≥1 mark. */}
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {count === 0 ? "" : `${count} ${count === 1 ? "sinal marcado" : "sinais marcados"}.`}
        </p>

        <div className="pointer-events-none sticky bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 mt-6 flex justify-start sm:justify-center">
          <AnimatePresence>
            {count > 0 && (
              <motion.div
                key="bar"
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.97 }}
                transition={reduce ? { duration: 0 } : spring}
                role="region"
                aria-label="Sinais que você marcou"
                className="pointer-events-auto flex w-[calc(100%-4rem)] flex-wrap items-center gap-x-3 gap-y-3 rounded-3xl bg-white p-3 pl-5 shadow-[0_12px_40px_rgb(49_46_129/16%)] sm:w-auto sm:flex-nowrap sm:rounded-full sm:py-2 sm:pr-2"
              >
                <div className="order-1 min-w-0 flex-1 sm:flex-none">
                  <p className="text-sm font-semibold text-ink tabular-nums">
                    {count} {count === 1 ? "sinal marcado" : "sinais marcados"}
                  </p>
                  <div aria-hidden className="mt-1.5 h-1 w-24 overflow-hidden rounded-full bg-primary-100">
                    <motion.div
                      className="h-full rounded-full bg-progress"
                      initial={false}
                      animate={{ width: `${Math.max(8, (count / totalSigns) * 100)}%` }}
                      transition={reduce ? { duration: 0 } : spring}
                    />
                  </div>
                </div>
                <ButtonLink
                  href={waHref}
                  external
                  variant="whatsapp"
                  className="order-3 h-10 w-full px-4 sm:order-2 sm:w-auto"
                >
                  <WhatsAppIcon className="size-4" />
                  Conversar sobre isso
                </ButtonLink>
                <button
                  type="button"
                  onClick={() => setMarked([])}
                  className="order-2 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm text-ink-muted transition-colors hover:bg-tint-mist hover:text-ink focus-visible:shadow-focus sm:order-3"
                >
                  <RotateCcw aria-hidden className="size-3.5" />
                  Limpar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </Section>
  );
}
