// Minimal fixed-window rate limiter keyed by an arbitrary string (e.g. IP).
//
// NOTE: this is in-memory, so the counter resets whenever the serverless
// instance is recycled and is not shared between concurrent instances. That is
// acceptable as a brute-force speed bump; for a hard guarantee swap the
// `check` implementation for a shared store (e.g. @upstash/ratelimit backed by
// Redis) — the call site does not need to change.

const buckets = new Map();

export function rateLimit({ limit, windowMs }) {
  return {
    // Returns { ok, retryAfterSeconds }. Counts the attempt.
    check(key) {
      const now = Date.now();
      const bucket = buckets.get(key);

      if (!bucket || now >= bucket.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { ok: true, retryAfterSeconds: 0 };
      }

      bucket.count += 1;
      if (bucket.count > limit) {
        return {
          ok: false,
          retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
        };
      }
      return { ok: true, retryAfterSeconds: 0 };
    },
  };
}

// Best-effort client IP for rate-limit keys (Vercel sets x-forwarded-for).
export function clientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
