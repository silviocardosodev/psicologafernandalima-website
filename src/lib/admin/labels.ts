/** Human labels for what the tracker stores (ids, device classes, target codes). */

const ZONES: Record<string, string> = {
  inicio: "Topo",
  header: "Menu",
  "para-voce": "Pra você",
  virada: "Virada",
  sobre: "Sobre mim",
  depoimentos: "Depoimentos",
  "como-funciona": "Como funciona",
  videos: "Vídeos",
  instagram: "Instagram",
  duvidas: "Dúvidas",
  agendar: "Agendar",
  rodape: "Rodapé",
  page: "Botão flutuante",
  sinais: "Sinais",
  recursos: "Recursos",
};

export function zoneLabel(zone: string | null | undefined) {
  if (!zone) return "—";
  return ZONES[zone] ?? zone.replace(/-/g, " ");
}

const DEVICES: Record<string, string> = { mobile: "Celular", tablet: "Tablet", desktop: "Computador" };
export const deviceLabel = (d: string) => DEVICES[d] ?? d;

export function targetLabel(target: string) {
  if (target === "whatsapp") return "WhatsApp";
  if (target === "instagram") return "Instagram";
  if (target === "youtube") return "YouTube";
  if (target === "enviar contato") return "Enviar contato (formulário)";
  if (target.startsWith("botão ")) return target.slice(6);
  if (target.startsWith("link #")) return `Link para “${zoneLabel(target.slice(6))}”`;
  if (target.startsWith("link /")) return `Link para ${target.slice(5)}`;
  if (target.startsWith("externo ")) return `Site externo: ${target.slice(8)}`;
  if (target.startsWith("telefone ")) return `Telefone ${target.slice(9)}`;
  return target;
}

export function sourceLabel(source: string) {
  if (source === "direto") return "Direto / app";
  if (/instagram/.test(source)) return "Instagram";
  if (/google\./.test(source)) return "Google";
  if (/youtube/.test(source)) return "YouTube";
  if (/facebook|fb\./.test(source)) return "Facebook";
  return source;
}

export function pageLabel(path: string) {
  const map: Record<string, string> = {
    "/": "Página inicial",
    "/mente-acelerada": "Mente acelerada",
    "/autocobranca": "Autocobrança",
    "/ansiedade": "Ansiedade",
    "/produtos": "Produtos",
    "/privacidade": "Privacidade",
  };
  return map[path] ?? path;
}

export const nf = new Intl.NumberFormat("pt-BR");
export const pct = (part: number, total: number) =>
  total > 0 ? `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format((part / total) * 100)}%` : "—";
