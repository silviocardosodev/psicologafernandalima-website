"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { track } from "@/lib/analytics";

/**
 * Vercel Web Analytics + Speed Insights (cookieless) and one delegated listener that
 * records every WhatsApp click with the section it came from — no per-button wiring.
 */
export function AnalyticsProvider() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest?.<HTMLAnchorElement>(
        'a[href*="wa.me"], a[href*="api.whatsapp.com"]',
      );
      if (!link) return;
      const section =
        link.dataset.analyticsSection ??
        link.closest<HTMLElement>("[data-analytics-section]")?.dataset.analyticsSection ??
        link.closest("section[id]")?.id ??
        (link.closest("header") ? "header" : link.closest("footer") ? "footer" : "floating");
      track("cta_whatsapp", { section });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
