import type { HostSurface } from "@/lib/types";

function state(value: string): "yes" | "partial" | "no" {
  const normalized = value.toLowerCase();
  if (normalized.startsWith("not ")) return "no";
  if (normalized.includes("available")) return "yes";
  if (normalized.includes("owns orchestration") || normalized.includes("integration")) return "partial";
  return "partial";
}

const MARK = {
  yes: { glyph: "●", className: "text-green" },
  partial: { glyph: "◐", className: "text-amber" },
  no: { glyph: "○", className: "text-muted" },
} as const;

function Workflow({ value }: { value: string }) {
  const mark = MARK[state(value)];
  return (
    <span className="flex items-start gap-1.5">
      <span aria-hidden="true" className={`ident mt-px text-sm ${mark.className}`}>
        {mark.glyph}
      </span>
      <span className="text-[0.8125rem] text-ink-2">{value}</span>
    </span>
  );
}

/**
 * Artifact delivery, live invocation and full workflow are three different
 * questions — the table keeps them apart rather than collapsing them into one
 * "supported" claim. Rows come from the repository README.
 */
export function HostMatrix({ surfaces }: { surfaces: HostSurface[] }) {
  return (
    <div>
      <div className="hidden overflow-x-auto rounded-xl border border-line bg-surface lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              {["Host or surface", "Artifact delivery", "Live invocation", "Full workflow", "Limit"].map(
                (heading) => (
                  <th key={heading} scope="col" className="label px-5 py-3 text-muted">
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {surfaces.map((surface) => (
              <tr key={surface.host} className="border-b border-line-soft last:border-b-0">
                <th scope="row" className="px-5 py-4 align-top">
                  <span className="ident text-[0.8125rem] text-ink">{surface.host}</span>
                </th>
                <td className="px-5 py-4 align-top text-[0.8125rem] text-ink-2">
                  {surface.artifacts}
                </td>
                <td className="px-5 py-4 align-top">
                  {surface.invocation.includes("engineering-control-plane") ? (
                    <code className="ident rounded border border-line bg-surface-2 px-1.5 py-0.5 text-[0.75rem] text-ink">
                      {surface.invocation}
                    </code>
                  ) : (
                    <span className="text-[0.8125rem] text-muted">{surface.invocation}</span>
                  )}
                </td>
                <td className="px-5 py-4 align-top">
                  <Workflow value={surface.workflow} />
                </td>
                <td className="max-w-[24ch] px-5 py-4 align-top text-xs leading-snug text-muted">
                  {surface.limit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex list-none flex-col gap-3 p-0 lg:hidden">
        {surfaces.map((surface) => (
          <li key={surface.host} className="rounded-xl border border-line bg-surface p-5">
            <p className="ident text-sm text-ink">{surface.host}</p>
            <dl className="mt-3 flex flex-col gap-2.5">
              <div>
                <dt className="label text-muted">Artifact delivery</dt>
                <dd className="m-0 mt-0.5 text-[0.8125rem] text-ink-2">{surface.artifacts}</dd>
              </div>
              <div>
                <dt className="label text-muted">Live invocation</dt>
                <dd className="ident m-0 mt-0.5 text-[0.8125rem] text-ink-2">{surface.invocation}</dd>
              </div>
              <div>
                <dt className="label text-muted">Full workflow</dt>
                <dd className="m-0 mt-0.5">
                  <Workflow value={surface.workflow} />
                </dd>
              </div>
              <div>
                <dt className="label text-muted">Limit</dt>
                <dd className="m-0 mt-0.5 text-xs leading-snug text-muted">{surface.limit}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <p className="mt-5 max-w-[74ch] text-[0.8125rem] leading-relaxed text-muted">
        Artifact delivery, live invocation and full workflow are separate questions. An invocation
        rule verified on one surface says nothing about another, and static checks on the installed
        files do not prove that a running host loaded them.
      </p>
    </div>
  );
}
