import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import {
  getProjectBySlug,
  getRelatedProjects,
  getProjects,
  getAllProjectSlugs,
} from "@/lib/projects";
import { pick } from "@/i18n/config";
import { Reveal } from "@/components/motion";
import Gallery from "@/components/Gallery";
import PanoramaGallery from "@/components/PanoramaGallery";
import ProjectCard from "@/components/ProjectCard";
import Pano360 from "@/components/Pano360";

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = params;
  const dict = await getDictionary(locale);
  const project = await getProjectBySlug(slug);
  if (!project) return { title: dict.project.backToPortfolio };

  const title = pick(project.title, locale);
  const description = pick(project.description, locale).slice(0, 160);
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/portfolio/${slug}`,
      languages: {
        en: `/en/portfolio/${slug}`,
        fr: `/fr/portfolio/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
  };
}

function MetaRow({ label, children }) {
  if (!children) return null;
  return (
    <div className="flex flex-col gap-1 border-t hairline py-4">
      <span className="annotation text-ash">{label}</span>
      <span className="text-sm text-ink">{children}</span>
    </div>
  );
}

export default async function ProjectDetailPage({ params }) {
  const { locale, slug } = params;
  const dict = await getDictionary(locale);
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [related, all] = await Promise.all([
    getRelatedProjects(slug, project.category.slug, 3),
    getProjects({}),
  ]);

  // Determine the "next project" by walking the full ordered list.
  const idx = all.findIndex((p) => p.slug === slug);
  const nextProject = all.length > 1 ? all[(idx + 1) % all.length] : null;

  const title = pick(project.title, locale);
  const description = pick(project.description, locale);
  const type = pick(project.type, locale);
  const categoryName = pick(project.category?.name, locale);
  const services = project.services?.[locale] || [];
  const galleryImages = project.gallery?.length
    ? project.gallery
    : project.coverImage
    ? [project.coverImage]
    : [];

  return (
    <article className="pt-28 sm:pt-32">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <Reveal>
          <Link href={`/${locale}/portfolio`} className="link-underline text-graphite">
            <ArrowLeft size={15} strokeWidth={1.75} />
            {dict.project.backToPortfolio}
          </Link>
        </Reveal>

        <header className="mt-10 flex flex-col gap-6 border-b hairline pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <span className="annotation text-blueprint">{categoryName}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold uppercase leading-[0.98] tracking-tightest text-ink sm:text-6xl md:text-7xl">
                {title}
              </h1>
            </Reveal>
          </div>
          {project.year ? (
            <Reveal delay={0.1}>
              <span className="annotation text-ash">{project.year}</span>
            </Reveal>
          ) : null}
        </header>
      </div>

      {/* Cover */}
      {project.coverImage ? (
        <div className="mx-auto mt-10 max-w-site px-5 sm:px-8">
          <Reveal y={24}>
            <div className="plate relative aspect-[16/10] w-full overflow-hidden bg-mist text-bone/70">
              {project.coverImage360 ? (
                <Pano360 src={project.coverImage} className="absolute inset-0 h-full w-full" />
              ) : (
                <Image
                  src={project.coverImage}
                  alt={title}
                  fill
                  priority
                  sizes="(min-width: 1480px) 1480px, 100vw"
                  unoptimized={project.coverImage.startsWith("data:")}
                  className="object-cover"
                />
              )}
            </div>
          </Reveal>
        </div>
      ) : null}

      {/* Overview + meta */}
      <div className="mx-auto mt-16 max-w-site px-5 sm:px-8 md:mt-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Reveal>
              <span className="annotation text-blueprint">{dict.project.overview}</span>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-graphite/90 sm:text-lg">
                {description.split("\n").map((para, i) =>
                  para.trim() ? <p key={i}>{para}</p> : null
                )}
              </div>
            </Reveal>
          </div>

          <aside className="md:col-span-5 md:pl-8">
            <Reveal delay={0.1}>
              <div>
                <MetaRow label={dict.project.category}>{categoryName}</MetaRow>
                <MetaRow label={dict.project.type}>{type}</MetaRow>
                <MetaRow label={dict.project.location}>{project.location}</MetaRow>
                <MetaRow label={dict.project.year}>{project.year}</MetaRow>
                {services.length ? (
                  <div className="flex flex-col gap-2 border-y hairline py-4">
                    <span className="annotation text-ash">{dict.project.services}</span>
                    <ul className="flex flex-col gap-1">
                      {services.map((s) => (
                        <li key={s} className="text-sm text-ink">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </Reveal>
          </aside>
        </div>
      </div>

      {/* 360° Panoramas */}
      {project.panoramas?.length ? (
        <div className="mx-auto mt-20 max-w-site px-5 sm:px-8 md:mt-28">
          <Reveal>
            <span className="annotation text-blueprint">{dict.project.panoramas}</span>
          </Reveal>
          <div className="mt-8">
            <PanoramaGallery images={project.panoramas} title={title} />
          </div>
        </div>
      ) : null}

      {/* Gallery */}
      {galleryImages.length ? (
        <div className="mx-auto mt-20 max-w-site px-5 sm:px-8 md:mt-28">
          <Reveal>
            <span className="annotation text-blueprint">{dict.project.gallery}</span>
          </Reveal>
          <div className="mt-8">
            <Gallery images={galleryImages} title={title} />
          </div>
        </div>
      ) : null}

      {/* Related */}
      {related.length ? (
        <div className="mx-auto mt-24 max-w-site px-5 sm:px-8 md:mt-32">
          <span className="annotation text-blueprint">{dict.project.related}</span>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <ProjectCard project={p} locale={locale} index={i} aspect="portrait" />
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}

      {/* Next project */}
      {nextProject ? (
        <Link
          href={`/${locale}/portfolio/${nextProject.slug}`}
          className="group mt-24 block border-t hairline bg-ink text-bone md:mt-32"
        >
          <div className="mx-auto flex max-w-site items-center justify-between gap-6 px-5 py-16 sm:px-8 md:py-24">
            <div>
              <span className="annotation text-blueprint-soft">{dict.project.nextProject}</span>
              <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-tightest text-bone sm:text-5xl md:text-6xl">
                {pick(nextProject.title, locale)}
              </h2>
            </div>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-bone/40 text-bone transition-all duration-500 group-hover:bg-bone group-hover:text-ink">
              <ArrowRight size={22} strokeWidth={1.5} />
            </span>
          </div>
        </Link>
      ) : null}
    </article>
  );
}
