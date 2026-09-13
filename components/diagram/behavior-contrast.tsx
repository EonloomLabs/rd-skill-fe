import { Check, TriangleAlert } from "lucide-react";

import type { BehaviorContrast as Row } from "@/lib/types";

/**
 * The most useful thing a newcomer can be told: what a healthy run looks like,
 * and what should make them suspicious. Rows come from the repository's own
 * usage guide.
 */
export function BehaviorContrast({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="hidden grid-cols-2 gap-px border-b border-line bg-line md:grid">
        <p className="label flex items-center gap-2 bg-surface px-6 py-3 text-green">
          <Check size={13} aria-hidden="true" />
          Normal behaviour
        </p>
        <p className="label flex items-center gap-2 bg-surface px-6 py-3 text-amber">
          <TriangleAlert size={13} aria-hidden="true" />
          Behaviour to question
        </p>
      </div>

      <ul className="flex list-none flex-col p-0">
        {rows.map((row) => (
          <li
            key={row.normal}
            className="grid gap-px border-b border-line-soft bg-line-soft last:border-b-0 md:grid-cols-2"
          >
            <div className="flex gap-2.5 bg-surface px-6 py-4">
              <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-green md:hidden" />
              <span className="text-[0.875rem] leading-relaxed text-ink-2">{row.normal}</span>
            </div>
            <div className="flex gap-2.5 bg-surface px-6 py-4">
              <TriangleAlert
                size={15}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-amber md:hidden"
              />
              <span className="text-[0.875rem] leading-relaxed text-muted">{row.questionable}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
