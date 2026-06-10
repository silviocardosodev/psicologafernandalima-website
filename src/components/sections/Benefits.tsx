"use client";

import { motion } from "framer-motion";

const cards = [
  {
    title: "Mais clareza",
    text: "Para compreender o que hoje parece confuso.",
  },
  {
    title: "Mais gentileza",
    text: "Para se relacionar consigo mesma de outra forma.",
  },
  {
    title: "Mais presença",
    text: "Para viver o agora sem tanta urgência.",
  },
  {
    title: "Mais equilíbrio",
    text: "Para sustentar a vida sem se abandonar.",
  },
  {
    title: "Mais liberdade",
    text: "Para fazer escolhas alinhadas com quem você é.",
  },
  {
    title: "Mais leveza",
    text: "Para que nem tudo precise ser tão pesado.",
  },
];

export function Benefits() {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
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
              Pequenas mudanças internas costumam transformar grandes partes da
              vida
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
                className="flex min-h-[15rem] flex-col justify-between rounded-[2rem] border border-border-soft bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,251,255,0.96))] p-8 shadow-[0_12px_40px_rgba(28,28,30,0.03)]"
              >
                <h3 className="max-w-[13rem] text-3xl leading-[1.1] font-medium tracking-[-0.03em] text-text-main">
                  {card.title}
                </h3>
                <p className="mt-8 max-w-xs text-base leading-7 text-text-muted">
                  {card.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
