"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 300, damping: 22 } as const;

/** Maps the normalised pointer offset (-0.5…0.5) to a pixel shift at a given depth. */
function useDepth(value: MotionValue<number>, depth: number) {
  return useTransform(value, (v) => v * depth);
}

/**
 * Small tag floating around the portrait. `initial`/`animate` are identical on server and
 * client; reduced motion only changes the transition (no entrance delay, no loop).
 * The outer layer follows the pointer parallax, the inner one runs the gentle float.
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
    <motion.div className={cn("absolute z-10", className)} style={{ x, y }}>
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.7, delay, ease: EASE }}
      >
        <motion.span
          className={cn(
            "block rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-deep shadow-[0_6px_24px_rgb(79_70_229/8%)]",
            tone,
          )}
          animate={{ y: [0, -drift, 0] }}
          transition={
            reduce ? { duration: 0 } : { duration: 6, delay: delay + 0.7, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {children}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const press = reduce ? { duration: 0 } : SPRING;

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
  const tagAX = useDepth(sx, 26);
  const tagAY = useDepth(sy, 18);
  const tagBX = useDepth(sx, -22);
  const tagBY = useDepth(sy, 14);
  const tagCX = useDepth(sx, 18);
  const tagCY = useDepth(sy, -16);

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine)");
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
            className="text-[clamp(2.6rem,5vw,4.1rem)] leading-[1.08] font-[650] tracking-[-0.035em] text-balance text-ink"
          >
            Você não precisa carregar tudo sozinha
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-soft sm:text-lg">
            Terapia online para mulheres, com acolhimento e base científica (TCC e ACT).
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={press}>
              <ButtonLink
                href={whatsappLink()}
                external
                size="lg"
                className="hover:translate-y-0 active:translate-y-0"
              >
                Agendar sessão
              </ButtonLink>
            </motion.div>
            <Link
              href="#sobre"
              className="group inline-flex items-center gap-2 rounded-sm text-[15px] text-ink-soft transition-colors duration-300 ease-out-soft hover:text-primary"
            >
              Conhecer meu trabalho
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1 group-focus-visible:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] lg:mr-0 lg:max-w-[480px]">
          {/* Soft lilac arch behind the cut-out portrait */}
          <motion.div
            aria-hidden
            style={{ x: archX, y: archY }}
            className="absolute inset-x-[7%] top-[10%] bottom-0 -z-10 rounded-t-full rounded-b-[2.5rem] bg-linear-to-b from-tint-violet via-tint-violet to-tint-lilac"
          >
            <div className="absolute inset-[6%] top-[5%] rounded-t-full rounded-b-[2rem] bg-white/35" />
          </motion.div>

          <motion.div style={{ x: photoX, y: photoY }} className="relative aspect-square">
            <Image
              src="/psicologa-fernanda-lima.webp"
              alt="Fernanda Lima, psicóloga, sorrindo"
              fill
              priority
              sizes="(min-width: 1024px) 480px, (min-width: 480px) 420px, 90vw"
              className="object-contain object-bottom"
            />
          </motion.div>

          <FloatingTag tone="bg-white" delay={0.3} x={tagAX} y={tagAY} className="top-[14%] -left-2 sm:-left-8">
            Acolhimento
          </FloatingTag>
          <FloatingTag
            tone="bg-tint-lilac"
            delay={0.45}
            drift={5}
            x={tagBX}
            y={tagBY}
            className="top-[38%] right-1 sm:top-1/2 sm:-right-6"
          >
            TCC &amp; ACT
          </FloatingTag>
          <FloatingTag
            tone="bg-tint-indigo"
            delay={0.6}
            drift={7}
            x={tagCX}
            y={tagCY}
            className="bottom-8 left-2 sm:-left-6"
          >
            Online · Brasil e exterior
          </FloatingTag>
        </div>
      </Container>
    </section>
  );
}
