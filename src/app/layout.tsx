import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import "@/app/globals.css";

config.autoAddCss = false;

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fernanda Lima Psicóloga",
  description:
    "Terapia para mulheres exigentes consigo mesmas, que vivem em estado de alerta e têm dificuldade de descansar sem culpa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${bodyFont.variable} bg-[var(--background)] font-[family:var(--font-body)] text-[var(--text-main)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
