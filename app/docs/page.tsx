import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

import { SITE } from "@/lib/site";
import { getDocs } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Read the rd-skills documentation here: installation, usage patterns, the operating model, skill governance and the validation architecture.",
};

function readingTime(words: number) {
  return Math.max(1, Math.round(words / 220));
}

export default function DocsPage() {
  const docs = getDocs();
  const groups = [...new Set(docs.map((doc) => doc.group))];

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-16 md:py-20">
          <p className="label text-accent">Documentation</p>
          <h1 className="mt-4 max-w-[20ch] text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-balance md:text-[2.75rem]">
            Everything you need to read, without leaving the site.
          </h1>
          <p className="mt-5 max-w-[66ch] text-[1.0625rem] leading-relaxed text-muted">
            These pages are rendered from the repository at build time, so they always match the
            release you would install. Every page links to its source file when you want the
            original.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/quickstart"
              className="flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-on-accent no-underline transition-colors duration-150 hover:bg-accent-hover"
            >
              <BookOpen size={15} aria-hidden="true" />
              Start with the 5-minute setup
            </Link>
            <a
              href={SITE.repo}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 items-center rounded-lg border border-line bg-surface px-4 text-sm text-ink no-underline transition-colors duration-150 hover:border-accent-line"
            >
              View the repository
            </a>
          </div>
        </div>
      </section>

      <div className="wrap flex flex-col gap-12 py-12 md:py-16">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="label text-muted">{group}</h2>
            <ul className="mt-4 grid list-none gap-3 p-0 md:grid-cols-2 xl:grid-cols-3">
              {docs
                .filter((doc) => doc.group === group)
                .map((doc) => {
                  const href = doc.route === "quickstart" ? "/quickstart" : `/docs/${doc.slug}`;
                  return (
                    <li key={doc.slug}>
                      <Link
                        href={href}
                        className="group flex h-full flex-col rounded-xl border border-line bg-surface p-5 no-underline transition-colors duration-150 hover:border-accent-line"
                      >
                        <span className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-ink group-hover:text-accent">
                          {doc.title}
                        </span>
                        <span className="mt-2 flex-1 text-[0.8125rem] leading-relaxed text-muted">
                          {doc.summary}
                        </span>
                        <span className="ident mt-4 flex items-center gap-3 border-t border-line-soft pt-3 text-xs text-muted">
                          <span>{readingTime(doc.words)} min read</span>
                          {doc.headings.length > 0 ? (
                            <span>{doc.headings.filter((h) => h.depth === 2).length} sections</span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}

        <section>
          <h2 className="label text-muted">In the repository</h2>
          <p className="mt-3 max-w-[66ch] text-[0.875rem] leading-relaxed text-muted">
            Generated inventories and governance files are large or change with every release, so
            they stay where they are produced.
          </p>
          <ul className="mt-4 flex list-none flex-wrap gap-2 p-0">
            {[
              { label: "Marketplace catalog", path: "blob/master/docs/MARKETPLACE_CATALOG.md" },
              { label: "Registries", path: "tree/master/src/registry" },
              { label: "Evaluation harness", path: "tree/master/evals" },
              { label: "Contributing", path: "blob/master/CONTRIBUTING.md" },
              { label: "Governance", path: "blob/master/GOVERNANCE.md" },
              { label: "Security", path: "blob/master/SECURITY.md" },
            ].map((item) => (
              <li key={item.label}>
                <a
                  href={`${SITE.repo}/${item.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-[0.8125rem] text-ink-2 no-underline transition-colors duration-150 hover:border-accent-line hover:text-ink"
                >
                  {item.label}
                  <ArrowUpRight size={12} aria-hidden="true" className="text-muted" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
