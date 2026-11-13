"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Clock, Lock, Pause, Play, Video, type LucideIcon } from "lucide-react";

import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Step = { title: string; text: string; expect: string[] };

const steps: Step[] = [
  {
    title: "Primeira conversa",
    text: "Você me conta o que te traz, no seu tempo. Juntas, definimos os objetivos.",
    expect: ["Escuta sem julgamentos", "Tirar dúvidas", "Seus objetivos"],
  },
  {
    title: "Sessões semanais",
    text: "Encontros online, num horário que caiba na sua rotina. Usamos ferramentas da TCC e da ACT.",
    expect: ["Seu ritmo", "Ferramentas práticas", "Acompanhamento"],
  },
  {
    title: "Evolução",
    text: "Olhamos juntas para o que vai mudando. Quando fizer sentido, as sessões ficam quinzenais.",
    expect: ["Revisão do caminho", "Mais autonomia", "Sessões quinzenais"],
  },
  {
    title: "Alta",
    text: "Com os objetivos alcançados, encerramos com segurança. Sessões de manutenção seguem possíveis.",
    expect: ["Encerramento combinado", "Autonomia", "Manutenção, se precisar"],
  },
];

const facts: { icon: LucideIcon; label: string }[] = [
  { icon: Clock, label: "≈ 50 min" },
  { icon: Video, label: "Google Meet" },
  { icon: Lock, label: "Sigilo profissional" },
];

const AUTO_MS = 6000;
const spring = { type: "spring", stiffness: 300, damping: 22 } as const;
const ease = [0.22, 1, 0.36, 1] as const;

function ExpectChips({ items, label }: { items: string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="inline-flex items-center gap-1.5 rounded-full bg-tint-lilac px-3 py-1 text-[13px] text-ink-soft"
        >
          <Check aria-hidden className="size-3.5 text-primary" strokeWidth={2.5} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function DesktopStepper() {
  const reduce = useReducedMotion();
  const uid = useId();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4 });

  // Reduced motion: no autoplay by default (the visitor can still opt in with "Retomar").
  useEffect(() => {
    if (reduce) setPlaying(false);
  }, [reduce]);

  const running = playing && !hovered && !focused && inView;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % steps.length), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [running, active]);

  function go(i: number) {
    setPlaying(false);
    setActive(i);
  }

  const step = steps[active];
  const fill = (active / (steps.length - 1)) * 100;
  const detailId = `${uid}-detalhe`;

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="relative">
        <div aria-hidden className="absolute top-[34px] right-[12.5%] left-[12.5%] h-0.5 rounded-full bg-white">
          <motion.div
            className="h-full rounded-full bg-progress"
            initial={false}
            animate={{ width: `${fill}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease }}
          />
        </div>
        <LayoutGroup id={`${uid}-steps`}>
          <ol aria-label="Etapas da terapia" className="relative grid grid-cols-4 gap-2">
            {steps.map((s, i) => {
              const isActive = i === active;
              const done = i < active;
              return (
                <li key={s.title} className="flex justify-center">
                  <motion.button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={isActive ? "step" : undefined}
                    aria-controls={detailId}
                    whileTap={{ scale: 0.97 }}
                    transition={reduce ? { duration: 0 } : spring}
                    className="group relative flex w-full max-w-[190px] flex-col items-center gap-3 rounded-2xl px-3 pt-4 pb-3 text-center focus-visible:shadow-focus"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="journey-active"
                        aria-hidden
                        className="absolute inset-0 rounded-2xl bg-white/70"
                        transition={reduce ? { duration: 0 } : spring}
                      />
                    )}
                    <span
                      className={cn(
                        "relative grid size-9 place-items-center rounded-full text-sm font-semibold tabular-nums transition-colors duration-200",
                        isActive && "bg-primary text-white shadow-primary",
                        done && "bg-primary-200 text-primary-deep",
                        !isActive && !done && "bg-white text-ink-muted group-hover:text-primary",
                      )}
                    >
                      {done ? <Check aria-hidden className="size-4" strokeWidth={2.75} /> : i + 1}
                      {done && <span className="sr-only">{i + 1}</span>}
                    </span>
                    <span
                      className={cn(
                        "relative text-[15px] font-semibold tracking-[-0.015em] transition-colors",
                        isActive ? "text-ink" : "text-ink-soft group-hover:text-ink",
                      )}
                    >
                      {s.title}
                    </span>
                  </motion.button>
                </li>
              );
            })}
          </ol>
        </LayoutGroup>
      </div>

      <div
        id={detailId}
        aria-live={running ? "off" : "polite"}
        className="relative mt-6 overflow-hidden rounded-3xl bg-white"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={reduce ? { duration: 0 } : { duration: 0.25, ease }}
            className="grid gap-6 p-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-10 lg:p-9"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                Etapa {active + 1} de {steps.length}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.015em] text-ink">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink-soft">{step.text}</p>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">O que esperar</p>
              <ExpectChips items={step.expect} label={`O que esperar: ${step.title}`} />
            </div>
          </motion.div>
        </AnimatePresence>

        {playing && (
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-tint-lilac">
            <motion.div
              key={`${active}-${running}`}
              className="h-full origin-left bg-progress"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: running ? 1 : 0 }}
              transition={{ duration: running ? AUTO_MS / 1000 : 0, ease: "linear" }}
            />
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm text-ink-muted transition-colors hover:bg-white/70 hover:text-ink focus-visible:shadow-focus"
        >
          {playing ? <Pause aria-hidden className="size-3.5" /> : <Play aria-hidden className="size-3.5" />}
          {playing ? "Pausar" : "Retomar"}
          <span className="sr-only"> apresentação automática das etapas</span>
        </button>
      </div>
    </div>
  );
}

function MobileAccordion() {
  const reduce = useReducedMotion();
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ol aria-label="Etapas da terapia" className="relative">
      {steps.map((s, i) => {
        const isOpen = open === i;
        const last = i === steps.length - 1;
        const btnId = `${uid}-b${i}`;
        const panelId = `${uid}-p${i}`;
        return (
          <li key={s.title} className="relative pb-2 last:pb-0">
            {!last && (
              <span aria-hidden className="absolute top-12 bottom-0 left-[25px] w-0.5 rounded-full bg-white">
                <motion.span
                  className="block w-full origin-top rounded-full bg-progress"
                  initial={false}
                  animate={{ height: open !== null && i < open ? "100%" : "0%" }}
                  transition={reduce ? { duration: 0 } : { duration: 0.4, ease }}
                />
              </span>
            )}
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center gap-4 rounded-2xl p-2 text-left focus-visible:shadow-focus"
              >
                <span
                  className={cn(
                    "relative z-10 grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums transition-colors duration-200",
                    isOpen ? "bg-primary text-white shadow-primary" : "bg-white text-primary",
                  )}
                >
                  <span className="sr-only">Etapa </span>
                  {i + 1}
                </span>
                <span className="flex-1 text-base font-semibold tracking-[-0.015em] text-ink">{s.title}</span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={reduce ? { duration: 0 } : spring}
                  className="grid text-ink-muted"
                >
                  <ChevronDown className="size-5" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.32, ease }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 mb-3 ml-[52px] rounded-3xl bg-white p-5">
                    <p className="text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
                    <div className="mt-4">
                      <ExpectChips items={s.expect} label={`O que esperar: ${s.title}`} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}

export function Journey() {
  return (
    <Section id="jornada" aria-labelledby="jornada-titulo" className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="rounded-3xl bg-tint-lilac px-5 py-12 sm:px-10 sm:py-14 lg:p-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <Eyebrow>Como funciona</Eyebrow>
              <h2
                id="jornada-titulo"
                className="mt-3 text-[32px] leading-[1.12] font-[650] tracking-[-0.03em] text-balance text-ink sm:text-[40px] lg:text-[46px]"
              >
                Simples, no seu ritmo
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-[17px]">
                Tudo online, de onde você estiver.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <ul aria-label="Detalhes das sessões" className="flex flex-wrap gap-2">
                {facts.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm text-ink-soft"
                  >
                    <Icon aria-hidden className="size-3.5 text-primary" />
                    {label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="mt-10 lg:mt-12">
            <div className="hidden md:block">
              <DesktopStepper />
            </div>
            <div className="md:hidden">
              <MobileAccordion />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
