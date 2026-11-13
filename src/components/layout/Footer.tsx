import Link from "next/link";
import { BadgeCheck, LifeBuoy, Phone, Video } from "lucide-react";

import { BrandMark } from "@/components/ui/BrandMark";
import { Container } from "@/components/ui/Section";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { navItems, site, whatsappLink } from "@/lib/site";

const linkClass =
  "rounded-sm text-[14.5px] text-white/90 transition-colors duration-150 hover:text-white focus-visible:outline-white";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-hero text-white" aria-labelledby="rodape-titulo">
      <h2 id="rodape-titulo" className="sr-only">
        Rodapé
      </h2>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/7%)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(180deg,transparent,#000_40%,transparent)]"
      />

      <Container className="pt-16 pb-8 sm:pt-20">
        {/* Emergency notice */}
        <aside
          role="note"
          aria-label="Aviso de emergência"
          className="flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-5 sm:p-6"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-primary-deep">
            <LifeBuoy className="size-5" aria-hidden />
          </span>
          <div className="flex-1">
            <p className="text-[15px] font-semibold tracking-[-0.01em] text-white">Precisa de ajuda agora?</p>
            <p className="mt-1 text-[14.5px] leading-relaxed text-white">
              Em caso de emergência ou crise, ligue para o <strong className="font-semibold text-white">CVV 188</strong>{" "}
              (24h, gratuito) ou <strong className="font-semibold text-white">SAMU 192</strong>.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="tel:188"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-primary-deep transition-colors duration-150 hover:bg-primary-100 focus-visible:outline-white"
            >
              <Phone className="size-4" aria-hidden />
              Ligar 188
            </a>
            <a
              href="tel:192"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-white/35 px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-white"
            >
              Ligar 192
            </a>
          </div>
        </aside>

        <div className="mt-14 grid gap-12 md:grid-cols-[1.4fr_1fr_1.2fr] md:gap-10">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="#inicio" className="inline-flex items-center gap-3 rounded-md focus-visible:outline-white">
              <BrandMark tone="light" className="w-9" />
              <span className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-[-0.03em]">{site.name}</span>
                <span className="mt-1 text-xs text-white/90">Psicóloga clínica · {site.crp}</span>
              </span>
            </Link>
            <p className="mt-5 text-[14.5px] leading-relaxed text-white/90">
              Um espaço seguro, ético e acolhedor para mulheres cuidarem da saúde emocional — com
              escuta atenta e ferramentas práticas da TCC e da ACT.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/15">
              <BadgeCheck className="size-3.5" aria-hidden />
              Registro ativo no Conselho Regional de Psicologia · {site.crp}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-labelledby="rodape-nav">
            <h3 id="rodape-nav" className="text-xs font-semibold tracking-[0.06em] text-white/90 uppercase">
              Navegação
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="#inicio" className={linkClass}>
                  Início
                </Link>
              </li>
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link href={`#${item.id}`} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="#agendar" className={linkClass}>
                  Agendar sessão
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.06em] text-white/90 uppercase">Contato</h3>
            <ul className="mt-4 space-y-3.5">
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-md focus-visible:outline-white"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-whatsapp text-white">
                    <WhatsAppIcon className="size-[18px]" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-xs text-white/90">WhatsApp</span>
                    <span className="block text-[14.5px] font-semibold text-white group-hover:underline group-hover:underline-offset-4">
                      {site.phoneDisplay}
                    </span>
                  </span>
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-white/10 text-white ring-1 ring-white/15">
                  <Video className="size-[18px]" aria-hidden />
                </span>
                <span className="leading-tight">
                  <span className="block text-xs text-white/90">Atendimento online</span>
                  <span className="block text-[14.5px] font-medium text-white">via Google Meet</span>
                </span>
              </li>
            </ul>
            <p className="mt-5 text-[13px] leading-relaxed text-white/90">
              Mulheres a partir de 18 anos, no Brasil e no exterior.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-6 text-[13px] text-white/90 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Fernanda Lima Psicóloga · {site.crp} · Todos os direitos reservados.
          </p>
          <p>Conteúdo informativo; não substitui avaliação psicológica.</p>
        </div>
      </Container>
    </footer>
  );
}
