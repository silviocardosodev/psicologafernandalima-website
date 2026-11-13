"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, HandHeart, Pencil, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/site";
import { useRadioKeys } from "@/lib/useRadioKeys";
import { cn } from "@/lib/utils";

const NAME_MAX = 60;

const reasons = ["Ansiedade", "Relacionamentos", "Autoestima", "Autocobrança", "Depressão", "Pânico", "Outro"];

const periods = ["Manhã", "Tarde", "Noite", "Flexível"] as const;
type Period = (typeof periods)[number];

const firstTimeOptions = ["Sim", "Não"] as const;
type FirstTime = (typeof firstTimeOptions)[number];

const steps = [
  { title: "Como posso te chamar?", short: "Nome" },
  { title: "O que te traz?", short: "Motivos" },
  { title: "Qual período prefere?", short: "Período" },
];

const reassurance = [
  { icon: Clock, label: "Resposta com calma" },
  { icon: HandHeart, label: "Sem compromisso" },
  { icon: ShieldCheck, label: "Nada é salvo aqui" },
];

const spring = { type: "spring", stiffness: 300, damping: 22 } as const;
const ease = [0.22, 1, 0.36, 1] as const;

const slide = {
  enter: (d: number) => ({ opacity: 0, x: d * 32 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d * -32 }),
};

function listPt(items: string[]) {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

export function Booking() {
  const reduce = useReducedMotion();
  const uid = useId();
  const shouldFocus = useRef(false);

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [period, setPeriod] = useState<Period | "">("");
  const [firstTime, setFirstTime] = useState<FirstTime | "">("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const periodKeys = useRadioKeys(periods, period, (v) => {
    setPeriod(v);
    setError(null);
  });
  const firstKeys = useRadioKeys(firstTimeOptions, firstTime, (v) => {
    setFirstTime(v);
    setError(null);
  });

  // Focus the new step heading once it mounts (after the exit animation).
  const headingRef = useCallback((el: HTMLHeadingElement | null) => {
    if (el && shouldFocus.current) {
      shouldFocus.current = false;
      el.focus({ preventScroll: true });
    }
  }, []);

  const message = useMemo(() => {
    const trimmed = name.trim();
    const lines = [trimmed ? `Olá Fernanda! Meu nome é ${trimmed}.` : "Olá Fernanda!"];
    lines.push("Cheguei pelo seu site e quero iniciar a terapia.");
    const motives = selected.filter((r) => r !== "Outro").map((r) => r.toLowerCase());
    const other = selected.includes("Outro");
    if (motives.length) lines.push(`Gostaria de conversar sobre ${listPt(motives)}${other ? " e outros temas" : ""}.`);
    else if (other) lines.push("Gostaria de conversar sobre um tema específico.");
    if (period) lines.push(period === "Flexível" ? "Tenho horários flexíveis." : `Prefiro o período da ${period.toLowerCase()}.`);
    if (firstTime) lines.push(firstTime === "Sim" ? "Será minha primeira vez na terapia." : "Já fiz terapia antes.");
    return lines.join("\n");
  }, [name, selected, period, firstTime]);

  function validate(s: number) {
    if (s === 1 && selected.length === 0) return "Escolha pelo menos uma opção — pode ser “Outro”.";
    if (s === 2 && !period) return "Escolha um período.";
    if (s === 2 && !firstTime) return "Conte se é sua primeira vez na terapia.";
    return null;
  }

  function next() {
    const err = validate(step);
    setError(err);
    if (err) return;
    setDir(1);
    shouldFocus.current = true;
    if (step < steps.length - 1) setStep(step + 1);
    else setDone(true);
  }

  function back() {
    setError(null);
    setDir(-1);
    shouldFocus.current = true;
    if (done) setDone(false);
    else if (step > 0) setStep(step - 1);
  }

  function goTo(s: number) {
    setError(null);
    setDir(done || s < step ? -1 : 1);
    shouldFocus.current = true;
    setDone(false);
    setStep(s);
  }

  function toggleReason(r: string) {
    setError(null);
    setSelected((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  const progress = done ? 100 : ((step + 1) / (steps.length + 1)) * 100;
  const errorId = `${uid}-erro`;
  const t = reduce ? { duration: 0 } : spring;

  return (
    <Section id="agendar" aria-labelledby="agendar-titulo" className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="grid items-center gap-10 rounded-3xl bg-[linear-gradient(160deg,var(--color-tint-lilac)_0%,var(--color-tint-violet)_45%,#ffffff_100%)] px-5 py-12 sm:px-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:p-16">
          {/* Left: pitch */}
          <Reveal>
            <h2
              id="agendar-titulo"
              className="text-[32px] leading-[1.12] font-[650] tracking-[-0.03em] text-balance text-ink sm:text-[40px] lg:text-[46px]"
            >
              Pronta para dar o primeiro passo?
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft sm:text-[17px]">
              Três perguntas rápidas e sua mensagem chega pronta no WhatsApp.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2 lg:flex-col lg:gap-3">
              {reassurance.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2.5 text-sm text-ink-soft">
                  <span className="grid size-8 place-items-center rounded-full bg-white text-primary">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Right: wizard card */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="rounded-3xl bg-white shadow-[0_12px_40px_rgb(49_46_129/8%)]">
              <div className="px-5 pt-5 sm:px-8 sm:pt-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase" aria-live="polite">
                    {done ? "Tudo pronto" : `Passo ${step + 1} de ${steps.length}`}
                  </p>
                  <LayoutGroup id={`${uid}-dots`}>
                    <ol className="flex items-center gap-1.5" aria-label="Etapas">
                      {steps.map((s, i) => {
                        const complete = done || i < step;
                        const current = !done && i === step;
                        return (
                          <li key={s.short}>
                            <button
                              type="button"
                              onClick={() => goTo(i)}
                              disabled={!complete}
                              aria-current={current ? "step" : undefined}
                              aria-label={`${s.short}${complete ? " (concluído, editar)" : current ? " (atual)" : ""}`}
                              className={cn(
                                "relative grid size-7 place-items-center rounded-full text-xs font-semibold transition-colors duration-150 focus-visible:shadow-focus disabled:cursor-default",
                                complete && "bg-primary-100 text-primary hover:bg-primary-200",
                                current && "text-white",
                                !complete && !current && "bg-tint-mist text-ink-muted",
                              )}
                            >
                              {current && (
                                <motion.span
                                  layoutId="booking-dot"
                                  aria-hidden
                                  className="absolute inset-0 rounded-full bg-primary"
                                  transition={t}
                                />
                              )}
                              <span className="relative">
                                {complete ? <Check aria-hidden className="size-3.5" strokeWidth={3} /> : i + 1}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </LayoutGroup>
                </div>
                <div
                  className="mt-4 h-1.5 overflow-hidden rounded-full bg-tint-lilac"
                  role="progressbar"
                  aria-label="Progresso"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                >
                  <motion.div
                    className="h-full rounded-full bg-progress"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={t}
                  />
                </div>
              </div>

              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!done) next();
                }}
                className="overflow-hidden px-5 py-6 sm:px-8 sm:py-7"
              >
                <div className="relative min-h-[272px]">
                  <AnimatePresence mode="wait" initial={false} custom={dir}>
                    <motion.div
                      key={done ? "done" : step}
                      custom={dir}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={reduce ? { duration: 0 } : { duration: 0.24, ease }}
                    >
                      {!done && step === 0 && (
                        <div>
                          <h3
                            ref={headingRef}
                            tabIndex={-1}
                            className="text-xl font-semibold tracking-[-0.015em] text-ink outline-none"
                          >
                            {steps[0].title}
                          </h3>
                          <p className="mt-1.5 text-sm text-ink-soft">Opcional — pode ser um apelido.</p>
                          <label htmlFor={`${uid}-nome`} className="mt-6 block text-sm font-medium text-ink">
                            Seu nome
                          </label>
                          <input
                            id={`${uid}-nome`}
                            type="text"
                            value={name}
                            maxLength={NAME_MAX}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="given-name"
                            placeholder="Ex.: Ana"
                            className="mt-2 h-12 w-full rounded-full bg-tint-mist px-5 text-base text-ink outline-none transition-[background-color,box-shadow] duration-150 placeholder:text-ink-muted hover:bg-tint-lilac focus:bg-white focus:shadow-focus"
                          />
                        </div>
                      )}

                      {!done && step === 1 && (
                        <fieldset aria-describedby={error ? errorId : undefined}>
                          <legend className="block w-full p-0">
                            <h3
                              ref={headingRef}
                              tabIndex={-1}
                              className="text-xl font-semibold tracking-[-0.015em] text-ink outline-none"
                            >
                              {steps[1].title}
                            </h3>
                          </legend>
                          <p className="mt-1.5 text-sm text-ink-soft">Escolha quantas quiser.</p>
                          <div className="mt-5 flex flex-wrap gap-2">
                            {reasons.map((r, i) => {
                              const on = selected.includes(r);
                              return (
                                <motion.button
                                  key={r}
                                  type="button"
                                  aria-pressed={on}
                                  onClick={() => toggleReason(r)}
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={
                                    reduce ? { duration: 0 } : { ...spring, opacity: { duration: 0.25, delay: i * 0.03 } }
                                  }
                                  className={cn(
                                    "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm transition-colors duration-150 focus-visible:shadow-focus",
                                    on ? "bg-primary text-white" : "bg-tint-lilac text-ink-soft hover:bg-tint-violet hover:text-ink",
                                  )}
                                >
                                  {on && <Check aria-hidden className="size-3.5" strokeWidth={2.75} />}
                                  {r}
                                </motion.button>
                              );
                            })}
                          </div>
                        </fieldset>
                      )}

                      {!done && step === 2 && (
                        <div>
                          <h3
                            ref={headingRef}
                            tabIndex={-1}
                            className="text-xl font-semibold tracking-[-0.015em] text-ink outline-none"
                          >
                            {steps[2].title}
                          </h3>
                          <p id={`${uid}-periodo`} className="sr-only">
                            Período preferido para as sessões
                          </p>
                          <LayoutGroup id={`${uid}-period`}>
                            <div
                              role="radiogroup"
                              aria-labelledby={`${uid}-periodo`}
                              aria-required="true"
                              className="mt-5 grid grid-cols-2 gap-2.5"
                            >
                              {periods.map((p, i) => {
                                const on = period === p;
                                return (
                                  <motion.button
                                    key={p}
                                    ref={(el) => {
                                      periodKeys.refs.current[i] = el;
                                    }}
                                    type="button"
                                    role="radio"
                                    aria-checked={on}
                                    tabIndex={periodKeys.tabIndexFor(i)}
                                    onKeyDown={(e) => periodKeys.onKeyDown(e, i)}
                                    onClick={() => {
                                      setPeriod(p);
                                      setError(null);
                                    }}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={t}
                                    className={cn(
                                      "relative flex h-14 items-center justify-between rounded-2xl px-4 text-left text-sm font-semibold transition-colors duration-150 focus-visible:shadow-focus",
                                      on ? "text-primary-deep" : "bg-tint-mist text-ink hover:bg-tint-lilac",
                                    )}
                                  >
                                    {on && (
                                      <motion.span
                                        layoutId="booking-period"
                                        aria-hidden
                                        className="absolute inset-0 rounded-2xl bg-tint-violet ring-1 ring-primary/30"
                                        transition={t}
                                      />
                                    )}
                                    <span className="relative">{p}</span>
                                    <span
                                      aria-hidden
                                      className={cn(
                                        "relative grid size-4 place-items-center rounded-full",
                                        on ? "bg-primary" : "bg-white ring-1 ring-line-control/50",
                                      )}
                                    >
                                      {on && <span className="size-1.5 rounded-full bg-white" />}
                                    </span>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </LayoutGroup>

                          <p id={`${uid}-primeira`} className="mt-6 text-sm font-medium text-ink">
                            Primeira vez na terapia?
                          </p>
                          <LayoutGroup id={`${uid}-first`}>
                            <div
                              role="radiogroup"
                              aria-labelledby={`${uid}-primeira`}
                              aria-required="true"
                              className="mt-3 inline-flex rounded-full bg-tint-mist p-1"
                            >
                              {firstTimeOptions.map((o, i) => {
                                const on = firstTime === o;
                                return (
                                  <button
                                    key={o}
                                    ref={(el) => {
                                      firstKeys.refs.current[i] = el;
                                    }}
                                    type="button"
                                    role="radio"
                                    aria-checked={on}
                                    tabIndex={firstKeys.tabIndexFor(i)}
                                    onKeyDown={(e) => firstKeys.onKeyDown(e, i)}
                                    onClick={() => {
                                      setFirstTime(o);
                                      setError(null);
                                    }}
                                    className={cn(
                                      "relative h-9 min-w-20 rounded-full px-5 text-sm font-medium transition-colors duration-150 focus-visible:shadow-focus",
                                      on ? "text-white" : "text-ink-soft hover:text-ink",
                                    )}
                                  >
                                    {on && (
                                      <motion.span
                                        layoutId="booking-first"
                                        aria-hidden
                                        className="absolute inset-0 rounded-full bg-primary"
                                        transition={t}
                                      />
                                    )}
                                    <span className="relative">{o}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </LayoutGroup>
                        </div>
                      )}

                      {done && (
                        <div>
                          <h3
                            ref={headingRef}
                            tabIndex={-1}
                            className="text-xl font-semibold tracking-[-0.015em] text-ink outline-none"
                          >
                            Sua mensagem está pronta
                          </h3>
                          <p className="mt-1.5 text-sm text-ink-soft">Você ainda pode editar no WhatsApp.</p>
                          <figure className="mt-5 rounded-3xl bg-tint-mist p-4">
                            <figcaption className="sr-only">Prévia da mensagem</figcaption>
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={reduce ? { duration: 0 } : { ...spring, delay: 0.1 }}
                              className="ml-auto max-w-[92%] origin-bottom-right rounded-2xl rounded-br-md bg-white px-4 py-3 text-[14px] leading-relaxed whitespace-pre-line text-ink ring-1 ring-primary-200"
                            >
                              {message}
                            </motion.div>
                          </figure>
                          <button
                            type="button"
                            onClick={() => goTo(0)}
                            className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-primary transition-colors hover:bg-tint-lilac hover:text-primary-hover focus-visible:shadow-focus"
                          >
                            <Pencil aria-hidden className="size-3.5" />
                            Editar
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <p
                  id={errorId}
                  role="alert"
                  className={cn("min-h-5 text-sm font-medium text-[#b42318]", !error && "sr-only")}
                >
                  {error}
                </p>

                {done ? (
                  <div className="mt-3 space-y-3">
                    <motion.a
                      href={whatsappLink(message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={t}
                      className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-6 text-base font-medium text-white shadow-[0_8px_24px_rgb(15_122_59/24%)] transition-colors hover:bg-whatsapp-hover focus-visible:shadow-focus"
                    >
                      <WhatsAppIcon className="size-5" />
                      Enviar pelo WhatsApp
                      <span className="sr-only"> (abre em nova aba)</span>
                    </motion.a>
                    <Button variant="ghost" onClick={back} className="px-3">
                      <ArrowLeft aria-hidden className="size-4" />
                      Voltar
                    </Button>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <Button variant="ghost" onClick={back} disabled={step === 0} className="px-3">
                      <ArrowLeft aria-hidden className="size-4" />
                      Voltar
                    </Button>
                    <Button type="submit" variant="primary" aria-describedby={error ? errorId : undefined}>
                      {step === steps.length - 1 ? "Ver mensagem" : step === 0 && !name.trim() ? "Pular" : "Continuar"}
                      <ArrowRight aria-hidden className="size-4" />
                    </Button>
                  </div>
                )}
              </form>

              <p className="border-t border-line-soft px-5 py-4 text-center text-sm text-ink-soft sm:px-8">
                Prefere a mensagem padrão?{" "}
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm font-medium text-primary underline-offset-4 hover:text-primary-hover hover:underline"
                >
                  Abrir WhatsApp
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
