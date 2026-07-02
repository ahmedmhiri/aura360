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

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
        {project.titleEn || project.titleFr}
      </h1>
      <ProjectForm
        locale={locale}
        dict={dict.admin}
        categories={categories}
        initial={project}
        projectId={project.id}
      />
    </div>
  );
}
