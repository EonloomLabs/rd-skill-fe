import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Chip, type ChipTone } from "@/components/ui/chip";
import { InlineCodeText } from "@/components/ui/inline-code-text";
import {
  AGENT_ROLE_LABEL,
  SKILL_TYPE_LABEL,
  getDataset,
  getSkill,
  githubBlobUrl,
  resolveConsumers,
  resolveLayer3,
} from "@/lib/skills";
import type { AgentRole, Skill } from "@/lib/types";

const TYPE_TONE: Record<Skill["type"], ChipTone> = {
  control: "accent",
  professional: "accent",
  foundation: "violet",
  domain: "violet",
};

const ROLES: AgentRole[] = [
  "main-control-agent",
  "analysis-agent",
  "task-agent",
  "review-agent",
];

export function generateStaticParams() {
  return getDataset().skills.map((skill) => ({ slug: skill.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) return { title: "Skill not found" };
  return {
    title: skill.slug,
    description: skill.description.replace(/`/g, ""),
    alternates: { canonical: `/skills/${skill.slug}` },
  };
}

function Field({
  title,
  hint,
  items,
  tone = "muted",
}: {
  title: string;
  hint?: string;
  items: string[];
  tone?: "green" | "red" | "muted";
}) {
  const dot =
    tone === "green" ? "bg-green" : tone === "red" ? "bg-red" : "bg-muted";
  return (
    <section className="rounded-xl border border-line bg-surface p-6">
      <h2 className="text-[0.9375rem] font-semibold tracking-[-0.01em]">{title}</h2>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      {items.length > 0 ? (
        <ul className="mt-4 flex list-none flex-col gap-2.5 p-0">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-ink-2">
              <span aria-hidden="true" className={`mt-[0.5rem] h-1 w-1 shrink-0 rounded-full ${dot}`} />
              <span>
                <InlineCodeText>{item}</InlineCodeText>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ident mt-4 text-[0.8125rem] text-muted">not declared in registry</p>
      )}
    </section>
  );
}

export default async function SkillDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  const layer3 = resolveLayer3(skill);
  const consumers = skill.type === "professional" ? [] : resolveConsumers(skill);
  const jitOnly = skill.type === "foundation" || skill.type === "domain";

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-12 md:py-16">
          <Link
            href="/skills"
            className="inline-flex items-center gap-1.5 text-[0.8125rem] text-muted no-underline hover:text-ink"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            All skills
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <h1 className="ident text-[1.375rem] font-medium tracking-[-0.02em] text-ink md:text-[1.75rem]">
              {skill.slug}
            </h1>
            <Chip tone={TYPE_TONE[skill.type]}>{SKILL_TYPE_LABEL[skill.type]}</Chip>
            {skill.runtimeTopLevel ? <Chip tone="green">Runtime top level</Chip> : null}
            {jitOnly ? <Chip tone="muted">JIT only</Chip> : null}
            {skill.deliveryScope && skill.deliveryScope !== "product" ? (
              <Chip tone="amber">{skill.deliveryScope}</Chip>
            ) : null}
          </div>

          <p className="mt-4 max-w-[70ch] text-[1.0625rem] leading-relaxed text-ink-2">
            <InlineCodeText>{skill.description}</InlineCodeText>
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
            {skill.groupLabel ? (
              <div>
                <dt className="label text-muted">Group</dt>
                <dd className="mt-1 text-[0.875rem] text-ink">{skill.groupLabel}</dd>
              </div>
            ) : null}
            {skill.routingMode ? (
              <div>
                <dt className="label text-muted">Routing mode</dt>
                <dd className="ident mt-1 text-[0.875rem] text-ink">{skill.routingMode}</dd>
              </div>
            ) : null}
            <div>
              <dt className="label text-muted">Supported roles</dt>
              <dd className="mt-1 flex gap-1.5">
                {ROLES.map((role) => {
                  const on = skill.roleSupport.includes(role);
                  return (
                    <span
                      key={role}
                      className={`label rounded border px-1.5 py-0.5 ${
                        on
                          ? "border-accent-line bg-accent-soft text-accent"
                          : "border-line bg-surface-2 text-muted line-through decoration-1"
                      }`}
                      title={
                        on
                          ? `${AGENT_ROLE_LABEL[role]} may use this skill`
                          : `${AGENT_ROLE_LABEL[role]} may not use this skill`
                      }
                    >
                      {AGENT_ROLE_LABEL[role]}
                    </span>
                  );
                })}
              </dd>
            </div>
            <div>
              <dt className="label text-muted">Source</dt>
              <dd className="mt-1">
                <a
                  href={skill.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[0.875rem] text-accent no-underline hover:underline"
                >
                  SKILL.md
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="wrap grid gap-3 py-12 md:grid-cols-2 md:py-16">
        <Field
          title="Use when"
          hint="Trigger signals that make this skill the right owner"
          items={skill.triggerSignals}
          tone="green"
        />
        <Field
          title="Do not use when"
          hint="Anti-triggers — as binding as the triggers above"
          items={skill.antiTriggerSignals}
          tone="red"
        />
        <Field
          title="Required inputs"
          hint="What must be supplied before this skill can decide anything"
          items={skill.requiredInputs}
        />
        <Field
          title="Output contract"
          hint="What this skill owes the next role"
          items={skill.outputContract}
        />
        {skill.boundarySignals.length > 0 ? (
          <Field
            title="Boundary signals"
            hint="Signals that mark the edge of this skill's authority"
            items={skill.boundarySignals}
          />
        ) : null}
        <Field
          title="Escalation signals"
          hint="When this skill must hand the decision back"
          items={skill.escalationSignals}
        />
      </div>

      {layer3.length > 0 ? (
        <section className="border-t border-line bg-surface">
          <div className="wrap py-12 md:py-16">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Related expertise</h2>
            <p className="mt-2 max-w-[68ch] text-[0.9375rem] text-muted">
              {layer3.length} Layer 3 candidates may be loaded behind this skill. A single task
              loads at most three, and only when the current evidence justifies them.
            </p>
            <ul className="mt-6 flex list-none flex-wrap gap-1.5 p-0">
              {layer3.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/skills/${item.slug}`}
                    className="ident block rounded border border-violet-line bg-violet-soft px-2.5 py-1.5 text-[0.75rem] text-violet no-underline transition-colors duration-150 hover:border-violet hover:bg-surface"
                  >
                    {item.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {consumers.length > 0 ? (
        <section className="border-t border-line bg-surface">
          <div className="wrap py-12 md:py-16">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Loaded by</h2>
            <p className="mt-2 max-w-[68ch] text-[0.9375rem] text-muted">
              This skill never owns a task. These professionals may pull it in as Layer 3.
            </p>
            <ul className="mt-6 flex list-none flex-wrap gap-1.5 p-0">
              {consumers.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/skills/${item.slug}`}
                    className="ident block rounded border border-line bg-surface-2 px-2.5 py-1.5 text-[0.75rem] text-ink-2 no-underline transition-colors duration-150 hover:border-accent-line hover:text-accent"
                  >
                    {item.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {skill.references.length > 0 ? (
        <section className="border-t border-line">
          <div className="wrap py-12 md:py-16">
            <h2 className="text-xl font-semibold tracking-[-0.02em]">Targeted references</h2>
            <p className="mt-2 max-w-[68ch] text-[0.9375rem] text-muted">
              Each reference carries its own load condition. None of them enter context by default.
            </p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-surface">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="label px-5 py-3 text-muted">Reference</th>
                    <th scope="col" className="label px-5 py-3 text-muted">Load when</th>
                    <th scope="col" className="label px-5 py-3 text-muted">Do not load when</th>
                    <th scope="col" className="label px-5 py-3 text-muted">Required by</th>
                  </tr>
                </thead>
                <tbody>
                  {skill.references.map((reference) => (
                    <tr key={reference.path} className="border-b border-line-soft last:border-b-0">
                      <th scope="row" className="px-5 py-4 align-top font-normal">
                        <a
                          href={githubBlobUrl(`${skill.sourcePath}/${reference.path}`)}
                          target="_blank"
                          rel="noreferrer"
                          className="ident text-[0.75rem] text-accent no-underline hover:underline"
                        >
                          {reference.path.replace(/^references\//, "")}
                        </a>
                        <span className="label mt-1 block text-muted">{reference.type}</span>
                      </th>
                      <td className="max-w-[26ch] px-5 py-4 align-top text-[0.8125rem] leading-relaxed text-ink-2">
                        {reference.loadWhen || "—"}
                      </td>
                      <td className="max-w-[26ch] px-5 py-4 align-top text-[0.8125rem] leading-relaxed text-muted">
                        {reference.doNotLoadWhen || "—"}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span className="flex flex-wrap gap-1">
                          {reference.requiredBy.map((role) => (
                            <span
                              key={role}
                              className="label rounded border border-line bg-surface-2 px-1.5 py-0.5 text-muted"
                            >
                              {AGENT_ROLE_LABEL[role] ?? role}
                            </span>
                          ))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
