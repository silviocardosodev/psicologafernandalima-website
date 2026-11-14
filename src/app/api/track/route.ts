import { clientKey, isBot, rateLimited } from "@/lib/rateLimit";
import { getServiceClient } from "@/lib/supabase/service";
import type { TrackBatch } from "@/lib/tracker";

const TYPES = new Set(["pageview", "click", "section_view", "conversion"]);
const DEVICES = new Set(["mobile", "tablet", "desktop"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const str = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
const ratio = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1 ? v : null);

/**
 * Receives anonymous navigation events (see src/lib/tracker.ts) and stores them.
 * Always answers 204: the page never waits on or reacts to this.
 */
export async function POST(request: Request) {
  const done = new Response(null, { status: 204 });
  const db = getServiceClient();
  if (isBot(request) || rateLimited(clientKey(request, "track"), 120, 60_000)) return done;

  let batch: TrackBatch;
  try {
    const text = await request.text();
    if (text.length > 20_000) return done;
    batch = JSON.parse(text);
  } catch {
    return done;
  }
  if (!db) {
    // No database (local dev): show what would be stored, to check the tracker.
    if (process.env.NODE_ENV === "development") console.log("[track:dev]", JSON.stringify(batch));
    return done;
  }
  if (!batch || typeof batch.s !== "string" || !UUID.test(batch.s) || !DEVICES.has(batch.d) || !Array.isArray(batch.e)) return done;

  const rows = batch.e
    .slice(0, 50)
    .filter((e) => e && TYPES.has(e.t) && typeof e.p === "string" && e.p.startsWith("/") && !e.p.startsWith("/admin"))
    .map((e) => {
      const isPageview = e.t === "pageview";
      return {
        session_id: batch.s,
        type: e.t,
        path: e.p.slice(0, 200),
        zone: str(e.z, 60),
        target: str(e.g, 80),
        rx: e.t === "click" ? ratio(e.x) : null,
        ry: e.t === "click" ? ratio(e.y) : null,
        device: batch.d,
        referrer: isPageview ? str(batch.r, 120) : null,
        utm_source: isPageview ? str(batch.us, 60) : null,
        utm_medium: isPageview ? str(batch.um, 60) : null,
        utm_campaign: isPageview ? str(batch.uc, 80) : null,
      };
    });

  if (rows.length) {
    const { error } = await db.from("site_events").insert(rows);
    if (error) console.error("[track] insert failed:", error.message);
  }
  return done;
}
