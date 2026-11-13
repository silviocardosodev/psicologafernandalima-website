import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { site, whatsappLink } from "@/lib/site";

const formations = ["TCC", "ACT", "Psicopatologia", "Psicofarmacologia"];

export function AboutMe() {
  return (
    <Section id="sobre" aria-labelledby="sobre-titulo" className="overflow-hidden">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative mx-auto aspect-square w-full max-w-[480px]">
            <div aria-hidden className="absolute inset-x-[4%] top-[16%] bottom-0 rounded-[2.5rem] bg-tint-lilac" />
            <Image
              src="/psicologa-fernanda-lima.webp"
              alt="Fernanda Lima, psicóloga clínica, sorrindo"
              fill
              sizes="(min-width: 1024px) 480px, (min-width: 640px) 70vw, 92vw"
              className="object-contain object-bottom"
            />
          </Reveal>

          <Reveal delay={0.05} className="max-w-xl">
            <Eyebrow>Sobre mim</Eyebrow>
            <h2
              id="sobre-titulo"
              className="mt-3 text-[32px] leading-[1.15] font-normal tracking-[-0.025em] text-balance text-ink sm:text-[40px] lg:text-[46px]"
            >
              Oi, eu sou a Fernanda
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft sm:text-[17px]">
              <p>
                Sou psicóloga clínica ({site.crp}) e atendo mulheres a partir de 18 anos, com TCC e ACT. Sou
                pós-graduanda em TCC pela PUC.
              </p>
              <p>Nossa relação será pautada em acolhimento e confiança — no seu tempo.</p>
            </div>

            <ul aria-label="Formação" className="mt-7 flex flex-wrap gap-2">
              {formations.map((item) => (
                <li key={item} className="rounded-full bg-tint-indigo px-4 py-1.5 text-sm text-primary-hover">
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2 rounded-full text-base font-medium text-primary hover:text-primary-hover"
            >
              Fale comigo
              <ArrowRight aria-hidden className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
            </a>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
