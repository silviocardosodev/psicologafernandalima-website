/**
 * Landing pages per pain: destinations for specific Instagram posts
 * (ex.: /mente-acelerada?utm_source=instagram&utm_medium=post&utm_campaign=mente-acelerada).
 *
 * Writing rules (ata, Writers + QA/CFP): her words, first person, short sentences,
 * no promises of results, signs are not a diagnosis.
 */
export type PainSlug = "mente-acelerada" | "autocobranca" | "ansiedade";

export type Pain = {
  slug: PainSlug;
  /** Short name (related links, breadcrumbs). */
  name: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  lead: string;
  signs: string[];
  why: string;
  help: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
  /** Teaser shown in "Também pode ser sobre isso". */
  teaser: string;
};

export const pains: Pain[] = [
  {
    slug: "mente-acelerada",
    name: "Mente acelerada",
    metaTitle: "Mente acelerada: quando a cabeça não desliga",
    metaDescription:
      "Pensamentos em loop, listas mentais, dificuldade para relaxar. Terapia online com a psicóloga Fernanda Lima (TCC e ACT) para desacelerar no seu ritmo.",
    title: "Quando a cabeça não desliga nem na hora de dormir.",
    lead: "Pensamentos em loop, listas mentais, o próximo problema antes de o atual acabar. Não é falta de força de vontade — e dá para aprender a desacelerar.",
    signs: [
      "Deito e começo a repassar o dia inteiro.",
      "Antecipo problemas que talvez nem aconteçam.",
      "Não consigo ficar presente nem nos momentos bons.",
      "Parar parece perda de tempo.",
    ],
    why: "Muitas vezes, a mente acelerada é uma tentativa de proteção: pensar em tudo para não ser pega de surpresa. Funciona por um tempo — até começar a cansar mais do que ajuda.",
    help: [
      { title: "Entender o ciclo", text: "Mapear o que dispara os pensamentos em loop e o que faz eles continuarem girando." },
      { title: "Ferramentas para o dia a dia", text: "Técnicas da TCC para lidar com a ruminação na vida real, não só durante a sessão." },
      { title: "Voltar para o agora", text: "Com a ACT, aprender a notar um pensamento sem precisar obedecer a cada um." },
    ],
    faq: [
      {
        question: "Pensar demais é ansiedade?",
        answer:
          "Nem sempre. Pensar muito pode ter várias causas, e só uma avaliação cuidadosa diz o que está acontecendo com você. A primeira conversa serve justamente para isso.",
      },
      {
        question: "Vou parar de pensar?",
        answer:
          "A ideia não é desligar a mente, e sim mudar a relação com os pensamentos, para que eles não decidam o seu dia. Cada pessoa tem seu ritmo, e não existe prazo garantido.",
      },
    ],
    teaser: "Quando a cabeça não desliga.",
  },
  {
    slug: "autocobranca",
    name: "Autocobrança",
    metaTitle: "Autocobrança: quando nunca parece suficiente",
    metaDescription:
      "Culpa ao descansar, medo de errar, dificuldade de dizer não. Terapia online com a psicóloga Fernanda Lima para ser exigente sem viver em dívida consigo mesma.",
    title: "Nunca parece suficiente. Nem quando você fez tudo.",
    lead: "Você entrega, resolve, cuida de todo mundo — e ainda se cobra por não ter feito mais. Dá para continuar exigente sem viver em dívida com você mesma.",
    signs: [
      "Descansar me dá culpa.",
      "Um erro pequeno ocupa minha cabeça o dia inteiro.",
      "Elogios não me convencem. Críticas, sim.",
      "Digo sim para tudo e fico sem espaço para mim.",
    ],
    why: "A autocobrança costuma nascer de regras antigas — “só tenho valor se der conta” — que um dia fizeram sentido. Na terapia, a gente revê essas regras com calma, sem jogar fora o que você construiu.",
    help: [
      { title: "Reconhecer as regras internas", text: "Perceber de onde vem a cobrança e quando ela deixa de te ajudar." },
      { title: "Limites possíveis", text: "Aprender, aos poucos, a dizer não e a descansar com menos culpa." },
      { title: "Agir pelo que importa", text: "Com a ACT, escolher pelo que você valoriza, e não pelo medo de falhar." },
    ],
    faq: [
      {
        question: "Vou ficar menos produtiva?",
        answer:
          "O objetivo não é perder o que você tem de bom, e sim tirar o peso. Muitas pessoas percebem que conseguem fazer o que importa com menos desgaste, mas cada caminho é único.",
      },
      {
        question: "Isso não é só falta de organização?",
        answer:
          "Organização ajuda, mas a autocobrança costuma estar no jeito como você se trata, não na agenda. Por isso, mais uma lista raramente resolve.",
      },
    ],
    teaser: "Quando nunca parece suficiente.",
  },
  {
    slug: "ansiedade",
    name: "Ansiedade",
    metaTitle: "Ansiedade: terapia online para mulheres",
    metaDescription:
      "Preocupação constante, corpo tenso, medo de que algo dê errado. Terapia online com a psicóloga Fernanda Lima (TCC e ACT) para cuidar da ansiedade no seu ritmo.",
    title: "Ansiedade não é frescura. E não precisa mandar no seu dia.",
    lead: "Aperto no peito, preocupação constante, a sensação de que algo vai dar errado. A ansiedade é comum, tem explicação e pode ser cuidada.",
    signs: [
      "Me preocupo com tudo, o tempo todo.",
      "Sinto o corpo tenso sem um motivo claro.",
      "Evito situações pelo medo de como vou me sentir.",
      "Durmo mal ou já acordo preocupada.",
    ],
    why: "A ansiedade é um alarme do corpo tentando te proteger. O problema começa quando ele dispara demais, diante de coisas que não são perigos de verdade. Na terapia, a gente aprende a entender e a ajustar esse alarme.",
    help: [
      { title: "Entender seus gatilhos", text: "Identificar o que acende o alarme e o que mantém a preocupação girando." },
      { title: "Recursos para os momentos difíceis", text: "Técnicas da TCC para lidar com a crise e com os pensamentos catastróficos." },
      { title: "Viver mesmo com medo", text: "Com a ACT, voltar a fazer o que importa sem esperar a ansiedade sumir." },
    ],
    faq: [
      {
        question: "Preciso de remédio?",
        answer:
          "Quem avalia medicação é o médico psiquiatra. Se fizer sentido no seu caso, eu explico como funciona, e a terapia pode caminhar junto com o acompanhamento médico.",
      },
      {
        question: "Estou em crise agora. O que faço?",
        answer:
          "Se você está em sofrimento intenso, ligue para o CVV no 188 (24h, gratuito) ou para o SAMU no 192. A terapia é um cuidado contínuo e não substitui o atendimento de emergência.",
      },
    ],
    teaser: "Quando a preocupação não dá trégua.",
  },
];

export function getPain(slug: string) {
  return pains.find((p) => p.slug === slug);
}
