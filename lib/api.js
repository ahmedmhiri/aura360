import { NextResponse } from "next/server";

// Shared helpers for the API route handlers.

export const dbDisabled = () =>
  NextResponse.json(
    {
      ok: false,
      error:
        "Database is not configured. Set DATABASE_URL and run migrations to enable editing.",
    },
    { status: 503 }
  );

export const unauthorized = () =>
  NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

export const badRequest = (error) =>
  NextResponse.json({ ok: false, error }, { status: 400 });

// Parse the request body as JSON, returning null when it is missing/malformed.
export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}