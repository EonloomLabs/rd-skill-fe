import { STEPS } from "@/content/model";

export function StepsTimeline() {
  return (
    <ol className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 xl:grid-cols-4">
      {STEPS.map((step) => (
        <li key={step.n} className="flex flex-col rounded-xl border border-line bg-surface p-6">
          <span className="ident text-xs text-accent">{step.n}</span>
          <h3 className="mt-3 text-[0.9375rem] font-semibold tracking-[-0.01em]">{step.title}</h3>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
