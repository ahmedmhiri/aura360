import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";

export const metadata = {
  title: "Studio admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children, params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);

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
