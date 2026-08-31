import { PLANES } from "@/content/model";

const TONE: Record<string, { bar: string; text: string }> = {
  accent: { bar: "bg-accent", text: "text-accent" },
  violet: { bar: "bg-violet", text: "text-violet" },
  green: { bar: "bg-green", text: "text-green" },
  amber: { bar: "bg-amber", text: "text-amber" },
  muted: { bar: "bg-muted", text: "text-muted" },
};

/**
 * Six responsibility planes. Hover dims the others so the reader can isolate
 * one plane without losing the stack — CSS only, no JS, no layout shift.
 */
export function PlaneStack() {
  return (
    <div className="group/stack flex flex-col gap-2">
      {PLANES.map((plane) => {
        const tone = TONE[plane.tone] ?? TONE.muted;
        return (
          <div
            key={plane.id}
            className="grid grid-cols-[3px_minmax(0,1fr)] overflow-hidden rounded-lg border border-line bg-surface transition-opacity duration-200 group-hover/stack:opacity-45 hover:!opacity-100 focus-within:!opacity-100"
          >
            <span aria-hidden="true" className={tone.bar} />
            <div className="grid gap-x-6 gap-y-2 px-5 py-4 md:grid-cols-[15rem_minmax(0,1fr)] md:items-baseline">
              <div>
                <p className={`text-[0.9375rem] font-semibold tracking-[-0.01em] ${tone.text}`}>
                  {plane.name}
                </p>
                <p className="mt-0.5 text-[0.8125rem] leading-snug text-muted">{plane.blurb}</p>
              </div>
              <ul className="flex list-none flex-wrap gap-1.5 p-0">
                {plane.parts.map((part) => (
                  <li
                    key={part}
                    className="ident rounded border border-line bg-surface-2 px-2 py-0.5 text-[0.75rem] text-ink-2"
                  >
                    {part}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
