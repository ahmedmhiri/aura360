import { getDictionary } from "@/i18n/dictionaries";
import prisma, { isDbEnabled } from "@/lib/prisma";
import { sampleCategories, sampleProjects } from "@/lib/sample-data";
import AdminCategoryList from "@/components/admin/AdminCategoryList";
import DbBanner from "@/components/admin/DbBanner";
import SignOutButton from "@/components/admin/SignOutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories", robots: { index: false, follow: false } };

export default async function AdminCategoriesPage({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);

  const categories = isDbEnabled
    ? (
        await prisma.category.findMany({
          orderBy: { order: "asc" },
          include: { _count: { select: { projects: true } } },
        })
      ).map((c) => ({
        id: c.id,
        slug: c.slug,
        nameEn: c.nameEn,
        nameFr: c.nameFr,
        order: c.order,
        projectCount: c._count.projects,
      }))
    : sampleCategories.map((c) => ({
        id: c.slug,
        ...c,
        projectCount: sampleProjects.filter((p) => p.categorySlug === c.slug).length,
      }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
            {dict.admin.categoryManager.title}
          </h1>
          <p className="annotation mt-2 text-ash">{dict.admin.categoryManager.subtitle}</p>
        </div>
        <SignOutButton locale={locale} label={dict.admin.signOut} />
      </div>

      {!isDbEnabled && (
        <DbBanner>
          You are viewing read-only sample data. Set <code className="font-mono text-[13px]">DATABASE_URL</code>,
          run the Prisma migration and seed, then restart to manage categories here.
        </DbBanner>
      )}

      <div className="mt-10">
        <AdminCategoryList
          locale={locale}
          dict={dict.admin.categoryManager}
          categories={categories}
          canEdit={isDbEnabled}
        />
      </div>
    </div>
  );
}
