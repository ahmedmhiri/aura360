"use client";

import { useState } from "react";
import { ChevronDown, Mail, Trash2 } from "lucide-react";

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMessageList({ dict, messages: initial, canEdit }) {
  const [messages, setMessages] = useState(initial);
  const [openId, setOpenId] = useState(null);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState(null);

  const toggleOpen = (id) => setOpenId((cur) => (cur === id ? null : id));

  const setRead = async (id, read) => {
    setPendingId(id);
    setError("");
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Update failed");
      setMessages((m) => m.map((x) => (x.id === id ? { ...x, read } : x)));
    } catch (e) {
      setError(e.message);
    } finally {
      setPendingId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm(dict.confirmDelete)) return;
    setPendingId(id);
    setError("");
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Delete failed");
      setMessages((m) => m.filter((x) => x.id !== id));
      if (openId === id) setOpenId(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setPendingId(null);
    }
  };

  if (!messages.length) {
    return <p className="py-16 text-graphite/70">{dict.empty}</p>;
  }

  return (
    <div>
      {error ? <p className="mb-4 text-sm text-blueprint">{error}</p> : null}
      <div className="border-t hairline">
        {messages.map((m) => {
          const open = openId === m.id;
          const busy = pendingId === m.id;
          return (
            <div key={m.id} className="border-b hairline">
              <button
                type="button"
                onClick={() => toggleOpen(m.id)}
                className="flex w-full items-center gap-4 py-4 text-left"
              >
                {!m.read ? (
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-blueprint"
                    title={dict.unread}
                  />
                ) : (
                  <span className="h-2 w-2 shrink-0" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="truncate font-display text-base font-semibold uppercase tracking-tightest text-ink">
                      {m.name}
                    </h3>
                    <span className="annotation truncate text-ash">{m.email}</span>
                  </div>
                  <p className="annotation mt-1 truncate text-ash">
                    {m.subject || dict.noSubject}
                  </p>
                </div>

                <span className="annotation shrink-0 text-ash">{formatDate(m.createdAt)}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.75}
                  className={`shrink-0 text-ash transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open ? (
                <div className="pb-5 pl-6">
                  <p className="max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-graphite/90">
                    {m.body}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-5">
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent(
                        m.subject ? `Re: ${m.subject}` : ""
                      )}`}
                      className="inline-flex items-center gap-2 py-3 font-mono text-[12px] uppercase tracking-annotation text-blueprint"
                    >
                      <Mail size={14} strokeWidth={1.75} />
                      {dict.reply}
                    </a>
                    <button
                      type="button"
                      disabled={!canEdit || busy}
                      onClick={() => setRead(m.id, !m.read)}
                      className="py-3 font-mono text-[12px] uppercase tracking-annotation text-ash transition-colors hover:text-ink disabled:opacity-40"
                    >
                      {m.read ? dict.markUnread : dict.markRead}
                    </button>
                    <button
                      type="button"
                      disabled={!canEdit || busy}
                      onClick={() => remove(m.id)}
                      className="inline-flex items-center gap-2 py-3 font-mono text-[12px] uppercase tracking-annotation text-ash transition-colors hover:text-blueprint disabled:opacity-40"
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                      {dict.delete}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
