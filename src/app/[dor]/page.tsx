import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { QuoteCards } from "@/components/sections/QuoteCards";
import { Container, Eyebrow, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { getPain, pains } from "@/lib/pains";
import { quotes } from "@/lib/quotes";
import { ctaLabel, site, whatsappLink } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return pains.map((pain) => ({ dor: pain.slug }));
}

type Props = { params: Promise<{ dor: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dor } = await params;
  const pain = getPain(dor);
  if (!pain) return {};
  const url = `${site.url}/${pain.slug}`;
  return {
    title: pain.metaTitle,
    description: pain.metaDescription,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: pain.metaTitle, description: pain.metaDescription, locale: "pt_BR" },
    twitter: { card: "summary_large_image", title: pain.metaTitle, description: pain.metaDescription },
  };
}

const whatsappButton =
  "inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-whatsapp px-8 text-[15px] font-medium whitespace-nowrap text-white shadow-[0_8px_24px_rgb(15_122_59/24%)] transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-whatsapp-hover focus-visible:shadow-focus active:translate-y-px";

function WhatsAppCta({ className }: { className?: string }) {
  // Neutral pre-filled message: the topic of the page is never written for her (LGPD).
  return (
    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={`${whatsappButton} ${className ?? ""}`}>
      <WhatsAppIcon className="size-5" />
      {ctaLabel}
      <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
    </a>
  );
}

export default async function PainPage({ params }: Props) {
  const { dor } = await params;
  const pain = getPain(dor);
  if (!pain) notFound();

  const related = pains.filter((p) => p.slug !== pain.slug);
  const painQuotes = quotes.filter((q) => q.pain === pain.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${site.url}/${pain.slug}#pagina`,
        url: `${site.url}/${pain.slug}`,
        name: pain.metaTitle,
        description: pain.metaDescription,
        inLanguage: "pt-BR",
        about: { "@id": `${site.url}/#fernanda-lima` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: site.url },
          { "@type": "ListItem", position: 2, name: pain.name, item: `${site.url}/${pain.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: pain.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <LandingHeader />
      <main id="conteudo">
        {/* Hero: her words, one idea, one action. */}
        <section id="inicio" aria-labelledby="dor-titulo" className="relative overflow-hidden bg-soft">
          <Container className="py-16 sm:py-24 lg:py-28">
            <nav aria-label="Você está em" className="mb-8 text-sm text-ink-muted">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="rounded-sm transition-colors duration-300 hover:text-primary">
                    Início
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-ink-soft">
                  {pain.name}
                </li>
              </ol>
            </nav>

            <Reveal className="max-w-3xl">
              <Eyebrow>{pain.name}</Eyebrow>
              <h1
                id="dor-titulo"
                className="mt-4 text-[36px] leading-[1.08] font-[650] tracking-[-0.035em] text-balance text-ink sm:text-[52px] lg:text-[60px]"
              >
                {pain.title}
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-soft sm:text-lg">{pain.lead}</p>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <WhatsAppCta />
                <a
                  href="#sinais"
                  className="group inline-flex items-center gap-2 rounded-sm text-[15px] text-ink-soft transition-colors duration-300 hover:text-primary"
                >
                  Continuar lendo
                  <ArrowRight aria-hidden className="size-4 rotate-90 transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Signs, in first person. */}
        <Section id="sinais" aria-labelledby="sinais-titulo">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <SectionHeader
                id="sinais-titulo"
                eyebrow="Talvez você se reconheça"
                title="Parece com o seu dia?"
                description="Sinais não são diagnóstico. São um convite para olhar com mais cuidado."
              />
              <Reveal delay={0.05}>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {pain.signs.map((sign) => (
                    <li
                      key={sign}
                      className="rounded-3xl border border-line bg-white p-6 text-[19px] leading-snug font-[550] tracking-[-0.015em] text-balance text-ink sm:text-[20px]"
                    >
                      <span aria-hidden className="mb-3 block h-0.5 w-8 rounded-full bg-lavender" />
                      {sign}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* Why: one breathing paragraph. */}
        <section aria-labelledby="porque-titulo" className="bg-tint-lilac py-20 sm:py-28">
          <Container className="max-w-3xl text-center">
            <Reveal>
              <Eyebrow>Por que isso acontece</Eyebrow>
              <h2 id="porque-titulo" className="sr-only">
                Por que isso acontece
              </h2>
              <p className="mt-5 text-[clamp(1.35rem,2.6vw,2rem)] leading-[1.35] font-[550] tracking-[-0.02em] text-balance text-primary-deep">
                {pain.why}
              </p>
            </Reveal>
          </Container>
        </section>

        {/* How therapy can help: 3 steps, no promises. */}
        <Section aria-labelledby="ajuda-titulo">
          <Container>
            <SectionHeader
              id="ajuda-titulo"
              eyebrow="Na terapia"
              title="Como a terapia pode ajudar"
              description="Online, semanal, no seu ritmo. Com TCC e ACT, abordagens com base científica."
              align="center"
            />
            <ol className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
              {pain.help.map((item, index) => (
                <li key={item.title}>
                  <Reveal delay={index * 0.06} className="h-full rounded-3xl bg-tint-mist p-7">
                    <span className="grid size-10 place-items-center rounded-full bg-white text-sm font-semibold text-primary shadow-xs">
                      {index + 1}
                    </span>
                    <h3 className="mt-5 text-[19px] font-[600] tracking-[-0.015em] text-ink">{item.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Container>
        </Section>

        {/* Short "who": trust before the ask. */}
        <section aria-labelledby="quem-titulo" className="pb-20 sm:pb-28">
          <Container>
            <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-[2.5rem] border border-line-soft bg-white p-8 text-center shadow-card sm:flex-row sm:p-10 sm:text-left">
              <div className="relative size-32 shrink-0 overflow-hidden rounded-full bg-tint-violet sm:size-36">
                <Image
                  src="/psicologa-fernanda-lima-2.webp"
                  alt="Fernanda Lima, psicóloga"
                  fill
                  sizes="144px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <h2 id="quem-titulo" className="text-[24px] font-[650] tracking-[-0.02em] text-ink">
                  Oi, eu sou a Fernanda
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink-soft">
                  Atendo mulheres que seguram muita coisa ao mesmo tempo. Na terapia, a gente desacelera junto e
                  transforma entendimento em prática — no seu ritmo.
                </p>
                <p className="mt-3 text-sm text-ink-muted">{site.crp} · TCC e ACT · Atendimento online</p>
                <Link
                  href="/#sobre"
                  className="group mt-4 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-primary transition-colors duration-300 hover:text-primary-deep"
                >
                  Conhecer minha formação
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </Container>
        </section>

        {painQuotes.length > 0 && (
          <QuoteCards items={painQuotes} id="frases" description="Salve esta para os dias difíceis — ou mande para quem precisa." />
        )}

        {/* Two specific doubts, native disclosure (works without JS). */}
        <Section aria-labelledby="duvidas-titulo">
          <Container className="max-w-3xl">
            <SectionHeader id="duvidas-titulo" eyebrow="Dúvidas" title="Antes de começar" align="center" />
            <Reveal delay={0.05} className="mt-10 divide-y divide-line-soft rounded-3xl border border-line bg-white">
              {pain.faq.map((item) => (
                <details key={item.question} className="group px-6 py-1 sm:px-8">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-[550] text-ink [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <Plus
                      aria-hidden
                      className="size-5 shrink-0 text-primary transition-transform duration-300 ease-out-soft group-open:rotate-45"
                    />
                  </summary>
                  <p className="pb-6 text-[15px] leading-relaxed text-ink-soft">{item.answer}</p>
                </details>
              ))}
            </Reveal>
            <p className="mt-6 text-center text-sm text-ink-muted">
              Tem outra dúvida?{" "}
              <Link href="/#duvidas" className="font-medium text-primary underline decoration-primary-200 underline-offset-4 hover:decoration-primary">
                Veja todas as perguntas
              </Link>
            </p>
          </Container>
        </Section>

        {/* Final CTA. */}
        <section aria-labelledby="cta-titulo" className="px-5 pb-20 sm:px-6 sm:pb-28">
          <Reveal className="relative mx-auto max-w-[1160px] overflow-hidden rounded-[2.5rem] bg-brand px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <h2 id="cta-titulo" className="mx-auto max-w-2xl text-[30px] leading-[1.15] font-[650] tracking-[-0.03em] text-balance sm:text-[40px]">
              Que tal começar por uma conversa?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-[17px]">
              Sem compromisso. Você me conta o que está sentindo e a gente vê, junto, se faz sentido começar.
            </p>
            <WhatsAppCta className="mt-8" />
          </Reveal>
        </section>

        {/* Internal links to the other pains. */}
        <section aria-labelledby="relacionados-titulo" className="border-t border-line-soft py-14 sm:py-16">
          <Container>
            <h2 id="relacionados-titulo" className="text-xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
              Também pode ser sobre isso
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/${item.slug}`}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-6 py-5 transition-[border-color,box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-raised"
                  >
                    <span>
                      <span className="block text-[17px] font-[600] text-ink">{item.name}</span>
                      <span className="mt-0.5 block text-sm text-ink-soft">{item.teaser}</span>
                    </span>
                    <ArrowRight aria-hidden className="size-5 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>
      <Footer base="/" />
      <FloatingActions />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
