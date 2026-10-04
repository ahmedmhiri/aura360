"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { pick } from "@/i18n/config";

export default function PortfolioGrid({
  projects,
  categories: allCategories,
  locale,
  dict,
  initialCategory = "all",
}) {
  const reduce = useReducedMotion();
  // Hide filter tabs that would show an empty grid.
  const categories = allCategories.filter((c) =>
    projects.some((p) => p.category.slug === c.slug)
  );
  const [active, setActive] = useState(
    categories.some((c) => c.slug === initialCategory) ? initialCategory : "all"
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const inCategory = active === "all" || p.category.slug === active;
      if (!inCategory) return false;
      if (!q) return true;
      const haystack = [
        pick(p.title, locale),
        pick(p.type, locale),
        p.location,
        pick(p.category.name, locale),
        ...(p.services[locale] || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, active, query, locale]);

  const tabs = [{ slug: "all", name: dict.all }, ...categories.map((c) => ({ slug: c.slug, name: pick(c.name, locale) }))];

  const count = filtered.length;
  const countLabel = `${count} ${count === 1 ? dict.resultsOne : dict.resultsMany}`;

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-6 border-y hairline py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="-my-3 flex flex-wrap items-center gap-x-7" role="tablist" aria-label="Filter by category">
          {tabs.map((t) => (
            <button
              key={t.slug}
              type="button"
              role="tab"
              aria-selected={active === t.slug}
              onClick={() => setActive(t.slug)}
              className={`relative py-3 font-mono text-[12px] uppercase tracking-annotation transition-opacity ${
                active === t.slug ? "text-ink opacity-100" : "text-ash opacity-70 hover:opacity-100"
              }`}
            >
              {t.name}
              {active === t.slug && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-1.5 left-0 h-px w-full bg-ink"
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 border-b border-line pb-2 lg:w-72">
          <Search size={16} strokeWidth={1.5} className="text-ash" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.searchPlaceholder}
            aria-label={dict.searchPlaceholder}
            className="w-full bg-transparent font-mono text-base uppercase tracking-wide text-ink placeholder:text-ash/70 focus:outline-none sm:text-[13px]"
          />
        </div>
      </div>

      <p className="annotation mt-5 text-ash">{countLabel}</p>

      {/* Grid */}
      {count === 0 ? (
        <p className="py-24 text-center text-lg text-graphite/70">{dict.empty}</p>
      ) : (
        <motion.div
          layout
          className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={p} locale={locale} index={i} aspect="portrait" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
