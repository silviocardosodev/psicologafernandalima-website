"use client";

import Image from "next/image";
import { useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";

import { Container, Section, SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";
import { videos, youtubeChannelUrl, type Video } from "@/lib/content";

/**
 * Latest YouTube videos as "lite" embeds: a local thumbnail + play button. The YouTube
 * player (youtube-nocookie.com) only loads after the click, so the page stays fast and
 * nothing from Google runs until she chooses to watch.
 */
function VideoCard({ video, index }: { video: Video; index: number }) {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  return (
    <Reveal delay={index * 0.06}>
      <figure className="group">
        <div className="relative aspect-video overflow-hidden rounded-3xl bg-tint-violet shadow-[0_10px_30px_rgb(79_70_229/10%)]">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setPlaying(true);
                track("video_play", { id: video.id });
              }}
              className="absolute inset-0 block size-full text-left focus-visible:shadow-focus"
            >
              <Image
                src={`/videos/${video.id}.webp`}
                alt=""
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 92vw"
                className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
              />
              <span aria-hidden className="absolute inset-0 bg-linear-to-t from-primary-deep/45 via-transparent to-transparent" />
              <m.span
                aria-hidden
                whileHover={reduce ? undefined : { scale: 1.08 }}
                className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-primary shadow-raised transition-colors duration-300 group-hover:bg-white"
              >
                <Play className="ml-1 size-6 fill-current" />
              </m.span>
              <span className="sr-only">Assistir ao vídeo: {video.title}</span>
            </button>
          )}
        </div>
        <figcaption className="mt-4 text-[17px] font-[600] tracking-[-0.015em] text-ink">{video.title}</figcaption>
      </figure>
    </Reveal>
  );
}

export function Videos() {
  return (
    <Section id="videos" aria-labelledby="videos-titulo">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            id="videos-titulo"
            eyebrow="Vídeos"
            title="Para assistir no seu tempo"
            description="Conversas curtas sobre o jeito como a gente se trata, pensa e sente."
          />
          <Reveal>
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full text-[15px] font-medium text-primary transition-colors duration-300 hover:text-primary-deep"
            >
              Ver todos no YouTube
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {videos.map((video, index) => (
            <li key={video.id}>
              <VideoCard video={video} index={index} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
