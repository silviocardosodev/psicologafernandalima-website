"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Activity, CloudRain, Info, Users, Wind, type LucideIcon } from "lucide-react";

import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export type AreaId = "ansiedade" | "relacionamentos" | "depressao" | "panico";

type Area = {
  id: AreaId;
  label: string;
  icon: LucideIcon;
  hook: string;
  signs: string[];
  paragraphs: string[];
  note: ReactNode;
  message: string;
};

const telLink = "font-semibold underline underline-offset-2 hover:no-underline";

const areas: Area[] = [
  {
    id: "ansiedade",
    label: "Ansiedade",
    icon: Wind,
    hook: "Como era a sua vida antes de a ansiedade se tornar um problema?",
    signs: [
      "Preocupação excessiva",
      "Dificuldade de concentração",
      "Tensão muscular",
      "Irritabilidade",
      "Falta de ar",
      "Coração acelerado",
    ],
    paragraphs: [
      "A ansiedade é uma emoção, assim como a alegria ou a tristeza. Ela nos ajuda a reagir a situações importantes — mas, quando fica desregulada, faz o corpo e o cérebro agirem como se você estivesse sempre em perigo.",
      "Existem vários tipos de ansiedade, como a ansiedade social, a ansiedade generalizada, o transtorno do pânico e as fobias específicas. Na terapia, entendemos juntas como ela aparece na sua vida e construímos formas mais leves de lidar com ela.",
    ],
    note: "A ocorrência de alguns desses sintomas é um sinal de alerta, mas não é suficiente para um diagnóstico. Para isso, é necessária uma avaliação clínica cuidadosa.",
    message: "Olá Fernanda! Cheguei aqui por meio do seu site e gostaria de conversar sobre ansiedade.",
  },
  {
    id: "relacionamentos",
    label: "Relacionamentos",
    icon: Users,
    hook: "Como era a sua vida antes dos problemas nos seus relacionamentos?",
    signs: [
      "Término",
      "Luto",
      "Problemas familiares",
      "Atritos constantes",
      "Relacionamento abusivo",
      "Dificuldade de impor limites",
    ],
    paragraphs: [
      "Somos seres sociais: é da nossa natureza encontrar felicidade no contato com outras pessoas. Por isso mesmo, em vários momentos da vida precisaremos lidar com dificuldades nas relações familiares, amorosas ou profissionais.",
      "Algumas relações nos alegram e suprem necessidades importantes; outras despertam emoções difíceis. A terapia é um espaço para compreender esses vínculos, fortalecer seus limites e cuidar de como você se sente neles.",
    ],
    note: (
      <>
        Cada relação tem sua própria história, e esses sinais não definem você. Se você estiver em situação de
        violência, procure ajuda: <a href="tel:180" className={telLink}>Ligue 180</a> (Central de Atendimento à
        Mulher, 24h, gratuito) ou <a href="tel:190" className={telLink}>190</a> em caso de emergência.
      </>
    ),
    message:
      "Olá Fernanda! Cheguei aqui por meio do seu site e gostaria de conversar sobre questões nos meus relacionamentos.",
  },
  {
    id: "depressao",
    label: "Depressão",
    icon: CloudRain,
    hook: "Como era a sua vida antes da depressão?",
    signs: ["Humor deprimido", "Cansaço", "Indecisão", "Insônia ou hipersonia", "Culpa", "Perda de interesse"],
    paragraphs: [
      "A depressão pode aparecer como perda de interesse por quase todas as atividades, sensação de vazio e cansaço, irritabilidade e vontade de chorar com frequência.",
      "Ela se diferencia da tristeza pela intensidade e pela duração, e costuma vir acompanhada de culpa, sensação de inutilidade, dificuldade para decidir e se concentrar e alterações no sono. Você não precisa esperar “piorar” para buscar cuidado.",
    ],
    note: (
      <>
        Esses sinais são um alerta, não um diagnóstico — apenas uma avaliação clínica cuidadosa pode indicá-lo.{" "}
        <strong className="font-semibold">Se você tiver pensamentos de morte, procure ajuda imediatamente:</strong>{" "}
        ligue para o CVV no <a href="tel:188" className={telLink}>188</a> (24h, gratuito).
      </>
    ),
    message: "Olá Fernanda! Cheguei aqui por meio do seu site e gostaria de conversar sobre depressão.",
  },
  {
    id: "panico",
    label: "Pânico",
    icon: Activity,
    hook: "Como era a sua vida antes dos ataques de pânico?",
    signs: ["Medo intenso", "Coração acelerado", "Tremores", "Falta de ar", "Formigamento", "Medo de perder o controle"],
    paragraphs: [
      "Os ataques de pânico podem estar presentes em quadros de ansiedade ou caracterizar um transtorno de pânico. Eles podem surgir de forma inesperada ou estar ligados a situações temidas.",
      "Com frequência, vem junto um medo constante de ter novos ataques e de suas consequências — o que leva a evitar lugares e situações. Na terapia, buscamos compreender essas reações e construir, no seu ritmo, novas formas de lidar com elas.",
    ],
    note: (
      <>
        A presença desses sintomas não basta para um diagnóstico; é necessária uma avaliação clínica cuidadosa. Em uma
        crise intensa, procure um serviço de saúde ou ligue <a href="tel:192" className={telLink}>192</a> (SAMU).
      </>
    ),
    message: "Olá Fernanda! Cheguei aqui por meio do seu site e gostaria de conversar sobre crises de pânico.",
  },
];

const ids = areas.map((a) => a.id);

export function Areas() {
  const [active, setActive] = useState<AreaId>("ansiedade");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const reduce = useReducedMotion();

  const select = useCallback((id: AreaId, focus = false) => {
    setActive(id);
    const el = tabRefs.current[id];
    if (!el) return;
    if (focus) el.focus();
    el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
  }, []);

  // Lets other components open a tab: window.dispatchEvent(new CustomEvent("fl:select-area", { detail: { id } }))
  useEffect(() => {
    function onSelect(e: Event) {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      if (id && (ids as string[]).includes(id)) setActive(id as AreaId);
    }
    window.addEventListener("fl:select-area", onSelect);
    return () => window.removeEventListener("fl:select-area", onSelect);
  }, []);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const i = ids.indexOf(active);
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % ids.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + ids.length) % ids.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = ids.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(ids[next], true);
  }

  const area = areas.find((a) => a.id === active)!;

  return (
    <Section id="atuacao" aria-labelledby="atuacao-title">
      <Container>
        <SectionHeader
          id="atuacao-title"
          eyebrow="Áreas de atuação"
          title="Como posso te ajudar"
          description="Cada mulher vive suas dificuldades de um jeito único. Conheça as principais questões com que trabalho e veja se alguma delas conversa com o seu momento."
        />

        <Reveal className="mt-10 lg:mt-12">
          {/* Tabs: scrollable chips on mobile, underline tabs from md */}
          <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:overflow-visible md:border-b md:border-line md:px-0 [&::-webkit-scrollbar]:hidden">
            <div role="tablist" aria-label="Áreas de atuação" className="flex w-max gap-2 py-1 md:w-auto md:gap-1 md:py-0">
              {areas.map((a) => {
                const selected = a.id === active;
                const Icon = a.icon;
                return (
                  <button
                    key={a.id}
                    ref={(el) => {
                      tabRefs.current[a.id] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${a.id}`}
                    aria-selected={selected}
                    aria-controls={selected ? `panel-${a.id}` : undefined}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(a.id)}
                    onKeyDown={onKeyDown}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 text-sm font-semibold whitespace-nowrap transition-[color,background-color,border-color] duration-150",
                      // mobile chip
                      "h-10 rounded-full border px-4",
                      selected
                        ? "border-primary bg-primary-100 text-primary-hover"
                        : "border-line bg-surface text-ink-soft hover:border-primary-200 hover:text-ink",
                      // desktop underline tab
                      "md:-mb-px md:h-12 md:rounded-none md:rounded-t-md md:border-0 md:border-b-2 md:bg-transparent md:px-4",
                      selected
                        ? "md:border-primary md:bg-transparent md:text-primary"
                        : "md:border-transparent md:hover:border-line-hover md:hover:bg-transparent",
                    )}
                  >
                    <Icon aria-hidden className="size-4" strokeWidth={2} />
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={area.id}
              role="tabpanel"
              id={`panel-${area.id}`}
              aria-labelledby={`tab-${area.id}`}
              tabIndex={0}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={reduce ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 grid gap-6 rounded-xl md:mt-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10"
            >
              <div>
                <h3 className="text-2xl leading-[1.2] font-bold tracking-[-0.025em] text-balance text-ink sm:text-[28px]">
                  {area.hook}
                </h3>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft">
                  {area.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <ButtonLink
                  href={whatsappLink(area.message)}
                  external
                  variant="primary"
                  size="lg"
                  className="mt-7 w-full sm:w-auto"
                >
                  <WhatsAppIcon className="size-5" />
                  Conversar sobre isso
                </ButtonLink>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-line bg-surface p-5 shadow-card sm:p-6">
                  <p className="text-xs font-semibold tracking-[0.05em] text-ink-muted uppercase">
                    Sinais que você pode estar vivenciando
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {area.signs.map((s) => (
                      <li
                        key={s}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1.5 text-sm text-ink"
                      >
                        <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 rounded-xl border border-warning/15 bg-warning-bg p-5 text-warning">
                  <Info aria-hidden className="mt-0.5 size-5 shrink-0" />
                  <p className="text-sm leading-relaxed">{area.note}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </Container>
    </Section>
  );
}
