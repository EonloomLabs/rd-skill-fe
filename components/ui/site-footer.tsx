import Link from "next/link";

import { SITE } from "@/lib/site";
import { getDataset } from "@/lib/skills";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/", label: "Overview" },
      { href: "/architecture", label: "Architecture" },
      { href: "/skills", label: "Skills" },
      { href: "/quickstart", label: "Get started" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/docs/usage", label: "Usage patterns" },
      { href: `${SITE.repo}`, label: "GitHub" },
      { href: `${SITE.repo}/blob/master/CONTRIBUTING.md`, label: "Contributing" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: `${SITE.repo}/blob/master/GOVERNANCE.md`, label: "Governance" },
      { href: `${SITE.repo}/blob/master/SECURITY.md`, label: "Security" },
      { href: `${SITE.repo}/blob/master/SUPPORT.md`, label: "Support" },
      { href: `${SITE.repo}/blob/master/LICENSE`, label: "License" },
    ],
  },
];

export function SiteFooter() {
  const { generatedAt, sourceCommit, degraded } = getDataset();
  const synced = new Date(generatedAt).toISOString().slice(0, 10);

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="ident text-[0.9375rem] font-medium text-ink">{SITE.name}</p>
          <p className="mt-2 max-w-[34ch] text-sm text-muted">{SITE.tagline}</p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="label text-muted">{column.title}</p>
            <ul className="mt-3 flex list-none flex-col gap-2 p-0">
              {column.links.map((link) => {
                const external = link.href.startsWith("http");
                return (
                  <li key={link.label}>
                    {external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-ink-2 no-underline hover:text-accent"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-ink-2 no-underline hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line-soft">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5">
          <p className="ident text-xs text-muted">
            Skill data synced {synced} from {sourceCommit.slice(0, 8)}
            {degraded ? " (snapshot fallback)" : ""}
          </p>
          <p className="text-xs text-muted">Built in the open.</p>
        </div>
      </div>
    </footer>
  );
}
