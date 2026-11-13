"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, Lock, Sofa, TrendingUp, type LucideIcon } from "lucide-react";

import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const cards: { icon: LucideIcon; title: string; text: string; fill: string }[] = [
  { icon: Lock, title: "Sigilo", text: "Plataformas seguras e o mesmo sigilo do presencial.", fill: "bg-tint-lilac" },
  { icon: TrendingUp, title: "Eficácia", text: "Estudos indicam eficácia semelhante à presencial.", fill: "bg-tint-violet" },
  { icon: Sofa, title: "Conforto", text: "Falar de assuntos delicados no seu próprio espaço.", fill: "bg-tint-orchid" },
];

const needs = ["Internet", "Um lugar reservado", "Fones (opcional)"];

const spring = { type: "spring", stiffness: 300, damping: 22 } as const;

export function OnlineTherapy() {
  const reduce = useReducedMotion();

  return (
    <Section id="terapia-online" aria-labelledby="terapia-online-titulo">
      <Container>
        <SectionHeader
          id="terapia-online-titulo"
          eyebrow="Terapia online"
          title="Cuidado de onde você estiver"
          description="Sessões por vídeo, no Brasil ou no exterior."
        />

        <ul className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-14">
          {cards.map(({ icon: Icon, title, text, fill }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.08} className="h-full">
                <motion.div
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  transition={reduce ? { duration: 0 } : spring}
                  className={cn("h-full rounded-3xl p-6 sm:p-7", fill)}
                >
                  <span className="grid size-11 place-items-center rounded-full bg-white text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-8 text-xl font-semibold tracking-[-0.015em] text-ink">{title}</h3>
                  <p className="mt-1.5 text-[15px] leading-snug text-ink-soft">{text}</p>
                </motion.div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.15} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <h3 id="terapia-online-precisa" className="text-sm font-semibold tracking-[-0.01em] text-ink">
            Do que você precisa
          </h3>
          <ul aria-labelledby="terapia-online-precisa" className="flex flex-wrap gap-2">
            {needs.map((need) => (
              <li
                key={need}
                className="inline-flex items-center gap-1.5 rounded-full bg-tint-mist px-3.5 py-1.5 text-sm text-ink-soft"
              >
                <Check aria-hidden className="size-3.5 text-primary" strokeWidth={2.5} />
                {need}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
