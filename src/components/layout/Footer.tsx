import Link from "next/link";
import { Instagram } from "lucide-react";

import { BrandMark } from "@/components/ui/BrandMark";
import { Container } from "@/components/ui/Section";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { navItems, site, whatsappLink } from "@/lib/site";

const linkClass =
  "inline-block rounded-sm text-sm text-ink-soft transition-[color,transform] duration-300 ease-out-soft hover:-translate-y-px hover:text-primary";

const contactClass =
  "inline-flex items-center gap-2 rounded-sm text-sm text-ink-soft transition-colors duration-300 ease-out-soft hover:text-primary";

const telClass =
  "font-medium text-ink underline decoration-primary-200 underline-offset-4 transition-colors duration-300 hover:decoration-primary";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="rodape" className="border-t border-line-soft bg-bg" aria-labelledby="rodape-titulo">
      <h2 id="rodape-titulo" className="sr-only">
        Rodapé
      </h2>

      <Container className="py-12 sm:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Link href="#inicio" className="group flex items-center gap-3 self-start rounded-md lg:self-auto">
            <BrandMark className="w-8 transition-transform duration-500 ease-out-soft group-hover:-rotate-6" />
            <span className="flex flex-col leading-tight">
              <span className="text-[15px] font-medium text-ink">{site.name}</span>
              <span className="text-[13px] text-ink-muted">Psicóloga · {site.crp}</span>
            </span>
          </Link>

          <nav aria-label="Navegação do rodapé">
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link href={`#${item.id}`} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={contactClass}>
                <WhatsAppIcon className="size-4 text-whatsapp" />
                {site.phoneDisplay}
                <span className="sr-only"> (WhatsApp, abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className={contactClass}>
                <Instagram className="size-4 text-primary" aria-hidden />@{site.instagram}
                <span className="sr-only"> (Instagram, abre em nova aba)</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-10 space-y-3 border-t border-line-soft pt-6 text-[13px] leading-relaxed text-ink-muted">
          <p className="text-ink-soft">
            Em crise ou emergência:{" "}
            <a href="tel:188" className={telClass}>
              CVV 188
            </a>{" "}
            (24h, gratuito) ou{" "}
            <a href="tel:192" className={telClass}>
              SAMU 192
            </a>
            .
          </p>
          <p>
            Este site não usa cookies e não armazena o que você marca ou escreve. As mensagens são enviadas por você,
            pelo WhatsApp.
          </p>
          <p>
            © {year} {site.name} · {site.crp}
          </p>
        </div>
      </Container>
    </footer>
  );
}
