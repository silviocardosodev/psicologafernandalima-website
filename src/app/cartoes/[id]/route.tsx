import { renderQuoteImage } from "@/lib/quoteImage";
import { getQuote, quotes } from "@/lib/quotes";

// Pre-rendered at build time: one static PNG per quote (1080×1350, Instagram post).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return quotes.map((quote) => ({ id: quote.id }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = getQuote(id);
  if (!quote) return new Response("Not found", { status: 404 });
  return renderQuoteImage(quote, "post");
}
