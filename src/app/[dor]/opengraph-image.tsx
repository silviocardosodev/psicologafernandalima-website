import { getPain, pains } from "@/lib/pains";
import { OG_SIZE, renderQuoteImage } from "@/lib/quoteImage";
import { quotes } from "@/lib/quotes";

export const size = OG_SIZE;
export const contentType = "image/png";
// Pre-rendered at build time (fonts are read from disk only during the build).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return pains.map((pain) => ({ dor: pain.slug }));
}

export const alt = "Frase da psicóloga Fernanda Lima";

/** Link preview (WhatsApp, Instagram DM) of each pain page: its first quote card. */
export default async function Image({ params }: { params: Promise<{ dor: string }> }) {
  const { dor } = await params;
  const pain = getPain(dor);
  const quote = quotes.find((q) => q.pain === dor) ?? quotes[0];
  return renderQuoteImage(pain ? quote : quotes[0], "og");
}
