/**
 * FAQ content — single source for the FAQ section and the FAQPage JSON-LD.
 * Plain-text answers (no markup). Objections first. Never promise results (CFP).
 */
export type FaqCategory = "objecoes" | "sessoes" | "valores";

export type FaqItem = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "ja-fiz-terapia",
    category: "objecoes",
    question: "Já fiz terapia e não senti diferença. Por que agora seria diferente?",
    answer:
      "Cada processo é único. Aqui combinamos objetivos claros, você leva ferramentas para usar na semana e revisamos juntas o caminho.",
  },
  {
    id: "quanto-tempo",
    category: "objecoes",
    question: "Quanto tempo até eu perceber diferença?",
    answer:
      "Depende de cada pessoa, então não dá para prometer um prazo. O que faço é acompanhar com você, sessão a sessão, o que já está mudando.",
  },
  {
    id: "vida-boa",
    category: "objecoes",
    question: "Minha vida é boa. Faz sentido fazer terapia?",
    answer:
      "Faz. Você não precisa estar no limite para cuidar de si — sentir que algo pesa já é motivo suficiente.",
  },
  {
    id: "primeira-sessao",
    category: "objecoes",
    question: "Como é a primeira sessão?",
    answer:
      "É o momento de nos conhecermos: você conta, no seu tempo, o que tem vivido. Juntas, entendemos onde você quer chegar.",
  },
  {
    id: "valor",
    category: "valores",
    question: "Qual o valor da sessão?",
    answer:
      "Pelo Código de Ética, não uso valores como propaganda — informo no nosso primeiro contato. O pagamento é por PIX ou transferência.",
  },
  {
    id: "como-funcionam",
    category: "sessoes",
    question: "Como funcionam as sessões?",
    answer:
      "São online, pelo Google Meet, semanais e com cerca de 50 minutos. Você só precisa de internet e de um lugar reservado.",
  },
  {
    id: "sigilo",
    category: "sessoes",
    question: "Minhas informações ficam em sigilo?",
    answer:
      "Sim. Tudo o que conversamos é protegido pelo sigilo profissional previsto no Código de Ética do psicólogo.",
  },
  {
    id: "exterior",
    category: "sessoes",
    question: "Atende quem mora fora do Brasil?",
    answer: "Sim. Atendo brasileiras no exterior e combinamos o horário pelo seu fuso.",
  },
];
