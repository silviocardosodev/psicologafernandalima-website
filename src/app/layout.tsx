import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "@/app/globals.css";
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
    "psicóloga online",
    "terapia online para mulheres",
    "TCC",
    "terapia cognitivo-comportamental",
    "ACT",
    "ansiedade",
    "depressão",
    "pânico",
    "relacionamentos",
    "Fernanda Lima",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: "Psicóloga Fernanda Lima",
    title: site.title,
    description: site.description,
    images: [{ url: "/psicologa-fernanda-lima-2.png", alt: "Psicóloga Fernanda Lima" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "ProfessionalService"],
  name: "Fernanda Lima — Psicóloga Clínica",
  description: site.description,
  url: site.url,
  telephone: `+${site.phone}`,
  image: `${site.url}/psicologa-fernanda-lima-2.png`,
  areaServed: ["BR", "Worldwide"],
  availableLanguage: "pt-BR",
  identifier: site.crp,
  knowsAbout: ["Terapia Cognitivo-Comportamental", "Terapia de Aceitação e Compromisso", "Ansiedade", "Depressão", "Transtorno do pânico", "Relacionamentos"],
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
