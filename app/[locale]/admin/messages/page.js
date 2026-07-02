import { getDictionary } from "@/i18n/dictionaries";
import prisma, { isDbEnabled } from "@/lib/prisma";
import AdminMessageList from "@/components/admin/AdminMessageList";
import DbBanner from "@/components/admin/DbBanner";
import SignOutButton from "@/components/admin/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  const messages = isDbEnabled
    ? await prisma.message.findMany({ orderBy: { createdAt: "desc" } })
    : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
            {dict.admin.messages.title}
          </h1>
          <p className="annotation mt-2 text-ash">{dict.admin.messages.subtitle}</p>
        </div>
        <SignOutButton locale={locale} label={dict.admin.signOut} />
      </div>

      {!isDbEnabled && (
        <DbBanner>
          Set <code className="font-mono text-[13px]">DATABASE_URL</code>, run the Prisma
          migration, then restart to receive contact messages here.
        </DbBanner>
      )}

      <div className="mt-10">
        <AdminMessageList dict={dict.admin.messages} messages={messages} canEdit={isDbEnabled} />
      </div>
    </div>
  );
}
