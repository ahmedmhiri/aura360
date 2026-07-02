"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { pick } from "@/i18n/config";

export default function AdminProjectList({ locale, dict, projects: initial, canEdit }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState(null);

  const togglePublished = async (id, published) => {
    setPendingId(id);
    setError("");
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Update failed");
      setProjects((p) => p.map((x) => (x.id === id ? { ...x, published } : x)));
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setPendingId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm(dict.confirmDelete)) return;
    setPendingId(id);
    setError("");
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Delete failed");
      setProjects((p) => p.filter((x) => x.id !== id));
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setPendingId(null);
    }
  };

  if (!projects.length) {
    return <p className="py-16 text-graphite/70">{dict.noProjects}</p>;
  }

  return (
    <div>
      {error ? <p className="mb-4 text-sm text-blueprint">{error}</p> : null}
      <div className="border-t hairline">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 border-b hairline py-4"
          >
            <div className="relative hidden h-14 w-20 shrink-0 overflow-hidden bg-mist sm:block">
              {p.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImage} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="truncate font-display text-base font-semibold uppercase tracking-tightest text-ink">
                  {pick(p.title, locale)}
                </h3>
                {p.featured ? (
                  <span className="annotation rounded-full border border-line px-2 py-0.5 text-blueprint">
                    ★
                  </span>
                ) : null}
                {!p.published ? (
                  <span className="annotation rounded-full border border-line px-2 py-0.5 text-ash">
                    {dict.draft}
                  </span>
                ) : null}
              </div>
              <p className="annotation mt-1 text-ash">
                {pick(p.category?.name, locale)}
                {p.year ? ` / ${p.year}` : ""}
                {` / ${p.slug}`}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => togglePublished(p.id, !p.published)}
                disabled={!canEdit || pendingId === p.id}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ash transition-colors hover:bg-mist hover:text-ink disabled:opacity-40"
                title={p.published ? dict.unpublish : dict.publish}
              >
                {p.published ? (
                  <Eye size={16} strokeWidth={1.5} />
                ) : (
                  <EyeOff size={16} strokeWidth={1.5} />
                )}
              </button>
              <Link
                href={`/${locale}/admin/projects/${p.id}/edit`}
                aria-disabled={!canEdit}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-ash transition-colors hover:bg-mist hover:text-ink ${
                  canEdit ? "" : "pointer-events-none opacity-40"
                }`}
                title={dict.edit}
              >
                <Pencil size={16} strokeWidth={1.5} />
              </Link>
              <button
                type="button"
                onClick={() => remove(p.id)}
                disabled={!canEdit || pendingId === p.id}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ash transition-colors hover:bg-mist hover:text-blueprint disabled:opacity-40"
                title={dict.delete}
              >
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
