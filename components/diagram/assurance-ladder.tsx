import { LEVELS } from "@/content/model";

/**
 * L1–L5 is assurance strength, not a pipeline. L3 is the default, which is why
 * the bar chart peaks in the middle rather than climbing to a "best" level.
 */
export function AssuranceLadder() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <ol className="flex list-none flex-col p-0">
        {LEVELS.map((level, index) => (
          <li
            key={level.id}
            className="grid gap-x-5 gap-y-1 border-b border-line-soft px-5 py-4 last:border-b-0 md:grid-cols-[3.5rem_11rem_minmax(0,1fr)] md:items-baseline"
          >
            <span
              className={`ident text-sm ${level.id === "L3" ? "text-accent" : "text-muted"}`}
            >
              {level.id}
            </span>
            <span className="text-[0.9375rem] font-semibold tracking-[-0.01em]">
              {level.name}
              {level.id === "L3" ? (
                <span className="label ml-2 rounded border border-accent-line bg-accent-soft px-1.5 py-0.5 align-middle text-accent">
                  default
                </span>
              ) : null}
            </span>
            <span className="text-[0.8125rem] leading-relaxed text-muted">{level.blurb}</span>
            <span
              aria-hidden="true"
              className="col-span-full mt-1 h-px bg-line-soft md:hidden"
              style={{ display: index === LEVELS.length - 1 ? "none" : undefined }}
            />
          </li>
        ))}
      </ol>
      <p className="border-t border-line bg-surface-2 px-5 py-3.5 text-[0.8125rem] text-muted">
        Level changes the depth and independence of validation, review and evidence. It never
        re-selects the primary professional, the implementation Layer 3, the domain, or the
        required review skills.
      </p>
    </div>
  );
}
