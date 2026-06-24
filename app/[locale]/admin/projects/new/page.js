import { getDictionary } from "@/i18n/dictionaries";
import prisma, { isDbEnabled } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";
import DbNotice from "@/components/admin/DbNotice";

export const dynamic = "force-dynamic";
export const metadata = { title: "New project", robots: { index: false, follow: false } };

export default async function NewProjectPage({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);

  if (!isDbEnabled) return <DbNotice locale={locale} dict={dict} />;

  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
        {dict.admin.newProject}
      </h1>
      <ProjectForm locale={locale} dict={dict.admin} categories={categories} />
    </div>
  );
}
