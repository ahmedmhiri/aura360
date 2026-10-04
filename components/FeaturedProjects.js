import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import ProjectCard from "@/components/ProjectCard";

// Even grid of equal portrait cards, all aligned. (Row-spanning cards left
// large empty holes with six projects, under the first card and beside the
// last; a staggered middle column was rejected by the studio.)
export default function FeaturedProjects({ locale, dict, projects }) {
  if (!projects?.length) return null;

  return (
    <section className="border-t hairline bg-bone">
      <div className="mx-auto max-w-site px-5 py-24 sm:px-8 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="annotation text-blueprint">{dict.eyebrow}</span>
            <h2 className="mt-4 font-display text-3xl font-semibold uppercase tracking-tightest text-ink sm:text-4xl md:text-5xl">
              {dict.title}
            </h2>
          </div>
          <Link href={`/${locale}/portfolio`} className="link-underline text-ink">
            {dict.viewAll}
            <ArrowRight size={15} strokeWidth={1.75} />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <ProjectCard project={p} locale={locale} index={i} aspect="portrait" priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
