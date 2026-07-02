import { getAllProjectSlugs } from "@/lib/projects";
import { locales } from "@/i18n/config";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const slugs = await getAllProjectSlugs();
  const staticRoutes = ["", "/portfolio", "/about", "/contact"];
  const now = new Date();

  const entries = [];
  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${base}/${locale}${route}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: route === "" ? 1 : 0.7,
      });
    }
    for (const slug of slugs) {
      entries.push({
        url: `${base}/${locale}/portfolio/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }
  return entries;
}
