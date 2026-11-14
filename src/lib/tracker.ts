import { ZONE_SELECTOR, zoneName } from "@/lib/heatZones";

/**
 * First-party, cookieless navigation tracking for the admin panel (Supabase).
 *
 * LGPD rules baked in:
 * - No cookies, no IP, no fingerprinting. The session id is random, lives only in this
 *   tab (sessionStorage) and is gone when the tab closes.
 * - Nothing typed, nothing selected. Anything inside [data-private] (the "Parece que fala
 *   de você?" cards, the message assistant) is ignored entirely, not even counted.
 * - Honors "Do Not Track" / Global Privacy Control.
 */

type Device = "mobile" | "tablet" | "desktop";
type EventType = "pageview" | "click" | "section_view" | "conversion";

export type TrackEvent = { t: EventType; p: string; z?: string; g?: string; x?: number; y?: number };

export type TrackBatch = {
  s: string;
  d: Device;
  r?: string;
  us?: string;
  um?: string;
  uc?: string;
  e: TrackEvent[];
};

const ENDPOINT = "/api/track";
const SESSION_KEY = "fl_sid";

let queue: TrackEvent[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
let attribution: Pick<TrackBatch, "r" | "us" | "um" | "uc"> | null = null;

export function trackingAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return false;
  if (window.self !== window.top) return false; // the admin heatmap preview
  if (location.pathname.startsWith("/admin")) return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.doNotTrack === "1" || nav.globalPrivacyControl || nav.webdriver) return false;
  return true;
}

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Storage blocked: one id per page load is still fine.
    return ((window as unknown as { __flSid?: string }).__flSid ??= crypto.randomUUID());
  }
}

function device(): Device {
  const w = window.innerWidth;
  return w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";
}

/** Where the visit came from: external referrer host + UTM tags (read once per page load). */
function readAttribution() {
  if (attribution) return attribution;
  const params = new URLSearchParams(location.search);
  let r: string | undefined;
  try {
    const host = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "";
    if (host && host !== location.hostname.replace(/^www\./, "")) r = host;
  } catch {}
  const clip = (v: string | null, n: number) => (v ? v.slice(0, n) : undefined);
  attribution = { r, us: clip(params.get("utm_source"), 60), um: clip(params.get("utm_medium"), 60), uc: clip(params.get("utm_campaign"), 80) };
  return attribution;
}

function flush(useBeacon = false) {
  clearTimeout(timer);
  timer = undefined;
  if (!queue.length) return;
  const batch: TrackBatch = { s: sessionId(), d: device(), ...readAttribution(), e: queue.splice(0, 50) };
  const body = JSON.stringify(batch);
  try {
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
    } else {
      void fetch(ENDPOINT, { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } }).catch(() => {});
    }
  } catch {
    // Tracking must never break the page.
  }
  if (queue.length) flush(useBeacon);
}

function push(event: TrackEvent) {
  if (!trackingAllowed()) return;
  queue.push(event);
  if (queue.length >= 10) flush();
  else if (!timer) timer = setTimeout(() => flush(), 4000);
}

export function flushOnHide() {
  flush(true);
}

export function trackPageview(path: string) {
  push({ t: "pageview", p: path });
}

export function trackSectionView(path: string, zone: string) {
  push({ t: "section_view", p: path, z: zone });
}

/** A completed action that has no link click (e.g. the contact form was sent). */
export function trackConversion(target: string) {
  push({ t: "conversion", p: location.pathname, g: target });
}

function clean(text: string | null | undefined, max = 40) {
  return (text ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

/** Names what was clicked, from the page's own copy/links. Never from anything the visitor typed. */
function describeTarget(el: Element): string | undefined {
  const tagged = el.closest<HTMLElement>("[data-track]");
  if (tagged?.dataset.track) return tagged.dataset.track.slice(0, 80);

  const link = el.closest<HTMLAnchorElement>("a[href]");
  if (link) {
    const href = link.getAttribute("href") ?? "";
    if (/wa\.me|api\.whatsapp\.com/.test(href)) return "whatsapp";
    if (href.includes("instagram.com")) return "instagram";
    if (/youtube\.com|youtu\.be/.test(href)) return "youtube";
    if (href.startsWith("tel:")) return `telefone ${href.slice(4)}`;
    try {
      const url = new URL(href, location.href);
      if (url.origin === location.origin) return `link ${url.pathname === location.pathname ? "" : url.pathname}${url.hash}`.trim().slice(0, 80);
      return `externo ${url.hostname.replace(/^www\./, "")}`.slice(0, 80);
    } catch {
      return "link";
    }
  }

  const button = el.closest<HTMLElement>("button, summary, [role=button]");
  if (button) {
    const label = clean(button.getAttribute("aria-label")) || clean(button.textContent);
    return label ? `botão ${label}` : "botão";
  }
  return undefined;
}

export function trackClick(event: MouseEvent) {
  if (!trackingAllowed()) return;
  const el = event.target as Element | null;
  if (!el?.closest || el.closest("[data-private]")) return;

  const target = describeTarget(el);
  const zoneEl = el.closest(ZONE_SELECTOR);
  let zone = "page";
  let x: number | undefined;
  let y: number | undefined;

  if (zoneEl && getComputedStyle(zoneEl).position !== "fixed") {
    zone = zoneName(zoneEl);
    const box = zoneEl.getBoundingClientRect();
    if (box.width > 0 && box.height > 0) {
      x = (event.clientX - box.left) / box.width;
      y = (event.clientY - box.top) / box.height;
    }
  } else if (!zoneEl) {
    const root = document.documentElement;
    x = event.pageX / root.scrollWidth;
    y = event.pageY / root.scrollHeight;
  }
  const inRange = (v?: number) => v !== undefined && v >= 0 && v <= 1;
  const placed = inRange(x) && inRange(y);

  push({
    t: "click",
    p: location.pathname,
    z: zone,
    g: target,
    x: placed ? Math.round(x! * 1000) / 1000 : undefined,
    y: placed ? Math.round(y! * 1000) / 1000 : undefined,
  });
}
