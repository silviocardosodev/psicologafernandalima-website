"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="agendar" className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto max-w-5xl rounded-[2.2rem] border border-border-soft bg-[linear-gradient(135deg,rgba(241,236,255,0.75),rgba(234,246,255,0.85),rgba(255,255,255,0.96))] p-8 text-center shadow-[0_16px_50px_rgba(28,28,30,0.04)] sm:p-12"
      >
        <h2 className="mx-auto max-w-3xl font-[family:var(--font-heading)] text-4xl leading-tight font-semibold tracking-[-0.03em] text-text-main sm:text-5xl">
          Talvez este seja um momento de olhar para si com mais cuidado.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-text-muted sm:text-lg">
          Se você sente que a terapia pode fazer sentido para a sua caminhada,
          ficarei feliz em acolher você nesse processo.
        </p>

        <Link
          href="#agendar"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,rgba(142,116,255,0.94),rgba(184,167,255,0.92))] px-6 py-3.5 text-sm font-medium text-white shadow-[0_14px_40px_rgba(142,116,255,0.14)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          Agendar sessão
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </section>
  );
}
