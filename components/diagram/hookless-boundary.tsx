import { Check, X } from "lucide-react";

import { HOOKLESS } from "@/content/model";

/**
 * The clearest statement of what this project is: a control plane that adds no
 * runtime of its own. The "does not have" column is the differentiating half.
 */
export function HooklessBoundary() {
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-green-line bg-surface p-6">
          <p className="label text-green">What it has</p>
          <ul className="mt-4 flex list-none flex-col gap-2 p-0">
            {HOOKLESS.has.map((item) => (
              <li key={item} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-ink-2">
                <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-green" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-line bg-surface p-6">
          <p className="label text-red">What it deliberately has not</p>
          <ul className="mt-4 flex list-none flex-col gap-2 p-0">
            {HOOKLESS.hasNot.map((item) => (
              <li key={item} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-muted">
                <X size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-red" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-3 max-w-[74ch] rounded-lg border-l-2 border-accent bg-accent-soft px-5 py-4 text-[0.9375rem] leading-relaxed text-ink">
        {HOOKLESS.why}
      </p>
    </div>
  );
}
