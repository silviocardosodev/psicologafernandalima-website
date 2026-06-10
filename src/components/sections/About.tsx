"use client";

import { motion } from "framer-motion";

const items = [
  {
    title: "Atendimento online",
    text: "Para todo o Brasil e exterior.",
  },
  {
    title: "Sessões semanais",
    text: "Com duração de aproximadamente 50 minutos.",
  },
  {
    title: "Um espaço seguro",
    text: "Para acolher sua história, emoções e desafios.",
  },
];

export function About() {
  return (
    <section id="sobre" className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-border-soft bg-[linear-gradient(180deg,rgba(250,251,255,0.96),rgba(255,255,255,0.96))] p-8 shadow-[0_14px_50px_rgba(28,28,30,0.03)] md:grid-cols-[0.9fr_1.1fr] md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="font-[family:var(--font-heading)] text-4xl leading-tight font-semibold tracking-[-0.03em] text-text-main sm:text-5xl">
            Como funciona
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          className="grid gap-5"
        >
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-border-soft bg-white/82 p-5 shadow-[0_8px_25px_rgba(28,28,30,0.025)]"
            >
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-text-main">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xl text-base leading-7 text-text-muted">
                {item.text}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
