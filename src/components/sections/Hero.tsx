"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { ctaLabel, site, whatsappLink } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 300, damping: 22 } as const;

/** Maps the normalised pointer offset (-0.5…0.5) to a pixel shift at a given depth. */
function useDepth(value: MotionValue<number>, depth: number) {
  return useTransform(value, (v) => v * depth);
}

/**
 * Small tag floating by the portrait. `initial`/`animate` are identical on server and
 * client; reduced motion only changes the transition (no entrance delay, no float).
 * It is never hidden (no opacity:0). The outer layer follows the pointer parallax, the
 * inner one runs a gentle float limited to 3 cycles in total (WCAG 2.2.2).
 */
function FloatingTag({
  children,
  className,
  tone,
  delay,
  drift = 6,
  x,
  y,
}: {
  children: ReactNode;
  className?: string;
  tone: string;
  delay: number;
  drift?: number;
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  const reduce = useReducedMotion();

  return (
    <m.div className={cn("absolute z-10", className)} style={{ x, y }}>
      <m.div
        initial={{ y: 8, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.7, delay, ease: EASE }}
      >
        <m.span
          className={cn(
            "block rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-deep shadow-[0_6px_24px_rgb(79_70_229/8%)]",
            tone,
          )}
          animate={{ y: [0, -drift, 0] }}
          transition={
            reduce ? { duration: 0 } : { duration: 6, delay: delay + 0.7, repeat: 2, ease: "easeInOut" }
          }
        >
          {children}
        </m.span>
      </m.div>
    </m.div>
  );
}

/* ------------------------------------------------------------------------------------
 * "Mente acelerada → calma" motif.
 * A few thin lilac strokes start as a tangled scribble (busy mind) and, as the hero
 * scrolls out, fade/flatten while smooth parallel waves draw in (calm). SSR markup is
 * identical for everyone: reduced motion only zeroes durations and pins the scroll-linked
 * values to the calm end state (equal output ranges), never branching initial/animate.
 * ---------------------------------------------------------------------------------- */

type Stroke = { d: string; color: string; opacity: number; width: number };

const TANGLE: Stroke[] = [
  { d: "M30 120 C80 40 140 200 190 90 S260 30 230 150 S120 190 200 60 S350 120 300 170 S250 60 370 100", color: "#747ff5", opacity: 0.58, width: 2.0 },
  { d: "M20 160 C70 90 110 70 150 150 S230 210 260 110 S190 40 160 120 S290 220 340 130 S330 60 385 150", color: "#a5a8ff", opacity: 0.8, width: 1.75 },
  { d: "M40 80 C100 130 90 200 170 170 S210 50 280 90 S330 210 250 180 S200 100 320 70 S370 160 360 190", color: "#c9c3ff", opacity: 0.87, width: 2.25 },
  { d: "M60 190 C40 120 130 100 120 60 S60 140 180 130 S300 40 270 130 S360 200 390 90", color: "#747ff5", opacity: 0.43, width: 1.75 },
  { d: "M90 100 C140 60 210 230 240 120 S140 80 300 150", color: "#a5a8ff", opacity: 0.65, width: 2.0 },
];

/** Same gentle sine for every line, so they read as parallel. */
const wave = (y: number) =>
  `M-60 ${y} Q-20 ${y - 7} 20 ${y} T100 ${y} T180 ${y} T260 ${y} T340 ${y} T420 ${y} T500 ${y}`;

const WAVES: Stroke[] = [
  { d: wave(92), color: "#c9c3ff", opacity: 0.87, width: 1.75 },
  { d: wave(116), color: "#a5a8ff", opacity: 0.72, width: 2.0 },
  { d: wave(140), color: "#747ff5", opacity: 0.51, width: 2.0 },
  { d: wave(164), color: "#a5a8ff", opacity: 0.72, width: 1.75 },
  { d: wave(188), color: "#c9c3ff", opacity: 0.8, width: 2.25 },
];

function MindMotif({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const calm = !!reduce;

  // Tangle unwinds: fades out and flattens vertically.
  const tangleOpacity = useTransform(progress, [0, 0.45], calm ? [0, 0] : [1, 0]);
  const tangleScaleY = useTransform(progress, [0, 0.45], calm ? [0.4, 0.4] : [1, 0.4]);
  // Waves draw in slowly with a soft horizontal drift.
  const wavesLength = useTransform(progress, [0.08, 0.6], calm ? [1, 1] : [0, 1]);
  const wavesOpacity = useTransform(progress, [0.05, 0.3], calm ? [1, 1] : [0, 1]);
  const wavesX = useTransform(progress, [0, 1], calm ? [0, 0] : [0, -28]);

  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 400 400"
      fill="none"
      className="pointer-events-none absolute -inset-x-[6%] top-0 h-auto w-[112%] overflow-visible opacity-70 lg:opacity-100"
    >
      <m.g style={{ opacity: tangleOpacity, scaleY: tangleScaleY, originX: 0.5, originY: 0.35 }}>
        {/* One-time intro: draws in quickly, then settles slightly calmer. */}
        <m.g
          initial={{ opacity: 0, rotate: -5, scale: 1.06 }}
          animate={{ opacity: 0.85, rotate: 0, scale: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 1.6, ease: EASE }}
          style={{ originX: 0.5, originY: 0.5 }}
        >
          {TANGLE.map((s, i) => (
            <m.path
              key={i}
              d={s.d}
              stroke={s.color}
              strokeOpacity={s.opacity}
              strokeWidth={s.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={reduce ? { duration: 0 } : { duration: 0.9, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
            />
          ))}
        </m.g>
      </m.g>

      <m.g style={{ opacity: wavesOpacity, x: wavesX }}>
        {WAVES.map((s, i) => (
          <m.path
            key={i}
            d={s.d}
            stroke={s.color}
            strokeOpacity={s.opacity}
            strokeWidth={s.width}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: wavesLength }}
          />
        ))}
      </m.g>
    </svg>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const press = reduce ? { duration: 0 } : SPRING;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  // Pointer parallax: raw values stay 0 unless a fine pointer is present and motion is allowed.
  const parallaxOn = useRef(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 80, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 80, damping: 20, mass: 0.6 });

  const archX = useDepth(sx, -10);
  const archY = useDepth(sy, -8);
  const photoX = useDepth(sx, 12);
  const photoY = useDepth(sy, 8);
  const tagX = useDepth(sx, 22);
  const tagY = useDepth(sy, 16);

  // Parallax only on desktop: fine pointer + wide viewport, and motion allowed.
  useEffect(() => {
    const query = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const update = () => {
      parallaxOn.current = query.matches && !reduce;
      if (!parallaxOn.current) {
        px.set(0);
        py.set(0);
      }
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [reduce, px, py]);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!parallaxOn.current || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
      ref={sectionRef}
      id="inicio"
      aria-labelledby="hero-titulo"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate overflow-hidden bg-soft pt-[calc(var(--header-height)+3rem)] pb-20 sm:pt-[calc(var(--header-height)+4rem)] sm:pb-28 lg:pb-32"
    >
      {/* One very soft blob for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 size-[560px] -translate-x-1/2 rounded-full bg-tint-violet opacity-70 blur-3xl lg:left-auto lg:right-[-10%] lg:translate-x-0"
      />

      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-xl">
          <h1
            id="hero-titulo"
            className="text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.08] font-[650] tracking-[-0.035em] text-balance text-ink"
          >
            Sua cabeça não para. Nem quando você pode parar.
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-soft sm:text-lg">
            Terapia online para mulheres que dão conta de tudo — e estão cansadas de dar conta sozinhas.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <m.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={press}>
              <ButtonLink
                href={whatsappLink()}
                external
                size="lg"
                className="hover:translate-y-0 active:translate-y-0"
              >
                {ctaLabel}
              </ButtonLink>
            </m.div>
            <Link
              href="#como-funciona"
              className="group inline-flex items-center gap-2 rounded-sm text-[15px] text-ink-soft transition-colors duration-300 ease-out-soft hover:text-primary"
            >
              Como funciona
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1 group-focus-visible:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] lg:mr-0 lg:max-w-[480px]">
          {/* Soft lilac arch behind the cut-out portrait */}
          <m.div
            aria-hidden
            style={{ x: archX, y: archY }}
            className="absolute inset-x-[7%] top-[10%] bottom-0 -z-10 rounded-t-full rounded-b-[2.5rem] bg-linear-to-b from-tint-violet via-tint-violet to-tint-lilac"
          >
            <div className="absolute inset-[6%] top-[5%] rounded-t-full rounded-b-[2rem] bg-white/35" />
          </m.div>

          {/* Busy-mind → calm strokes: above the arch, behind the cut-out portrait. */}
          <MindMotif progress={scrollYProgress} />

          <m.div style={{ x: photoX, y: photoY }} className="relative aspect-square">
            <Image
              src="/psicologa-fernanda-lima.webp"
              alt="Fernanda Lima, psicóloga, sorrindo"
              fill
              priority
              quality={70}
              sizes="(min-width: 1024px) 480px, (min-width: 480px) 420px, 90vw"
              className="object-contain object-bottom"
            />
          </m.div>

          <FloatingTag
            tone="bg-white"
            delay={0.3}
            x={tagX}
            y={tagY}
            className="bottom-6 left-2 sm:bottom-10 sm:left-auto sm:-right-4"
          >
            {site.crp} · TCC e ACT
          </FloatingTag>
        </div>
      </Container>
    </section>
  );
}
