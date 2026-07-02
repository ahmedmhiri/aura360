"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function ProjectForm({
  locale,
  dict,
  categories = [],
  initial = null,
  projectId = null,
}) {
  const router = useRouter();
  const f = dict.fields;
  const isEdit = Boolean(projectId);

  const [form, setForm] = useState({
    titleEn: initial?.titleEn || "",
    titleFr: initial?.titleFr || "",
    slug: initial?.slug || "",
    categoryId: initial?.categoryId || categories[0]?.id || "",
    location: initial?.location || "",
    year: initial?.year || "",
    typeEn: initial?.typeEn || "",
    typeFr: initial?.typeFr || "",
    servicesEn: (initial?.servicesEn || []).join(", "),
    servicesFr: (initial?.servicesFr || []).join(", "),
    descriptionEn: initial?.descriptionEn || "",
    descriptionFr: initial?.descriptionFr || "",
    coverImage: initial?.coverImage || "",
    coverImage360: initial?.coverImage360 ?? false,
    panoramas: initial?.panoramas || [],
    gallery: initial?.gallery || [],
    featured: initial?.featured ?? false,
    published: initial?.published ?? true,
    order: initial?.order ?? 0,
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [status, setStatus] = useState("idle"); // idle | saving | error
  const [error, setError] = useState("");

  const set = (key, val) => setForm((s) => ({ ...s, [key]: val }));

  const onTitleEn = (e) => {
    const val = e.target.value;
    setForm((s) => ({
      ...s,
      titleEn: val,
      slug: slugTouched ? s.slug : slugify(val),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch(
        isEdit ? `/api/projects/${projectId}` : "/api/projects",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed");
      router.push(`/${locale}/admin`);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const field =
    "w-full border-b border-line bg-transparent py-2.5 text-base text-ink placeholder:text-ash/60 transition-colors focus:border-ink focus:outline-none";
  const labelClass = "annotation mb-2 block text-ash";

  return (
    <form onSubmit={submit} className="max-w-3xl">
      <Link href={`/${locale}/admin`} className="link-underline text-graphite">
        <ArrowLeft size={15} strokeWidth={1.75} />
        {dict.cancel}
      </Link>

      <div className="mt-8 space-y-10">
        {/* Titles */}
        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="titleEn">{f.titleEn}</label>
            <input id="titleEn" required value={form.titleEn} onChange={onTitleEn} className={field} />
          </div>
          <div>
            <label className={labelClass} htmlFor="titleFr">{f.titleFr}</label>
            <input id="titleFr" value={form.titleFr} onChange={(e) => set("titleFr", e.target.value)} className={field} />
          </div>
        </div>

        {/* Slug + category */}
        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="slug">{f.slug}</label>
            <input
              id="slug"
              required
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              className={`${field} font-mono`}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="categoryId">{f.category}</label>
            <select
              id="categoryId"
              required
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className={`${field} appearance-none`}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {locale === "fr" ? c.nameFr : c.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location / year / order */}
        <div className="grid gap-7 sm:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="location">{f.location}</label>
            <input id="location" value={form.location} onChange={(e) => set("location", e.target.value)} className={field} />
          </div>
          <div>
            <label className={labelClass} htmlFor="year">{f.year}</label>
            <input id="year" type="number" value={form.year} onChange={(e) => set("year", e.target.value)} className={field} />
          </div>
          <div>
            <label className={labelClass} htmlFor="order">Order</label>
            <input id="order" type="number" value={form.order} onChange={(e) => set("order", e.target.value)} className={field} />
          </div>
        </div>

        {/* Types */}
        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="typeEn">{f.typeEn}</label>
            <input id="typeEn" value={form.typeEn} onChange={(e) => set("typeEn", e.target.value)} className={field} />
          </div>
          <div>
            <label className={labelClass} htmlFor="typeFr">{f.typeFr}</label>
            <input id="typeFr" value={form.typeFr} onChange={(e) => set("typeFr", e.target.value)} className={field} />
          </div>
        </div>

        {/* Services */}
        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="servicesEn">{f.servicesEn}</label>
            <input id="servicesEn" value={form.servicesEn} onChange={(e) => set("servicesEn", e.target.value)} placeholder="Architecture, Interiors" className={field} />
          </div>
          <div>
            <label className={labelClass} htmlFor="servicesFr">{f.servicesFr}</label>
            <input id="servicesFr" value={form.servicesFr} onChange={(e) => set("servicesFr", e.target.value)} placeholder="Architecture, Intérieurs" className={field} />
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid gap-7">
          <div>
            <label className={labelClass} htmlFor="descriptionEn">{f.descriptionEn}</label>
            <textarea id="descriptionEn" rows={5} value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} className={`${field} resize-none`} />
          </div>
          <div>
            <label className={labelClass} htmlFor="descriptionFr">{f.descriptionFr}</label>
            <textarea id="descriptionFr" rows={5} value={form.descriptionFr} onChange={(e) => set("descriptionFr", e.target.value)} className={`${field} resize-none`} />
          </div>
        </div>

        {/* Images */}
        {/* The 360 checkbox sits above the uploader so it is set before the
            file is chosen. Covers always upload at panorama resolution anyway:
            an image downscaled at upload time can never be sharpened again,
            and non-360 covers are resized on delivery by next/image. */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.coverImage360}
            onChange={(e) => set("coverImage360", e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          <span className="text-sm text-ink">
            {f.coverImage360 || "Cover image is a 360° panorama"}
          </span>
        </label>
        <ImageUploader
          label={f.coverImage}
          value={form.coverImage}
          onChange={(v) => set("coverImage", v)}
          dict={dict}
          maxDimension={4096}
          quality={0.92}
          warnBelowWidth={form.coverImage360 ? 4000 : 0}
        />
        <ImageUploader
          label={f.panoramas || "360° Panoramas (shown before the gallery)"}
          value={form.panoramas}
          onChange={(v) => set("panoramas", v)}
          multiple
          dict={dict}
          maxDimension={4096}
          quality={0.92}
          warnBelowWidth={4000}
        />
        <ImageUploader
          label={f.gallery}
          value={form.gallery}
          onChange={(v) => set("gallery", v)}
          multiple
          dict={dict}
        />

        {/* Featured + published toggles */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          <span className="text-sm text-ink">{f.featured}</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          <span className="text-sm text-ink">{f.published}</span>
        </label>

        {error ? <p className="text-sm text-blueprint">{error}</p> : null}

        <div className="flex items-center gap-4 border-t hairline pt-8">
          <button type="submit" disabled={status === "saving"} className="btn-primary disabled:opacity-60">
            {status === "saving" ? dict.saving : dict.save}
          </button>
          <Link href={`/${locale}/admin`} className="font-mono text-[12px] uppercase tracking-annotation text-ash hover:text-ink">
            {dict.cancel}
          </Link>
        </div>
      </div>
    </form>
  );
}
