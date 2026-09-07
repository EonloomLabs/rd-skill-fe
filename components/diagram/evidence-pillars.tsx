import { EVIDENCE_PILLARS } from "@/content/model";

const TONE: Record<string, { chip: string; bar: string }> = {
  accent: { chip: "text-accent", bar: "bg-accent" },
  green: { chip: "text-green", bar: "bg-green" },
  amber: { chip: "text-amber", bar: "bg-amber" },
};

/**
 * v24 dropped the mandatory evidence ledger. What is left is the part that was
 * always doing the work: read the source now, validate after the last edit, and
 * say plainly what you could not prove.
 */
export function EvidencePillars() {
  return (
    <ol className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-3">
      {EVIDENCE_PILLARS.map((pillar, index) => {
        const tone = TONE[pillar.tone] ?? TONE.accent;
        return (
          <li
            key={pillar.id}
            className="grid grid-cols-[3px_minmax(0,1fr)] overflow-hidden rounded-xl border border-line bg-surface"
          >
            <span aria-hidden="true" className={tone.bar} />
            <div className="p-6">
              <span className="ident text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
              <h3 className={`mt-3 text-[0.9375rem] font-semibold tracking-[-0.01em] ${tone.chip}`}>
                {pillar.name}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{pillar.blurb}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
