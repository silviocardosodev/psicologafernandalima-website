"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock,
  Flag,
  MessageCircle,
  Pause,
  Play,
  Repeat,
  Sparkles,
  TrendingUp,
  Video,
  type LucideIcon,
} from "lucide-react";

import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Step = {
  icon: LucideIcon;
  meta: string;
  title: string;
  text: string;
  expect: string[];
};

const steps: Step[] = [
  {
    icon: MessageCircle,
    meta: "Primeira sessão",
    title: "Atendimento inicial",
    text: "Na primeira sessão, nos conheceremos e você terá espaço para contar o que tem vivido e quais são seus objetivos com a terapia.",
    expect: [
      "Escuta acolhedora e sem julgamentos",
      "Conversa sobre sua história e o momento atual",
      "Definição conjunta dos objetivos da terapia",
    ],
  },
  {
    icon: CalendarCheck,
    meta: "Semanal",
    title: "Sessões semanais",
    text: "Ao longo das semanas, você traz suas questões do dia a dia e, em paralelo, trabalhamos os objetivos definidos no início.",
    expect: [
      "Espaço para o que surgir na sua semana",
      "Ferramentas da TCC e da ACT aplicadas à sua rotina",
      "Acompanhamento dos objetivos combinados",
    ],
  },
  {
    icon: TrendingUp,
    meta: "Quinzenal",
    title: "Evolução",
    text: "Com uma evolução consistente, as sessões podem passar a ser quinzenais, preparando a alta terapêutica.",
    expect: [
      "Revisão do caminho percorrido até aqui",
      "Sessões quinzenais, quando fizer sentido para você",
      "Mais autonomia para aplicar o que foi construído",
    ],
  },
  {
    icon: Flag,
    meta: "Conclusão",
    title: "Alta terapêutica",
    text: "Quando seus objetivos forem alcançados e você tiver estratégias para lidar com suas questões sem acompanhamento, estará pronta para a alta — com a possibilidade de sessões de manutenção.",
    expect: [
      "Encerramento planejado em conjunto",
      "Estratégias para seguir com autonomia",
      "Possibilidade de sessões de manutenção",
    ],
  },
];

const facts: { icon: LucideIcon; value: string; label: string }[] = [
  { icon: Clock, value: "≈ 50 min", label: "por sessão" },
  { icon: Repeat, value: "Semanal", label: "frequência inicial" },
  { icon: Video, value: "Google Meet", label: "de onde você estiver" },
  { icon: Sparkles, value: "TCC & ACT", label: "abordagens da terapia" },
];

const AUTO_MS = 6000;

function ExpectList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
          <span aria-hidden className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-success-bg text-success">
            <Check className="size-3" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function DesktopStepper() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4 });

  const autoplayEnabled = !reduce;
  const running = autoplayEnabled && playing && !hovered && !focused && inView;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setActive((i) => (i + 1) % steps.length), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [running, active]);

  function go(i: number) {
    setPlaying(false);
    setActive(Math.max(0, Math.min(steps.length - 1, i)));
  }

  const step = steps[active];
  const Icon = step.icon;
  const fill = (active / (steps.length - 1)) * 100;

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
      {/* Timeline */}
      <div className="relative">
        <div aria-hidden className="absolute top-5 right-[12.5%] left-[12.5%] h-0.5 rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-progress"
            initial={false}
            animate={{ width: `${fill}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <ol aria-label="Etapas da jornada terapêutica" className="relative grid grid-cols-4">
          {steps.map((s, i) => {
            const isActive = i === active;
            const done = i < active;
            return (
              <li key={s.title} className="flex justify-center">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={isActive ? "step" : undefined}
                  aria-controls="jornada-detalhe"
                  className="group flex flex-col items-center gap-3 rounded-lg px-3 pb-2 text-center"
                >
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-full border-2 text-sm font-bold tabular-nums transition-[background-color,border-color,color,box-shadow,transform] duration-200",
                      isActive && "scale-110 border-primary bg-primary text-white shadow-primary",
                      done && "border-primary bg-primary-100 text-primary",
                      !isActive && !done && "border-line-hover bg-surface text-ink-muted group-hover:border-primary-200 group-hover:text-primary",
                    )}
                  >
                    {done ? <Check aria-hidden className="size-4" strokeWidth={3} /> : i + 1}
                    {done && <span className="sr-only">{i + 1}</span>}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs font-semibold tracking-[0.05em] text-ink-muted uppercase">{s.meta}</span>
                    <span
                      className={cn(
                        "mt-0.5 text-[15px] font-semibold tracking-[-0.01em] transition-colors",
                        isActive ? "text-primary" : "text-ink group-hover:text-primary-hover",
                      )}
                    >
                      {s.title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Detail card */}
      <div
        id="jornada-detalhe"
        aria-live={running ? "off" : "polite"}
        className="relative mt-8 overflow-hidden rounded-2xl border border-line bg-surface shadow-raised"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8 p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:p-10"
          >
            <div className="flex gap-5">
              <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-md bg-primary-100 text-primary">
                <Icon className="size-5.5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-[0.05em] text-primary uppercase">
                  Etapa {active + 1} de {steps.length}
                </p>
                <h3 className="mt-1.5 text-2xl font-bold tracking-[-0.025em] text-ink">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </div>
            <div className="rounded-xl border border-line-soft bg-bg p-5">
              <p className="mb-3 text-xs font-semibold tracking-[0.05em] text-ink-muted uppercase">O que esperar</p>
              <ExpectList items={step.expect} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Autoplay progress */}
        {autoplayEnabled && playing && (
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-line-soft">
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

      {/* Controls */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(active - 1)}
            disabled={active === 0}
            aria-label="Etapa anterior"
            className="grid size-10 place-items-center rounded-md border border-line-hover bg-surface text-ink shadow-xs transition-colors hover:border-line-control hover:bg-surface-hover disabled:pointer-events-none disabled:opacity-45"
          >
            <ArrowLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            disabled={active === steps.length - 1}
            aria-label="Próxima etapa"
            className="grid size-10 place-items-center rounded-md border border-line-hover bg-surface text-ink shadow-xs transition-colors hover:border-line-control hover:bg-surface-hover disabled:pointer-events-none disabled:opacity-45"
          >
            <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>
        {autoplayEnabled && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={!playing}
            className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
          >
            {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
            {playing ? "Pausar apresentação" : "Retomar apresentação"}
          </button>
        )}
      </div>
    </div>
  );
}

function MobileTimeline() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ol aria-label="Etapas da jornada terapêutica" className="relative">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const isOpen = open === i;
        const last = i === steps.length - 1;
        return (
          <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && (
              <span aria-hidden className="absolute top-11 bottom-1 left-[19px] w-0.5 rounded-full bg-line">
                <span
                  className={cn(
                    "block h-full w-full rounded-full bg-progress transition-opacity duration-300",
                    open !== null && i < open ? "opacity-100" : "opacity-0",
                  )}
                />
              </span>
            )}
            <span
              aria-hidden
              className={cn(
                "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 text-sm font-bold tabular-nums transition-colors",
                isOpen ? "border-primary bg-primary text-white shadow-primary" : "border-primary-200 bg-surface text-primary",
              )}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1 rounded-lg border border-line bg-surface p-4 shadow-card">
              <div className="flex items-start gap-3">
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-md bg-primary-100 text-primary">
                  <Icon className="size-4.5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.05em] text-ink-muted uppercase">
                    <span className="sr-only">Etapa {i + 1}: </span>
                    {s.meta}
                  </p>
                  <h3 className="mt-0.5 text-base font-semibold tracking-[-0.01em] text-ink">{s.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.text}</p>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`jornada-esperar-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-primary hover:text-primary-hover"
              >
                O que esperar
                <ChevronDown
                  aria-hidden
                  className={cn("size-4 transition-transform duration-200", isOpen && "rotate-180")}
                />
              </button>
              <div id={`jornada-esperar-${i}`} hidden={!isOpen} className="mt-3 border-t border-line-soft pt-3">
                <ExpectList items={s.expect} />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Journey() {
  return (
    <Section id="jornada" aria-labelledby="jornada-title" className="border-y border-line bg-surface">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-soft opacity-60" />
      <Container className="relative">
        <SectionHeader
          id="jornada-title"
          eyebrow="Como funciona"
          title="Sua jornada terapêutica em quatro etapas"
          description="Cada processo é único, mas o caminho costuma seguir estas etapas — sempre no seu ritmo."
        />

        <Reveal className="mt-12 lg:mt-14">
          <div className="hidden md:block">
            <DesktopStepper />
          </div>
          <div className="md:hidden">
            <MobileTimeline />
          </div>
        </Reveal>

        <Reveal delay={0.06} className="mt-10 lg:mt-12">
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {facts.map((f) => {
              const Icon = f.icon;
              return (
                <li
                  key={f.value}
                  className="flex items-center gap-3 rounded-lg border border-line bg-surface p-3.5 shadow-card sm:p-4"
                >
                  <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-md bg-primary-100 text-primary sm:size-10">
                    <Icon className="size-4.5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold tracking-[-0.01em] text-ink sm:text-[15px]">{f.value}</span>
                    <span className="block text-xs leading-snug text-ink-muted sm:text-[13px]">{f.label}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
