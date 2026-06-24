// ---------------------------------------------------------------------------
// Lightweight admin session (DEMO-GRADE — not production auth).
//
// The dashboard is gated by a single shared password. On success we set an
// httpOnly cookie whose value is an HMAC-SHA256 signature of a fixed payload,
// signed with ADMIN_SESSION_SECRET. Because it is stateless we can verify it
// in both the Node runtime (this file) and the Edge middleware (Web Crypto).
//
// For a real product, replace this with Auth.js / NextAuth, per-user accounts,
// and proper session storage. See the README "Security notes" section.
// ---------------------------------------------------------------------------

import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "aura_session";
const PAYLOAD = "aura360lab-admin-v1";
const DEV_SECRET = "aura360lab-dev-secret-change-me";

function secret() {
  return process.env.ADMIN_SESSION_SECRET || DEV_SECRET;
}

export function adminPassword() {
  // Defaults to a known value so the dashboard works out-of-the-box in a
  // preview. CHANGE THIS via ADMIN_PASSWORD before deploying.
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function signSession() {
  return crypto.createHmac("sha256", secret()).update(PAYLOAD).digest("hex");
}

export function verifySession(value) {
  if (!value) return false;
  try {
    const expected = signSession();
    const a = Buffer.from(value);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// Read the current request's cookie (use inside server components / routes).
export function isAuthenticated() {
  const value = cookies().get(SESSION_COOKIE)?.value;
  return verifySession(value);
}
