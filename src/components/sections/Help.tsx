"use client";

import { Fragment, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Activity, CloudRain, Plus, Users, Wind, type LucideIcon } from "lucide-react";

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
    tint: "bg-tint-sky",
    signs: ["Preocupação constante", "Tensão no corpo", "Coração acelerado", "Falta de ar", "Dificuldade de concentração"],
    text: "Juntas, entendemos como ela aparece e encontramos formas mais leves de lidar.",
    message: "Olá Fernanda! Cheguei pelo seu site e gostaria de conversar sobre ansiedade.",
  },
  {
    id: "relacionamentos",
    title: "Relacionamentos",
    line: "Vínculos que pesam ou machucam.",
    icon: Users,
    tint: "bg-tint-lilac",
    signs: ["Término", "Luto", "Conflitos familiares", "Dificuldade com limites", "Relação abusiva"],
    text: "Um espaço para compreender seus vínculos e cuidar de como você se sente neles.",
    message: "Olá Fernanda! Cheguei pelo seu site e gostaria de conversar sobre meus relacionamentos.",
  },
  {
    id: "depressao",
    title: "Depressão",
    line: "Quando tudo parece perder a cor.",
    icon: CloudRain,
    tint: "bg-tint-rose",
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
    tint: "bg-tint-mint",
    signs: ["Medo intenso", "Coração acelerado", "Tremores", "Falta de ar", "Medo de perder o controle"],
    text: "No seu ritmo, construímos novas formas de lidar com as crises.",
    message: "Olá Fernanda! Cheguei pelo seu site e gostaria de conversar sobre crises de pânico.",
  },
];

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

export function Help() {
  const [open, setOpen] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const uid = useId();

  return (
    <Section id="ajuda" aria-labelledby="ajuda-titulo">
      <Container>
        <SectionHeader
          id="ajuda-titulo"
          eyebrow="Como posso ajudar"
          title="Você não precisa passar por isso sozinha"
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {areas.map((area, i) => {
            const Icon = area.icon;
            const isOpen = open === area.id;
            const btnId = `${uid}-${area.id}-btn`;
            const panelId = `${uid}-${area.id}-panel`;

            return (
              <Fragment key={area.id}>
                <Reveal delay={i * 0.06} className={cn("h-full", cardOrder[i])}>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? panelId : undefined}
                    onClick={() => setOpen(isOpen ? null : area.id)}
                    className={cn(
                      "group flex h-full w-full flex-col items-start rounded-3xl p-6 text-left transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 focus-visible:shadow-focus sm:p-7",
                      area.tint,
                      isOpen && "ring-1 ring-primary/25",
                    )}
                  >
                    <span className="flex w-full items-start justify-between">
                      <span className="grid size-11 place-items-center rounded-full bg-white text-primary">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <Plus
                        aria-hidden
                        className={cn(
                          "size-5 text-ink-muted transition-transform duration-200",
                          isOpen && "rotate-45 text-primary",
                        )}
                      />
                    </span>
                    <span className="mt-8 text-xl font-normal tracking-[-0.015em] text-ink">{area.title}</span>
                    <span className="mt-1.5 text-[15px] leading-snug text-ink-soft">{area.line}</span>
                  </button>
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
                      transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className={cn("col-span-full overflow-hidden", panelOrder[i])}
                    >
                      <div className={cn("rounded-3xl p-6 sm:p-8", area.tint)}>
                        <ul aria-label={`Sinais comuns de ${area.title.toLowerCase()}`} className="flex flex-wrap gap-2">
                          {area.signs.map((sign) => (
                            <li key={sign} className="rounded-full bg-white px-3.5 py-1.5 text-sm text-ink-soft">
                              {sign}
                            </li>
                          ))}
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
                            Conversar sobre isso
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

        <p className="mt-8 text-center text-sm text-ink-muted">
          Sinais não são diagnóstico — a avaliação acontece com cuidado, nas sessões.
        </p>
      </Container>
    </Section>
  );
}
