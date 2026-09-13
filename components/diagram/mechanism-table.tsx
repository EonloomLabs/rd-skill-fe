import type { Mechanism } from "@/lib/types";

const TONE: Record<string, { chip: string; bar: string }> = {
  Analysis: { chip: "text-violet", bar: "bg-violet" },
  Task: { chip: "text-accent", bar: "bg-accent" },
  Validation: { chip: "text-green", bar: "bg-green" },
  Review: { chip: "text-amber", bar: "bg-amber" },
};

/**
 * Four mechanisms, each answering a different question. The distinction that
 * matters: validation is an activity the task performs, not a fifth agent.
 */
export function MechanismTable({ mechanisms }: { mechanisms: Mechanism[] }) {
  return (
    <div>
      <ol className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 xl:grid-cols-4">
        {mechanisms.map((mechanism) => {
          const tone = TONE[mechanism.name] ?? TONE.Task;
          return (
            <li
              key={mechanism.name}
              className="grid grid-cols-[3px_minmax(0,1fr)] overflow-hidden rounded-xl border border-line bg-surface"
            >
              <span aria-hidden="true" className={tone.bar} />
              <div className="flex flex-col p-6">
                <h3 className={`text-[0.9375rem] font-semibold tracking-[-0.01em] ${tone.chip}`}>
                  {mechanism.name}
                </h3>
                <p className="mt-2 text-[0.875rem] font-medium leading-snug text-ink">
                  {mechanism.question}
                </p>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{mechanism.does}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 max-w-[74ch] rounded-lg border-l-2 border-green bg-green-soft px-5 py-4 text-[0.9375rem] leading-relaxed text-ink">
        Validation is an activity, not a fifth agent role. A reviewer can examine tests and their
        results, but independent review never replaces running the checks.
      </p>
    </div>
  );
}
