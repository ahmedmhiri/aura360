import { describe, it, expect } from "vitest";
import { toProjectData, validateProjectData } from "@/lib/project-input";
import { serializeProject } from "@/lib/projects";

// A realistic admin-form payload (services as comma strings, year/order as
// strings — exactly what the form submits).
const formInput = {
  slug: "  meridian-house ",
  titleEn: " Meridian House ",
  titleFr: "Maison Méridien",
  descriptionEn: "A private residence.",
  descriptionFr: "Une résidence privée.",
  typeEn: "Private residence",
  typeFr: "Résidence privée",
  location: "Doha, Qatar",
  year: "2025",
  coverImage: "/uploads/cover.jpg",
  coverImage360: true,
  gallery: ["/uploads/1.jpg", "/uploads/2.jpg"],
  panoramas: ["/uploads/pano-1.jpg"],
  servicesEn: "Architecture, Interior Design",
  servicesFr: ["Architecture", "Design d'intérieur"],
  featured: true,
  order: "3",
  categoryId: "cat_1",
};

describe("toProjectData", () => {
  it("normalizes strings, numbers and arrays", () => {
    const data = toProjectData(formInput);
    expect(data.slug).toBe("meridian-house");
    expect(data.titleEn).toBe("Meridian House");
    expect(data.year).toBe(2025);
    expect(data.order).toBe(3);
    expect(data.servicesEn).toEqual(["Architecture", "Interior Design"]);
    expect(data.servicesFr).toEqual(["Architecture", "Design d'intérieur"]);
    expect(data.categoryId).toBe("cat_1");
  });

  it("preserves 360 fields (regression: edits must not wipe panoramas)", () => {
    const data = toProjectData(formInput);
    expect(data.coverImage360).toBe(true);
    expect(data.panoramas).toEqual(["/uploads/pano-1.jpg"]);
    expect(data.gallery).toEqual(["/uploads/1.jpg", "/uploads/2.jpg"]);
  });

  it("defaults published to true when the field is absent", () => {
    expect(toProjectData(formInput).published).toBe(true);
  });

  it("respects an explicit published: false", () => {
    expect(toProjectData({ ...formInput, published: false }).published).toBe(false);
  });

  it("coerces empty/invalid year to null", () => {
    expect(toProjectData({ ...formInput, year: "" }).year).toBeNull();
    expect(toProjectData({ ...formInput, year: "abc" }).year).toBeNull();
  });

  it("trims the client name and defaults it to empty (anonymous)", () => {
    expect(toProjectData({ ...formInput, clientName: "  Café Dose SARL " }).clientName).toBe(
      "Café Dose SARL"
    );
    expect(toProjectData(formInput).clientName).toBe("");
    expect(serializeProject({ ...toProjectData(formInput), categorySlug: "x" }).clientName).toBe("");
  });
});

describe("validateProjectData", () => {
  it("accepts a valid payload", () => {
    expect(validateProjectData(toProjectData(formInput))).toBeNull();
  });

  it("rejects a bad slug", () => {
    const data = toProjectData({ ...formInput, slug: "Bad Slug!" });
    expect(validateProjectData(data)).toMatch(/slug/i);
  });

  it("requires at least one title", () => {
    const data = toProjectData({ ...formInput, titleEn: "", titleFr: "" });
    expect(validateProjectData(data)).toMatch(/title/i);
  });

  it("requires a category when asked to", () => {
    const data = toProjectData({ ...formInput, categoryId: "" });
    expect(validateProjectData(data, { requireCategory: true })).toMatch(/category/i);
  });
});

describe("toProjectData → serializeProject round-trip", () => {
  // Simulate what Prisma returns after a create/update: the normalized data
  // plus row metadata and the joined category.
  const dbRow = (input = formInput) => ({
    ...toProjectData(input),
    id: "proj_1",
    category: { slug: "architecture", nameEn: "Architecture", nameFr: "Architecture" },
  });

  it("keeps every image field intact through the full cycle", () => {
    const p = serializeProject(dbRow());
    expect(p.coverImage).toBe("/uploads/cover.jpg");
    expect(p.coverImage360).toBe(true);
    expect(p.gallery).toEqual(["/uploads/1.jpg", "/uploads/2.jpg"]);
    expect(p.panoramas).toEqual(["/uploads/pano-1.jpg"]);
  });

  it("keeps project videos through the full cycle and defaults to none", () => {
    const videos = ["https://x.public.blob.vercel-storage.com/videos/projects/a.mp4"];
    expect(serializeProject(dbRow({ ...formInput, videos })).videos).toEqual(videos);
    expect(serializeProject(dbRow()).videos).toEqual([]);
  });

  it("groups localized fields as { en, fr }", () => {
    const p = serializeProject(dbRow());
    expect(p.title).toEqual({ en: "Meridian House", fr: "Maison Méridien" });
    expect(p.services.en).toEqual(["Architecture", "Interior Design"]);
    expect(p.category.name).toEqual({ en: "Architecture", fr: "Architecture" });
  });

  it("carries the published flag, defaulting legacy rows to true", () => {
    expect(serializeProject(dbRow()).published).toBe(true);
    expect(serializeProject(dbRow({ ...formInput, published: false })).published).toBe(false);
    // Sample/legacy rows without the column count as published.
    const legacy = dbRow();
    delete legacy.published;
    expect(serializeProject(legacy).published).toBe(true);
  });

  it("resolves the category from a list when only categorySlug is present (sample data path)", () => {
    const categories = [{ slug: "interior", nameEn: "Interior Design", nameFr: "Design d'intérieur" }];
    const sample = { ...toProjectData(formInput), categorySlug: "interior" };
    delete sample.category;
    const p = serializeProject(sample, categories);
    expect(p.category.slug).toBe("interior");
    expect(p.category.name.fr).toBe("Design d'intérieur");
  });
});
