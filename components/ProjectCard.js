import Link from "next/link";
import Image from "next/image";
import { pick } from "@/i18n/config";

/**
 * Project plate. CSS-only hover (works in both server and client trees).
 * `aspect` controls the frame ratio so grids can stagger heights.
 */
export default function ProjectCard({
  project,
  locale,
  index = 0,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  aspect = "portrait",
  className = "",
}) {
  const title = pick(project.title, locale);
  const category = pick(project.category?.name, locale);
  const ratio =
    aspect === "tall"
      ? "aspect-[3/4.4]"
      : aspect === "landscape"
      ? "aspect-[4/3]"
      : "aspect-[4/5]";

  return (
    <Link
      href={`/${locale}/portfolio/${project.slug}`}
      className={`group block ${className}`}
    >
      <div className={`relative w-full overflow-hidden bg-mist ${ratio}`}>
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={title}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.05]"
          />
        ) : null}

        <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />

        {/* Top annotation */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="annotation text-bone mix-blend-difference">{category}</span>
          <span className="annotation text-bone mix-blend-difference">
            {String(index + 1).padStart(3, "0")}
          </span>
        </div>

        {/* Corner registration tick, drawn on hover */}
        <span className="pointer-events-none absolute bottom-4 right-4 h-3.5 w-3.5 border-b border-r border-bone opacity-0 transition-opacity duration-500 group-hover:opacity-80" />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg font-semibold uppercase tracking-tightest text-ink transition-opacity">
          {title}
        </h3>
        {project.year ? (
          <span className="annotation shrink-0 text-ash">{project.year}</span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-graphite/70">{project.location}</p>
    </Link>
  );
}
