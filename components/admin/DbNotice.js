import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Shown on create/edit screens when no database is connected, since those
// actions require persistence.
export default function DbNotice({ locale, dict }) {
  return (
    <div>
      <Link href={`/${locale}/admin`} className="link-underline text-graphite">
        <ArrowLeft size={15} strokeWidth={1.75} />
        {dict.admin.cancel}
      </Link>
      <div className="mt-8 max-w-xl border-l-2 border-blueprint bg-mist/50 p-6">
        <h2 className="font-display text-xl font-semibold uppercase tracking-tightest text-ink">
          Database required
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-graphite">
          Creating and editing projects needs a database. Set{" "}
          <code className="font-mono text-[13px]">DATABASE_URL</code>, run{" "}
          <code className="font-mono text-[13px]">npx prisma migrate dev</code> and{" "}
          <code className="font-mono text-[13px]">npm run db:seed</code>, then
          restart the dev server.
        </p>
      </div>
    </div>
  );
}
