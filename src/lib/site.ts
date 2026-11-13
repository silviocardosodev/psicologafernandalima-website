export const site = {
  name: "Fernanda Lima",
  title: "Psicóloga Fernanda Lima | Terapia Online para Mulheres",
  description:
    "Terapia online com a psicóloga Fernanda Lima (CRP 06/192404) para mulheres a partir de 18 anos, no Brasil e no exterior. Abordagem em TCC e ACT para ansiedade, depressão, pânico e relacionamentos.",
  url: "https://www.psicologafernandalima.com.br",
  crp: "CRP 06/192404",
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
  { id: "ajuda", label: "Como posso ajudar" },
  { id: "jornada", label: "Como funciona" },
  { id: "terapia-online", label: "Terapia online" },
  { id: "sobre", label: "Sobre mim" },
  { id: "duvidas", label: "Dúvidas" },
] as const;
