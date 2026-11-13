"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const topics = ["Ansiedade", "Relacionamentos", "Autoestima", "Depressão", "Pânico", "Outro"];

function listPt(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

export function Booking() {
  const [selected, setSelected] = useState<string[]>([]);

  const message = useMemo(() => {
    const named = topics.filter((t) => t !== "Outro" && selected.includes(t)).map((t) => t.toLowerCase());
    const other = selected.includes("Outro");
    if (!named.length && !other) return site.defaultMessage;
    const about = named.length ? `${listPt(named)}${other ? " e outros temas" : ""}` : "um tema específico";
    return `Olá Fernanda! Cheguei pelo seu site e gostaria de iniciar a terapia. Quero conversar sobre ${about}.`;
  }, [selected]);

  function toggle(topic: string) {
    setSelected((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]));
  }

  return (
    <Section id="agendar" aria-labelledby="agendar-titulo" className="py-12 sm:py-16 lg:py-20">
      <Container>
        <Reveal className="rounded-3xl bg-[linear-gradient(135deg,var(--color-tint-indigo)_0%,var(--color-tint-lilac)_55%,var(--color-tint-rose)_100%)] px-6 py-14 text-center sm:px-12 sm:py-20 lg:py-24">
          <h2
            id="agendar-titulo"
            className="mx-auto max-w-2xl text-[32px] leading-[1.15] font-normal tracking-[-0.025em] text-balance text-ink sm:text-[40px] lg:text-[46px]"
          >
            Pronta para dar o primeiro passo?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-[17px]">
            Me conte o que te traz — respondo pelo WhatsApp.
          </p>

          <div role="group" aria-label="Temas que você quer conversar (opcional)" className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2">
            {topics.map((topic) => {
              const on = selected.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(topic)}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-[background-color,color] duration-150 focus-visible:shadow-focus",
                    on ? "bg-primary text-white" : "bg-white/80 text-ink-soft hover:bg-white hover:text-ink",
                  )}
                >
                  {on && <Check aria-hidden className="size-3.5" strokeWidth={2.5} />}
                  {topic}
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <ButtonLink href={whatsappLink(message)} external variant="whatsapp" size="lg">
              <WhatsAppIcon />
              Enviar mensagem
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-ink-muted">Nada é salvo neste site.</p>
        </Reveal>
      </Container>
    </Section>
  );
}
