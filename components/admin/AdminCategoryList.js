"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const EMPTY = { slug: "", nameEn: "", nameFr: "", order: 0 };

const fieldClass =
  "w-full border-b border-line bg-transparent py-2 text-sm text-ink placeholder:text-ash/60 transition-colors focus:border-ink focus:outline-none";
const labelClass = "annotation mb-1.5 block text-ash";

function CategoryFields({ dict, form, setForm, slugTouched, setSlugTouched }) {
  const onNameEn = (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, nameEn: val, slug: slugTouched ? f.slug : slugify(val) }));
  };
  return (
    <div className="grid gap-5 sm:grid-cols-4">
      <div>
        <label className={labelClass}>{dict.nameEn}</label>
        <input required value={form.nameEn} onChange={onNameEn} className={fieldClass} />
      </div>
      <div>
        <label className={labelClass}>{dict.nameFr}</label>
        <input
          required
          value={form.nameFr}
          onChange={(e) => setForm((f) => ({ ...f, nameFr: e.target.value }))}
          className={fieldClass}
        />
      </div>
      <div>
        <label className={labelClass}>{dict.slug}</label>
        <input
          required
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true);
            const val = slugify(e.target.value);
            setForm((f) => ({ ...f, slug: val }));
          }}
          className={`${fieldClass} font-mono`}
        />
      </div>
      <div>
        <label className={labelClass}>{dict.order}</label>
        <input
          type="number"
          value={form.order}
          onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
          className={fieldClass}
        />
      </div>
    </div>
  );
}

export default function AdminCategoryList({ locale, dict, categories, canEdit }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = create mode
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(editingId);

  const startEdit = (c) => {
    setEditingId(c.id);
    setSlugTouched(true);
    setForm({ slug: c.slug, nameEn: c.nameEn, nameFr: c.nameFr, order: c.order });
    setError("");
  };

  const reset = () => {
    setEditingId(null);
    setSlugTouched(false);
    setForm(EMPTY);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(isEdit ? `/api/categories/${editingId}` : "/api/categories", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed");
      reset();
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm(dict.confirmDelete)) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Delete failed");
      if (editingId === id) reset();
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {canEdit && (
        <form onSubmit={submit} className="border hairline bg-mist/30 p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="annotation text-blueprint">
              {isEdit ? dict.save : dict.newCategory}
            </span>
            {isEdit ? (
              <button
                type="button"
                onClick={reset}
                className="flex h-7 w-7 items-center justify-center rounded-full text-ash transition-colors hover:bg-mist hover:text-ink"
                aria-label="Cancel"
              >
                <X size={14} strokeWidth={2} />
              </button>
            ) : null}
          </div>
          <CategoryFields
            dict={dict}
            form={form}
            setForm={setForm}
            slugTouched={slugTouched}
            setSlugTouched={setSlugTouched}
          />
          <button type="submit" disabled={busy} className="btn-primary mt-6 disabled:opacity-60">
            {!isEdit && <Plus size={15} strokeWidth={2} />}
            {isEdit ? dict.save : dict.add}
          </button>
        </form>
      )}

      {error ? <p className="mt-4 text-sm text-blueprint">{error}</p> : null}

      {!categories.length ? (
        <p className="py-16 text-graphite/70">{dict.empty}</p>
      ) : (
        <div className="mt-8 border-t hairline">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-4 border-b hairline py-4">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-base font-semibold uppercase tracking-tightest text-ink">
                  {locale === "fr" ? c.nameFr : c.nameEn}
                </h3>
                <p className="annotation mt-1 text-ash">
                  {c.slug}
                  {` / ${c.projectCount} ${dict.projectsCount}`}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(c)}
                  disabled={!canEdit || busy}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ash transition-colors hover:bg-mist hover:text-ink disabled:opacity-40"
                  title={dict.save}
                >
                  <Pencil size={16} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  disabled={!canEdit || busy}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ash transition-colors hover:bg-mist hover:text-blueprint disabled:opacity-40"
                  title={dict.confirmDelete}
                >
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
