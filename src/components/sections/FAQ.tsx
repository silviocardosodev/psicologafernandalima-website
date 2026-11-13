"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Plus, Search, X } from "lucide-react";

import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { faqItems, type FaqCategory } from "@/lib/faq";
import { useRadioKeys } from "@/lib/useRadioKeys";
import { cn } from "@/lib/utils";

type Filter = FaqCategory | "todas";

const categories: { id: Filter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "objecoes", label: "Antes de começar" },
  { id: "sessoes", label: "Sessões" },
  { id: "valores", label: "Valores" },
];
const categoryIds = categories.map((c) => c.id);

/** Accent/case-insensitive normalization that keeps string length (1:1 chars), so match indexes map back. */
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
  let idx = hay.indexOf(q);
  while (idx !== -1) {
    if (idx > from) parts.push(text.slice(from, idx));
    parts.push(
      <mark key={idx} className="rounded-[4px] bg-tint-violet px-0.5 text-ink">
        {text.slice(idx, idx + q.length)}
      </mark>,
    );
    from = idx + q.length;
    idx = hay.indexOf(q, from);
  }
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}

const spring = { type: "spring", stiffness: 300, damping: 22 } as const;
const ease = [0.22, 1, 0.36, 1] as const;

export function FAQ() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Filter>("todas");
  const [open, setOpen] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const uid = useId();
  const keys = useRadioKeys(categoryIds, category, setCategory);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    return faqItems.filter(
      (f) =>
        (category === "todas" || f.category === category) &&
        (!q || normalize(f.question).includes(q) || normalize(f.answer).includes(q)),
    );
  }, [query, category]);

  const status =
    results.length === 0
      ? "Nenhuma pergunta encontrada"
      : `${results.length} ${results.length === 1 ? "pergunta" : "perguntas"}`;

  // One polite announcement per pause in typing (not one per keystroke). The count lives only
  // here — the input no longer points to it via aria-describedby, so it isn't read twice.
  const [announced, setAnnounced] = useState(status);
  useEffect(() => {
    const t = window.setTimeout(() => setAnnounced(status), 450);
    return () => window.clearTimeout(t);
  }, [status]);

  // Opens the first match so the highlighted answer is visible right away.
  function onSearch(value: string) {
    setQuery(value);
    const q = normalize(value.trim());
    if (!q) return;
    const first = faqItems.find(
      (f) =>
        (category === "todas" || f.category === category) &&
        (normalize(f.question).includes(q) || normalize(f.answer).includes(q)),
    );
    if (first) setOpen(first.id);
  }

  function reset() {
    setQuery("");
    setCategory("todas");
  }

  return (
    <Section id="duvidas" aria-labelledby="duvidas-titulo">
      <Container>
        <SectionHeader id="duvidas-titulo" eyebrow="Dúvidas" title="O que você pode estar se perguntando" align="center" />

        <Reveal delay={0.05} className="mx-auto mt-10 max-w-3xl">
          <div className="relative">
            <label htmlFor={`${uid}-busca`} className="sr-only">
              Buscar nas perguntas
            </label>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-ink-muted" />
            <input
              id={`${uid}-busca`}
              type="search"
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setQuery("");
              }}
              placeholder="Buscar dúvida… ex.: sigilo"
              autoComplete="off"
              className="h-13 w-full rounded-full border border-line-control bg-white pr-14 pl-13 text-base text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-muted hover:border-ink-soft focus:border-primary focus:shadow-focus [&::-webkit-search-cancel-button]:appearance-none"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Limpar busca"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={reduce ? { duration: 0 } : spring}
                  className="absolute top-1/2 right-3 -mt-4 grid size-8 place-items-center rounded-full text-ink-muted transition-colors hover:bg-tint-violet hover:text-ink focus-visible:shadow-focus"
                >
                  <X aria-hidden className="size-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <LayoutGroup id={`${uid}-cats`}>
              <div role="radiogroup" aria-label="Filtrar por categoria" className="flex flex-wrap gap-1.5">
                {categories.map((c, i) => {
                  const active = category === c.id;
                  return (
                    <button
                      key={c.id}
                      ref={(el) => {
                        keys.refs.current[i] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      tabIndex={keys.tabIndexFor(i)}
                      onKeyDown={(e) => keys.onKeyDown(e, i)}
                      onClick={() => setCategory(c.id)}
                      className={cn(
                        "relative h-9 rounded-full px-4 text-sm transition-colors duration-150 focus-visible:shadow-focus",
                        active ? "text-white" : "text-ink-soft hover:bg-tint-lilac hover:text-ink",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="faq-cat-pill"
                          aria-hidden
                          className="absolute inset-0 rounded-full bg-primary"
                          transition={reduce ? { duration: 0 } : spring}
                        />
                      )}
                      <span className="relative">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
            <p id={`${uid}-status`} aria-live="polite" aria-atomic="true" className="text-sm text-ink-muted">
              {announced}
            </p>
          </div>

          <ul className="mt-6 divide-y divide-line border-y border-line">
            <AnimatePresence initial={false}>
              {results.map((item) => {
                const isOpen = open === item.id;
                const btnId = `${uid}-q-${item.id}`;
                const panelId = `${uid}-a-${item.id}`;
                return (
                  <motion.li
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.28, ease }}
                    className="overflow-hidden"
                  >
                    <h3>
                      <button
                        id={btnId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen(isOpen ? null : item.id)}
                        className="group flex w-full items-center justify-between gap-6 rounded-lg py-6 text-left text-[17px] font-semibold tracking-[-0.015em] text-ink transition-colors hover:text-primary focus-visible:shadow-focus sm:text-lg"
                      >
                        <span>
                          <Highlight text={item.question} query={query} />
                        </span>
                        <motion.span
                          aria-hidden
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={reduce ? { duration: 0 } : spring}
                          className={cn(
                            "grid size-8 shrink-0 place-items-center rounded-full transition-colors",
                            isOpen ? "bg-primary text-white" : "bg-tint-lilac text-primary group-hover:bg-tint-violet",
                          )}
                        >
                          <Plus className="size-4" />
                        </motion.span>
                      </button>
                    </h3>
                    <div id={panelId} role="region" aria-labelledby={btnId}>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.3, ease }}
                            className="overflow-hidden"
                          >
                            <p className="pr-12 pb-6 text-base leading-relaxed text-ink-soft">
                              <Highlight text={item.answer} query={query} />
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          <AnimatePresence initial={false}>
            {results.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.25, ease }}
                className="mt-6 rounded-3xl bg-tint-mist p-8 text-center"
              >
                <p className="font-semibold tracking-[-0.015em] text-ink">Nada encontrado</p>
                <p className="mt-1 text-sm text-ink-soft">Tente outra palavra ou me pergunte no WhatsApp.</p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-4 inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-medium text-primary transition-colors hover:bg-primary-100 focus-visible:shadow-focus"
                >
                  Ver todas
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </Container>
    </Section>
  );
}
