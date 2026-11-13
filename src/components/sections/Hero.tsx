"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, BadgeCheck, Brain, Clock3, Globe, ShieldCheck } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Section";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { site, whatsappLink } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const trustItems = [
  { icon: ShieldCheck, label: "Sigilo garantido · CFP" },
  { icon: Globe, label: "Atendimento no Brasil e exterior" },
  { icon: BadgeCheck, label: site.crp },
];

/** Parallax offset for one layer, in px, from normalized pointer position (-0.5..0.5). */
function useLayer(x: MotionValue<number>, y: MotionValue<number>, depth: number) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return { x: tx, y: ty };
}

function FloatingCard({
  children,
  className,
  delay,
  floatDistance = 8,
  duration = 6,
  parallax,
  reduce,
}: {
  children: ReactNode;
  className?: string;
  delay: number;
  floatDistance?: number;
  duration?: number;
  parallax: { x: MotionValue<number>; y: MotionValue<number> };
  reduce: boolean;
}) {
  return (
    <motion.div
      className={cn("absolute z-20", className)}
      style={parallax}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, delay, ease: EASE }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -floatDistance, 0] }}
        transition={reduce ? undefined : { duration, delay: delay + 0.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-3 rounded-xl border border-white/70 bg-white/85 px-3.5 py-3 shadow-raised backdrop-blur-md sm:px-4"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function HeroVisual() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const [finePointer, setFinePointer] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 120, damping: 20, mass: 0.6 });

  const blob = useLayer(sx, sy, -10);
  const dots = useLayer(sx, sy, -18);
  const portrait = useLayer(sx, sy, 6);
  const cardA = useLayer(sx, sy, 22);
  const cardB = useLayer(sx, sy, 16);
  const cardC = useLayer(sx, sy, 26);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const parallaxOn = finePointer && !reduce;

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!parallaxOn || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative mx-auto aspect-[4/5] w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[520px]"
    >
      {/* Dotted texture */}
      <motion.div
        aria-hidden
        style={parallaxOn ? dots : undefined}
        className="absolute -top-2 -right-1 h-[55%] w-[60%] rounded-2xl bg-dots [mask-image:radial-gradient(closest-side,#000_55%,transparent)] sm:-right-6"
      />
      <motion.div
        aria-hidden
        style={parallaxOn ? dots : undefined}
        className="absolute bottom-6 -left-1 h-[35%] w-[45%] rounded-2xl bg-dots [mask-image:radial-gradient(closest-side,#000_50%,transparent)] sm:-left-6"
      />

      {/* Brand arch */}
      <motion.div
        aria-hidden
        style={parallaxOn ? blob : undefined}
        initial={{ scale: 0.94 }}
        animate={{ scale: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.8, ease: EASE }}
        className="absolute inset-x-[7%] top-[14%] bottom-0 overflow-hidden rounded-t-[999px] rounded-b-2xl bg-brand shadow-[0_30px_80px_-20px_rgb(79_70_229/45%)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/45%),transparent_55%)]" />
        <div className="absolute inset-x-[12%] top-[10%] aspect-square rounded-full border border-white/25" />
        <div className="absolute inset-x-[24%] top-[22%] aspect-square rounded-full border border-white/20" />
      </motion.div>

      {/* Portrait cut-out */}
      <motion.div
        style={parallaxOn ? portrait : undefined}
        initial={{ y: 24 }}
        animate={{ y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.8, delay: 0.1, ease: EASE }}
        className="absolute inset-x-0 top-0 bottom-0 z-10"
      >
        <Image
          src="/psicologa-fernanda-lima.png"
          alt="Psicóloga Fernanda Lima sorrindo, em retrato"
          fill
          priority
          sizes="(min-width: 1024px) 520px, (min-width: 640px) 460px, 90vw"
          className="object-contain object-bottom drop-shadow-[0_20px_30px_rgb(49_46_129/22%)]"
        />
      </motion.div>

      {/* Floating glass cards */}
      <FloatingCard
        reduce={reduce}
        parallax={cardA}
        delay={0.5}
        className="top-[18%] left-0 sm:-left-8 lg:-left-14"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-100 text-primary">
          <Clock3 className="size-[18px]" aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block text-[13px] font-semibold tracking-[-0.01em] text-ink">Sessões de ~50 min</span>
          <span className="block text-xs text-ink-muted">Encontros semanais</span>
        </span>
      </FloatingCard>

      <FloatingCard
        reduce={reduce}
        parallax={cardB}
        delay={0.65}
        duration={7}
        floatDistance={10}
        className="top-[46%] right-0 sm:-right-6 lg:-right-10"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-hero text-white">
          <Brain className="size-[18px]" aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block text-xs text-ink-muted">Abordagem</span>
          <span className="block text-[13px] font-semibold tracking-[-0.01em] text-ink">TCC &amp; ACT</span>
        </span>
      </FloatingCard>

      <FloatingCard
        reduce={reduce}
        parallax={cardC}
        delay={0.8}
        duration={6.5}
        floatDistance={6}
        className="bottom-[6%] left-[4%] sm:-left-4 lg:-left-8"
      >
        <span className="relative flex size-2.5 shrink-0" aria-hidden>
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22c55e] opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex size-2.5 rounded-full bg-[#16a34a]" />
        </span>
        <span className="text-[13px] font-semibold tracking-[-0.01em] text-ink">
          Agenda aberta <span className="font-normal text-ink-soft">para novas pacientes</span>
        </span>
      </FloatingCard>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  // Above-the-fold copy stays visible on first paint (no opacity:0 in SSR): only slide it in.
  // initial/animate are identical on server and client; reduced motion only zeroes the duration.
  const slideUp = (delay = 0, y = 14) => ({
    initial: { y },
    animate: { y: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.6, delay, ease: EASE },
  });

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-10 pb-20 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-28"
    >
      {/* Background atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_10%,var(--color-primary-200)_0%,transparent_70%),radial-gradient(45%_45%_at_0%_30%,var(--color-lavender-soft)_0%,transparent_70%),linear-gradient(180deg,var(--color-primary-100)_0%,var(--color-bg)_70%)]" />
        <div className="absolute inset-x-0 top-0 h-[480px] bg-dots opacity-50 [mask-image:linear-gradient(180deg,#000,transparent)]" />
      </div>

      <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
        {/* Copy */}
        <div className="max-w-[620px]">
          <motion.div {...slideUp(0, 18)}>
            <Eyebrow>Terapia online · Brasil e exterior</Eyebrow>
          </motion.div>

          <motion.h1
            id="hero-title"
            {...slideUp()}
            className="mt-5 text-[clamp(2.5rem,1.6rem+3.6vw,4rem)] leading-[1.04] font-bold tracking-[-0.035em] text-balance text-ink"
          >
            Você não precisa carregar tudo{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="bg-[linear-gradient(120deg,#4f46e5_0%,#4338ca_50%,#312e81_100%)] bg-clip-text text-transparent">
                sozinha
              </span>
              <svg
                aria-hidden
                viewBox="0 0 220 16"
                preserveAspectRatio="none"
                className="absolute -bottom-1.5 left-0 h-[0.22em] w-full text-primary/45"
              >
                <motion.path
                  d="M3 11 C 50 3, 120 3, 217 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.9, delay: 0.55, ease: EASE }}
                />
              </svg>
            </span>
            .
          </motion.h1>

          <motion.p
            {...slideUp(0.12, 18)}
            className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-ink-soft sm:text-lg"
          >
            Terapia online individual para mulheres a partir de 18 anos, com base na Terapia
            Cognitivo-Comportamental (TCC) e na Terapia de Aceitação e Compromisso (ACT). Um espaço
            seguro e acolhedor para cuidar de você, no conforto da sua casa.
          </motion.p>

          <motion.div {...slideUp(0.18, 18)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={whatsappLink()} external variant="whatsapp" size="lg" className="w-full sm:w-auto">
              <WhatsAppIcon className="size-5" />
              Agendar pelo WhatsApp
            </ButtonLink>
            <ButtonLink href="#jornada" variant="outline" size="lg" className="group w-full sm:w-auto">
              Como funciona
              <ArrowDown
                className="size-4 transition-transform duration-150 group-hover:translate-y-0.5"
                aria-hidden
              />
            </ButtonLink>
          </motion.div>

          <motion.ul
            {...slideUp(0.24, 18)}
            aria-label="Garantias do atendimento"
            className="mt-9 flex flex-wrap gap-x-5 gap-y-3 border-t border-line pt-6"
          >
            {trustItems.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-[13.5px] font-medium tracking-[-0.01em] text-ink-soft">
                <span className="grid size-7 place-items-center rounded-full bg-surface text-primary shadow-card ring-1 ring-line-soft">
                  <Icon className="size-[15px]" aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Visual */}
        <div className="px-2 sm:px-8 lg:px-0">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
