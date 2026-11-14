import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "@/app/globals.css";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | Psicóloga Fernanda Lima" },
  description: site.description,
  keywords: [
    "psicóloga online para mulheres",
    "terapia online",
    "mente acelerada",
    "não consigo desligar a mente",
    "autocobrança",
    "perfeccionismo",
    "ansiedade",
    "culpa ao descansar",
    "terapia cognitivo-comportamental",
    "ACT",
    "Fernanda Lima",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: "Psicóloga Fernanda Lima",
    title: "Sua cabeça não para? Terapia online para mulheres",
    description: "Para quem dá conta de tudo — e está cansada de dar conta sozinha. Psicóloga Fernanda Lima, CRP 06/192404.",
    images: [{ url: "/og-fernanda-lima.jpg", width: 1200, height: 630, alt: "Psicóloga Fernanda Lima" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sua cabeça não para? Terapia online para mulheres",
    description: "Para quem dá conta de tudo — e está cansada de dar conta sozinha.",
    images: ["/og-fernanda-lima.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f4efff",
  width: "device-width",
  initialScale: 1,
  // Lets env(safe-area-inset-*) work (floating WhatsApp button above iOS / Instagram bars).
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "ProfessionalService"],
  "@id": `${site.url}/#fernanda-lima`,
  name: "Fernanda Lima — Psicóloga Clínica",
  description: site.description,
  url: site.url,
  telephone: `+${site.phone}`,
  image: `${site.url}/og-fernanda-lima.jpg`,
  address: { "@type": "PostalAddress", addressLocality: "São Paulo", addressRegion: "SP", addressCountry: "BR" },
  areaServed: ["BR", "Worldwide"],
  availableLanguage: "pt-BR",
  identifier: site.crp,
  sameAs: [site.instagramUrl],
  knowsAbout: ["Terapia Cognitivo-Comportamental", "Terapia de Aceitação e Compromisso", "Ansiedade", "Autocobrança", "Perfeccionismo"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-dvh bg-bg font-sans text-[15px] leading-[1.6] text-ink antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <MotionProvider>{children}</MotionProvider>
        <AnalyticsProvider />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
