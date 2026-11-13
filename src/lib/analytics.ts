import { track as vercelTrack } from "@vercel/analytics";

/**
 * Privacy-first event tracking (Vercel Web Analytics — cookieless, no banner needed).
 *
 * LGPD rule: NEVER send health data or anything the visitor typed — no symptoms,
 * no selected statements, no names, no search text. Only counts, steps and section ids.
 */
export type AnalyticsEvent =
  | { name: "cta_whatsapp"; props: { section: string } }
  | { name: "identify_select"; props: { count: number } }
  | { name: "identify_optin"; props: { enabled: boolean } }
  | { name: "booking_open"; props?: undefined }
  | { name: "booking_step"; props: { step: number } }
  | { name: "booking_submit"; props?: undefined }
  | { name: "faq_open"; props: { id: string } }
  | { name: "faq_search"; props: { has_results: boolean } }
  | { name: "faq_filter"; props: { category: string } };

export function track<E extends AnalyticsEvent>(name: E["name"], props?: E["props"]) {
  try {
    vercelTrack(name, props as Record<string, string | number | boolean> | undefined);
  } catch {
    // Analytics must never break the page.
  }
}
