"use client";

import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";

import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Breathing "turning point" between the identification cards and "Sobre mim".
 * One idea, lots of air: it normalises the inner conflict ("my life is good, so why...").
 * Text is never hidden in the server HTML (Reveal only moves it); only the decorative
 * wave fades/draws in, and reduced motion just makes that instant.
 */
export function Turning() {
  const reduce = useReducedMotion();

  return (
    <section
      id="virada"
      aria-labelledby="virada-titulo"
      className="relative overflow-hidden bg-tint-lilac py-24 sm:py-32 lg:py-40"
    >
      <Container className="flex flex-col items-center text-center">
        {/* Accelerated line settling into a calm wave (decorative). */}
        <svg
          aria-hidden
          viewBox="0 0 160 24"
          fill="none"
          className="mb-8 h-6 w-40 text-lavender sm:mb-10"
        >
          <m.path
            d="M2 12c6-9 10-9 14 0s8 9 12 0 7-8 11 0 9 7 15 0 12-6 20 0 16 5 26 0 18-4 28 0 16 3 30 0"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={reduce ? { duration: 0 } : { duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        <Reveal className="max-w-3xl">
          <h2
            id="virada-titulo"
            className="text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.2] font-[600] tracking-[-0.025em] text-balance text-primary-deep"
          >
            Sua vida é boa — e mesmo assim pesa.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-balance text-ink-soft sm:text-lg">
            Faz sentido. Não é ingratidão, é cansaço. E dá para cuidar disso.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <Link
            href="#como-funciona"
            className="group inline-flex items-center gap-2 rounded-sm text-[15px] text-ink-soft transition-colors duration-300 ease-out-soft hover:text-primary"
          >
            Ver como funciona
            <ArrowDown
              aria-hidden
              className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-y-0.5 group-focus-visible:translate-y-0.5"
            />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
