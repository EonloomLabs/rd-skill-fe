import { BRANCHES } from "@/content/model";

const TONE = {
  violet: {
    chip: "border-violet-line bg-violet-soft text-violet",
    dotYes: "bg-violet",
  },
  green: {
    chip: "border-green-line bg-green-soft text-green",
    dotYes: "bg-green",
  },
} as const;

/**
 * Analysis and independent review are branches, not stages. Showing what does
 * *not* trigger them matters as much as what does — that is the difference
 * between a control plane and a ceremony.
 */
export function WorkPaths() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {BRANCHES.map((branch) => {
        const tone = TONE[branch.tone];
        return (
          <div key={branch.id} className="flex flex-col rounded-xl border border-line bg-surface p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`label rounded border px-1.5 py-0.5 ${tone.chip}`}>
                {branch.name}
              </span>
              <span className="label text-muted">on demand</span>
            </div>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{branch.when}</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="label text-muted">Worth it when</p>
                <ul className="mt-2.5 flex list-none flex-col gap-1.5 p-0">
                  {branch.yes.map((item) => (
                    <li key={item} className="flex gap-2 text-[0.8125rem] leading-snug text-ink-2">
                      <span aria-hidden="true" className={`mt-[0.45rem] h-1 w-1 shrink-0 rounded-full ${tone.dotYes}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label text-muted">Not a trigger</p>
                <ul className="mt-2.5 flex list-none flex-col gap-1.5 p-0">
                  {branch.no.map((item) => (
                    <li key={item} className="flex gap-2 text-[0.8125rem] leading-snug text-muted">
                      <span aria-hidden="true" className="ident mt-px w-2.5 shrink-0 text-red">
                        &times;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
