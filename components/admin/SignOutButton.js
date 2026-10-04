"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function SignOutButton({ locale, label }) {
  const router = useRouter();
  const signOut = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push(`/${locale}/admin/login`);
    router.refresh();
  };
  return (
    <button
      type="button"
      onClick={signOut}
      className="-my-3 inline-flex items-center gap-2 py-3 font-mono text-[12px] uppercase tracking-annotation text-ash transition-colors hover:text-ink"
    >
      <LogOut size={14} strokeWidth={1.75} />
      {label}
    </button>
  );
}
