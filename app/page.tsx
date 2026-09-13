import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DEMO, HERO, OPEN_SOURCE } from "@/content/model";
import { BehaviorContrast } from "@/components/diagram/behavior-contrast";
import { CompareColumns } from "@/components/diagram/compare-columns";
import { CoreSystems } from "@/components/diagram/core-systems";
import { EvidencePillars } from "@/components/diagram/evidence-pillars";
import { HooklessBoundary } from "@/components/diagram/hookless-boundary";
import { HostMatrix } from "@/components/diagram/host-matrix";
import { MechanismTable } from "@/components/diagram/mechanism-table";
import { RiskDistinctions } from "@/components/diagram/risk-distinctions";
import { WorkPaths } from "@/components/diagram/work-paths";
import { PlaneStack } from "@/components/diagram/plane-stack";
import { RoleRelay } from "@/components/diagram/role-relay";
import { SkillTree } from "@/components/diagram/skill-tree";
import { StepsTimeline } from "@/components/diagram/steps-timeline";
import { CommandBlock } from "@/components/terminal/command-block";
import { TaskLifecycle, type LifecycleLine } from "@/components/terminal/task-lifecycle";
import { SkillCard } from "@/components/skills/skill-card";
import { Section } from "@/components/ui/section";
import { StatGrid } from "@/components/ui/stat-grid";
import { AUTHORITY_NOTE, CHANGE_RULES } from "@/content/model";
import { SITE } from "@/lib/site";
import {
  getCounts,
  getDataset,
  getProfessionalsByGroup,
  getSkill,
  resolveLayer3,
  toSummary,
} from "@/lib/skills";

/** Fails the build if the hero demo names a skill the registry does not have. */
function lifecycleLines(): LifecycleLine[] {
  return DEMO.lines.map((line) => {
    if (line.skill && !getSkill(line.skill)) {
      throw new Error(`hero demo references unknown skill "${line.skill}"`);
    }
    return { stage: line.stage, value: line.value, note: line.note, tone: line.tone };
  });
}

export default function Home() {
  const counts = getCounts();
  const { quickstart, explainers } = getDataset();
  const groups = getProfessionalsByGroup();
  const professionals = groups.flatMap((g) => g.skills);
  const featured = groups.flatMap((group) => group.skills.slice(0, 2)).slice(0, 10);

  const tree = professionals.map((professional) => ({
    slug: professional.slug,
    description: professional.description,
    referenceCount: professional.references.length,
    layer3: resolveLayer3(professional).map((item) => item.slug),
  }));

  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <section className="rule-grid border-b border-line">
        <div className="wrap py-20 md:py-28">
          <p className="label text-accent">{HERO.eyebrow}</p>
          <h1 className="mt-5 max-w-[17ch] text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.035em] text-balance md:text-[3.75rem]">
            {HERO.headline}
          </h1>
          <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-muted md:text-lg">
            {HERO.sub}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/quickstart"
              className="flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-on-accent no-underline transition-colors duration-150 hover:bg-accent-hover"
            >
              Get started
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <a
              href={SITE.repo}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 items-center rounded-lg border border-line bg-surface px-4 text-sm text-ink no-underline transition-colors duration-150 hover:border-accent-line"
            >
              View on GitHub
            </a>
          </div>

          <div className="mt-14">
            <TaskLifecycle request={DEMO.request} lines={lifecycleLines()} />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- system facts */}
      <section className="border-b border-line bg-surface py-14">
        <div className="wrap">
          <StatGrid
            items={[
              {
                value: String(counts.runtimeTopLevel),
                label: "Runtime skills",
                note: `${counts.control} control + ${counts.professional} professional at the host top level`,
              },
              {
                value: String(counts.jitItems),
                label: "JIT items",
                note: "Loaded only behind the selected professional",
              },
              {
                value: `0–${counts.maxLayer3PerTask}`,
                label: "Layer 3 per task",
                note: "Only what the current evidence justifies",
              },
              {
                value: "1",
                label: "Primary professional",
                note: "Per task, always — ownership is never shared",
              },
              {
                value: String(counts.agentRoles),
                label: "Agent roles",
                note: "Split by authority and tool boundary, not persona",
              },
              {
                value: String(counts.hostAdapters),
                label: "Host adapters",
                note: "Projected onto each host's real capabilities",
              },
            ]}
          />
          <p className="mt-4 text-xs text-muted">
            Derived at build time from the upstream registry — {counts.sourceTotal} source skills in
            total, {counts.references} targeted references.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------- problem */}
      <Section
        id="problem"
        eyebrow="The problem"
        title="Coding is not engineering."
        lead="The question is not whether a model can write code. It is whether it knows what should change, who owns the decision, what must stay invariant, when evidence is insufficient, and what actually proves the work is complete."
      >
        <CompareColumns />
      </Section>

      {/* ----------------------------------------------------- core model */}
      <Section
        id="model"
        tone="surface"
        eyebrow="Core model"
        title="Three systems. One engineering task."
        lead="Three control systems act on every task at once: the boundary decides what may change, the skills decide how it is done professionally, and assurance decides why anyone should believe it is finished."
      >
        <CoreSystems />
      </Section>

      {/* --------------------------------------------------- how it works */}
      <Section
        id="how"
        eyebrow="How it works"
        title="One request. Seven steps. Two optional branches."
        lead="This is the whole ordinary path. There is no mandatory brief, task contract, handoff or review standing in front of it — those are added only when the engineering facts call for them."
      >
        <StepsTimeline />

        <p className="mt-6 max-w-[74ch] rounded-lg border-l-2 border-accent bg-accent-soft px-5 py-4 text-[0.9375rem] leading-relaxed text-ink">
          {AUTHORITY_NOTE}
        </p>

        <div className="mt-12">
          <h3 className="text-xl font-semibold tracking-[-0.02em]">Four mechanisms, four questions</h3>
          <p className="mt-2 max-w-[68ch] text-[0.9375rem] text-muted">
            These are not four stages every change passes through. Each one answers a different
            question, and only the ones with a question to answer show up.
          </p>
          <div className="mt-6">
            <MechanismTable mechanisms={explainers.mechanisms} />
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-semibold tracking-[-0.02em]">Added only on demand</h3>
          <p className="mt-2 max-w-[68ch] text-[0.9375rem] text-muted">
            Depth is not chosen by a level or a file count. It is chosen by whether an unresolved
            question would actually change the implementation.
          </p>
          <div className="mt-6">
            <WorkPaths />
          </div>
        </div>
      </Section>

      {/* ------------------------------------------- recognising good work */}
      <Section
        id="behaviour"
        tone="surface"
        eyebrow="How to tell it is working"
        title="You should be able to audit it without reading the diff."
        lead="A control plane is only useful if you can recognise when it is doing its job — and when it is performing ceremony instead. These are the signals, straight from the project's usage guide."
      >
        <BehaviorContrast rows={explainers.behavior} />
        <p className="mt-6 max-w-[74ch] text-[0.9375rem] leading-relaxed text-muted">
          rd-skills reuses your existing authorization for bounded, reversible work. It asks when
          the decision is yours: new scope, intended product behaviour, a compatibility break, or
          authority for a destructive, privileged, production or irreversible action.
        </p>
      </Section>

      {/* -------------------------------------------------- six-plane arch */}
      <Section
        id="architecture"
        tone="surface"
        eyebrow="Architecture"
        title="A control plane, not another agent runtime."
        lead="Six responsibility planes constrain the same task simultaneously. When the Task Agent edits a file, its skills, execution level, evidence obligations and authority all apply at once."
      >
        <PlaneStack />
        <p className="mt-6 max-w-[70ch] rounded-lg border-l-2 border-accent bg-accent-soft px-5 py-4 text-[0.9375rem] text-ink">
          These are responsibility planes, not six sequential workflow stages.
        </p>
        <p className="mt-8">
          <Link href="/architecture" className="text-sm text-accent no-underline hover:underline">
            Read the full architecture →
          </Link>
        </p>
      </Section>

      {/* ------------------------------------------------------- hookless */}
      <Section
        id="hookless"
        eyebrow="Boundary"
        title="A control plane that adds no runtime of its own."
        lead="rd-skills is non-intercepting and host-native. It ships prompts, profiles, knowledge and markdown — not a shadow execution environment sitting between you and your agent."
      >
        <HooklessBoundary />
      </Section>

      {/* ---------------------------------------------------- agent roles */}
      <Section
        id="roles"
        eyebrow="Agent roles"
        title="Separation of responsibility by design."
        lead="Roles are split by authority and tool boundary, not by personality. Professionalism comes from skills, which is why four fixed agents can cover a large number of engineering domains."
      >
        <RoleRelay />
      </Section>

      {/* ----------------------------------------------- skill architecture */}
      <Section
        id="skills"
        tone="surface"
        eyebrow="Skill architecture"
        title="Expertise without context explosion."
        lead={`The host sees ${counts.runtimeTopLevel} top-level skills. The remaining ${counts.jitItems} items stay behind the selected professional and load only when the current decision needs them — none of the knowledge is removed, only deferred.`}
      >
        <SkillTree
          professionals={tree}
          jitTotal={counts.jitItems}
          maxPerTask={counts.maxLayer3PerTask}
        />
        <div className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <p className="max-w-[70ch] rounded-lg border-l-2 border-violet bg-violet-soft px-5 py-4 text-[0.9375rem] text-ink">
            Do not load every skill. Load the smallest set of expertise that can materially change
            the current engineering decision.
          </p>
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-1">
            <div className="bg-surface px-4 py-2.5">
              <dt className="text-xs text-muted">Source skills</dt>
              <dd className="ident text-sm text-ink">{counts.sourceTotal}</dd>
            </div>
            <div className="bg-surface px-4 py-2.5">
              <dt className="text-xs text-muted">Top level</dt>
              <dd className="ident text-sm text-ink">{counts.runtimeTopLevel}</dd>
            </div>
            <div className="bg-surface px-4 py-2.5">
              <dt className="text-xs text-muted">JIT only</dt>
              <dd className="ident text-sm text-violet">{counts.jitItems}</dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* ---------------------------------------------------- professionals */}
      <Section
        id="professionals"
        eyebrow="Professional skills"
        title="Engineering judgment, organised by decision ownership."
        lead="Not a Java skill or a React skill. Each professional owns a class of engineering decision; languages, platforms and domains arrive underneath it as Layer 3."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((skill) => (
            <SkillCard key={skill.slug} skill={toSummary(skill)} showType={false} />
          ))}
        </div>
        <p className="mt-8">
          <Link href="/skills" className="text-sm text-accent no-underline hover:underline">
            Browse all {counts.professional} professional skills →
          </Link>
        </p>
      </Section>

      {/* -------------------------------------------------------- evidence */}
      <Section
        id="evidence"
        tone="surface"
        eyebrow="Evidence"
        title="A result is only current if nothing has changed since."
        lead="There is no mandatory evidence ledger. What remains is the part that was always doing the work: read the source now, validate after the last edit, and state plainly what you could not prove."
      >
        <EvidencePillars />
        <div className="mt-10">
          <h3 className="text-xl font-semibold tracking-[-0.02em]">And three rules that keep the change small</h3>
          <dl className="mt-6 grid gap-3 md:grid-cols-3">
            {CHANGE_RULES.map((rule) => (
              <div key={rule.name} className="rounded-xl border border-line bg-surface p-6">
                <dt className="text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em]">
                  {rule.name}
                </dt>
                <dd className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted">{rule.blurb}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* ------------------------------------------------ assurance + hosts */}
      <Section
        id="assurance"
        eyebrow="Risk and hosts"
        title="Risk is reachability, not vocabulary."
        lead="There is no level ladder to climb. Risk handling turns on five distinctions that are easy to collapse — and on what each host surface can actually do."
      >
        <RiskDistinctions />
        <div className="mt-12">
          <h3 className="text-xl font-semibold tracking-[-0.02em]">
            One engineering model. Several host surfaces.
          </h3>
          <p className="mt-2 max-w-[66ch] text-[0.9375rem] text-muted">
            rd-skills projects the control model onto what each host actually supports, and says so
            where a surface falls short.
          </p>
          <div className="mt-6">
            <HostMatrix surfaces={quickstart.surfaces} />
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ quickstart */}
      <Section
        id="quickstart"
        tone="surface"
        eyebrow="Quickstart"
        title="Two commands, then ask in plain language."
        lead="One runtime, no profile flag to choose. These commands come out of the repository at build time, so they cannot drift from what the project actually supports — and the setup page turns them into the exact lines for your agent and scope."
      >
        <div className="grid gap-3 lg:grid-cols-2 [&>*]:min-w-0">
          <div className="flex flex-col gap-3">
            {quickstart.install.map((block, index) => (
              <CommandBlock
                key={block.code}
                code={block.code}
                step={String(index + 1).padStart(2, "0")}
                label="Build, install and check"
                {...(index === 0 ? {} : {})}
              />
            ))}
          </div>
          <div className="min-w-0">
            <CommandBlock code={quickstart.firstTask} label="Your first task" step="02" />
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">
              You do not need to investigate the repository first. Add paths, acceptance criteria or
              a test command when you already know them; otherwise describe the problem and let the
              task agent find the owner, the tests and the callers.
            </p>
            <p className="mt-5">
              <Link
                href="/quickstart"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-on-accent no-underline transition-colors duration-150 hover:bg-accent-hover"
              >
                Set it up for your agent
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </p>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------- open source */}
      <Section
        id="open-source"
        eyebrow="Open source"
        title="Built in the open."
        lead="The registries, the build, the validators and the evaluation harness are all in the repository. So are the governance rules for adding a skill."
      >
        <ul className="flex list-none flex-wrap gap-2 p-0">
          {OPEN_SOURCE.map((item) => (
            <li key={item.label}>
              <a
                href={`${SITE.repo}/${item.path}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm text-ink-2 no-underline transition-colors duration-150 hover:border-accent-line hover:text-ink"
              >
                {item.label}
                <ArrowRight size={13} aria-hidden="true" className="text-muted" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
