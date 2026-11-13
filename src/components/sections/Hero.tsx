"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Tiny pastel tag floating around the portrait. `initial`/`animate` are identical on server and
 * client; reduced motion only changes the transition (no entrance delay, no loop).
 */
function FloatingTag({
  children,
  className,
  tone,
  delay,
  drift = 6,
}: {
  children: ReactNode;
  className?: string;
  tone: string;
  delay: number;
  drift?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn("absolute z-10", className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, delay, ease: EASE }}
    >
      <motion.span
        className={cn(
          "block rounded-full px-4 py-2 text-sm whitespace-nowrap text-ink shadow-[0_2px_10px_rgb(17_24_39/4%)]",
          tone,
        )}
        animate={{ y: [0, -drift, 0] }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 6, delay: delay + 0.6, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {children}
      </motion.span>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className="relative isolate overflow-hidden bg-soft pt-[calc(var(--header-height)+3rem)] pb-20 sm:pt-[calc(var(--header-height)+4rem)] sm:pb-28 lg:pb-32"
    >
      {/* One very soft blob for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 -z-10 size-[560px] -translate-x-1/2 rounded-full bg-tint-sky opacity-70 blur-3xl lg:left-auto lg:right-[-10%] lg:translate-x-0"
      />

      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="max-w-xl">
          <h1
            id="hero-titulo"
            className="text-[clamp(2.6rem,5vw,4.1rem)] leading-[1.1] font-normal tracking-[-0.03em] text-balance text-ink"
          >
            Você não precisa carregar tudo sozinha
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-soft sm:text-lg">
            Terapia online para mulheres, com acolhimento e base científica (TCC e ACT).
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <ButtonLink href={whatsappLink()} external size="lg">
              Agendar sessão
            </ButtonLink>
            <Link
              href="#sobre"
              className="group inline-flex items-center gap-2 rounded-sm text-[15px] text-ink-soft transition-colors duration-150 hover:text-ink"
            >
              Conhecer meu trabalho
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] lg:mr-0 lg:max-w-[460px]">
          {/* Soft pastel shape behind the photo */}
          <div
            aria-hidden
            className="absolute -inset-x-4 top-8 -bottom-4 -z-10 rounded-[3rem] bg-tint-lilac sm:-inset-x-6"
          />

          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-tint-indigo">
            <Image
              src="/psicologa-fernanda-lima-2.webp"
              alt="Fernanda Lima, psicóloga, sorrindo"
              fill
              priority
              sizes="(min-width: 1024px) 460px, (min-width: 480px) 420px, 90vw"
              className="object-cover object-top"
            />
          </div>

          <FloatingTag tone="bg-tint-rose" delay={0.3} className="top-10 -left-2 sm:-left-8">
            Acolhimento
          </FloatingTag>
          <FloatingTag tone="bg-tint-mint" delay={0.45} drift={5} className="top-1/2 -right-2 sm:-right-8">
            TCC &amp; ACT
          </FloatingTag>
          <FloatingTag tone="bg-tint-sky" delay={0.6} drift={7} className="bottom-8 left-4 sm:-left-6">
            Online · Brasil e exterior
          </FloatingTag>
        </div>
      </Container>
    </section>
  );
}
