"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, HandHeart, Pencil, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";
import { site, whatsappLink } from "@/lib/site";
import { useRadioKeys } from "@/lib/useRadioKeys";

const NAME_MAX = 60;
const NOTE_MAX = 280;

const reasons = ["Ansiedade", "Relacionamentos", "Depressão", "Pânico", "Autoestima", "Autocobrança", "Outro motivo"];

const periods = [
  { id: "Manhã", hint: "Início do dia" },
  { id: "Tarde", hint: "Meio do dia" },
  { id: "Noite", hint: "Fim do dia" },
  { id: "Flexível", hint: "Qualquer horário" },
] as const;

const firstTimeOptions = ["Sim", "Não"] as const;

const steps = [
  { title: "Como posso te chamar?", short: "Nome" },
  { title: "O que te traz à terapia?", short: "Motivo" },
  { title: "Qual período prefere?", short: "Período" },
];

const reassurance = [
  { icon: Clock, title: "Costumo responder em até 1 dia útil", text: "Você recebe um retorno atencioso, sem respostas automáticas." },
  { icon: HandHeart, title: "Sem compromisso", text: "Conversar não te obriga a nada. Tire suas dúvidas com calma." },
  { icon: ShieldCheck, title: "Nada é armazenado neste site", text: "Suas respostas só montam a mensagem; quem envia é você." },
];

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
  const [note, setNote] = useState("");
  const [period, setPeriod] = useState<(typeof periods)[number]["id"] | "">("");
  const [firstTime, setFirstTime] = useState<(typeof firstTimeOptions)[number] | "">("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const periodIds = periods.map((p) => p.id);
  const periodKeys = useRadioKeys(periodIds, period, setPeriod);
  const firstKeys = useRadioKeys(firstTimeOptions, firstTime, setFirstTime);

  // Move focus to the new step heading once it mounts (after the exit animation).
  const headingRef = useCallback((el: HTMLHeadingElement | null) => {
    if (el && shouldFocus.current) {
      shouldFocus.current = false;
      el.focus({ preventScroll: true });
    }
  }, []);

  const message = useMemo(() => {
    const trimmed = name.trim();
    const lines = [trimmed ? `Olá Fernanda! Meu nome é ${trimmed}.` : "Olá Fernanda!"];
    lines.push("Cheguei pelo seu site e tenho interesse em iniciar a terapia.");
    const motives = selected.filter((r) => r !== "Outro motivo");
    const other = selected.includes("Outro motivo");
    if (motives.length) lines.push(`Gostaria de conversar sobre: ${listPt(motives)}${other ? " e outros temas" : ""}.`);
    else if (other) lines.push("Gostaria de conversar sobre um tema específico.");
    if (note.trim()) lines.push(`Um pouco mais sobre mim: ${note.trim()}`);
    if (period) lines.push(period === "Flexível" ? "Tenho horários flexíveis." : `Prefiro sessões no período da ${period.toLowerCase()}.`);
    if (firstTime) lines.push(firstTime === "Sim" ? "Será minha primeira vez na terapia." : "Já fiz terapia antes.");
    return lines.join("\n");
  }, [name, selected, note, period, firstTime]);

  function validate(s: number) {
    if (s === 1 && selected.length === 0) return "Escolha pelo menos uma opção — pode ser “Outro motivo”.";
    if (s === 2 && !period) return "Escolha o período que prefere.";
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
    setDir(s < step ? -1 : 1);
    shouldFocus.current = true;
    setDone(false);
    setStep(s);
  }

  function toggleReason(r: string) {
    setError(null);
    setSelected((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  const progress = done ? 100 : ((step + 1) / (steps.length + 1)) * 100;
  const errorId = `${uid}-error`;
  const variants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -28 }),
  };

  return (
    <Section id="agendar" aria-labelledby="agendar-titulo" className="overflow-hidden bg-soft">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-60 [mask-image:radial-gradient(70%_60%_at_80%_40%,black,transparent)]" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Left: pitch */}
          <Reveal>
            <Eyebrow>Agendamento</Eyebrow>
            <h2
              id="agendar-titulo"
              className="mt-4 text-[32px] leading-[1.12] font-bold tracking-[-0.03em] text-balance text-ink sm:text-[40px] lg:text-[48px]"
            >
              Pronta para dar o primeiro passo?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              Estou te esperando! Responda três perguntas rápidas e eu recebo sua mensagem já organizada no WhatsApp.
            </p>
            <ul className="mt-8 space-y-4">
              {reassurance.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface text-primary shadow-card ring-1 ring-line">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold tracking-[-0.01em] text-ink">{title}</span>
                    <span className="mt-0.5 block text-sm text-ink-soft">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-ink-muted">
              Fernanda Lima · Psicóloga Clínica · {site.crp}
            </p>
          </Reveal>

          {/* Right: form card */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="relative rounded-xl border border-line bg-surface shadow-raised">
              {/* Header: step indicator */}
              <div className="border-b border-line-soft px-5 pt-5 pb-4 sm:px-7 sm:pt-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold tracking-[0.05em] text-ink-muted uppercase" aria-live="polite">
                    {done ? "Tudo pronto" : `Passo ${step + 1} de ${steps.length}`}
                  </p>
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
                              "grid size-7 place-items-center rounded-full text-xs font-semibold transition-colors duration-150 focus-visible:shadow-focus disabled:opacity-100",
                              complete && "bg-primary text-white hover:bg-primary-hover",
                              current && "bg-primary-100 text-primary-hover ring-1 ring-primary",
                              !complete && !current && "bg-surface-hover text-ink-muted",
                            )}
                          >
                            {complete ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>
                <div
                  className="mt-4 h-1.5 overflow-hidden rounded-full bg-primary-100"
                  role="progressbar"
                  aria-label="Progresso do agendamento"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                >
                  <motion.div
                    className="h-full rounded-full bg-progress"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!done) next();
                }}
                className="px-5 py-6 sm:px-7 sm:py-7"
              >
                <div className="relative min-h-[300px]">
                  <AnimatePresence mode="wait" initial={false} custom={dir}>
                    <motion.div
                      key={done ? "done" : step}
                      custom={dir}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: reduce ? 0.01 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {!done && step === 0 && (
                        <fieldset>
                          <legend className="block w-full p-0 text-xl font-semibold tracking-[-0.02em] text-ink">
                            <h3 ref={headingRef} tabIndex={-1} className="outline-none">
                              {steps[0].title}
                            </h3>
                          </legend>
                          <p className="mt-1.5 text-sm text-ink-soft">Opcional — pode ser só o primeiro nome ou um apelido.</p>
                          <label htmlFor={`${uid}-name`} className="mt-6 block text-sm font-medium text-ink">
                            Seu nome
                          </label>
                          <input
                            id={`${uid}-name`}
                            type="text"
                            value={name}
                            maxLength={NAME_MAX}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="given-name"
                            placeholder="Ex.: Ana"
                            aria-describedby={`${uid}-name-count`}
                            className="mt-2 h-12 w-full rounded-md border border-line-control bg-surface px-4 text-base text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-muted focus:border-primary focus:shadow-focus sm:text-[15px]"
                          />
                          <p id={`${uid}-name-count`} className="mt-2 text-right text-xs text-ink-muted">
                            {name.length}/{NAME_MAX}
                          </p>
                        </fieldset>
                      )}

                      {!done && step === 1 && (
                        <fieldset aria-describedby={error ? errorId : undefined}>
                          <legend className="block w-full p-0 text-xl font-semibold tracking-[-0.02em] text-ink">
                            <h3 ref={headingRef} tabIndex={-1} className="outline-none">
                              {steps[1].title}
                            </h3>
                          </legend>
                          <p className="mt-1.5 text-sm text-ink-soft">Escolha quantas opções quiser.</p>
                          <div className="mt-5 flex flex-wrap gap-2">
                            {reasons.map((r) => {
                              const on = selected.includes(r);
                              return (
                                <button
                                  key={r}
                                  type="button"
                                  aria-pressed={on}
                                  onClick={() => toggleReason(r)}
                                  className={cn(
                                    "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-150 focus-visible:shadow-focus",
                                    on
                                      ? "border-primary bg-primary-100 text-primary-hover"
                                      : "border-line bg-surface text-ink-soft hover:-translate-y-px hover:border-primary-200 hover:text-ink hover:shadow-card",
                                  )}
                                >
                                  {on && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
                                  {r}
                                </button>
                              );
                            })}
                          </div>
                          <label htmlFor={`${uid}-note`} className="mt-6 block text-sm font-medium text-ink">
                            Quer contar um pouco mais? <span className="font-normal text-ink-muted">(opcional)</span>
                          </label>
                          <textarea
                            id={`${uid}-note`}
                            value={note}
                            maxLength={NOTE_MAX}
                            rows={3}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Escreva só o que se sentir à vontade."
                            aria-describedby={`${uid}-note-count`}
                            className="mt-2 w-full resize-none rounded-md border border-line-control bg-surface px-4 py-3 text-base leading-relaxed text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-muted focus:border-primary focus:shadow-focus sm:text-[15px]"
                          />
                          <p id={`${uid}-note-count`} className="mt-1 text-right text-xs text-ink-muted">
                            {note.length}/{NOTE_MAX}
                          </p>
                        </fieldset>
                      )}

                      {!done && step === 2 && (
                        <div>
                          <h3 ref={headingRef} tabIndex={-1} className="text-xl font-semibold tracking-[-0.02em] text-ink outline-none">
                            {steps[2].title}
                          </h3>
                          <p id={`${uid}-period-label`} className="mt-1.5 text-sm text-ink-soft">
                            Período preferido para as sessões
                          </p>
                          <div role="radiogroup" aria-labelledby={`${uid}-period-label`} aria-required="true" className="mt-4 grid grid-cols-2 gap-2.5">
                            {periods.map((p, i) => {
                              const on = period === p.id;
                              return (
                                <button
                                  key={p.id}
                                  ref={(el) => {
                                    periodKeys.refs.current[i] = el;
                                  }}
                                  type="button"
                                  role="radio"
                                  aria-checked={on}
                                  tabIndex={periodKeys.tabIndexFor(i)}
                                  onKeyDown={(e) => periodKeys.onKeyDown(e, i)}
                                  onClick={() => {
                                    setPeriod(p.id);
                                    setError(null);
                                  }}
                                  className={cn(
                                    "relative rounded-lg border p-3.5 text-left transition-[background-color,border-color,box-shadow,transform] duration-150 focus-visible:shadow-focus",
                                    on
                                      ? "border-primary bg-primary-100 shadow-card"
                                      : "border-line bg-surface hover:-translate-y-px hover:border-primary-200 hover:shadow-raised",
                                  )}
                                >
                                  <span className="block text-sm font-semibold text-ink">{p.id}</span>
                                  <span className="mt-0.5 block text-xs text-ink-muted">{p.hint}</span>
                                  <span
                                    aria-hidden
                                    className={cn(
                                      "absolute top-3.5 right-3.5 grid size-4 place-items-center rounded-full border",
                                      on ? "border-primary bg-primary" : "border-line-control bg-surface",
                                    )}
                                  >
                                    {on && <span className="size-1.5 rounded-full bg-white" />}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          <p id={`${uid}-first-label`} className="mt-6 text-sm font-medium text-ink">
                            É sua primeira vez na terapia?
                          </p>
                          <div role="radiogroup" aria-labelledby={`${uid}-first-label`} aria-required="true" className="mt-3 inline-flex rounded-md border border-line bg-surface-hover p-1">
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
                                    "h-9 min-w-20 rounded-sm px-4 text-sm font-semibold transition-[background-color,color,box-shadow] duration-150 focus-visible:shadow-focus",
                                    on ? "bg-surface text-primary-hover shadow-card" : "text-ink-soft hover:text-ink",
                                  )}
                                >
                                  {o}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {done && (
                        <div>
                          <h3 ref={headingRef} tabIndex={-1} className="text-xl font-semibold tracking-[-0.02em] text-ink outline-none">
                            Sua mensagem está pronta
                          </h3>
                          <p className="mt-1.5 text-sm text-ink-soft">
                            Confira abaixo. Você poderá editá-la no WhatsApp antes de enviar.
                          </p>
                          <figure className="mt-5 rounded-lg bg-[#efeae2] p-4 bg-dots">
                            <figcaption className="sr-only">Prévia da mensagem do WhatsApp</figcaption>
                            <div className="relative ml-auto max-w-[92%] rounded-lg rounded-tr-sm bg-[#d9fdd3] px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-line text-[#111b21] shadow-xs">
                              {message}
                              <span className="mt-1 flex items-center justify-end gap-1 text-[11px] text-[#54656f]" aria-hidden>
                                agora
                                <Check className="size-3" />
                              </span>
                            </div>
                          </figure>
                          <button
                            type="button"
                            onClick={() => goTo(0)}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-primary hover:text-primary-hover focus-visible:shadow-focus"
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            Editar respostas
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <p id={errorId} role="alert" className={cn("min-h-5 text-sm font-medium text-[#b42318]", !error && "sr-only")}>
                  {error}
                </p>

                {/* Actions */}
                {done ? (
                  <div className="mt-4 space-y-4">
                    <a
                      href={whatsappLink(message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-md border border-whatsapp bg-whatsapp px-6 text-base font-semibold text-white shadow-[0_8px_24px_rgb(15_122_59/24%)] transition-[background-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:bg-whatsapp-hover focus-visible:shadow-focus active:translate-y-px"
                    >
                      <WhatsAppIcon className="size-6" />
                      Enviar pelo WhatsApp
                      <span className="sr-only">(abre em nova aba)</span>
                    </a>
                    <div className="flex items-center justify-between gap-3">
                      <Button variant="ghost" onClick={back} className="px-2">
                        <ArrowLeft className="size-4" aria-hidden />
                        Voltar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Button variant="ghost" onClick={back} disabled={step === 0} className="px-2">
                      <ArrowLeft className="size-4" aria-hidden />
                      Voltar
                    </Button>
                    <Button type="submit" variant="primary" size="lg" aria-describedby={error ? errorId : undefined}>
                      {step === steps.length - 1 ? "Ver mensagem" : step === 0 && !name.trim() ? "Pular" : "Continuar"}
                      <ArrowRight className="size-4" aria-hidden />
                    </Button>
                  </div>
                )}
              </form>

              <div className="rounded-b-xl border-t border-line-soft bg-bg/60 px-5 py-4 text-center text-sm text-ink-soft sm:px-7">
                Prefere uma mensagem padrão?{" "}
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline-offset-4 hover:text-primary-hover hover:underline"
                >
                  Abrir WhatsApp
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
