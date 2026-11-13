"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, MessageCircleQuestion, Search, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { useRadioKeys } from "@/lib/useRadioKeys";
import { whatsappLink } from "@/lib/site";

type Category = "valores" | "sessoes" | "primeiros-passos";

const categories: { id: Category | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "valores", label: "Valores e pagamento" },
  { id: "sessoes", label: "Sessões" },
  { id: "primeiros-passos", label: "Primeiros passos" },
];

const faqs: { q: string; a: string; category: Category }[] = [
  {
    q: "Qual o valor da sessão?",
    a: "Por orientação do Código de Ética Profissional, não utilizo o valor como forma de propaganda — por isso, informo os valores diretamente quando você entra em contato. O pagamento pode ser feito por PIX ou transferência bancária.",
    category: "valores",
  },
  {
    q: "Do que preciso para começar?",
    a: "Apenas de um computador ou celular com internet e de um ambiente onde você se sinta à vontade e tenha privacidade para conversar. As sessões acontecem pelo Google Meet — você só precisa clicar no link que eu enviar.",
    category: "primeiros-passos",
  },
  {
    q: "Com que frequência são as sessões?",
    a: "As sessões são semanais e duram cerca de 50 minutos. Esse ritmo evita que as demandas se acumulem e mantém a nossa proximidade no processo. Conforme você for evoluindo, podemos combinar de espaçar as sessões para quinzenais.",
    category: "sessoes",
  },
  {
    q: "Como posso agendar?",
    a: "É simples: clique em \"Agendar\" ou \"Fale comigo\" em qualquer parte do site. Você será direcionada ao meu WhatsApp, onde combinamos o melhor dia e horário para você.",
    category: "primeiros-passos",
  },
  {
    q: "A terapia online funciona mesmo?",
    a: "Sim. A terapia online segue a mesma estrutura da sessão presencial, e estudos indicam eficácia semelhante à da terapia presencial. O que muda é que você não precisa se deslocar e pode estar em um lugar onde se sente confortável.",
    category: "sessoes",
  },
  {
    q: "Você atende quem mora fora do Brasil?",
    a: "Sim! Como os atendimentos são online, atendo mulheres de qualquer estado do Brasil e também brasileiras que moram em outros países. Combinamos os horários considerando o seu fuso.",
    category: "primeiros-passos",
  },
  {
    q: "Quem você atende?",
    a: "Atendo mulheres jovens e adultas, a partir de 18 anos, que desejam cuidar da saúde emocional — seja para lidar com algo específico, seja para se conhecer melhor.",
    category: "primeiros-passos",
  },
  {
    q: "O que acontece na primeira sessão?",
    a: "A primeira sessão é o nosso momento de nos conhecermos. Você me conta, no seu tempo, o que tem vivido e o que gostaria de transformar, e eu explico como vamos trabalhar juntas. Não existe resposta certa nem pressa.",
    category: "sessoes",
  },
  {
    q: "Minhas informações ficam em sigilo?",
    a: "Sim. Tudo o que é conversado em sessão é protegido pelo sigilo profissional, garantido pelo Código de Ética da Psicologia. Além disso, utilizo plataformas seguras para as videochamadas.",
    category: "sessoes",
  },
  {
    q: "Qual abordagem você utiliza?",
    a: "Trabalho com a Terapia Cognitivo-Comportamental (TCC), com contribuições da Terapia de Aceitação e Compromisso (ACT). Na prática, vamos entender juntas como seus pensamentos, emoções e comportamentos se conectam, desenvolver estratégias para lidar com o que te faz sofrer e fortalecer escolhas alinhadas ao que é importante para você.",
    category: "sessoes",
  },
];

/** Accent/case-insensitive normalization that preserves string length (1:1 chars). */
function normalize(s: string) {
  return s
    .split("")
    .map((c) => c.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().charAt(0) || c)
    .join("");
}

function Highlight({ text, query }: { text: string; query: string }): ReactNode {
  const q = normalize(query.trim());
  if (!q) return text;
  const hay = normalize(text);
  const parts: ReactNode[] = [];
  let from = 0;
  let idx = hay.indexOf(q, from);
  while (idx !== -1) {
    if (idx > from) parts.push(text.slice(from, idx));
    parts.push(
      <mark key={idx} className="rounded-[3px] bg-primary-200 px-0.5 text-ink">
        {text.slice(idx, idx + q.length)}
      </mark>,
    );
    from = idx + q.length;
    idx = hay.indexOf(q, from);
  }
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}

export function FAQ() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "todas">("todas");
  const [open, setOpen] = useState<string | null>(faqs[0].q);
  const reduce = useReducedMotion();
  const baseId = useId();
  const categoryIds = categories.map((c) => c.id);
  const categoryKeys = useRadioKeys(categoryIds, category, setCategory);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return faqs.filter(
      (f) =>
        (category === "todas" || f.category === category) &&
        (!q || normalize(f.q).includes(q) || normalize(f.a).includes(q)),
    );
  }, [query, category]);

  const statusText =
    results.length === 0
      ? "Nenhuma pergunta encontrada"
      : `${results.length} ${results.length === 1 ? "pergunta encontrada" : "perguntas encontradas"}`;

  return (
    <Section id="duvidas" aria-labelledby="duvidas-titulo">
      <Container>
        <SectionHeader
          id="duvidas-titulo"
          eyebrow="Dúvidas frequentes"
          title="Perguntas que costumo receber"
          description="Reuni aqui as dúvidas mais comuns sobre a terapia online. Se a sua não estiver na lista, é só me chamar."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-12">
          <div className="min-w-0">
            {/* Search + filters */}
            <Reveal className="space-y-4">
              <div className="relative">
                <label htmlFor={`${baseId}-search`} className="sr-only">
                  Buscar nas perguntas frequentes
                </label>
                <Search
                  className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-muted"
                  aria-hidden
                />
                <input
                  id={`${baseId}-search`}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setQuery("");
                  }}
                  placeholder="Buscar dúvida… ex.: sigilo, valores, primeira sessão"
                  aria-describedby={`${baseId}-status`}
                  autoComplete="off"
                  className="h-12 w-full rounded-md border border-line-control bg-surface pr-12 pl-12 text-base text-ink shadow-xs outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-muted focus:border-primary focus:shadow-focus sm:text-[15px] [&::-webkit-search-cancel-button]:appearance-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Limpar busca"
                    className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink focus-visible:shadow-focus"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div role="radiogroup" aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
                  {categories.map((c, i) => {
                    const active = category === c.id;
                    return (
                      <button
                        key={c.id}
                        ref={(el) => {
                          categoryKeys.refs.current[i] = el;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        tabIndex={categoryKeys.tabIndexFor(i)}
                        onKeyDown={(e) => categoryKeys.onKeyDown(e, i)}
                        onClick={() => setCategory(c.id)}
                        className={cn(
                          "h-9 rounded-full border px-3.5 text-sm font-medium transition-[background-color,border-color,color] duration-150 focus-visible:shadow-focus",
                          active
                            ? "border-primary bg-primary text-white"
                            : "border-line bg-surface text-ink-soft hover:border-primary-200 hover:text-ink",
                        )}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
                <p id={`${baseId}-status`} aria-live="polite" className="text-sm text-ink-muted">
                  {statusText}
                </p>
              </div>
            </Reveal>

            {/* Accordion */}
            <ul className="mt-6 space-y-3">
              {results.map((f, i) => {
                const isOpen = open === f.q;
                const btnId = `${baseId}-btn-${i}`;
                const panelId = `${baseId}-panel-${i}`;
                return (
                  <li
                    key={f.q}
                    className={cn(
                      "rounded-lg border bg-surface transition-[border-color,box-shadow] duration-150",
                      isOpen ? "border-primary-200 shadow-raised" : "border-line shadow-card hover:border-primary-200",
                    )}
                  >
                    <h3>
                      <button
                        id={btnId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen(isOpen ? null : f.q)}
                        className="flex w-full items-center justify-between gap-4 rounded-lg px-5 py-4 text-left text-[15px] font-semibold tracking-[-0.01em] text-ink focus-visible:shadow-focus sm:px-6 sm:py-5 sm:text-base"
                      >
                        <span>
                          <Highlight text={f.q} query={query} />
                        </span>
                        <span
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-md transition-[background-color,color,transform] duration-200",
                            isOpen ? "rotate-180 bg-primary text-white" : "bg-primary-100 text-primary",
                          )}
                        >
                          <ChevronDown className="size-4" aria-hidden />
                        </span>
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
                          transition={reduce ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink-soft sm:px-6 sm:pb-6">
                            <Highlight text={f.a} query={query} />
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>

            {results.length === 0 && (
              <div className="mt-6 rounded-lg border border-dashed border-line-hover bg-surface p-8 text-center">
                <p className="font-semibold text-ink">Não encontrei nada com esse termo.</p>
                <p className="mt-1 text-sm text-ink-soft">Tente outra palavra ou me envie sua pergunta pelo WhatsApp.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("todas");
                  }}
                  className="mt-4 text-sm font-semibold text-primary underline-offset-4 hover:text-primary-hover hover:underline"
                >
                  Ver todas as perguntas
                </button>
              </div>
            )}
          </div>

          {/* Side card */}
          <aside className="lg:pt-0">
            <Reveal
              delay={0.1}
              className="rounded-xl border border-line bg-surface p-6 shadow-raised lg:sticky lg:top-[calc(var(--header-height)+32px)]"
            >
              <span className="grid size-11 place-items-center rounded-md bg-primary-100 text-primary">
                <MessageCircleQuestion className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-ink">Não encontrou sua dúvida?</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Me mande uma mensagem. Respondo com calma e sem compromisso — é só um primeiro contato.
              </p>
              <ButtonLink
                href={whatsappLink("Olá Fernanda! Vim pelo seu site e tenho uma dúvida sobre a terapia:")}
                external
                variant="whatsapp"
                className="mt-6 w-full"
              >
                <WhatsAppIcon className="size-4" />
                Perguntar no WhatsApp
              </ButtonLink>
            </Reveal>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
