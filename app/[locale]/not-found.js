import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-site flex-col items-center justify-center px-5 text-center sm:px-8">
      <span className="annotation text-blueprint">Error 404</span>
      <h1 className="mt-5 font-display text-6xl font-bold uppercase tracking-tightest text-ink sm:text-8xl">
        Not found
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-graphite/80">
        The page you are looking for has moved or no longer exists.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Return home
      </Link>
    </div>
  );
}
