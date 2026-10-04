import { getDictionary } from "@/i18n/dictionaries";
import { isDbEnabled } from "@/lib/prisma";
import { SERVICE_KEYS, getServiceVideos } from "@/lib/service-videos";
import ServiceVideoManager from "@/components/admin/ServiceVideoManager";
import DbBanner from "@/components/admin/DbBanner";
import SignOutButton from "@/components/admin/SignOutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Videos", robots: { index: false, follow: false } };

export default async function AdminVideosPage({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  const videos = await getServiceVideos();

  const services = SERVICE_KEYS.map((key) => ({
    key,
    name: dict.services.items[key].name,
    url: videos[key] || "",
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
            {dict.admin.videos.title}
          </h1>
          <p className="annotation mt-2 text-ash">{dict.admin.videos.subtitle}</p>
        </div>
        <SignOutButton locale={locale} label={dict.admin.signOut} />
      </div>

      {!isDbEnabled && (
        <DbBanner>
          Set <code className="font-mono text-[13px]">DATABASE_URL</code> and run the Prisma
          migration to upload service videos.
        </DbBanner>
      )}

      <div className="mt-10">
        <ServiceVideoManager services={services} dict={dict.admin.videos} canEdit={isDbEnabled} />
      </div>
    </div>
  );
}
