"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AboutMe() {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-x-10 top-8 -z-10 h-[78%] rounded-full border border-[rgba(184,167,255,0.22)]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-16 rounded-[2rem] bg-[linear-gradient(90deg,rgba(241,236,255,0.7),rgba(234,246,255,0.72))] blur-2xl" />

          <div className="relative mx-auto max-w-[34rem] overflow-hidden rounded-[2.5rem] border border-border-soft bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,251,255,0.98))] p-4 shadow-[0_20px_60px_rgba(28,28,30,0.05)]">
            <div className="relative aspect-[4/4.8] overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,rgba(241,236,255,0.55),rgba(234,246,255,0.45))]">
              <Image
                src="/psicologa-fernanda-lima-2.png"
                alt="Fernanda Lima, psicóloga clínica"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 540px"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          className="rounded-[2rem] border border-border-soft bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,251,255,0.96))] p-8 shadow-[0_14px_50px_rgba(28,28,30,0.03)] sm:p-10 lg:p-12"
        >
          <h2 className="text-4xl leading-[1.08] font-semibold tracking-[-0.04em] text-text-main sm:text-5xl">
            Um pouco sobre mim
          </h2>

          <div className="mt-6 space-y-5">
            <p className="max-w-xl text-base leading-8 text-text-muted sm:text-lg">
              Acredito que a terapia pode ser um espaço de acolhimento, reflexão
              e cuidado, onde você possa compreender suas emoções com mais
              clareza e construir uma relação mais gentil consigo mesma.
            </p>

            <p className="max-w-xl text-base leading-8 text-text-muted sm:text-lg">
              Meu trabalho é oferecer uma escuta atenta e respeitosa, ajudando
              você a lidar com os desafios emocionais da vida sem julgamentos e
              no seu próprio ritmo.
            </p>
          </div>

          <div className="mt-8 border-t border-border-soft pt-8">
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-text-main">
              Fernanda Lima
            </h3>
            <p className="mt-2 text-base font-medium text-text-muted">
              Psicóloga Clínica • CRP: 06/192404
            </p>
            <p className="mt-5 max-w-xl text-base leading-8 text-text-muted sm:text-lg">
              Pós-graduanda em Terapia Cognitivo-Comportamental pela PUC.
              Formação em Terapia de Aceitação e Compromisso (ACT), Terapia
              Cognitivo-Comportamental (TCC), Psicopatologia e
              Psicofarmacologia.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
