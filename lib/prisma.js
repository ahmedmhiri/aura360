// Prisma client singleton with graceful degradation.
//
// If DATABASE_URL is not set, or the client has not been generated yet,
// `prisma` stays null and the data layer falls back to sample content.
// This lets the site render immediately for a preview, while a real
// database simply activates the dynamic, editable behaviour.

let prisma = null;

if (process.env.DATABASE_URL) {
  try {
    // Required lazily so a missing/ungenerated client never crashes the build.
    const { PrismaClient } = require("@prisma/client");
    const globalForPrisma = globalThis;
    // Append connect_timeout so build workers fail fast (not after 60 s) when
    // Neon is sleeping, letting the sample-data fallback kick in immediately.
    const rawUrl = process.env.DATABASE_URL;
    const dbUrl = rawUrl.includes("connect_timeout")
      ? rawUrl
      : rawUrl + (rawUrl.includes("?") ? "&" : "?") + "connect_timeout=10";
    prisma =
      globalForPrisma.__aura_prisma ||
      new PrismaClient({
        datasources: { db: { url: dbUrl } },
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.__aura_prisma = prisma;
    }
  } catch (error) {
    console.warn(
      "[aura360lab] Prisma client unavailable — using sample data. Run `npx prisma generate`.",
      error?.message
    );
    prisma = null;
  }
}

export const isDbEnabled = Boolean(prisma);
export default prisma;
