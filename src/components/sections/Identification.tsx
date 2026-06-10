"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const cards = [
  {
    title: "Sua mente não desacelera",
    text: "Existe sempre algo ocupando seus pensamentos.",
  },
  {
    title: "Você se cobra demais",
    text: "O suficiente nunca parece suficiente.",
  },
  {
    title: "Descansar é difícil",
    text: "Até a pausa pode virar obrigação.",
  },
  {
    title: "Você sustenta muita coisa",
    text: "Nem sempre sobra espaço para você.",
  },
];

export function Identification() {
  return (
    <section id="para-quem-e" className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-[2rem] border border-border-soft bg-white p-8 shadow-[0_12px_40px_rgba(28,28,30,0.03)] sm:p-10"
          >
            <h2 className="max-w-sm text-4xl leading-[1.08] font-semibold tracking-[-0.04em] text-text-main sm:text-5xl">
              Algumas experiências são mais comuns do que parecem:
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                className="flex min-h-[16rem] flex-col justify-between rounded-[2rem] border border-border-soft bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,251,255,0.96))] p-8 shadow-[0_12px_40px_rgba(28,28,30,0.03)]"
              >
                <h3 className="max-w-[13rem] text-3xl leading-[1.1] font-medium tracking-[-0.03em] text-text-main">
                  {card.title}
                </h3>
                <p className="mt-8 max-w-xs text-base leading-7 text-text-muted">
                  {card.text}
                </p>
              </motion.article>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.24, ease: "easeOut" }}
              className="md:col-span-2 lg:col-span-1"
            >
              <Link
                href="#agendar"
                className="flex min-h-[16rem] flex-col justify-between rounded-[2rem] border border-[rgba(184,225,255,0.36)] bg-[linear-gradient(180deg,rgba(234,246,255,0.9),rgba(241,236,255,0.78))] p-8 shadow-[0_14px_44px_rgba(28,28,30,0.04)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex justify-end">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/86 text-text-main shadow-[0_8px_20px_rgba(28,28,30,0.05)]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div>
                  <p className="max-w-[14rem] text-3xl leading-[1.08] font-medium tracking-[-0.03em] text-text-main">
                    E se fosse diferente?
                  </p>
                  <p className="mt-4 max-w-xs text-base leading-7 text-text-muted">
                    Conheça como a terapia pode ajudar
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
