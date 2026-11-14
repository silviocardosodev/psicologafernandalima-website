/**
 * Heatmap anchoring. A click is stored relative to the page block it landed in
 * (a section with an id, the header or the footer), as fractions of that block's box.
 * Blocks reflow with screen width, so this lands the dot on the same spot of the same
 * block when the admin re-draws it, even if the visitor's phone was a bit narrower.
 */
export const ZONE_SELECTOR = "[data-zone], section[id], footer[id], header:not(section header):not(article header)";

export function zoneName(el: Element): string {
  const h = el as HTMLElement;
  return h.dataset.zone || h.id || h.tagName.toLowerCase();
}

/** Finds the element for a stored zone name in a document (admin heatmap iframe). */
export function findZone(doc: Document, zone: string): HTMLElement | null {
  if (zone === "page") return doc.documentElement;
  return (
    doc.querySelector<HTMLElement>(`[data-zone="${CSS.escape(zone)}"]`) ??
    doc.getElementById(zone) ??
    (zone === "header" ? doc.querySelector<HTMLElement>("header:not(section header):not(article header)") : null)
  );
}
