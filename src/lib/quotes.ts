/**
 * "Frases pra guardar": short, original lines in Fernanda's voice, made to be saved
 * and shared on Instagram (4:5 post). CFP: no promises, no diagnosis, always signed
 * with name + CRP.
 */
export type QuoteTheme = "lilac" | "brand" | "white";

export type Quote = {
  id: string;
  text: string;
  /** Pain page this line belongs to (or "inicio" for the home page). */
  pain: "mente-acelerada" | "autocobranca" | "ansiedade" | "inicio";
  theme: QuoteTheme;
};

export const quotes: Quote[] = [
  { id: "vida-boa-pesa", text: "Sua vida pode ser boa e ainda assim pesar. As duas coisas cabem.", pain: "inicio", theme: "brand" },
  { id: "nem-todo-pensamento", text: "Nem todo pensamento merece a sua atenção.", pain: "mente-acelerada", theme: "lilac" },
  { id: "desacelerar", text: "Desacelerar não é ficar para trás.", pain: "mente-acelerada", theme: "white" },
  { id: "descansar", text: "Descansar também é responsabilidade.", pain: "autocobranca", theme: "lilac" },
  { id: "valor", text: "Você não precisa dar conta de tudo para ter valor.", pain: "autocobranca", theme: "brand" },
  { id: "ansiedade-alarme", text: "Sentir ansiedade não significa que algo ruim vai acontecer.", pain: "ansiedade", theme: "white" },
];

export function getQuote(id: string) {
  return quotes.find((q) => q.id === id);
}

/** Public URL of the pre-rendered PNG (1080×1350). */
export function quoteImagePath(id: string) {
  return `/cartoes/${id}`;
}
