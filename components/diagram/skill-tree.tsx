"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { InlineCodeText } from "@/components/ui/inline-code-text";

export interface TreeProfessional {
  slug: string;
  description: string;
  /** Layer 3 slugs only — the tree renders identifiers, not full records. */
  layer3: string[];
  referenceCount: number;
}

/**
 * The site's central claim, made operable: pick a professional, and see the
 * bounded set of Layer 3 expertise the selector may add behind it — never the
 * whole library.
 */
export function SkillTree({
  professionals,
  jitTotal,
  maxPerTask,
}: {
  professionals: TreeProfessional[];
  jitTotal: number;
  maxPerTask: number;
}) {
  const [activeSlug, setActiveSlug] = useState(professionals[0]?.slug ?? "");
  const active = professionals.find((p) => p.slug === activeSlug) ?? professionals[0];

  if (!active) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div className="border-b border-line lg:border-b-0 lg:border-r">
          <p className="label border-b border-line-soft px-5 py-3 text-muted">
            Step 1 · one primary professional
          </p>
          <ul
            className="flex max-h-[22rem] list-none flex-col overflow-y-auto p-0"
            role="listbox"
            aria-label="Primary professional"
          >
            {professionals.map((professional) => {
              const selected = professional.slug === active.slug;
              return (
                <li key={professional.slug}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => setActiveSlug(professional.slug)}
                    className={`flex w-full items-center gap-2 px-5 py-2.5 text-left transition-colors duration-150 ${
                      selected ? "bg-accent-soft" : "hover:bg-surface-2"
                    }`}
                  >
                    <ChevronRight
                      size={13}
                      aria-hidden="true"
                      className={selected ? "text-accent" : "text-muted"}
                    />
                    <span
                      className={`ident text-[0.8125rem] ${selected ? "text-accent" : "text-ink-2"}`}
                    >
                      {professional.slug}
                    </span>
                    <span className="ident ml-auto text-xs text-muted">
                      {professional.layer3.length}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-5 md:p-7">
          <p className="text-[0.9375rem] leading-relaxed text-ink-2">
            <InlineCodeText>{active.description}</InlineCodeText>
          </p>

          <div className="mt-6">
            <p className="label text-violet">
              Step 2 · selector-authorised Layer 3 · {active.layer3.length} candidates, at most{" "}
              {maxPerTask} loaded per task
            </p>
            <ul className="mt-3 flex list-none flex-wrap gap-1.5 p-0">
              {active.layer3.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/skills/${slug}`}
                    className="ident block rounded border border-violet-line bg-violet-soft px-2 py-1 text-[0.75rem] text-violet no-underline transition-colors duration-150 hover:border-violet hover:bg-surface"
                  >
                    {slug}
                  </Link>
                </li>
              ))}
              {active.layer3.length === 0 ? (
                <li className="text-sm text-muted">
                  No standing Layer 3 candidates — expertise arrives through evidence-driven
                  selectors instead.
                </li>
              ) : null}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line-soft pt-5 text-[0.8125rem] text-muted">
            <span>
              <span className="ident text-ink">{active.referenceCount}</span> targeted references,
              each with its own load condition
            </span>
            <span>
              <span className="ident text-ink">{jitTotal}</span> JIT items exist in total — this
              task sees only what its evidence justifies
            </span>
            <Link href={`/skills/${active.slug}`} className="text-accent no-underline hover:underline">
              Full contract →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
