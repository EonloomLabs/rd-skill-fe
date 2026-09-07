import { ROLES } from "@/content/model";

/**
 * Four profiles with fixed tool boundaries — deliberately not a fixed order.
 * The "cannot" list is the product claim: an agent that could review its own
 * change would make the whole model decorative.
 */
export function RoleRelay() {
  return (
    <div>
      <ol className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 xl:grid-cols-4">
        {ROLES.map((role, index) => (
          <li key={role.id} className="relative flex flex-col rounded-xl border border-line bg-surface">
            <div className="flex items-baseline gap-2 border-b border-line-soft px-5 py-4">
              <span className="ident text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="text-[0.9375rem] font-semibold tracking-[-0.01em]">{role.name}</h3>
              <span className="ml-auto text-[0.75rem] text-muted">{role.summary}</span>
            </div>
            <div className="flex-1 px-5 py-4">
              <p className="label text-muted">Can</p>
              <ul className="mt-2 flex list-none flex-col gap-1.5 p-0">
                {role.can.map((item) => (
                  <li key={item} className="flex gap-2 text-[0.8125rem] leading-snug text-ink-2">
                    <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-green" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-line-soft bg-surface-2 px-5 py-4">
              <p className="label text-red">Deliberately cannot</p>
              <ul className="mt-2 flex list-none flex-col gap-1.5 p-0">
                {role.cannot.map((item) => (
                  <li key={item} className="flex gap-2 text-[0.8125rem] leading-snug text-ink-2">
                    <span aria-hidden="true" className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-red" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-5 max-w-[74ch] text-[0.8125rem] leading-relaxed text-muted">
        An implementation request goes straight to the task agent. An unknown local owner, file,
        test or caller is that agent&apos;s discovery work — not a reason to start analysis.
      </p>
    </div>
  );
}
