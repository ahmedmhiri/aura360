import Link from "next/link";
import { Plus } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { getProjects } from "@/lib/projects";
import { isDbEnabled } from "@/lib/prisma";
import AdminProjectList from "@/components/admin/AdminProjectList";
import DbBanner from "@/components/admin/DbBanner";
import SignOutButton from "@/components/admin/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  const projects = await getProjects({});

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
            {dict.admin.projects}
          </h1>
          <p className="annotation mt-2 text-ash">{dict.admin.subtitle}</p>
        </div>
        <div className="flex items-center gap-5">
          <SignOutButton locale={locale} label={dict.admin.signOut} />
          <Link
            href={`/${locale}/admin/projects/new`}
            aria-disabled={!isDbEnabled}
            className={`btn-primary ${isDbEnabled ? "" : "pointer-events-none opacity-40"}`}
          >
            <Plus size={15} strokeWidth={2} />
            {dict.admin.newProject}
          </Link>
        </div>
      </div>

      {!isDbEnabled && (
        <DbBanner>
          You are viewing read-only sample data. Set <code className="font-mono text-[13px]">DATABASE_URL</code>,
          run the Prisma migration and seed, then restart to create, edit and
          delete projects here.
        </DbBanner>
      )}

      <div className="mt-10">
        <AdminProjectList
          locale={locale}
          dict={dict.admin}
          projects={projects}
          canEdit={isDbEnabled}
        />
      </div>
    </div>
  );
}
