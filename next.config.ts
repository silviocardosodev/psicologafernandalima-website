import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (~30% lighter than WebP on photos), WebP fallback.
    formats: ["image/avif", "image/webp"],
  },
  // Old Wix site URLs (indexed or linked before the move to Vercel) → closest page of the new site.
  async redirects() {
    const toHome = ["/home", "/inicio", "/terapia", "/terapia-online", "/servicos", "/blank", "/blog", "/blog/:path*", "/post/:path*"];
    const toSection: [string, string][] = [
      ["/sobre", "sobre"],
      ["/sobre-mim", "sobre"],
      ["/quem-sou", "sobre"],
      ["/como-funciona", "como-funciona"],
      ["/depoimentos", "depoimentos"],
      ["/faq", "duvidas"],
      ["/duvidas", "duvidas"],
      ["/contato", "agendar"],
      ["/agendamento", "agendar"],
      ["/agendar", "agendar"],
      ["/videos", "videos"],
    ];
    return [
      ...toHome.map((source) => ({ source, destination: "/", permanent: true })),
      ...toSection.map(([source, id]) => ({ source, destination: `/#${id}`, permanent: true })),
    ];
  },
};

export default nextConfig;
