import Image from "next/image";
import { Instagram } from "lucide-react";

import { Container, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { videos } from "@/lib/content";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Typographic tiles mixed with video frames: a preview of the feed's tone, not real posts. */
const themeTiles = [
  { text: "Mente acelerada", className: "bg-brand text-white" },
  { text: "Autocobrança", className: "bg-tint-violet text-primary-deep" },
  { text: "Ansiedade", className: "bg-linear-to-br from-tint-lilac to-primary-200 text-primary-deep" },
] as const;

/**
 * Instagram invite. A soft profile preview (avatar, @, bio, a 3×2 grid) that links to
 * the real profile. Instagram has no embed without a login/token, so nothing from
 * Meta loads here: fast and cookieless.
 */
export function InstagramSection() {
  const tiles = [
    { kind: "video" as const, id: videos[0]?.id },
    { kind: "theme" as const, ...themeTiles[0] },
    { kind: "video" as const, id: videos[1]?.id },
    { kind: "theme" as const, ...themeTiles[1] },
    { kind: "video" as const, id: videos[2]?.id },
    { kind: "theme" as const, ...themeTiles[2] },
  ];

  return (
    <section id="instagram" aria-labelledby="instagram-titulo" className="relative overflow-hidden px-5 pb-20 sm:px-6 sm:pb-28 lg:pb-32">
      <Reveal className="mx-auto grid max-w-[1160px] items-center gap-12 overflow-hidden rounded-[2.5rem] bg-tint-lilac px-6 py-14 sm:px-12 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:px-16">
        <div className="max-w-lg">
          <Eyebrow>Instagram</Eyebrow>
          <h2
            id="instagram-titulo"
            className="mt-3 text-[32px] leading-[1.12] font-[650] tracking-[-0.03em] text-balance text-ink sm:text-[40px]"
          >
            Um pouco de terapia no seu feed
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-[17px]">
            Reflexões curtas sobre mente acelerada, autocobrança e ansiedade, para ler no seu tempo.
          </p>
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-13 items-center gap-2.5 rounded-full bg-primary px-7 text-[15px] font-medium text-white shadow-[0_10px_30px_rgb(79_70_229/22%)] transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-primary-hover focus-visible:shadow-focus active:translate-y-px"
          >
            <Instagram aria-hidden className="size-5" />
            Seguir @{site.instagram}
            <span className="sr-only"> no Instagram (abre em nova aba)</span>
          </a>
        </div>

        {/* Profile preview: one link to the real profile. */}
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir o perfil @${site.instagram} no Instagram (abre em nova aba)`}
          className="group mx-auto block w-full max-w-[400px] rounded-[2rem] bg-white p-5 shadow-[0_20px_50px_rgb(79_70_229/14%)] transition-transform duration-500 ease-out-soft hover:-translate-y-1 focus-visible:shadow-focus sm:p-6 lg:mr-0"
        >
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-linear-to-tr from-lavender via-primary to-primary-deep p-[2.5px]">
              <span className="relative block size-16 overflow-hidden rounded-full border-2 border-white bg-tint-violet">
                <Image src="/psicologa-fernanda-lima-2.webp" alt="" fill sizes="64px" className="object-cover object-top" />
              </span>
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[15px] font-semibold text-ink">{site.instagram}</span>
              <span className="block text-[13px] text-ink-soft">{site.name} · Psicóloga</span>
              <span className="block text-[13px] text-ink-muted">{site.crp} · Terapia online</span>
            </span>
          </div>

          <span className="mt-4 flex h-9 items-center justify-center rounded-lg bg-primary text-[13px] font-semibold text-white transition-colors duration-300 group-hover:bg-primary-hover">
            Seguir
          </span>

          <span aria-hidden className="mt-4 grid grid-cols-3 gap-1 overflow-hidden rounded-xl">
            {tiles.map((tile, index) =>
              tile.kind === "video" && tile.id ? (
                <span key={index} className="relative aspect-square overflow-hidden bg-tint-violet">
                  <Image src={`/videos/${tile.id}.webp`} alt="" fill sizes="190px" className="origin-top scale-[1.5] object-cover object-[50%_15%]" />
                </span>
              ) : tile.kind === "theme" ? (
                <span
                  key={index}
                  className={cn("grid aspect-square place-items-center p-1.5 text-center text-[11px] leading-tight font-semibold tracking-[-0.01em] break-words hyphens-auto sm:p-2 sm:text-[13px]", tile.className)}
                >
                  {tile.text}
                </span>
              ) : null,
            )}
          </span>
        </a>
      </Reveal>
    </section>
  );
}
