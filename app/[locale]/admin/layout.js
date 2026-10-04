import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { isAuthenticated } from "@/lib/auth";
import prisma, { isDbEnabled } from "@/lib/prisma";
import Logo from "@/components/Logo";

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
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-1 px-5 py-4 sm:flex-nowrap sm:px-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-ink"
          >
            <Logo className="h-6 w-auto" title="AURA360LAB" />
            <span className="ml-3 font-mono text-[11px] font-normal uppercase tracking-annotation text-ash">
              {dict.admin.title}
            </span>
          </Link>

          {authed ? (
            // On phones the menu drops to its own scrollable row under the logo
            // (it used to be hidden there, leaving Videos/Messages unreachable).
            <nav className="order-last -mx-5 flex w-[calc(100%+2.5rem)] items-center gap-6 overflow-x-auto px-5 sm:order-none sm:mx-0 sm:w-auto sm:overflow-visible sm:px-0 [&>a]:shrink-0 [&>a]:py-3 sm:[&>a]:py-0">
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
            className="-my-3 inline-flex items-center gap-1.5 py-3 font-mono text-[12px] uppercase tracking-annotation text-ash transition-colors hover:text-ink"
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
