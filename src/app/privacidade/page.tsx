import type { Metadata } from "next";

import { FloatingActions } from "@/components/layout/FloatingActions";
import { Footer } from "@/components/layout/Footer";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Container } from "@/components/ui/Section";
import { CONSENT_TEXT } from "@/lib/leads";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Como o site da psicóloga Fernanda Lima trata seus dados: sem cookies, contagem anônima de visitas e contato só com a sua autorização.",
  alternates: { canonical: "/privacidade" },
};

const deleteMessage = "Olá Fernanda! Quero que você apague o contato que deixei no seu site.";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line-soft pt-8">
      <h2 className="text-[22px] font-[650] tracking-[-0.02em] text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-[16px] leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <LandingHeader />
      <main id="conteudo">
        <Container className="max-w-[760px] py-14 sm:py-20">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">Privacidade</p>
          <h1 className="mt-3 text-[34px] leading-[1.1] font-[650] tracking-[-0.03em] text-balance text-ink sm:text-[44px]">
            Seus dados, em linguagem simples
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
            Este site é da psicóloga {site.name} ({site.crp}), responsável pelos dados descritos aqui, conforme a Lei
            Geral de Proteção de Dados (LGPD).
          </p>

          <div className="mt-10 space-y-8">
            <Block title="O que nunca é guardado">
              <p>
                O que você marca em “Parece que fala de você?” e o que escreve no assistente de mensagem ficam só no seu
                aparelho. A mensagem vai para o WhatsApp porque você decidiu enviá-la. Nada disso é salvo nem contado.
              </p>
              <p>O site não usa cookies e não guarda seu IP.</p>
            </Block>

            <Block title="Contagem anônima de visitas">
              <p>
                Para melhorar o site, contamos de forma anônima quais páginas e partes da página são vistas, onde as
                pessoas clicam (por exemplo, no botão do WhatsApp), o tipo de aparelho (celular ou computador) e de onde
                a visita veio (Instagram, Google…).
              </p>
              <p>
                Cada aba aberta recebe um código aleatório que some quando você a fecha. Ele não identifica você e não
                acompanha você em outros sites. Esses registros ficam guardados por até 13 meses.
              </p>
              <p>
                Se o seu navegador estiver com “Não rastrear” (Do Not Track) ou Controle Global de Privacidade ligado,
                nada é contado. Também usamos o Vercel Web Analytics, que conta visitas sem cookies.
              </p>
            </Block>

            <Block title="Quando você pede que eu te chame">
              <p>
                No formulário “Prefere que eu te chame?”, você informa seu nome, seu WhatsApp e, se quiser, o melhor
                período. Só peço isso, e nunca o motivo da procura. Guardo também a data em que você deu esta
                autorização:
              </p>
              <blockquote className="rounded-2xl bg-tint-lilac px-5 py-4 text-ink">“{CONSENT_TEXT}”</blockquote>
              <p>
                Seu contato é usado só para eu te responder. Não vai para listas, propagandas ou outras pessoas. Depois
                do retorno, ele é arquivado e apagado em até 6 meses.
              </p>
            </Block>

            <Block title="Seus direitos">
              <p>
                Você pode pedir a qualquer momento para saber quais dados seus estão aqui, corrigi-los ou apagá-los.
                Basta mandar uma mensagem:
              </p>
              <p>
                <a
                  href={whatsappLink(deleteMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  Pedir pelo WhatsApp
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>{" "}
                ({site.phoneDisplay})
              </p>
            </Block>

            <Block title="Onde os dados ficam">
              <p>
                O site é hospedado na Vercel, e a contagem de visitas e os contatos ficam num banco de dados Supabase,
                com acesso restrito à Fernanda. Esses serviços processam os dados só para manter o site funcionando.
              </p>
            </Block>
          </div>

          <p className="mt-12 text-sm text-ink-muted">Atualizado em novembro de 2026.</p>
        </Container>
      </main>
      <Footer base="/" />
      <FloatingActions />
    </>
  );
}
