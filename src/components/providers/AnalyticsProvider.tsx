"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { track } from "@/lib/analytics";
import { flushOnHide, trackClick, trackPageview, trackSectionView, trackingAllowed } from "@/lib/tracker";

/** The admin panel and its heatmap preview (an iframe) never count as visits. */
function skipVercel(event: BeforeSendEvent) {
  if (typeof window !== "undefined" && window.self !== window.top) return null;
  return new URL(event.url).pathname.startsWith("/admin") ? null : event;
}

/**
 * Vercel Web Analytics + Speed Insights (cookieless), one delegated listener that records
 * every WhatsApp (and Instagram) click with the section it came from, and the first-party
 * tracker that feeds the admin panel (visits, sections seen, click heatmap).
 */
export function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      trackClick(event);
      const target = event.target as HTMLElement | null;
      const insta = target?.closest?.<HTMLAnchorElement>('a[href*="instagram.com"]');
      if (insta) {
        const where = insta.closest("section[id]")?.id ?? (insta.closest("footer") ? "footer" : "outro");
        track("instagram_open", { section: where });
        return;
      }
      const link = target?.closest?.<HTMLAnchorElement>('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
      if (!link) return;
      const section =
        link.dataset.analyticsSection ??
        link.closest<HTMLElement>("[data-analytics-section]")?.dataset.analyticsSection ??
        link.closest("section[id]")?.id ??
        (link.closest("header") ? "header" : link.closest("footer") ? "footer" : "floating");
      track("cta_whatsapp", { section });
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") flushOnHide();
    };
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flushOnHide);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flushOnHide);
    };
  }, []);

  // One pageview per route, and each section counted once when it crosses the middle of the screen.
  useEffect(() => {
    if (!trackingAllowed()) return;
    trackPageview(pathname);
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting && id && !seen.has(id)) {
            seen.add(id);
            trackSectionView(pathname, id);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    document.querySelectorAll("main section[id], section[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <Analytics beforeSend={skipVercel} />
      <SpeedInsights />
    </>
  );
}
