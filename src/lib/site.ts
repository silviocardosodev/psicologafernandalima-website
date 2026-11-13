export const site = {
  name: "Fernanda Lima",
  title: "Psicóloga Fernanda Lima | Terapia online para mulheres com a mente acelerada",
  description:
    "Terapia online para mulheres com mente acelerada, autocobrança e ansiedade. Psicóloga Fernanda Lima, CRP 06/192404, TCC e ACT — no Brasil e no exterior.",
  url: "https://www.psicologafernandalima.com.br",
  crp: "CRP 06/192404",
  instagram: "fernandalima.psi",
  instagramUrl: "https://www.instagram.com/fernandalima.psi/",
  phone: "5511994558021",
  phoneDisplay: "+55 (11) 99455-8021",
  defaultMessage:
    "Olá Fernanda! Cheguei aqui por meio do seu site, estou interessada em iniciar o processo de terapia!",
} as const;

/** Builds a wa.me link with a prefilled, URL-encoded message. */
export function whatsappLink(message: string = site.defaultMessage) {
  return `https://wa.me/${site.phone}?text=${encodeURIComponent(message)}`;
}

export const navItems = [
  { id: "para-voce", label: "Pra você" },
  { id: "sobre", label: "Sobre mim" },
  { id: "como-funciona", label: "Como funciona" },
  { id: "duvidas", label: "Dúvidas" },
] as const;

/** Single primary CTA label used everywhere (always opens WhatsApp). */
export const ctaLabel = "Quero conversar";
