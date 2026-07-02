"use client";

import { usePathname } from "next/navigation";

// Hides its children on /[locale]/admin routes, so the public chrome (navbar,
// footer) does not appear inside the dashboard. Children are still rendered on
// the server and passed through — this only controls visibility by path.
export default function ChromeGate({ children }) {
  const pathname = usePathname() || "";
  const isAdminRoute = /^\/(en|fr)\/admin(\/|$)/.test(pathname);
  if (isAdminRoute) return null;
  return children;
}
