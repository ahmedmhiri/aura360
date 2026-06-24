"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function LoginForm({ locale, dict }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || dict.loginError);
      router.push(`/${locale}/admin`);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <label className="annotation mb-2 block text-ash" htmlFor="password">
        {dict.password}
      </label>
      <input
        id="password"
        type="password"
        autoFocus
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={dict.passwordPlaceholder}
        className="w-full border-b border-line bg-transparent py-3 text-base text-ink placeholder:text-ash/60 transition-colors focus:border-ink focus:outline-none"
      />
      {error ? <p className="mt-3 text-sm text-blueprint">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary mt-7 w-full disabled:opacity-60"
      >
        {status === "loading" ? dict.saving : dict.loginButton}
        {status !== "loading" && <ArrowRight size={15} strokeWidth={1.75} />}
      </button>
    </form>
  );
}
