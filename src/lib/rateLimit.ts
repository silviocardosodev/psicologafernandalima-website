/**
 * Best-effort per-instance rate limit (serverless instances don't share memory).
 * Enough to blunt a script hammering one endpoint; not a security boundary.
 * The key is hashed in memory only; IPs are never stored in the database.
 */
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}

export function clientKey(request: Request, scope: string) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anon";
  return `${scope}:${ip}`;
}

const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|whatsapp|monitor|curl|wget|python|axios/i;

export function isBot(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  return !ua || BOT_UA.test(ua);
}
