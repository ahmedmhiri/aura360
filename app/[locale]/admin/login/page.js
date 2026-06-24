import { getDictionary } from "@/i18n/dictionaries";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <span className="annotation text-blueprint">{dict.admin.title}</span>
        <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-tightest text-ink">
          {dict.admin.login}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-graphite/80">
          {dict.admin.subtitle}
        </p>
        <div className="mt-8">
          <LoginForm locale={locale} dict={dict.admin} />
        </div>
      </div>
    </div>
  );
}
