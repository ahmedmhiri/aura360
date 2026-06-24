import { Reveal } from "@/components/motion";
import { stats } from "@/lib/site";

export default function Stats({ dict }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden border hairline bg-line md:grid-cols-4">
      {stats.map((s, i) => (
        <Reveal key={s.key} delay={i * 0.07}>
          <div className="bg-bone p-7 md:p-9">
            <div className="font-display text-4xl font-bold tracking-tightest text-ink md:text-5xl">
              {s.value}
            </div>
            <div className="annotation mt-3 text-ash">{dict[s.key]}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
