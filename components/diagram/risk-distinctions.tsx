import { ESCALATION_CONDITIONS, RISK_DISTINCTIONS } from "@/content/model";

/**
 * v24 removed the execution-level ladder. Risk is handled by distinguishing
 * five pairs that are easy to conflate — and escalation needs all three
 * conditions at once, not a scary-sounding keyword.
 */
export function RiskDistinctions() {
  return (
    <div>
      <ol className="grid list-none grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line p-0 md:grid-cols-2 xl:grid-cols-3">
        {RISK_DISTINCTIONS.map((item, index) => (
          <li key={item.left} className="flex flex-col bg-surface p-5">
            <span className="ident text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
            <p className="mt-3 flex flex-wrap items-baseline gap-2 text-[0.9375rem] font-semibold tracking-[-0.01em]">
              <span className="text-muted">{item.left}</span>
              <span aria-label="is not" className="ident text-sm text-red">
                &ne;
              </span>
              <span className="text-ink">{item.right}</span>
            </p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{item.blurb}</p>
          </li>
        ))}

        <li className="flex flex-col justify-center bg-surface p-5">
          <p className="label text-amber">Escalation needs all three</p>
          <ul className="mt-3 flex list-none flex-col gap-1.5 p-0">
            {ESCALATION_CONDITIONS.map((condition) => (
              <li key={condition} className="flex gap-2 text-[0.8125rem] leading-snug text-ink-2">
                <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-amber" />
                {condition}
              </li>
            ))}
          </ul>
        </li>
      </ol>

      <p className="mt-5 max-w-[74ch] rounded-lg border-l-2 border-accent bg-accent-soft px-5 py-4 text-[0.9375rem] text-ink">
        There is no fixed process hierarchy. Depth is not chosen by a risk score, a severity ladder
        or a state machine — it comes from the engineering facts of the task in front of you.
      </p>
    </div>
  );
}
