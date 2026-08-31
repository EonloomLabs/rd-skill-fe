import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { getDoc, getDocPages } from "@/lib/skills";

export function generateStaticParams() {
  return getDocPages().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc || doc.route !== "docs") return { title: "Not found" };
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/docs/${doc.slug}` },
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc || doc.route !== "docs") notFound();

  const pages = getDocPages();
  const index = pages.findIndex((page) => page.slug === doc.slug);
  const previous = index > 0 ? pages[index - 1] : null;
  const next = index < pages.length - 1 ? pages[index + 1] : null;

  return (
    <div className="wrap grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
      <article className="min-w-0">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted no-underline hover:text-ink"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          Documentation
        </Link>

        <header className="mt-6 border-b border-line pb-8">
          <p className="label text-accent">{doc.group}</p>
          <h1 className="mt-3 text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] text-balance md:text-[2.5rem]">
            {doc.title}
          </h1>
          <p className="mt-4 max-w-[70ch] text-[1.0625rem] leading-relaxed text-muted">
            {doc.summary}
          </p>
          <a
            href={doc.url}
            target="_blank"
            rel="noreferrer"
            className="ident mt-5 inline-flex items-center gap-1.5 text-[0.75rem] text-accent no-underline hover:underline"
          >
            {doc.file}
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
        </header>

        <div className="doc-prose mt-8" dangerouslySetInnerHTML={{ __html: doc.html }} />

        <nav
          aria-label="Documentation"
          className="mt-16 grid gap-3 border-t border-line pt-8 md:grid-cols-2"
        >
          {previous ? (
            <Link
              href={`/docs/${previous.slug}`}
              className="group rounded-xl border border-line bg-surface p-4 no-underline transition-colors duration-150 hover:border-accent-line"
            >
              <span className="label flex items-center gap-1.5 text-muted">
                <ArrowLeft size={11} aria-hidden="true" />
                Previous
              </span>
              <span className="mt-1.5 block text-[0.9375rem] font-medium text-ink group-hover:text-accent">
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/docs/${next.slug}`}
              className="group rounded-xl border border-line bg-surface p-4 text-right no-underline transition-colors duration-150 hover:border-accent-line"
            >
              <span className="label flex items-center justify-end gap-1.5 text-muted">
                Next
                <ArrowRight size={11} aria-hidden="true" />
              </span>
              <span className="mt-1.5 block text-[0.9375rem] font-medium text-ink group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          ) : null}
        </nav>
      </article>

      {doc.headings.length > 0 ? (
        <aside className="order-first lg:order-last">
          <nav aria-label="On this page" className="lg:sticky lg:top-20">
            <p className="label border-b border-line pb-2 text-muted">On this page</p>
            <ul className="mt-3 flex list-none flex-col gap-0.5 p-0">
              {doc.headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={`block rounded-md px-2 py-1 text-[0.8125rem] leading-snug no-underline transition-colors duration-150 hover:bg-surface-2 hover:text-ink ${
                      heading.depth === 3 ? "pl-5 text-muted" : "text-ink-2"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      ) : null}
    </div>
  );
}
