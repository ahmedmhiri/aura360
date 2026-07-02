// Inline notice shown on admin pages when no database is connected.
export default function DbBanner({ children }) {
  return (
    <div className="mt-8 border-l-2 border-blueprint bg-mist/50 p-5">
      <p className="text-sm leading-relaxed text-graphite">
        <span className="font-medium text-ink">No database connected.</span>{" "}
        {children}
      </p>
    </div>
  );
}
