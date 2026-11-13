"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BatteryLow,
  Brain,
  Check,
  HandHeart,
  HeartCrack,
  Lock,
  RotateCcw,
  Scale,
  Moon,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

type Moment = {
  id: string;
  icon: LucideIcon;
  title: string;
  text: string;
  /** Short label used in the WhatsApp message. */
  topic: string;
};

const moments: Moment[] = [
  {
    id: "mente",
    icon: Brain,
    title: "Sua mente não desacelera",
    text: "Pensamentos que não dão trégua, nem na hora de dormir.",
    topic: "mente que não desacelera",
  },
  {
    id: "cobranca",
    icon: Scale,
    title: "Você se cobra demais",
    text: "O que você faz nunca parece suficiente.",
    topic: "autocobrança",
  },
  {
    id: "descanso",
    icon: Moon,
    title: "Descansar vem com culpa",
    text: "Até a pausa parece mais uma obrigação.",
    topic: "culpa ao descansar",
  },
  {
    id: "sobrecarga",
    icon: HandHeart,
    title: "Você sustenta muita coisa",
    text: "Cuida de todos e quase não sobra espaço para você.",
    topic: "sobrecarga",
  },
  {
    id: "ansiedade",
    icon: Wind,
    title: "Ansiedade no dia a dia",
    text: "Preocupação constante, tensão e sensação de alerta.",
    topic: "ansiedade no dia a dia",
  },
  {
    id: "relacoes",
    icon: HeartCrack,
    title: "Relações que machucam",
    text: "Vínculos que trazem mais dor do que acolhimento.",
    topic: "relações que machucam",
  },
  {
    id: "cansaco",
    icon: BatteryLow,
    title: "Cansaço e falta de ânimo",
    text: "O que antes dava prazer hoje parece pesado.",
    topic: "cansaço e falta de ânimo",
  },
  {
    id: "panico",
    icon: Zap,
    title: "Medo de crises ou do pânico",
    text: "Receio de perder o controle a qualquer momento.",
    topic: "medo de crises ou do pânico",
  },
];

function joinList(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

type Tier = "empty" | "some" | "many";

const feedback: Record<Tier, { title: string; text: string }> = {
  empty: {
    title: "Comece por onde fizer sentido",
    text: "Não existe resposta certa. Marque os momentos que se parecem com o que você tem vivido ultimamente.",
  },
  some: {
    title: "Obrigada por se permitir olhar para isso",
    text: "Reconhecer o que você sente já é um passo importante. Esses sinais merecem atenção e cuidado — e falar sobre eles pode trazer mais clareza.",
  },
  many: {
    title: "Você não precisa passar por isso sozinha",
    text: "Quando vários desses momentos aparecem juntos, a terapia pode ser um espaço seguro para entender o que está acontecendo e construir novas formas de lidar com isso.",
  },
};

export function Identification() {
  const [selected, setSelected] = useState<string[]>([]);
  const reduce = useReducedMotion();

  const count = selected.length;
  const tier: Tier = count === 0 ? "empty" : count < 3 ? "some" : "many";
  const message = feedback[tier];

  const waHref = useMemo(() => {
    const topics = moments.filter((m) => selected.includes(m.id)).map((m) => m.topic);
    return whatsappLink(
      `Olá Fernanda! Cheguei aqui por meio do seu site e gostaria de saber mais sobre a terapia. Tenho me identificado com: ${joinList(topics)}.`,
    );
  }, [selected]);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const percent = (count / moments.length) * 100;

  return (
    <Section id="para-voce" aria-labelledby="para-voce-title">
      <Container>
        <SectionHeader
          id="para-voce-title"
          eyebrow="Para você"
          title="Você se reconhece em algum destes momentos?"
          description="Marque o que faz sentido para você hoje."
        />

        <div className="mt-12 grid items-start gap-6 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
          {/* Selectable cards */}
          <Reveal>
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4" aria-label="Momentos para marcar">
              {moments.map((m) => {
                const pressed = selected.includes(m.id);
                const Icon = m.icon;
                return (
                  <li key={m.id} className="flex">
                    <button
                      type="button"
                      aria-pressed={pressed}
                      onClick={() => toggle(m.id)}
                      className={cn(
                        "group relative flex w-full items-start gap-3.5 rounded-lg border p-4 pr-11 text-left shadow-card sm:p-5 sm:pr-12",
                        "transition-[border-color,box-shadow,transform,background-color] duration-150 ease-out",
                        "hover:-translate-y-px hover:shadow-raised active:translate-y-0 focus-visible:shadow-focus",
                        pressed
                          ? "border-primary bg-primary-100/60 ring-1 ring-primary"
                          : "border-line bg-surface hover:border-primary-200",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-md transition-colors duration-150",
                          pressed ? "bg-primary text-white" : "bg-primary-100 text-primary",
                        )}
                      >
                        <Icon className="size-5" strokeWidth={1.75} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] leading-snug font-semibold tracking-[-0.01em] text-ink">
                          {m.title}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{m.text}</span>
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "absolute top-4 right-4 grid size-5 place-items-center rounded-full border transition-[background-color,border-color,transform] duration-150",
                          pressed
                            ? "scale-100 border-primary bg-primary text-white"
                            : "border-line-control/60 bg-surface text-transparent group-hover:border-primary",
                        )}
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* Feedback panel */}
          <Reveal delay={0.08} className="lg:sticky lg:top-[calc(var(--header-height)+24px)]">
            <aside
              aria-label="Seu momento"
              className="overflow-hidden rounded-xl border border-line bg-surface shadow-card"
            >
              <div className="bg-soft px-5 pt-5 pb-4 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold tracking-[0.05em] text-ink-muted uppercase">Seu momento</span>
                  <span className="text-sm font-semibold text-ink tabular-nums">
                    {count} <span className="font-normal text-ink-muted">de {moments.length}</span>
                  </span>
                </div>
                <div aria-hidden className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-200/70">
                  <motion.div
                    className="h-full rounded-full bg-progress"
                    initial={false}
                    animate={{ width: `${percent}%` }}
                    transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <div className="px-5 pt-4 pb-5 sm:px-6 sm:pb-6">
                <div aria-live="polite" aria-atomic="true" className="min-h-[132px]">
                  <span className="sr-only">
                    {count === 0
                      ? "Nenhum momento marcado."
                      : `${count} ${count === 1 ? "momento marcado" : "momentos marcados"}.`}
                  </span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={tier}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={reduce ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
                    >
                      <p className="text-lg leading-snug font-semibold tracking-[-0.02em] text-ink">{message.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{message.text}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {tier === "many" && (
                  <ButtonLink href={waHref} external variant="whatsapp" size="lg" className="mt-5 w-full">
                    <WhatsAppIcon className="size-5" />
                    Conversar com a Fernanda
                  </ButtonLink>
                )}

                {tier !== "empty" && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <Link
                      href="#atuacao"
                      className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
                    >
                      Ver como a terapia pode ajudar
                      <ArrowRight aria-hidden className="size-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSelected([])}
                      className="inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      <RotateCcw aria-hidden className="size-3.5" />
                      Limpar
                    </button>
                  </div>
                )}

                <p className="mt-5 flex items-start gap-2 border-t border-line-soft pt-4 text-xs leading-relaxed text-ink-muted">
                  <Lock aria-hidden className="mt-px size-3.5 shrink-0" />
                  Nada do que você marcar é salvo ou enviado — só entra na mensagem se você decidir
                  conversar. Isto não é um teste nem um diagnóstico.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
