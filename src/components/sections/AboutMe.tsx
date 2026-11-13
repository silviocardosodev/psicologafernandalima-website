"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, BookOpen, Brain, Check, GraduationCap, Heart, Pill, Sparkles } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { site, whatsappLink } from "@/lib/site";
import { useRadioKeys } from "@/lib/useRadioKeys";

const goals = [
  "Construir relacionamentos mais saudáveis",
  "Confiar mais em si mesmas",
  "Viver o dia a dia com mais leveza",
  "Lidar melhor com o que sentem",
  "Comunicar limites e necessidades",
  "Lidar com questões que afetam o cotidiano",
];

const education = [
  {
    title: "Graduação em Psicologia",
    icon: GraduationCap,
    status: "Concluída",
    detail: "A base da minha prática clínica: ciência, ética e escuta cuidadosa.",
  },
  {
    title: "Pós-graduação em TCC — PUC",
    icon: BookOpen,
    status: "Em andamento",
    detail: "Aprofundamento contínuo em Terapia Cognitivo-Comportamental, uma das abordagens com mais evidências científicas.",
  },
  {
    title: "Formação em ACT",
    icon: Heart,
    status: "Concluída",
    detail: "Terapia de Aceitação e Compromisso: aprender a acolher o que sentimos e agir de acordo com o que importa para nós.",
  },
  {
    title: "Formação em TCC",
    icon: Brain,
    status: "Concluída",
    detail: "Ferramentas práticas para compreender pensamentos, emoções e comportamentos — e transformá-los.",
  },
  {
    title: "Psicopatologia",
    icon: Sparkles,
    status: "Concluída",
    detail: "Compreensão aprofundada do sofrimento psíquico para um olhar clínico mais preciso.",
  },
  {
    title: "Psicofarmacologia",
    icon: Pill,
    status: "Concluída",
    detail: "Conhecimento sobre medicações para dialogar bem com psiquiatras quando o cuidado é compartilhado.",
  },
];

const educationTitles = education.map((item) => item.title);

const values = ["Afeto", "Confiança", "Acolhimento", "Atenção aos detalhes"];

export function AboutMe() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = education[active];
  const formacaoKeys = useRadioKeys(educationTitles, current.title, (title) =>
    setActive(educationTitles.indexOf(title)),
  );

  return (
    <Section id="sobre" aria-labelledby="sobre-titulo" className="overflow-hidden">
      <Container>
        <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Photo */}
          <Reveal className="relative mx-auto w-full max-w-[460px] lg:sticky lg:top-[calc(var(--header-height)+32px)]">
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-[32px] bg-dots opacity-70" />
            <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-raised">
              <Image
                src="/psicologa-fernanda-lima-2.png"
                alt="Fernanda Lima, psicóloga clínica, sorrindo"
                width={1920}
                height={1920}
                sizes="(min-width: 1024px) 460px, (min-width: 640px) 70vw, 92vw"
                className="aspect-[4/5] h-auto w-full object-cover object-top"
              />
            </div>

            <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary-hover shadow-card ring-1 ring-line backdrop-blur">
              <Brain className="size-3.5" aria-hidden />
              TCC · ACT
            </span>

            <div className="absolute -bottom-6 left-4 right-4 flex items-center gap-3 rounded-xl border border-line bg-surface/95 p-4 shadow-raised backdrop-blur sm:left-auto sm:-right-6 sm:max-w-[290px]">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-100 text-primary">
                <BadgeCheck className="size-5" aria-hidden />
              </span>
              <p className="min-w-0 text-sm leading-snug">
                <span className="block font-semibold tracking-[-0.01em] text-ink">Fernanda Lima</span>
                <span className="block text-ink-muted">
                  Psicóloga Clínica · {site.crp}
                </span>
              </p>
            </div>
          </Reveal>

          {/* Text */}
          <div className="pt-6 lg:pt-0">
            <Reveal>
              <Eyebrow>Sobre mim</Eyebrow>
              <h2
                id="sobre-titulo"
                className="mt-4 text-[32px] leading-[1.12] font-bold tracking-[-0.03em] text-balance text-ink sm:text-[40px] lg:text-[44px]"
              >
                Agora, um pouco sobre mim
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft sm:text-[17px]">
                <p>
                  Fico muito feliz que você tenha chegado até aqui! Sou a Fernanda, psicóloga clínica, pós-graduanda em Terapia Cognitivo-Comportamental pela PUC, com formação em Terapia de
                  Aceitação e Compromisso (ACT), Terapia Cognitivo-Comportamental (TCC), Psicopatologia e
                  Psicofarmacologia.
                </p>
                <p>
                  Meu intuito é te ajudar a atingir seus objetivos, oferecendo um tratamento baseado em evidências científicas
                  para as suas demandas. Nossa relação será sempre pautada em afeto, confiança, acolhimento e atenção aos
                  detalhes.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.05} className="mt-8 rounded-xl border border-line bg-surface p-5 shadow-card sm:p-6">
              <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
                Diariamente, acompanho mulheres que buscam:
              </h3>
              <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {goals.map((goal) => (
                  <li key={goal} className="flex items-start gap-2.5 text-sm leading-snug text-ink-soft">
                    <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-success-bg text-success">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                    {goal}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="mt-8">
              <h3 id="formacao-titulo" className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
                Formação
              </h3>
              <p className="mt-1 text-sm text-ink-muted">Clique ou toque em cada item para saber mais.</p>
              <div
                role="radiogroup"
                aria-labelledby="formacao-titulo"
                className="mt-4 flex flex-wrap gap-2"
              >
                {education.map((item, i) => {
                  const Icon = item.icon;
                  const selected = i === active;
                  return (
                      <button
                        key={item.title}
                        ref={(el) => {
                          formacaoKeys.refs.current[i] = el;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-controls="formacao-detalhe"
                        tabIndex={formacaoKeys.tabIndexFor(i)}
                        onKeyDown={(e) => formacaoKeys.onKeyDown(e, i)}
                        onClick={() => setActive(i)}
                        className={cn(
                          "inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 py-1.5 text-left text-sm font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:shadow-focus",
                          selected
                            ? "border-primary bg-primary-100 text-primary-hover shadow-card"
                            : "border-line bg-surface text-ink-soft hover:-translate-y-px hover:border-primary-200 hover:text-ink hover:shadow-raised",
                        )}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                        {item.title}
                      </button>
                  );
                })}
              </div>
              <div
                id="formacao-detalhe"
                aria-live="polite"
                className="mt-3 min-h-[92px] rounded-lg border border-line-soft bg-primary-100/50 p-4"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current.title}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: reduce ? 0 : 0.18 }}
                  >
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                      {current.title}
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-semibold",
                          current.status === "Em andamento"
                            ? "bg-warning-bg text-warning"
                            : "bg-success-bg text-success",
                        )}
                      >
                        {current.status}
                      </span>
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{current.detail}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <ul aria-label="Valores do meu trabalho" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-ink-soft">
                {values.map((v, i) => (
                  <li key={v} className="flex items-center gap-2">
                    {i > 0 && <span aria-hidden className="size-1 rounded-full bg-primary/50" />}
                    {v}
                  </li>
                ))}
              </ul>
              <ButtonLink href={whatsappLink()} external variant="whatsapp" size="lg" className="shrink-0">
                <WhatsAppIcon />
                Fale comigo
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
