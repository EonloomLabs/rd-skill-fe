import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CircleCheck, LifeBuoy } from "lucide-react";

import { SetupWizard } from "@/components/quickstart/setup-wizard";
import { CommandBlock } from "@/components/terminal/command-block";
import { Section } from "@/components/ui/section";
import { SITE } from "@/lib/site";
import { getCounts, getDataset, getDoc } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Get started",
  description:
    "Install rd-skills for Codex, Claude, Copilot, Cline or the OpenAI API, then submit your first bounded engineering task. Copy-paste commands, no profile flag to choose.",
};

/** What each line of the request template is for. */
const TASK_FIELDS = [
  { field: "Goal", blurb: "What should be different when this is done. One sentence." },
  { field: "Acceptance", blurb: "How anyone could observe that it worked, without reading the diff." },
  { field: "Allowed scope", blurb: "The files it may touch. Everything else is off limits." },
  { field: "Verify", blurb: "The exact command that proves it. It runs after the final edit." },
  { field: "Stop if", blurb: "The condition that should make it come back and ask instead of guessing." },
];

const EXPECTATIONS = [
  "one primary professional skill takes ownership",
  "a task agent implements inside the scope you gave",
  "validation runs after the final edit, not before",
  "a separate review agent reads the actual diff",
  "the handoff lists changed files, results, unverified scope and residual risk",
];

export default function QuickstartPage() {
  const { quickstart } = getDataset();
  const counts = getCounts();
  const doc = getDoc("quickstart");

  return (
    <>
      <section className="rule-grid border-b border-line">
        <div className="wrap py-16 md:py-20">
          <p className="label text-accent">Get started</p>
          <h1 className="mt-4 max-w-[18ch] text-[2rem] font-semibold leading-[1.08] tracking-[-0.032em] text-balance md:text-[2.85rem]">
            Running in about five minutes.
          </h1>
          <p className="mt-5 max-w-[64ch] text-[1.0625rem] leading-relaxed text-muted">
            Pick your agent, copy four commands, then send one bounded request. There is a single
            runtime and no profile to choose — every host gets the same{" "}
            {counts.runtimeTopLevel} top-level skills.
          </p>
          <ul className="mt-6 flex list-none flex-wrap gap-2 p-0">
            {["Python 3.11+", "git", `${quickstart.hosts.length} supported agents`].map((item) => (
              <li
                key={item}
                className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[0.8125rem] text-ink-2"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section
        id="install"
        eyebrow="Step 1"
        title="Install it for your agent."
        lead="The options below are read from the installer's own tables, so every combination shown is one the CLI accepts. Preview first — step 3 writes nothing."
      >
        <SetupWizard hosts={quickstart.setup} repoUrl={SITE.repo} />
      </Section>

      <Section
        id="first-task"
        tone="surface"
        eyebrow="Step 2"
        title="Send one bounded request."
        lead="Open a small test repository in your agent and paste this. The five lines are the whole contract — they tell rd-skills what done means and when to stop."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] [&>*]:min-w-0">
          <CommandBlock code={quickstart.firstTask} label="Your first task" />

          <dl className="flex flex-col gap-4">
            {TASK_FIELDS.map((item) => (
              <div key={item.field} className="border-l-2 border-line pl-4">
                <dt className="ident text-[0.8125rem] text-ink">{item.field}</dt>
                <dd className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{item.blurb}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-6 max-w-[70ch] rounded-lg border-l-2 border-amber bg-amber-soft px-5 py-4 text-[0.875rem] leading-relaxed text-ink">
          Some hosts have no native slash UI. Typing{" "}
          <code className="ident">/engineering-control-plane</code> into the request text still
          expresses routing intent — it just does not mean the host implements slash commands.
        </p>
      </Section>

      <Section
        id="expect"
        eyebrow="Step 3"
        title="Know what a good result looks like."
        lead="If you get a diff and nothing else, something is wrong. A bounded implementation should produce all five of these."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <ul className="flex list-none flex-col gap-2.5 rounded-xl border border-line bg-surface p-6">
            {EXPECTATIONS.map((item) => (
              <li key={item} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-ink-2">
                <CircleCheck size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-green" />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-line bg-surface p-6">
              <h3 className="text-[0.9375rem] font-semibold tracking-[-0.01em]">
                A healthy doctor run
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                Doctor confirms {counts.runtimeTopLevel} installed skills, the manifest, current
                source bindings and the agent profile expectation for your host. It proves the files
                are correct on disk — not that the host has loaded them.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-6">
              <h3 className="flex items-center gap-2 text-[0.9375rem] font-semibold tracking-[-0.01em]">
                <LifeBuoy size={15} aria-hidden="true" className="text-muted" />
                If setup fails
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
                Read the conflict before reaching for <code className="ident">--force</code>. An old{" "}
                <code className="ident">recommended</code>, <code className="ident">full</code> or{" "}
                <code className="ident">dev</code> manifest means migration: run upgrade rather than
                uninstalling first.
              </p>
              <p className="mt-3">
                <Link
                  href="/docs/installation#troubleshooting-and-recovery"
                  className="text-[0.875rem] text-accent no-underline hover:underline"
                >
                  Troubleshooting and recovery →
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/docs/usage"
            className="rounded-lg border border-line bg-surface px-4 py-2.5 text-sm text-ink no-underline hover:border-accent-line"
          >
            Three request patterns
          </Link>
          <Link
            href="/skills"
            className="rounded-lg border border-line bg-surface px-4 py-2.5 text-sm text-ink no-underline hover:border-accent-line"
          >
            Browse the {counts.professional} professionals
          </Link>
          <a
            href={SITE.repo}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm text-ink no-underline hover:border-accent-line"
          >
            Repository
            <ArrowUpRight size={13} aria-hidden="true" className="text-muted" />
          </a>
        </div>
      </Section>

      {doc ? (
        <section id="reference" className="border-t border-line bg-surface py-20 md:py-24">
          <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
            <div className="min-w-0">
              <p className="label text-accent">Reference</p>
              <h2 className="mt-3 text-[1.75rem] font-semibold leading-[1.14] tracking-[-0.028em] text-balance md:text-[2.2rem]">
                {doc.title}
              </h2>
              <p className="mt-4 max-w-[68ch] text-[0.9375rem] leading-relaxed text-muted">
                The complete document from the repository, including project scope, the OpenAI API
                zip path and the exact expected outcome.
              </p>
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="ident mt-4 inline-flex items-center gap-1.5 text-[0.75rem] text-accent no-underline hover:underline"
              >
                {doc.file}
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>

              <div className="doc-prose mt-8" dangerouslySetInnerHTML={{ __html: doc.html }} />
            </div>

            {doc.headings.length > 0 ? (
              <aside className="order-first lg:order-last">
                <nav aria-label="On this page" className="lg:sticky lg:top-20">
                  <p className="label border-b border-line pb-2 text-muted">In this document</p>
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
        </section>
      ) : null}
    </>
  );
}
