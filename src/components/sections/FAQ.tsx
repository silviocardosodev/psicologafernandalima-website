"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const faqs = [
  {
    q: "Qual é o valor da sessão?",
    a: "Pelo Código de Ética, não uso valores como propaganda — informo tudo no nosso primeiro contato. O pagamento é por PIX ou transferência.",
  },
  {
    q: "Como funciona a sessão online?",
    a: "As sessões são pelo Google Meet, semanais, com cerca de 50 minutos. Você só precisa de internet e de um lugar com privacidade.",
  },
  {
    q: "Você atende quem mora fora do Brasil?",
    a: "Sim! Atendo mulheres no Brasil e no exterior.",
  },
  {
    q: "O que eu disser fica entre nós?",
    a: "Sim. Tudo o que é conversado nas sessões é protegido pelo sigilo profissional.",
  },
  {
    q: "Como faço para agendar?",
    a: "É só me chamar no WhatsApp. Combinamos juntas o melhor dia e horário.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const uid = useId();

  return (
    <Section id="duvidas" aria-labelledby="duvidas-titulo">
      <Container>
        <SectionHeader id="duvidas-titulo" eyebrow="Dúvidas" title="Perguntas frequentes" align="center" />

        <Reveal delay={0.05} className="mx-auto mt-12 max-w-3xl">
          <ul className="divide-y divide-line border-y border-line">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              const btnId = `${uid}-q${i}`;
              const panelId = `${uid}-a${i}`;
              return (
                <li key={item.q}>
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={isOpen ? panelId : undefined}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-6 rounded-lg py-6 text-left text-[17px] font-normal tracking-[-0.01em] text-ink transition-colors hover:text-primary focus-visible:shadow-focus sm:text-lg"
                    >
                      {item.q}
                      {isOpen ? (
                        <Minus aria-hidden className="size-5 shrink-0 text-primary" />
                      ) : (
                        <Plus aria-hidden className="size-5 shrink-0 text-primary" />
                      )}
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pr-10 pb-6 text-base leading-relaxed text-ink-soft">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
