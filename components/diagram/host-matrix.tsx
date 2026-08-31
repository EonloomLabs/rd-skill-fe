import {
  HOSTS,
  HOST_CAPABILITIES,
  HOST_SUPPORT_LABEL,
  type HostSupport,
} from "@/content/model";

const MARK: Record<HostSupport, { glyph: string; className: string }> = {
  native: { glyph: "●", className: "text-green" },
  prompt: { glyph: "◐", className: "text-accent" },
  supplied: { glyph: "◑", className: "text-amber" },
  unsupported: { glyph: "○", className: "text-muted" },
};

function Cell({ support }: { support: HostSupport }) {
  const mark = MARK[support];
  return (
    <span className="flex items-center gap-1.5">
      <span aria-hidden="true" className={`ident text-sm ${mark.className}`}>
        {mark.glyph}
      </span>
      <span className="text-[0.8125rem] text-ink-2">{HOST_SUPPORT_LABEL[support]}</span>
    </span>
  );
}

/**
 * Honest capability projection. Two of the five hosts support none of these
 * natively, and saying so is the point — the control model is projected onto
 * whatever a host can actually do.
 */
export function HostMatrix() {
  return (
    <div>
      <div className="hidden overflow-x-auto rounded-xl border border-line bg-surface lg:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="label px-5 py-3 text-muted">
                Host
              </th>
              {HOST_CAPABILITIES.map((capability) => (
                <th key={capability} scope="col" className="label px-5 py-3 text-muted">
                  {capability}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOSTS.map((host) => (
              <tr key={host.id} className="border-b border-line-soft last:border-b-0">
                <th scope="row" className="px-5 py-4 align-top">
                  <span className="ident text-[0.8125rem] text-ink">{host.name}</span>
                  <span className="mt-1 block max-w-[24ch] text-xs leading-snug font-normal text-muted">
                    {host.note}
                  </span>
                </th>
                {HOST_CAPABILITIES.map((capability) => (
                  <td key={capability} className="px-5 py-4 align-top">
                    <Cell support={host.support[capability]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex list-none flex-col gap-3 p-0 lg:hidden">
        {HOSTS.map((host) => (
          <li key={host.id} className="rounded-xl border border-line bg-surface p-5">
            <p className="ident text-sm text-ink">{host.name}</p>
            <p className="mt-1 text-xs leading-snug text-muted">{host.note}</p>
            <dl className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2">
              {HOST_CAPABILITIES.map((capability) => (
                <div key={capability} className="contents">
                  <dt className="text-[0.8125rem] text-muted">{capability}</dt>
                  <dd className="m-0 justify-self-end">
                    <Cell support={host.support[capability]} />
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
