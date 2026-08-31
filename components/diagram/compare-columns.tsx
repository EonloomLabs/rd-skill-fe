import { CONTROLLED_PATH, TYPICAL_AGENT } from "@/content/model";

function Flow({ steps, tone }: { steps: readonly string[]; tone: "muted" | "accent" }) {
  return (
    <ol className="flex list-none flex-wrap items-center gap-x-1.5 gap-y-1 p-0">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-1.5">
          <span
            className={`ident rounded border px-2 py-0.5 text-[0.75rem] ${
              tone === "accent"
                ? "border-accent-line bg-accent-soft text-accent"
                : "border-line bg-surface-2 text-muted"
            }`}
          >
            {step}
          </span>
          {index < steps.length - 1 ? (
            <span aria-hidden="true" className="text-muted">
              ›
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function CompareColumns() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div className="rounded-xl border border-line bg-surface p-6 md:p-7">
        <p className="label text-muted">{TYPICAL_AGENT.title}</p>
        <div className="mt-4">
          <Flow steps={TYPICAL_AGENT.flow} tone="muted" />
        </div>
        <p className="mt-6 text-[0.8125rem] text-muted">What stays undecided</p>
        <ul className="mt-2.5 flex list-none flex-col gap-2 p-0">
          {TYPICAL_AGENT.failures.map((failure) => (
            <li key={failure} className="flex items-start gap-2.5 text-[0.875rem] text-ink-2">
              <span aria-hidden="true" className="ident mt-px w-3 shrink-0 text-muted">
                ○
              </span>
              {failure}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-accent-line bg-surface p-6 md:p-7">
        <p className="label text-accent">{CONTROLLED_PATH.title}</p>
        <div className="mt-4">
          <Flow steps={CONTROLLED_PATH.flow} tone="accent" />
        </div>
        <p className="mt-6 text-[0.8125rem] text-muted">What each step decides</p>
        <ul className="mt-2.5 flex list-none flex-col gap-2 p-0">
          {CONTROLLED_PATH.guarantees.map((guarantee) => (
            <li key={guarantee} className="flex items-start gap-2.5 text-[0.875rem] text-ink-2">
              <span aria-hidden="true" className="ident mt-px w-3 shrink-0 text-green">
                ●
              </span>
              {guarantee}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
