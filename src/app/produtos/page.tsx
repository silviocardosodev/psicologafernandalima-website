import type { Metadata } from "next";
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Container, Eyebrow, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { site, whatsappLink } from "@/lib/site";

const title = "FL PsicoFlow: a rotina clínica num só lugar";
const description =
  "Agenda, pacientes, registros de sessão, plano terapêutico e apoio de IA para preparar a próxima sessão. Uma área de trabalho para psicólogas, em beta fechado.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${site.url}/produtos` },
  openGraph: { type: "website", url: `${site.url}/produtos`, title, description, locale: "pt_BR" },
  twitter: { card: "summary_large_image", title, description },
};

/** Professionals, not patients: this message never carries health data. */
const pilotMessage = "Olá Fernanda! Sou psicóloga e quero saber mais sobre o FL PsicoFlow e o piloto.";
const pilotCta = "Quero participar do piloto";

const features = [
  {
    icon: LayoutDashboard,
    title: "Início",
    text: "As sessões de hoje com o próximo passo de cada uma, pendências mais antigas primeiro e os números do mês.",
  },
  {
    icon: CalendarDays,
    title: "Agenda",
    text: "Dia, semana ou mês. Sessões avulsas ou recorrentes, online ou presenciais, com aviso de conflito de horário.",
  },
  {
    icon: Users,
    title: "Pacientes",
    text: "Busca e filtros úteis: sem próxima sessão, sem retorno há 30 dias, registro ou pagamento pendente.",
  },
  {
    icon: FileText,
    title: "Registro de sessão",
    text: "Rascunho automático e histórico de versões, com o combinado da sessão anterior ao lado do texto.",
  },
  {
    icon: Target,
    title: "Plano terapêutico",
    text: "Demanda, objetivos e abordagem em um lugar só, sempre à mão na hora de registrar.",
  },
  {
    icon: BrainCircuit,
    title: "Apoio de IA",
    text: "Preparação da próxima sessão: evolução, pontos em aberto, temas recorrentes e pontos de atenção.",
  },
] as const;

const extras = [
  "Importar cadastro de Word, PDF, planilha ou contato",
  "Busca rápida com Ctrl+K",
  "Metas da clínica",
  "Assistente do dia",
  "Controle de pagamentos",
  "Exportação do prontuário (Res. CFP 01/2009)",
] as const;

const aiPrinciples = [
  { title: "A IA sugere, você decide", text: "Todo material gerado traz esse aviso e não entra no prontuário." },
  { title: "Dados minimizados", text: "Nomes, telefones, datas e locais são removidos do texto antes do envio." },
  { title: "Uso registrado", text: "Cada geração fica na auditoria, com limite diário de uso." },
  { title: "Só no servidor", text: "A comunicação com a IA acontece no servidor; nenhuma chave vai para o navegador." },
] as const;

const privacy = [
  { icon: LockKeyhole, text: "Cada conta só enxerga os próprios dados, com isolamento direto no banco." },
  { icon: ShieldCheck, text: "Sessão com tempo máximo e encerramento por inatividade." },
  { icon: ClipboardList, text: "Registro de auditoria dos acessos a dados clínicos." },
  { icon: FileText, text: "Exportação e exclusão de dados a qualquer momento (LGPD)." },
] as const;

function PilotButton({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <a
      href={whatsappLink(pilotMessage)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-13 items-center justify-center gap-2.5 rounded-full px-7 text-[15px] font-medium whitespace-nowrap transition-[background-color,transform] duration-150 hover:-translate-y-px focus-visible:shadow-focus active:translate-y-px ${
        light
          ? "bg-white text-primary-hover shadow-raised hover:bg-primary-100"
          : "bg-primary text-white shadow-[0_10px_30px_rgb(79_70_229/22%)] hover:bg-primary-hover"
      } ${className}`}
    >
      <WhatsAppIcon className="size-5" />
      {pilotCta}
      <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
    </a>
  );
}

/** Static illustration of the "Início" screen, with fictitious data. */
function AppPreview() {
  const sessions = [
    { time: "09:00", who: "Paciente A", mode: "Online", action: "Preparar" },
    { time: "10:30", who: "Paciente B", mode: "Presencial", action: "Registrar" },
    { time: "14:00", who: "Paciente C", mode: "Online", action: "Preparar" },
  ];
  const bars = [46, 62, 54, 78, 70, 88, 74, 92];

  return (
    <figure className="relative">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[3rem] bg-tint-violet/70 blur-2xl" />
      <div
        aria-hidden
        className="overflow-hidden rounded-[1.75rem] border border-line-soft bg-white shadow-[0_24px_60px_rgb(49_46_129/14%)]"
      >
        {/* Window bar */}
        <div className="flex items-center gap-2 border-b border-line-soft bg-tint-mist px-4 py-3">
          <span className="size-2.5 rounded-full bg-primary-200" />
          <span className="size-2.5 rounded-full bg-primary-200" />
          <span className="size-2.5 rounded-full bg-primary-200" />
          <span className="ml-3 text-[11px] font-medium text-ink-muted">FL PsicoFlow · Início</span>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-ink-muted">Quinta-feira</p>
              <p className="text-[17px] font-[650] tracking-[-0.02em] text-ink">Bom dia! 3 sessões hoje</p>
            </div>
            <span className="rounded-full bg-tint-lilac px-2.5 py-1 text-[11px] font-medium text-primary">2 pendências</span>
          </div>

          <ul className="space-y-2">
            {sessions.map((s) => (
              <li key={s.time} className="flex items-center gap-3 rounded-xl border border-line-soft px-3 py-2.5">
                <span className="w-11 text-[12px] font-semibold text-primary-deep">{s.time}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-ink">{s.who}</span>
                  <span className="block text-[11px] text-ink-muted">{s.mode}</span>
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    s.action === "Registrar" ? "bg-primary text-white" : "bg-tint-violet text-primary"
                  }`}
                >
                  {s.action}
                </span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-3 gap-2">
            {[
              ["42", "sessões no mês"],
              ["94%", "comparecimento"],
              ["18", "pacientes ativos"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl bg-tint-mist px-3 py-2.5">
                <p className="text-[17px] font-[650] tracking-[-0.02em] text-primary-deep">{value}</p>
                <p className="text-[10px] leading-tight text-ink-muted">{label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-line-soft p-3">
            <p className="text-[11px] font-medium text-ink-soft">Sessões por semana</p>
            <div className="mt-2 flex h-16 items-end gap-1.5">
              {bars.map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`flex-1 rounded-t-md ${i === bars.length - 1 ? "bg-primary" : "bg-primary-200"}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-tint-lilac p-3">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-[12px] leading-snug text-ink-soft">
              <span className="font-semibold text-primary-deep">Preparação pronta:</span> 2 pontos em aberto e o combinado da
              última sessão.
            </p>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-[12px] text-ink-muted">Ilustração da tela inicial, com dados fictícios.</figcaption>
    </figure>
  );
}

export default function ProductsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FL PsicoFlow",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description,
    url: `${site.url}/produtos`,
    inLanguage: "pt-BR",
    author: { "@id": `${site.url}/#fernanda-lima` },
  };

  return (
    <>
      <LandingHeader cta={pilotCta} ctaShort="Participar" message={pilotMessage} />
      <main id="conteudo">
        {/* Hero */}
        <section id="inicio" aria-labelledby="produto-titulo" className="relative overflow-hidden bg-soft">
          <Container className="grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:py-28">
            <Reveal className="max-w-xl">
              <div className="flex flex-wrap items-center gap-3">
                <Eyebrow>Produtos · Para psicólogas</Eyebrow>
                <span className="rounded-full border border-primary-200 bg-white px-2.5 py-0.5 text-[12px] font-medium text-primary">
                  Beta fechado
                </span>
              </div>
              <h1
                id="produto-titulo"
                className="mt-5 text-[38px] leading-[1.06] font-[650] tracking-[-0.035em] text-balance text-ink sm:text-[52px] lg:text-[58px]"
              >
                FL PsicoFlow
                <span className="mt-2 block text-[0.62em] leading-[1.15] font-[600] text-primary-deep">
                  A rotina do consultório num só lugar.
                </span>
              </h1>
              <p className="mt-6 text-[17px] leading-relaxed text-ink-soft sm:text-lg">
                Pacientes, agenda, registros de sessão, plano terapêutico e apoio de IA para preparar a próxima sessão. O que
                precisa de atenção hoje aparece primeiro, e cada tarefa leva poucos cliques.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <PilotButton />
                <a
                  href="#recursos"
                  className="group inline-flex items-center gap-2 rounded-sm text-[15px] text-ink-soft transition-colors duration-300 hover:text-primary"
                >
                  Ver o que ele faz
                  <ArrowRight aria-hidden className="size-4 rotate-90 transition-transform duration-300 group-hover:translate-y-0.5" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="mx-auto w-full max-w-[460px] lg:mr-0">
              <AppPreview />
            </Reveal>
          </Container>
        </section>

        {/* Features */}
        <Section id="recursos" aria-labelledby="recursos-titulo">
          <Container>
            <SectionHeader
              id="recursos-titulo"
              eyebrow="O que ele faz"
              title="Menos planilha, mais presença na sessão"
              description="Tudo o que a clínica pede no dia a dia, organizado do jeito que a gente pensa."
              align="center"
            />
            <ul className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <li key={feature.title}>
                  <Reveal
                    delay={(index % 3) * 0.06}
                    className="group h-full rounded-3xl border border-line-soft bg-white p-7 transition-[transform,box-shadow,border-color] duration-500 ease-out-soft hover:-translate-y-1 hover:border-primary-200 hover:shadow-raised"
                  >
                    <span className="grid size-11 place-items-center rounded-2xl bg-tint-lilac text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <feature.icon aria-hidden className="size-5" />
                    </span>
                    <h3 className="mt-5 text-[19px] font-[600] tracking-[-0.015em] text-ink">{feature.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{feature.text}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
            <Reveal delay={0.05}>
              <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
                {extras.map((extra) => (
                  <li key={extra} className="rounded-full bg-tint-mist px-4 py-2 text-[13px] text-ink-soft">
                    {extra}
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </Section>

        {/* AI */}
        <section aria-labelledby="ia-titulo" className="px-5 sm:px-6">
          <Reveal className="relative mx-auto max-w-[1160px] overflow-hidden rounded-[2.5rem] bg-brand px-6 py-16 text-white sm:px-12 sm:py-20 lg:px-16">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div>
                <Eyebrow tone="light">Apoio de IA</Eyebrow>
                <h2 id="ia-titulo" className="mt-3 text-[30px] leading-[1.12] font-[650] tracking-[-0.03em] text-balance sm:text-[40px]">
                  Chegue à sessão com o fio da meada na mão
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-[17px]">
                  Antes de cada atendimento, um resumo da evolução, dos pontos em aberto e de temas recorrentes. Depois de
                  cada registro, aspectos a explorar e materiais de estudo.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {aiPrinciples.map((item) => (
                  <li key={item.title} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur-sm">
                    <h3 className="text-[17px] font-[600]">{item.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/80">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* Privacy */}
        <Section aria-labelledby="privacidade-titulo">
          <Container>
            <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <SectionHeader
                id="privacidade-titulo"
                eyebrow="Privacidade"
                title="Sigilo é o ponto de partida"
                description="Pensado para a responsabilidade de guardar informação clínica, com as regras do CFP e da LGPD em mente."
              />
              <Reveal delay={0.05}>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {privacy.map((item) => (
                    <li key={item.text} className="flex gap-4 rounded-3xl bg-tint-mist p-6">
                      <item.icon aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                      <p className="text-[15px] leading-relaxed text-ink-soft">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* Pilot status + CTA */}
        <section aria-labelledby="piloto-titulo" className="px-5 pb-20 sm:px-6 sm:pb-28">
          <Reveal className="mx-auto max-w-[1160px] rounded-[2.5rem] bg-tint-lilac px-6 py-14 text-center sm:px-12 sm:py-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[12px] font-medium text-primary">
              <span aria-hidden className="size-1.5 rounded-full bg-primary" />
              Em piloto
            </span>
            <h2
              id="piloto-titulo"
              className="mx-auto mt-5 max-w-2xl text-[30px] leading-[1.15] font-[650] tracking-[-0.03em] text-balance text-ink sm:text-[40px]"
            >
              Quer usar e ajudar a construir?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-[17px]">
              O FL PsicoFlow está em beta fechado, com um grupo pequeno de profissionais convidadas e atualizações
              frequentes. Durante o piloto, os testes são feitos com dados fictícios.
            </p>
            <PilotButton className="mt-8" />
          </Reveal>
        </section>
      </main>
      <Footer base="/" />
      <FloatingActions />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
