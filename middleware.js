import { NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

// Keep these in sync with lib/auth.js (cannot import it here — that file uses
// the Node `crypto` module, which is unavailable in the Edge middleware runtime).
const SESSION_COOKIE = "aura_session";
const SESSION_PAYLOAD = "aura360lab-admin-v1";
const DEV_SECRET = "aura360lab-dev-secret-change-me";

function getLocale(request) {
  // 1. Cookie preference
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  // 2. Accept-Language header
  const accept = request.headers.get("accept-language");
  if (accept) {
    const preferred = accept
      .split(",")
      .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
    const match = preferred.find((code) => locales.includes(code));
    if (match) return match;
  }

  return defaultLocale;
}

// Verify the admin session cookie using Web Crypto (Edge-compatible HMAC).
async function verifyAdminSession(value) {
  if (!value) return false;
  // Fail closed in production: the dev secret is public in the repo, so a
  // cookie signed with it must never be accepted outside local development.
  if (process.env.NODE_ENV === "production" && !process.env.ADMIN_SESSION_SECRET) {
    return false;
  }
  try {
    const secret = process.env.ADMIN_SESSION_SECRET || DEV_SECRET;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(SESSION_PAYLOAD));
    const expected = Array.from(new Uint8Array(sigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    if (expected.length !== value.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ value.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip Next internals, API routes and static files.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ---- Admin gate (routes already carry a locale prefix) -----------------
  const adminMatch = pathname.match(/^\/(en|fr)\/admin(?:\/(.*))?$/);
  if (adminMatch) {
    const locale = adminMatch[1];
    const isLoginRoute = pathname === `/${locale}/admin/login`;
    const authed = await verifyAdminSession(request.cookies.get(SESSION_COOKIE)?.value);

    if (!authed && !isLoginRoute) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }
    if (authed && isLoginRoute) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ---- Locale prefixing --------------------------------------------------
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocale) {
    const locale = getLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
