import { CORE_SYSTEMS, PRIORITIES } from "@/content/model";

export function CoreSystems() {
  return (
    <div>
      <div className="grid gap-3 lg:grid-cols-3">
        {CORE_SYSTEMS.map((system, index) => (
          <article
            key={system.id}
            className="flex flex-col rounded-xl border border-line bg-surface p-6"
          >
            <p className="ident text-xs text-muted">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-3 text-lg font-semibold tracking-[-0.015em]">{system.name}</h3>
            <p className="mt-1 text-[0.8125rem] font-medium text-accent">{system.question}</p>
            <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-muted">{system.blurb}</p>
            <ul className="mt-5 flex list-none flex-wrap gap-1.5 p-0">
              {system.items.map((item) => (
                <li
                  key={item}
                  className="ident rounded border border-line bg-surface-2 px-2 py-0.5 text-[0.75rem] text-ink-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-line bg-surface px-6 py-5">
        <p className="label text-muted">When they conflict, this is the order</p>
        <ol className="mt-3 flex list-none flex-wrap items-center gap-x-2 gap-y-2 p-0">
          {PRIORITIES.map((priority, index) => (
            <li key={priority} className="flex items-center gap-2">
              <span
                className={`text-[0.875rem] ${index === 0 ? "font-medium text-ink" : "text-muted"}`}
              >
                {priority}
              </span>
              {index < PRIORITIES.length - 1 ? (
                <span aria-hidden="true" className="text-muted">
                  &rsaquo;
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
