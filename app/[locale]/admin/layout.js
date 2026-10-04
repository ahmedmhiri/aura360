import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { isAuthenticated } from "@/lib/auth";
import prisma, { isDbEnabled } from "@/lib/prisma";

export const metadata = {
  title: "Studio admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children, params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  const authed = isAuthenticated();
  const unreadCount =
    authed && isDbEnabled ? await prisma.message.count({ where: { read: false } }) : 0;

  return (
    <div className="min-h-screen bg-bone">
      <header className="border-b hairline">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href={`/${locale}`}
            className="font-display text-base font-bold uppercase tracking-tightest text-ink"
          >
            AURA<span className="text-blueprint">360</span>LAB
            <span className="ml-3 align-middle font-mono text-[11px] font-normal uppercase tracking-annotation text-ash">
              {dict.admin.title}
            </span>
          </Link>

          {authed ? (
            <nav className="hidden items-center gap-6 sm:flex">
              <Link
                href={`/${locale}/admin`}
                className="font-mono text-[12px] uppercase tracking-annotation text-ash transition-colors hover:text-ink"
              >
                {dict.admin.projects}
              </Link>
              <Link
                href={`/${locale}/admin/categories`}
                className="font-mono text-[12px] uppercase tracking-annotation text-ash transition-colors hover:text-ink"
              >
                {dict.admin.categories}
              </Link>
              <Link
                href={`/${locale}/admin/videos`}
                className="font-mono text-[12px] uppercase tracking-annotation text-ash transition-colors hover:text-ink"
              >
                {dict.admin.videos.title}
              </Link>
              <Link
                href={`/${locale}/admin/messages`}
                className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-annotation text-ash transition-colors hover:text-ink"
              >
                {dict.admin.messages.title}
                {unreadCount > 0 ? (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blueprint px-1.5 font-mono text-[10px] text-bone">
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            </nav>
          ) : null}

          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-annotation text-ash transition-colors hover:text-ink"
          >
            View site
            <ArrowUpRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 md:py-16">{children}</div>
    </div>
  );
}
