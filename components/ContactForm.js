"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function ContactForm({ dict }) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4 border hairline bg-bone p-8"
      >
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-bone">
          <Check size={16} strokeWidth={2} />
        </span>
        <p className="text-base leading-relaxed text-graphite">{dict.sent}</p>
      </motion.div>
    );
  }

  const fieldClass =
    "w-full border-b border-line bg-transparent py-3 text-base text-ink placeholder:text-ash/70 transition-colors focus:border-ink focus:outline-none";
  const labelClass = "annotation mb-2 block text-ash";

  return (
    <form onSubmit={submit} className="space-y-7">
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            {dict.name}
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={update("name")}
            placeholder={dict.namePlaceholder}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">
            {dict.email}
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            placeholder={dict.emailPlaceholder}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="subject">
          {dict.subject}
        </label>
        <input
          id="subject"
          value={form.subject}
          onChange={update("subject")}
          placeholder={dict.subjectPlaceholder}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="message">
          {dict.message}
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          placeholder={dict.messagePlaceholder}
          className={`${fieldClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-blueprint">{dict.error}</p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
        {status === "sending" ? dict.sending : dict.send}
        {status !== "sending" && <ArrowRight size={15} strokeWidth={1.75} />}
      </button>
    </form>
  );
}
