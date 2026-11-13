import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  { title: "Primeira conversa", text: "Você me conta o que te traz e tira dúvidas." },
  { title: "Sessões semanais", text: "Encontros online, num horário que caiba na rotina." },
  { title: "Evolução", text: "Olhamos juntas para o que vai mudando." },
  { title: "Alta", text: "Quando fizer sentido, encerramos com segurança." },
];

const facts = ["≈ 50 min", "Google Meet", "Sigilo profissional"];

export function Journey() {
  return (
    <Section id="jornada" aria-labelledby="jornada-titulo" className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="grid gap-12 rounded-3xl bg-tint-sky px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:p-20">
          <Reveal>
            <Eyebrow>Como funciona</Eyebrow>
            <h2
              id="jornada-titulo"
              className="mt-3 text-[32px] leading-[1.15] font-normal tracking-[-0.025em] text-balance text-ink sm:text-[40px] lg:text-[46px]"
            >
              Simples, no seu ritmo
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-[17px]">
              Tudo online, de onde você estiver.
            </p>
          </Reveal>

          <div>
            <ol className="space-y-7">
              {steps.map((step, i) => (
                <li key={step.title}>
                  <Reveal delay={i * 0.06} className="flex items-start gap-4">
                    <span
                      aria-hidden
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-medium text-white"
                    >
                      {i + 1}
                    </span>
                    <div className="pt-1">
                      <h3 className="text-lg font-normal tracking-[-0.01em] text-ink">{step.title}</h3>
                      <p className="mt-1 text-[15px] leading-snug text-ink-soft">{step.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal delay={0.3}>
              <ul aria-label="Detalhes das sessões" className="mt-10 flex flex-wrap gap-2">
                {facts.map((fact) => (
                  <li key={fact} className="rounded-full bg-white px-4 py-1.5 text-sm text-ink-soft">
                    {fact}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
