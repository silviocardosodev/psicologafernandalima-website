import Link from "next/link";

import { BrandMark } from "@/components/ui/BrandMark";
import { Container } from "@/components/ui/Section";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { navItems, site, whatsappLink } from "@/lib/site";

const linkClass = "rounded-sm text-sm text-ink-soft transition-colors duration-150 hover:text-ink";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-soft bg-bg" aria-labelledby="rodape-titulo">
      <h2 id="rodape-titulo" className="sr-only">
        Rodapé
      </h2>

      <Container className="py-12 sm:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Link href="#inicio" className="flex items-center gap-3 self-start rounded-md">
            <BrandMark className="w-8" />
            <span className="flex flex-col leading-tight">
              <span className="text-[15px] font-medium text-ink">{site.name}</span>
              <span className="text-[13px] text-ink-muted">Psicóloga clínica · {site.crp}</span>
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

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-sm text-sm text-ink-soft transition-colors duration-150 hover:text-whatsapp lg:self-auto"
          >
            <WhatsAppIcon className="size-4 text-whatsapp" />
            {site.phoneDisplay}
            <span className="sr-only"> (WhatsApp, abre em nova aba)</span>
          </a>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line-soft pt-6 text-[13px] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-soft">
            Em caso de emergência, ligue{" "}
            <a href="tel:188" className="font-medium text-ink underline decoration-line-hover underline-offset-4 hover:decoration-ink">
              CVV 188
            </a>{" "}
            ou{" "}
            <a href="tel:192" className="font-medium text-ink underline decoration-line-hover underline-offset-4 hover:decoration-ink">
              SAMU 192
            </a>
            .
          </p>
          <p>
            © {year} {site.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
