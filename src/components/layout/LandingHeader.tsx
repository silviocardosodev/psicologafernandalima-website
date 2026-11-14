import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BrandMark } from "@/components/ui/BrandMark";
import { Container } from "@/components/ui/Section";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { ctaLabel, site, whatsappLink } from "@/lib/site";

/**
 * Light header for the pain landing pages (no scroll-spy, no drawer):
 * brand → home, "Ver o site" link, and the same "Quero conversar" CTA as everywhere.
 */
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft/80 bg-white/85 backdrop-blur-md">
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label={`${site.name}, Psicóloga — página inicial`}>
          <BrandMark className="w-7" />
          <span className="flex flex-col leading-none">
            <span className="text-[16px] font-medium text-ink">{site.name}</span>
            <span className="mt-1 text-[11px] text-ink-muted">Psicóloga</span>
          </span>
        </Link>

        <nav aria-label="Navegação" className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-ink-soft transition-colors duration-300 ease-out-soft hover:text-primary md:inline-flex"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Ver o site completo
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium whitespace-nowrap text-white shadow-[0_8px_22px_rgb(79_70_229/20%)] transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-primary-hover focus-visible:shadow-focus active:translate-y-px sm:px-5"
          >
            <WhatsAppIcon className="size-4" />
            {ctaLabel}
            <span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
          </a>
        </nav>
      </Container>
    </header>
  );
}
