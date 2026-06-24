import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import prisma, { isDbEnabled } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";
import DbNotice from "@/components/admin/DbNotice";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit project", robots: { index: false, follow: false } };

export default async function EditProjectPage({ params }) {
  const { locale, id } = params;
  const dict = await getDictionary(locale);

  if (!isDbEnabled) return <DbNotice locale={locale} dict={dict} />;

  const [project, categories] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!project) notFound();

  const initial = {
    id: project.id,
    slug: project.slug,
    titleEn: project.titleEn,
    titleFr: project.titleFr,
    descriptionEn: project.descriptionEn,
    descriptionFr: project.descriptionFr,
    typeEn: project.typeEn,
    typeFr: project.typeFr,
    location: project.location,
    year: project.year ?? "",
    coverImage: project.coverImage,
    gallery: project.gallery || [],
    servicesEn: project.servicesEn || [],
    servicesFr: project.servicesFr || [],
    featured: project.featured,
    order: project.order ?? 0,
    categoryId: project.categoryId,
  };

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
        {project.titleEn || project.titleFr}
      </h1>
      <ProjectForm
        locale={locale}
        dict={dict.admin}
        categories={categories}
        initial={initial}
        projectId={project.id}
      />
    </div>
  );
}
