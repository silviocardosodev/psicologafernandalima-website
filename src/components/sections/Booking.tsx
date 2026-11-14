"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, m, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Pencil, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { track } from "@/lib/analytics";
import { ctaLabel, whatsappLink } from "@/lib/site";
import { useRadioKeys } from "@/lib/useRadioKeys";
import { cn } from "@/lib/utils";

const NAME_MAX = 60;

const reasons = ["Mente acelerada", "Autocobrança", "Cansaço", "Ansiedade", "Relacionamentos", "Outro"];

const periods = ["Manhã", "Tarde", "Noite", "Flexível"] as const;
type Period = (typeof periods)[number];

const firstTimeOptions = ["Sim", "Não"] as const;
type FirstTime = (typeof firstTimeOptions)[number];

const steps = [
  { title: "Como posso te chamar?", short: "Nome" },
  { title: "O que te traz?", short: "Motivos" },
  { title: "Qual período prefere?", short: "Período" },
];

type Field = "reasons" | "period" | "first";
type Errors = Partial<Record<Field, string>>;

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
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);
  const reasonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const clearError = (f: Field) => setErrors((e) => (e[f] ? { ...e, [f]: undefined } : e));
  const choosePeriod = (v: Period) => {
    setPeriod(v);
    clearError("period");
  };
  const chooseFirst = (v: FirstTime) => {
    setFirstTime(v);
    clearError("first");
  };
  const periodKeys = useRadioKeys(periods, period, choosePeriod);
  const firstKeys = useRadioKeys(firstTimeOptions, firstTime, chooseFirst);

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

  function validate(s: number): Errors {
    const e: Errors = {};
    if (s === 1 && selected.length === 0) e.reasons = "Escolha pelo menos uma opção — pode ser “Outro”.";
    if (s === 2 && !period) e.period = "Escolha um período.";
    if (s === 2 && !firstTime) e.first = "Conte se é sua primeira vez na terapia.";
    return e;
  }

  // On error, focus moves to the first invalid control; its group carries aria-describedby
  // pointing to the message, so it's read once (no extra role="alert").
  function focusFirstInvalid(e: Errors) {
    if (e.reasons) reasonRefs.current[0]?.focus();
    else if (e.period) periodKeys.refs.current[Math.max(0, period ? periods.indexOf(period) : 0)]?.focus();
    else if (e.first) firstKeys.refs.current[Math.max(0, firstTime ? firstTimeOptions.indexOf(firstTime) : 0)]?.focus();
  }

  function next() {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) {
      focusFirstInvalid(e);
      return;
    }
    setDir(1);
    shouldFocus.current = true;
    // Analytics: 1-based step reached (2, 3), 4 = preview. No answers are sent.
    track("booking_step", { step: step < steps.length - 1 ? step + 2 : steps.length + 1 });
    if (step < steps.length - 1) setStep(step + 1);
    else setDone(true);
  }

  function back() {
    setErrors({});
    setDir(-1);
    shouldFocus.current = true;
    if (done) setDone(false);
    else if (step > 0) setStep(step - 1);
  }

  function goTo(s: number) {
    setErrors({});
    setDir(done || s < step ? -1 : 1);
    shouldFocus.current = true;
    setDone(false);
    setStep(s);
  }

  function toggleReason(r: string) {
    clearError("reasons");
    setSelected((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  const progress = done ? 100 : ((step + 1) / (steps.length + 1)) * 100;
  const errId = (f: Field) => `${uid}-erro-${f}`;
  const panelId = `${uid}-assistente`;
  const stepLabel = (i: number) => <span className="sr-only">Passo {i + 1} de {steps.length}: </span>;
  const t = reduce ? { duration: 0 } : spring;

  const errorText = (f: Field) =>
    errors[f] ? (
      <p id={errId(f)} className="mt-2 text-sm font-medium text-[#b42318]">
        {errors[f]}
      </p>
    ) : null;

  const headingClass = "text-xl font-semibold tracking-[-0.015em] text-ink outline-none";

  return (
    <Section id="agendar" aria-labelledby="agendar-titulo" className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="rounded-3xl bg-[linear-gradient(180deg,var(--color-tint-lilac)_0%,var(--color-tint-mist)_55%,#ffffff_100%)] px-5 py-14 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <Reveal className="mx-auto max-w-2xl">
            <h2
              id="agendar-titulo"
              className="text-[32px] leading-[1.12] font-[650] tracking-[-0.03em] text-balance text-ink sm:text-[40px] lg:text-[46px]"
            >
              Que tal começar por uma conversa?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-soft sm:text-[17px]">
              Sem compromisso. Você me escreve e combinamos o melhor horário.
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-whatsapp px-9 text-base font-medium text-white shadow-[0_8px_24px_rgb(15_122_59/24%)] transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-whatsapp-hover focus-visible:shadow-focus active:translate-y-px sm:h-15 sm:text-[17px]"
            >
              <WhatsAppIcon className="size-5" />
              {ctaLabel}
              <span className="sr-only"> no WhatsApp (abre em nova aba)</span>
            </a>

            <div className="mt-6">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => {
                  if (!open) track("booking_open");
                  setOpen(!open);
                }}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[15px] font-medium text-primary underline-offset-4 transition-colors hover:bg-white/70 hover:text-primary-hover hover:underline focus-visible:shadow-focus"
              >
                Prefere que eu escreva a mensagem por você?
                <m.span aria-hidden animate={{ rotate: open ? 180 : 0 }} transition={t} className="grid place-items-center">
                  <ChevronDown className="size-4" />
                </m.span>
              </button>
            </div>
          </Reveal>

          <div id={panelId}>
            <AnimatePresence initial={false}>
              {open && (
                <m.div
                  key="assistente"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.4, ease }}
                  className="overflow-hidden"
                >
                  <div className="mx-auto mt-6 max-w-xl rounded-3xl bg-white text-left shadow-[0_12px_40px_rgb(49_46_129/8%)]">
                    <div className="px-5 pt-5 sm:px-8 sm:pt-7">
                      <p className="text-sm text-ink-soft">Leva menos de 1 minuto. Sua mensagem chega pronta no WhatsApp.</p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">
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
                                      <m.span
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
                        <m.div
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
                          <m.div
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
                                <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                                  {stepLabel(0)}
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
                                  className="mt-2 h-12 w-full rounded-full border border-line-control bg-white px-5 text-base text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-muted hover:border-ink-soft focus:border-primary focus:shadow-focus"
                                />
                              </div>
                            )}

                            {!done && step === 1 && (
                              <fieldset>
                                <legend className="block w-full p-0">
                                  <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                                    {stepLabel(1)}
                                    {steps[1].title}
                                  </h3>
                                </legend>
                                <p className="mt-1.5 text-sm text-ink-soft">Escolha quantas quiser.</p>
                                <div className="mt-5 flex flex-wrap gap-2">
                                  {reasons.map((r, i) => {
                                    const on = selected.includes(r);
                                    return (
                                      <m.button
                                        key={r}
                                        ref={(el) => {
                                          reasonRefs.current[i] = el;
                                        }}
                                        type="button"
                                        aria-pressed={on}
                                        aria-describedby={errors.reasons ? errId("reasons") : undefined}
                                        onClick={() => toggleReason(r)}
                                        whileTap={{ scale: 0.95 }}
                                        transition={t}
                                        className={cn(
                                          "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors duration-150 focus-visible:shadow-focus",
                                          on
                                            ? "border-primary bg-primary text-white"
                                            : "border-line-control bg-white text-ink hover:bg-tint-lilac",
                                        )}
                                      >
                                        {on && <Check aria-hidden className="size-3.5" strokeWidth={2.75} />}
                                        {r}
                                      </m.button>
                                    );
                                  })}
                                </div>
                                {errorText("reasons")}
                              </fieldset>
                            )}

                            {!done && step === 2 && (
                              <div>
                                <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                                  {stepLabel(2)}
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
                                    aria-invalid={errors.period ? true : undefined}
                                    aria-describedby={errors.period ? errId("period") : undefined}
                                    className="mt-5 grid grid-cols-2 gap-2.5"
                                  >
                                    {periods.map((p, i) => {
                                      const on = period === p;
                                      return (
                                        <m.button
                                          key={p}
                                          ref={(el) => {
                                            periodKeys.refs.current[i] = el;
                                          }}
                                          type="button"
                                          role="radio"
                                          aria-checked={on}
                                          tabIndex={periodKeys.tabIndexFor(i)}
                                          onKeyDown={(e) => periodKeys.onKeyDown(e, i)}
                                          onClick={() => choosePeriod(p)}
                                          whileHover={{ y: -2 }}
                                          whileTap={{ scale: 0.97 }}
                                          transition={t}
                                          className={cn(
                                            "relative flex h-14 items-center justify-between rounded-2xl border px-4 text-left text-sm font-semibold transition-colors duration-150 focus-visible:shadow-focus",
                                            on
                                              ? "border-primary text-primary-deep"
                                              : errors.period
                                                ? "border-[#b42318] bg-white text-ink hover:bg-tint-lilac"
                                                : "border-line-control bg-white text-ink hover:bg-tint-lilac",
                                          )}
                                        >
                                          {on && (
                                            <m.span
                                              layoutId="booking-period"
                                              aria-hidden
                                              className="absolute inset-0 rounded-[15px] bg-tint-violet"
                                              transition={t}
                                            />
                                          )}
                                          <span className="relative">{p}</span>
                                          <span
                                            aria-hidden
                                            className={cn(
                                              "relative grid size-4 place-items-center rounded-full",
                                              on ? "bg-primary" : "bg-white ring-1 ring-line-control",
                                            )}
                                          >
                                            {on && <span className="size-1.5 rounded-full bg-white" />}
                                          </span>
                                        </m.button>
                                      );
                                    })}
                                  </div>
                                </LayoutGroup>
                                {errorText("period")}

                                <p id={`${uid}-primeira`} className="mt-6 text-sm font-medium text-ink">
                                  Primeira vez na terapia?
                                </p>
                                <LayoutGroup id={`${uid}-first`}>
                                  <div
                                    role="radiogroup"
                                    aria-labelledby={`${uid}-primeira`}
                                    aria-required="true"
                                    aria-invalid={errors.first ? true : undefined}
                                    aria-describedby={errors.first ? errId("first") : undefined}
                                    className={cn(
                                      "mt-3 inline-flex rounded-full border bg-white p-1",
                                      errors.first ? "border-[#b42318]" : "border-line-control",
                                    )}
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
                                          onClick={() => chooseFirst(o)}
                                          className={cn(
                                            "relative h-9 min-w-20 rounded-full px-5 text-sm font-medium transition-colors duration-150 focus-visible:shadow-focus",
                                            on ? "text-white" : "text-ink-soft hover:text-ink",
                                          )}
                                        >
                                          {on && (
                                            <m.span
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
                                {errorText("first")}
                              </div>
                            )}

                            {done && (
                              <div>
                                <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                                  Sua mensagem está pronta
                                </h3>
                                <p className="mt-1.5 text-sm text-ink-soft">Você ainda pode editar no WhatsApp.</p>
                                <figure className="mt-5 rounded-3xl bg-tint-mist p-4">
                                  <figcaption className="sr-only">Prévia da mensagem</figcaption>
                                  <m.div
                                    initial={{ y: 10, scale: 0.97 }}
                                    animate={{ y: 0, scale: 1 }}
                                    transition={reduce ? { duration: 0 } : { ...spring, delay: 0.1 }}
                                    className="ml-auto max-w-[92%] origin-bottom-right rounded-2xl rounded-br-md border border-primary-200 bg-white px-4 py-3 text-[14px] leading-relaxed whitespace-pre-line text-ink"
                                  >
                                    {message}
                                  </m.div>
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
                          </m.div>
                        </AnimatePresence>
                      </div>

                      {done ? (
                        <div className="mt-3 space-y-3">
                          <m.a
                            href={whatsappLink(message)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => track("booking_submit")}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={t}
                            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-6 text-base font-medium text-white shadow-[0_8px_24px_rgb(15_122_59/24%)] transition-colors hover:bg-whatsapp-hover focus-visible:shadow-focus"
                          >
                            <WhatsAppIcon className="size-5" />
                            Enviar pelo WhatsApp
                            <span className="sr-only"> (abre em nova aba)</span>
                          </m.a>
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
                          <Button type="submit" variant="primary">
                            {step === steps.length - 1 ? "Ver mensagem" : step === 0 && !name.trim() ? "Pular" : "Continuar"}
                            <ArrowRight aria-hidden className="size-4" />
                          </Button>
                        </div>
                      )}
                    </form>

                    <p className="flex items-center justify-center gap-2 border-t border-line-soft px-5 py-4 text-center text-sm text-ink-soft sm:px-8">
                      <ShieldCheck aria-hidden className="size-4 text-primary" />
                      Nada do que você escreve aqui é salvo.
                    </p>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  );
}
