"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Check, Download, Share2 } from "lucide-react";

import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";
import { quoteImagePath, type Quote } from "@/lib/quotes";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const actionClass =
  "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-[background-color,color,transform] duration-200 ease-out-soft active:translate-y-px focus-visible:shadow-focus";

function shareUrl(quote: Quote) {
  const path = quote.pain === "inicio" ? "/" : `/${quote.pain}`;
  return `${site.url}${path}?utm_source=compartilhar&utm_medium=cartao&utm_campaign=${quote.id}`;
}

/**
 * "Frases pra guardar": Instagram-format (4:5) cards. The preview IS the shared PNG
 * (pre-rendered by /cartoes/[id]), so what she sees is exactly what she posts.
 *
 * Share: on phones, the native share sheet with the image file (Instagram, WhatsApp…);
 * otherwise the link; last resort, copy text + link. The PNG is fetched when the pointer
 * reaches the button, so `navigator.share` still runs inside the tap's user activation
 * (Safari drops it after a slow await).
 */
export function QuoteCards({
  items,
  id = "frases",
  title = "Frases pra guardar",
  description = "Salve, mande pra uma amiga ou poste nos seus Stories.",
  className,
}: {
  items: Quote[];
  id?: string;
  title?: string;
  description?: string;
  className?: string;
}) {
  const files = useRef(new Map<string, Promise<File | null>>());
  const [status, setStatus] = useState<{ id: string; text: string } | null>(null);

  function prefetch(quote: Quote) {
    if (files.current.has(quote.id)) return files.current.get(quote.id)!;
    const promise = fetch(quoteImagePath(quote.id))
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(String(res.status)))))
      .then((blob) => new File([blob], `fernanda-lima-${quote.id}.png`, { type: "image/png" }))
      .catch(() => {
        files.current.delete(quote.id);
        return null;
      });
    files.current.set(quote.id, promise);
    return promise;
  }

  function announce(quote: Quote, text: string) {
    setStatus({ id: quote.id, text });
    window.setTimeout(() => setStatus((s) => (s?.id === quote.id ? null : s)), 3500);
  }

  async function share(quote: Quote) {
    const url = shareUrl(quote);
    const text = `“${quote.text}”\n${site.name} · Psicóloga · @${site.instagram}`;

    try {
      const file = await prefetch(quote);
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: site.name, text });
        track("quote_share", { id: quote.id, method: "imagem" });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: site.name, text, url });
        track("quote_share", { id: quote.id, method: "link" });
        return;
      }
    } catch (error) {
      // She closed the share sheet: do nothing.
      if (error instanceof DOMException && error.name === "AbortError") return;
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      track("quote_share", { id: quote.id, method: "copiar" });
      announce(quote, "Frase e link copiados");
    } catch {
      announce(quote, "Não deu para compartilhar. Use o botão Baixar.");
    }
  }

  return (
    <Section id={id} aria-labelledby={`${id}-titulo`} className={cn("overflow-hidden bg-tint-mist", className)}>
      <Container>
        <SectionHeader id={`${id}-titulo`} eyebrow="Pra guardar" title={title} description={description} align="center" />

        <ul
          className={cn(
            // Phones: horizontal snap carousel that bleeds to the edges. Desktop: grid.
            "-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6",
            "lg:mx-auto lg:grid lg:overflow-visible lg:px-0 lg:pb-0",
            items.length >= 3 ? "lg:grid-cols-3" : "lg:max-w-3xl lg:grid-cols-2",
          )}
        >
          {items.map((quote, index) => {
            const done = status?.id === quote.id;
            return (
              <li key={quote.id} className="w-[78%] max-w-[340px] shrink-0 snap-center sm:w-[46%] lg:w-auto lg:max-w-none">
                <Reveal delay={Math.min(index, 3) * 0.06}>
                  <figure className="group">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-tint-lilac shadow-[0_10px_30px_rgb(79_70_229/10%)] transition-[transform,box-shadow] duration-500 ease-out-soft group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_rgb(79_70_229/16%)]">
                      <Image
                        src={quoteImagePath(quote.id)}
                        alt={`Frase: “${quote.text}” — ${site.name}, psicóloga`}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 78vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="sr-only">{quote.text}</figcaption>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onPointerEnter={() => prefetch(quote)}
                        onFocus={() => prefetch(quote)}
                        onTouchStart={() => prefetch(quote)}
                        onClick={() => share(quote)}
                        className={cn(actionClass, "bg-primary text-white hover:bg-primary-hover")}
                        aria-describedby={done ? `${id}-status-${quote.id}` : undefined}
                      >
                        {done ? <Check aria-hidden className="size-4" /> : <Share2 aria-hidden className="size-4" />}
                        Compartilhar
                      </button>
                      <a
                        href={quoteImagePath(quote.id)}
                        download={`fernanda-lima-${quote.id}.png`}
                        onClick={() => track("quote_download", { id: quote.id })}
                        className={cn(actionClass, "text-ink-soft hover:bg-white hover:text-primary")}
                      >
                        <Download aria-hidden className="size-4" />
                        Baixar
                        <span className="sr-only"> imagem da frase</span>
                      </a>
                    </div>
                    <p
                      id={`${id}-status-${quote.id}`}
                      className={cn("mt-1 min-h-5 text-[13px] text-primary", !done && "invisible")}
                    >
                      {done ? status.text : ""}
                    </p>
                  </figure>
                </Reveal>
              </li>
            );
          })}
        </ul>

        {/* One polite announcement for screen readers. */}
        <p className="sr-only" aria-live="polite">
          {status?.text ?? ""}
        </p>
      </Container>
    </Section>
  );
}
