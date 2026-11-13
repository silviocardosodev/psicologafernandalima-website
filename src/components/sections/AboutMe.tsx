"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { site, whatsappLink } from "@/lib/site";
import { useRadioKeys } from "@/lib/useRadioKeys";

const SPRING = { type: "spring", stiffness: 300, damping: 22 } as const;

const formations = [
  { title: "TCC", status: "Concluída", detail: "Ferramentas práticas para entender pensamentos, emoções e comportamentos." },
  { title: "ACT", status: "Concluída", detail: "Acolher o que você sente e agir de acordo com o que importa." },
  { title: "Pós em TCC (PUC)", status: "Em andamento", detail: "Aprofundamento contínuo em uma das abordagens com mais evidências." },
  { title: "Psicopatologia", status: "Concluída", detail: "Um olhar clínico mais preciso sobre o sofrimento emocional." },
  { title: "Psicofarmacologia", status: "Concluída", detail: "Para dialogar bem com psiquiatras quando o cuidado é compartilhado." },
] as const;

type FormationTitle = (typeof formations)[number]["title"];
const titles = formations.map((f) => f.title) as FormationTitle[];

const goals = ["Mais leveza", "Relações saudáveis", "Autoconfiança", "Limites claros"];

export function AboutMe() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<FormationTitle>("TCC");
  const current = formations.find((f) => f.title === selected) ?? formations[0];
  const keys = useRadioKeys(titles, selected, setSelected);
  const spring = reduce ? { duration: 0 } : SPRING;

  return (
    <Section id="sobre" aria-labelledby="sobre-titulo" className="overflow-hidden">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative mx-auto w-full max-w-[440px]">
            <div
              aria-hidden
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.5rem] bg-tint-lilac sm:translate-x-6 sm:translate-y-6"
            />
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-tint-violet">
              <Image
                src="/psicologa-fernanda-lima-2.webp"
                alt="Fernanda Lima, psicóloga clínica, sorrindo"
                fill
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 70vw, 92vw"
                className="object-cover object-top transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.04]"
              />
            </div>
          </Reveal>

          <Reveal delay={0.05} className="max-w-xl">
            <Eyebrow>Sobre mim</Eyebrow>
            <h2
              id="sobre-titulo"
              className="mt-3 text-[32px] leading-[1.12] font-[650] tracking-[-0.03em] text-balance text-ink sm:text-[40px] lg:text-[46px]"
            >
              Oi, eu sou a Fernanda
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft sm:text-[17px]">
              <p>
                Sou psicóloga clínica ({site.crp}) e atendo mulheres a partir de 18 anos, com TCC e ACT. Sou
                pós-graduanda em TCC pela PUC.
              </p>
              <p>Nossa relação será pautada em acolhimento e confiança — no seu tempo.</p>
            </div>

            {/* Formation chips */}
            <h3 id="formacao-titulo" className="mt-8 text-sm font-medium text-ink">
              Formação
            </h3>
            <div role="radiogroup" aria-labelledby="formacao-titulo" className="mt-3 flex flex-wrap gap-2">
              {formations.map((item, i) => {
                const isSelected = item.title === selected;
                return (
                  <motion.button
                    key={item.title}
                    ref={(el) => {
                      keys.refs.current[i] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-controls="formacao-detalhe"
                    tabIndex={keys.tabIndexFor(i)}
                    onKeyDown={(e) => keys.onKeyDown(e, i)}
                    onClick={() => setSelected(item.title)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={spring}
                    className={cn(
                      "relative inline-flex min-h-10 items-center rounded-full px-4 py-1.5 text-sm transition-colors duration-300 ease-out-soft focus-visible:shadow-focus",
                      isSelected ? "text-white" : "bg-tint-indigo text-primary-deep hover:bg-primary-200",
                    )}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="formacao-pill"
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-primary"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item.title}</span>
                  </motion.button>
                );
              })}
            </div>
            <div
              id="formacao-detalhe"
              aria-live="polite"
              className="mt-3 min-h-[84px] overflow-hidden rounded-3xl bg-tint-mist px-5 py-4"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
                  transition={reduce ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink">
                    {current.title}
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium text-primary-deep",
                        current.status === "Em andamento" ? "bg-tint-orchid" : "bg-primary-100",
                      )}
                    >
                      {current.status === "Em andamento" && (
                        <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                      )}
                      {current.status}
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{current.detail}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Goals */}
            <h3 id="busca-titulo" className="mt-7 text-sm font-medium text-ink">
              Acompanho mulheres que buscam
            </h3>
            <ul aria-labelledby="busca-titulo" className="mt-3 flex flex-wrap gap-2">
              {goals.map((goal) => (
                <li key={goal} className="rounded-full bg-tint-lilac px-3.5 py-1 text-sm text-primary-deep">
                  {goal}
                </li>
              ))}
            </ul>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2 rounded-full text-base font-medium text-primary transition-colors duration-300 ease-out-soft hover:text-primary-deep"
            >
              Fale comigo
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1 group-focus-visible:translate-x-1"
              />
              <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
            </a>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
