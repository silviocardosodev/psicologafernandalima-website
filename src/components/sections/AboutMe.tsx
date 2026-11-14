"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { ctaLabel, site, whatsappLink } from "@/lib/site";

const methods = [
  { name: "TCC", text: "entender os pensamentos que aceleram e criar novas respostas no dia a dia." },
  { name: "ACT", text: "parar de brigar com o que sente e agir pelo que importa para você." },
] as const;

const formations = [
  "Graduação em Psicologia",
  "Pós em TCC — PUC (em andamento)",
  "Formação em ACT",
  "Formação em TCC",
  "Psicopatologia",
  "Psicofarmacologia",
] as const;

export function AboutMe() {
  const [open, setOpen] = useState(false);
  const panelId = `formacao-${useId().replace(/:/g, "")}`;

  return (
    <Section id="sobre" aria-labelledby="sobre-titulo" className="overflow-hidden">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative mx-auto w-full max-w-[440px]">
            <div
              aria-hidden
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.5rem] bg-tint-lilac sm:translate-x-6 sm:translate-y-6"
            />
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-tint-violet">
              <Image
                src="/psicologa-fernanda-lima-2.webp"
                alt="Fernanda Lima, psicóloga, sorrindo"
                fill
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 70vw, 92vw"
                className="object-cover object-top transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.04]"
              />
            </div>
          </Reveal>

          <Reveal delay={0.05} className="max-w-xl">
            <Eyebrow>Sobre mim</Eyebrow>
            <h2
              id="sobre-titulo"
              className="mt-3 text-[32px] leading-[1.12] font-[650] tracking-[-0.03em] text-balance text-ink sm:text-[40px] lg:text-[46px]"
            >
              Oi, eu sou a Fernanda
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-[17px]">
              Atendo mulheres que seguram muita coisa ao mesmo tempo. Na terapia, a gente desacelera junto e
              transforma entendimento em prática — no seu ritmo.
            </p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {methods.map((method) => (
                <li key={method.name} className="rounded-2xl bg-tint-mist px-4 py-3.5 text-sm leading-relaxed text-ink-soft">
                  <span className="font-semibold text-primary-deep">{method.name}</span> — {method.text}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-sm text-ink-muted">{site.crp} · Pós-graduanda em TCC (PUC)</p>

            {/* Formations: collapsed disclosure. Content stays in the HTML (smooth height via
                grid rows) and is made inert while closed, so it's unreachable but indexable. */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              className="group mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-full text-sm font-medium text-primary transition-colors duration-300 ease-out-soft hover:text-primary-deep focus-visible:shadow-focus"
            >
              {open ? "Ocultar formação" : "Ver formação completa"}
              <ChevronDown
                aria-hidden
                className={cn("size-4 transition-transform duration-300 ease-out-soft", open && "rotate-180")}
              />
            </button>
            <div
              id={panelId}
              inert={!open}
              className={cn(
                "grid transition-[grid-template-rows] duration-500 ease-out-soft",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <ul className="mt-2 space-y-1.5 border-l-2 border-primary-200 pl-4 text-sm leading-relaxed text-ink-soft">
                  {formations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-7">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full text-base font-medium text-primary transition-colors duration-300 ease-out-soft hover:text-primary-deep"
              >
                {ctaLabel}
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1 group-focus-visible:translate-x-1"
                />
                <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
