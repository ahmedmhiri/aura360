// Normalizes a project payload coming from the admin form into the shape
// Prisma expects. Accepts services/gallery as arrays or comma-separated
// strings, coerces year/order to numbers, and trims text.

function toArray(value) {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string")
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

function toInt(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

export function toProjectData(input = {}) {
  const data = {
    slug: String(input.slug || "").trim(),
    titleEn: String(input.titleEn || "").trim(),
    titleFr: String(input.titleFr || "").trim(),
    descriptionEn: String(input.descriptionEn || ""),
    descriptionFr: String(input.descriptionFr || ""),
    typeEn: String(input.typeEn || "").trim(),
    typeFr: String(input.typeFr || "").trim(),
    location: String(input.location || "").trim(),
    year: toInt(input.year),
    coverImage: String(input.coverImage || "").trim(),
    coverImage360: Boolean(input.coverImage360),
    gallery: toArray(input.gallery),
    panoramas: toArray(input.panoramas),
    servicesEn: toArray(input.servicesEn),
    servicesFr: toArray(input.servicesFr),
    featured: Boolean(input.featured),
    // Absent means published (older clients / partial payloads must not
    // silently unpublish a project).
    published: input.published === undefined ? true : Boolean(input.published),
    order: toInt(input.order) ?? 0,
  };
  if (input.categoryId) data.categoryId = String(input.categoryId);
  return data;
}

// Basic validation shared by create/update. Returns an error string or null.
export function validateProjectData(data, { requireCategory = true } = {}) {
  if (!data.slug) return "A slug is required.";
  if (!/^[a-z0-9-]+$/.test(data.slug))
    return "Slug may only contain lowercase letters, numbers and hyphens.";
  if (!data.titleEn && !data.titleFr) return "At least one title is required.";
  if (requireCategory && !data.categoryId) return "A category is required.";
  return null;
}
