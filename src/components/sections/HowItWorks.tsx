"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock, Lock, MapPin, Video, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    title: "Primeira conversa",
    text: "Você conta o que está pesando. Juntas, definimos onde quer chegar.",
  },
  {
    title: "Encontros semanais",
    text: "Ferramentas práticas para usar entre uma sessão e outra.",
  },
  {
    title: "Acompanhamento",
    text: "Olhamos juntas o que já mudou e ajustamos o caminho.",
  },
  {
    title: "Encerramento",
    text: "Quando fizer sentido, encerramos juntas. A porta continua aberta.",
  },
];

const chips: { icon: LucideIcon; label: ReactNode }[] = [
  {
    icon: Clock,
    label: (
      <>
        <span aria-hidden>≈ </span>
        <span className="sr-only">Cerca de </span>50 min por sessão
      </>
    ),
  },
  { icon: Video, label: "Google Meet" },
  { icon: Lock, label: "Sigilo do consultório" },
  { icon: MapPin, label: "De onde você estiver" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function HowItWorks() {
  const reduce = useReducedMotion();
  const draw = reduce ? { duration: 0 } : { duration: 1.2, delay: 0.2, ease };

  return (
    <Section id="como-funciona" aria-labelledby="como-funciona-titulo">
      <Container>
        <div className="rounded-3xl bg-tint-lilac px-5 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <SectionHeader
            id="como-funciona-titulo"
            eyebrow="Como funciona"
            title="Um passo de cada vez"
            description="Terapia online que cabe na sua rotina."
            align="center"
          />

          <Reveal delay={0.05} className="relative mt-12 lg:mt-14">
            {/* Decorative connecting line — draws in once, never loops. */}
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={draw}
              className="pointer-events-none absolute top-[22px] right-[12.5%] left-[12.5%] hidden h-px origin-left bg-lavender/60 lg:block"
            />
            <motion.span
              aria-hidden
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={draw}
              className="pointer-events-none absolute top-6 bottom-6 left-[22px] w-px origin-top bg-lavender/60 lg:hidden"
            />

            <ol className="relative grid gap-4 lg:grid-cols-4 lg:gap-6">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="flex gap-4 transition-transform duration-200 ease-out hover:-translate-y-1 lg:flex-col lg:items-center lg:text-center"
                >
                  <span
                    aria-hidden
                    className="relative grid size-11 shrink-0 place-items-center rounded-full bg-white text-[15px] font-semibold text-primary shadow-card ring-1 ring-primary-200"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 pt-2 lg:pt-0">
                    <h3 className="text-lg font-semibold tracking-[-0.015em] text-ink">
                      <span className="sr-only">Passo {i + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-12 flex flex-wrap justify-center gap-2.5 lg:mt-14" aria-label="Na prática">
              {chips.map(({ icon: Icon, label }, i) => (
                <li
                  key={i}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-ink shadow-xs"
                >
                  <Icon aria-hidden className="size-4 text-primary" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
