"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Check, Globe2, Headphones, Lock, MonitorSmartphone, Sofa, TrendingUp, Video, DoorClosed } from "lucide-react";

import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const advantages = [
  {
    icon: Lock,
    title: "Sigilo",
    text: "As sessões acontecem por videochamada em plataformas seguras, seguindo as mesmas regras de sigilo da terapia presencial.",
  },
  {
    icon: TrendingUp,
    title: "Eficácia",
    text: "Estudos, especialmente após a pandemia, mostram que a terapia online tem resultados equivalentes aos da terapia presencial.",
  },
  {
    icon: Sofa,
    title: "Conforto",
    text: "Algumas pessoas se sentem mais à vontade para falar de assuntos delicados estando no próprio ambiente.",
  },
];

const needs = [
  { icon: MonitorSmartphone, label: "Celular ou computador com internet" },
  { icon: DoorClosed, label: "Um ambiente com privacidade" },
  { icon: Headphones, label: "Fones de ouvido (opcional)" },
];

const facts = [
  { icon: CalendarClock, label: "Sessões de ~50 min" },
  { icon: Video, label: "Google Meet" },
  { icon: Globe2, label: "Brasil e exterior" },
];

export function OnlineTherapy() {
  const reduce = useReducedMotion();

  return (
    <Section id="terapia-online" aria-labelledby="terapia-online-titulo" className="py-12 sm:py-16 lg:py-20">
      <Container className="px-0 sm:px-6 lg:px-10">
        <div className="relative isolate overflow-hidden bg-hero px-5 py-16 text-white sm:rounded-2xl sm:px-10 sm:py-20 lg:px-16 lg:py-24">
          <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 -z-10 size-[420px] rounded-full bg-lavender/30 blur-3xl" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(rgb(255_255_255/14%)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(180deg,black,transparent_70%)]"
          />

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
            <Reveal>
              <Eyebrow tone="light">Terapia online</Eyebrow>
              <h2
                id="terapia-online-titulo"
                className="mt-4 text-[32px] leading-[1.12] font-bold tracking-[-0.03em] text-balance sm:text-[40px] lg:text-[44px]"
              >
                Como funciona a terapia online?
              </h2>
              <div className="mt-5 max-w-2xl space-y-4 text-base leading-relaxed text-white/85 sm:text-lg">
                <p>
                  A estrutura é a mesma da sessão presencial, e estudos indicam eficácia semelhante à da terapia
                  presencial — com a vantagem de você não precisar se deslocar.
                </p>
                <p>
                  Atendo mulheres a partir de 18 anos, de qualquer estado do Brasil ou de outro país, com um trabalho
                  pautado pela Terapia Cognitivo-Comportamental (TCC) e pela Terapia de Aceitação e Compromisso (ACT).
                </p>
              </div>
              <ul className="mt-7 flex flex-wrap gap-2">
                {facts.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20"
                  >
                    <Icon className="size-3.5" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="rounded-xl bg-white/8 p-5 ring-1 ring-white/15 backdrop-blur-sm sm:p-6">
              <h3 className="text-[15px] font-semibold tracking-[-0.01em]">Do que você precisa</h3>
              <ul className="mt-4 space-y-3">
                {needs.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm text-white/90">
                    <span className="grid size-8 shrink-0 place-items-center rounded-md bg-white/12 text-white">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="flex-1">{label}</span>
                    <Check className="size-4 shrink-0 text-emerald-300" aria-hidden />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <ul className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-16">
            {advantages.map(({ icon: Icon, title, text }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={reduce ? { duration: 0 } : { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-xl bg-white/8 p-6 ring-1 ring-white/15 backdrop-blur-sm transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:bg-white/12 hover:shadow-[0_16px_40px_rgb(10_8_40/30%)] hover:ring-white/25"
              >
                <span className="grid size-11 place-items-center rounded-md bg-white text-primary shadow-card transition-transform duration-200 group-hover:scale-105">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{text}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
