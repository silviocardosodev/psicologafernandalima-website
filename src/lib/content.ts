/**
 * Content brought over from the current site (psicologafernandalima.com.br):
 * testimonials (transcribed from the message screenshots, names omitted) and the
 * latest YouTube videos. Edit here to add or swap items.
 */

export type Testimonial = { id: string; paragraphs: string[] };

export const testimonials: Testimonial[] = [
  {
    id: "diferente",
    paragraphs: [
      "Me consultar com a Fernanda foi diferente de todas as outras experiências de terapia que já tive. Eu vinha de um dos meus piores momentos, sentindo uma ansiedade absurda, impossibilitada de fazer qualquer tarefa do início ao fim, de prestar atenção ao que as pessoas falavam comigo ou qualquer uma dessas coisas simples.",
      "A Fernanda tem me ajudado a entender que nem tudo o que eu penso vai acontecer, que meus pensamentos não são necessariamente a realidade. Com essas e outras coisas que aprendi, meus dias têm sido mais tranquilos, tenho estado mais consciente, diferente de como me sentia antes. Só tenho a agradecer, de todo coração!",
    ],
  },
  {
    id: "primeira-sessao",
    paragraphs: [
      "Eu cheguei à primeira sessão morrendo de medo de como seria falar dos detalhes da minha vida para “uma estranha”, mas você é um doce. Foi como se já nos conhecêssemos, fiquei super à vontade e pensando em por que não comecei a fazer terapia antes.",
      "A respiração que me ensinou já me ajudou horrores a lidar com as coisas hoje. Muitíssimo obrigada pelo seu trabalho, querida! ❤️",
    ],
  },
  {
    id: "libertador",
    paragraphs: [
      "Quando cheguei até a Fe, me sentia o pior ser humano da face da terra. Só via meus vários defeitos e por isso já não tinha ânimo para sair, para estar com meu namorado, para ir a festas, para assumir novos projetos na empresa e tudo mais. Esse foi um dos motivos que me levaram a buscar uma psicóloga…",
      "Hoje, ainda tenho consciência dos meus defeitos, mas surpreendentemente também consigo enxergar algumas coisas boas em mim mesma, e isso é libertador.",
      "Tenho certeza de que vamos chegar ainda mais longe e não sei o que faria sem a Fe, sua paciência e sua dedicação… ❤️",
    ],
  },
  {
    id: "menos-perdida",
    paragraphs: [
      "Boa tarde, Fer!! Passando para agradecer a sessão de hoje. Aliás, agradecer por tudo.",
      "Como falamos, minha vida estava um caos e eu não via um jeito de consertar, mas estamos conseguindo!! Sei que as coisas acontecem aos poucos, mas já me sinto menos perdida 💙",
    ],
  },
  {
    id: "o-que-posso-dizer",
    paragraphs: [
      "Ahhh, o que posso dizer de você?!",
      "Eu sempre soube que fazer terapia poderia me ajudar de algum jeito, mas não tinha noção do quanto a minha decisão de adiar esse tratamento refletia na minha vida, no meu casamento e até no trabalho. Eu me acostumei com um monte de coisas e imaginava que fossem normais (criticar os outros o tempo todo, me criticar o tempo todo, estar sempre preocupada e controlando tudo etc.), mas percebo agora que não são.",
      "Acabei descobrindo o TAG e, sem o tratamento, entendo que as coisas poderiam ficar ainda piores. A Fer entrega o melhor não só nas sessões, mas fora delas. Sempre disponível, sempre gentil, sempre propondo reflexões que me fazem pensar a semana toda. Sou muito grata e sortuda por estarmos caminhando juntas e por essa mudança que tem acontecido na minha vida, Ferrr!",
    ],
  },
  {
    id: "fase-conturbada",
    paragraphs: [
      "Olá, Fernanda! Já disse isso em nossa chamada, mas agradeço imensamente por sua paciência e compreensão.",
      "Essa é uma fase bastante conturbada e ter seu apoio tem sido essencial para organizar meus sentimentos e todas as coisas que estão por vir.",
    ],
  },
];

export type Video = { id: string; title: string };

export const youtubeChannelUrl = "https://www.youtube.com/@fernandalimapsi";

export const videos: Video[] = [
  { id: "wCw4uVjcuyU", title: "Como você fala com você?" },
  { id: "8NnLTNWabF8", title: "Como não ser uma reclamona?" },
  { id: "fb216O1qKUY", title: "Como você lida com o medo?" },
];
