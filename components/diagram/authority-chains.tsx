const CHAINS = [
  {
    id: "direct",
    label: "Direct Task",
    tone: "accent" as const,
    when: "The user supplied the facts and the boundary is explicit.",
    steps: [
      { name: "User facts + explicit boundary", note: "nothing material is unknown" },
      { name: "Direct Task Contract", note: "the authority for this task" },
      { name: "Task / execution delta", note: "implementation inside the boundary" },
      { name: "Review artifact", note: "latest change plus current evidence" },
      { name: "Closure", note: "conditions met" },
    ],
  },
  {
    id: "analyzed",
    label: "Analyzed Work",
    tone: "violet" as const,
    when: "Owner, placement, verification or material risk is still unknown.",
    steps: [
      { name: "User request + source evidence", note: "start from the repository, not the prompt" },
      { name: "Engineering Brief", note: "the single runtime analysis authority" },
      { name: "First executable slice", note: "the first fully executable task" },
      { name: "Task / execution delta", note: "implementation and evidence increment" },
      { name: "Review artifact", note: "independent review input" },
    ],
  },
];

const TONE = {
  accent: { line: "bg-accent", text: "text-accent", chip: "border-accent-line bg-accent-soft text-accent" },
  violet: { line: "bg-violet", text: "text-violet", chip: "border-violet-line bg-violet-soft text-violet" },
};

/** Two authority chains. A Direct Task never creates an Engineering Brief. */
export function AuthorityChains() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {CHAINS.map((chain) => {
        const tone = TONE[chain.tone];
        return (
          <div key={chain.id} className="rounded-xl border border-line bg-surface p-6">
            <span className={`label rounded border px-1.5 py-0.5 ${tone.chip}`}>{chain.label}</span>
            <p className="mt-3 text-[0.875rem] text-muted">{chain.when}</p>
            <ol className="mt-6 flex list-none flex-col p-0">
              {chain.steps.map((step, index) => (
                <li key={step.name} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`ident grid h-5 w-5 place-items-center rounded-full border text-[0.625rem] ${tone.chip}`}
                    >
                      {index + 1}
                    </span>
                    {index < chain.steps.length - 1 ? (
                      <span aria-hidden="true" className={`w-px flex-1 ${tone.line} opacity-30`} />
                    ) : null}
                  </div>
                  <div className={index < chain.steps.length - 1 ? "pb-5" : ""}>
                    <p className="text-[0.875rem] font-medium leading-snug text-ink">{step.name}</p>
                    <p className="mt-0.5 text-[0.8125rem] leading-snug text-muted">{step.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
