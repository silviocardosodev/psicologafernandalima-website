import { Quote } from "lucide-react";

import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Messages people sent after their sessions, as soft chat bubbles.
 * Phones: horizontal snap carousel (one message per swipe). Tablet/desktop: masonry
 * columns so every message is read in full without clicks. No JS needed.
 */
export function Testimonials() {
  return (
    <Section id="depoimentos" aria-labelledby="depoimentos-titulo" className="overflow-hidden bg-tint-mist">
      <Container>
        <SectionHeader
          id="depoimentos-titulo"
          eyebrow="Depoimentos"
          title="Quem já começou, conta"
          description="Mensagens que recebi depois das sessões. Os nomes ficam de fora, para preservar o sigilo."
          align="center"
        />

        <ul
          aria-label="Depoimentos"
          className={cn(
            "-mx-5 mt-12 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6",
            "md:mx-0 md:block md:columns-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:columns-3",
          )}
        >
          {testimonials.map((item, index) => (
            <li
              key={item.id}
              className="w-[86%] max-w-[380px] shrink-0 snap-center md:mb-5 md:w-auto md:max-w-none md:break-inside-avoid"
            >
              <Reveal delay={Math.min(index % 3, 2) * 0.06}>
                <figure className="group relative rounded-3xl rounded-bl-md border border-line-soft bg-white p-6 shadow-[0_1px_2px_rgb(17_24_39/4%),0_10px_30px_rgb(79_70_229/6%)] transition-[transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-[0_18px_40px_rgb(79_70_229/12%)] sm:p-7">
                  <Quote aria-hidden className="size-6 fill-tint-violet text-lavender" strokeWidth={1.5} />
                  <blockquote className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft">
                    {item.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-2 text-[13px] text-ink-muted">
                    <span aria-hidden className="h-px w-5 bg-primary-200" />
                    Mensagem de quem faz terapia comigo
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-center text-[13px] text-ink-muted md:hidden">Deslize para ler mais →</p>
      </Container>
    </Section>
  );
}
