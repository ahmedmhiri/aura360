import prisma, { isDbEnabled } from "@/lib/prisma";
import { sampleProjects, sampleCategories } from "@/lib/sample-data";

// Normalize any project (DB row or sample) into the shape components consume:
// localized text grouped as { en, fr }.
function serializeProject(p, categories) {
  const categorySlug = p.categorySlug || p.category?.slug;
  const category =
    p.category && p.category.nameEn
      ? p.category
      : (categories || []).find((c) => c.slug === categorySlug);

  return {
    id: p.id || p.slug,
    slug: p.slug,
    title: { en: p.titleEn, fr: p.titleFr },
    description: { en: p.descriptionEn, fr: p.descriptionFr },
    type: { en: p.typeEn || "", fr: p.typeFr || "" },
    services: { en: p.servicesEn || [], fr: p.servicesFr || [] },
    location: p.location || "",
    year: p.year || null,
    coverImage: p.coverImage || (p.gallery && p.gallery[0]) || "",
    gallery: p.gallery || [],
    featured: Boolean(p.featured),
    order: p.order ?? 0,
    category: category
      ? { slug: category.slug, name: { en: category.nameEn, fr: category.nameFr } }
      : { slug: categorySlug || "", name: { en: "", fr: "" } },
  };
}

function serializeCategory(c) {
  return { slug: c.slug, name: { en: c.nameEn, fr: c.nameFr }, order: c.order ?? 0 };
}

// ---- Sample fallback helpers ---------------------------------------------

function sampleAll() {
  return [...sampleProjects]
    .sort((a, b) => a.order - b.order)
    .map((p) => serializeProject(p, sampleCategories));
}

// ---- Public API -----------------------------------------------------------

export async function getCategories() {
  if (isDbEnabled) {
    try {
      const rows = await prisma.category.findMany({ orderBy: { order: "asc" } });
      if (rows.length) return rows.map(serializeCategory);
    } catch (e) {
      console.warn("[aura360lab] getCategories fell back to sample data:", e?.message);
    }
  }
  return [...sampleCategories].sort((a, b) => a.order - b.order).map(serializeCategory);
}

export async function getProjects({ category, featured } = {}) {
  if (isDbEnabled) {
    try {
      const rows = await prisma.project.findMany({
        where: {
          ...(featured ? { featured: true } : {}),
          ...(category ? { category: { slug: category } } : {}),
        },
        include: { category: true },
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      });
      return rows.map((r) => serializeProject(r));
    } catch (e) {
      console.warn("[aura360lab] getProjects fell back to sample data:", e?.message);
    }
  }
  let list = sampleAll();
  if (featured) list = list.filter((p) => p.featured);
  if (category) list = list.filter((p) => p.category.slug === category);
  return list;
}

export async function getFeaturedProjects(limit = 6) {
  const list = await getProjects({ featured: true });
  return list.slice(0, limit);
}

export async function getProjectBySlug(slug) {
  if (isDbEnabled) {
    try {
      const row = await prisma.project.findUnique({
        where: { slug },
        include: { category: true },
      });
      if (row) return serializeProject(row);
    } catch (e) {
      console.warn("[aura360lab] getProjectBySlug fell back to sample data:", e?.message);
    }
  }
  const found = sampleProjects.find((p) => p.slug === slug);
  return found ? serializeProject(found, sampleCategories) : null;
}

export async function getRelatedProjects(slug, categorySlug, limit = 3) {
  const all = await getProjects({});
  return all
    .filter((p) => p.slug !== slug && p.category.slug === categorySlug)
    .slice(0, limit);
}

export async function getAllProjectSlugs() {
  const all = await getProjects({});
  return all.map((p) => p.slug);
}
