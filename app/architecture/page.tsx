import type { Metadata } from "next";
import Link from "next/link";

import { BuildPipeline } from "@/components/diagram/build-pipeline";
import { EvidencePillars } from "@/components/diagram/evidence-pillars";
import { HooklessBoundary } from "@/components/diagram/hookless-boundary";
import { HostMatrix } from "@/components/diagram/host-matrix";
import { PlaneStack } from "@/components/diagram/plane-stack";
import { RiskDistinctions } from "@/components/diagram/risk-distinctions";
import { RoleRelay } from "@/components/diagram/role-relay";
import { StepsTimeline } from "@/components/diagram/steps-timeline";
import { WorkPaths } from "@/components/diagram/work-paths";
import { Section } from "@/components/ui/section";
import { CHANGE_RULES } from "@/content/model";
import { getCounts, getDataset } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "The six responsibility planes of rd-skills: authority, knowledge, roles, assurance, host adapters and build/QA — plus the two authority chains and the evidence model.",
};

export default function ArchitecturePage() {
  const counts = getCounts();
  const { quickstart } = getDataset();

  return (
    <>
      <section className="rule-grid border-b border-line">
        <div className="wrap py-16 md:py-24">
          <p className="label text-accent">Architecture</p>
          <h1 className="mt-4 max-w-[20ch] text-[2rem] font-semibold leading-[1.08] tracking-[-0.032em] text-balance md:text-[3rem]">
            Six responsibility planes, acting at the same time.
          </h1>
          <p className="mt-6 max-w-[66ch] text-[1.0625rem] leading-relaxed text-muted md:text-lg">
            rd-skills is a non-intercepting, host-native control plane — not a hidden agent runtime
            and not a fixed pipeline. Six responsibility planes combine as a task needs them, and
            there is no process hierarchy to climb.
          </p>
        </div>
      </section>

      <Section
        id="planes"
        eyebrow="Planes"
        title="What each plane is responsible for."
        lead="Read this as six concerns, not six steps. Nothing here runs in sequence."
      >
        <PlaneStack />
      </Section>

      <Section
        id="boundary"
        tone="surface"
        eyebrow="Boundary"
        title="What it has, and what it deliberately has not."
        lead="The hookless boundary is the design decision everything else rests on: control rules stay inspectable, host permissions stay explicit, and no internal protocol competes with the engineering task."
      >
        <HooklessBoundary />
      </Section>

      <Section
        id="roles"
        eyebrow="Roles"
        title="Authority and tool boundaries, not personas."
        lead={`${counts.agentRoles} fixed agents cover a large number of engineering domains because professionalism comes from skills rather than from the agent itself.`}
      >
        <RoleRelay />
      </Section>

      <Section
        id="flow"
        tone="surface"
        eyebrow="Execution"
        title="What actually happens to one request."
        lead="An implementation request goes straight to the task agent. Analysis and independent review are branches taken when the facts require them, not stages every task passes through."
      >
        <StepsTimeline />
        <div className="mt-10">
          <WorkPaths />
        </div>
      </Section>

      <Section
        id="knowledge"
        eyebrow="Knowledge"
        title="Three layers, one fixed runtime surface."
        lead={`The repository holds ${counts.sourceTotal} source skills. The host sees ${counts.runtimeTopLevel}. The difference is not lost capability — it is deferred loading.`}
      >
        <dl className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              value: counts.control,
              name: "Control",
              blurb: "Runtime top level. Classifies, dispatches, and routes review, repair and closure.",
              tone: "accent",
            },
            {
              value: counts.professional,
              name: "Professional",
              blurb: "Runtime top level. Exactly one primary professional owns each task.",
              tone: "accent",
            },
            {
              value: counts.foundationProduct,
              name: "Product Foundation",
              blurb: "Capability modifiers, loaded JIT through the professional selector. Never a host top-level skill.",
              tone: "violet",
            },
            {
              value: counts.domain,
              name: "Domain",
              blurb: "Modifier-only. Adds domain invariants and proof obligations; never owns a primary route.",
              tone: "violet",
            },
          ].map((layer) => (
            <div key={layer.name} className="rounded-xl border border-line bg-surface p-6">
              <dt>
                <span
                  className={`ident block text-[1.75rem] font-medium leading-none tracking-[-0.03em] ${
                    layer.tone === "violet" ? "text-violet" : "text-accent"
                  }`}
                >
                  {layer.value}
                </span>
                <span className="mt-3 block text-[0.9375rem] font-semibold tracking-[-0.01em]">
                  {layer.name}
                </span>
              </dt>
              <dd className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{layer.blurb}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-[70ch] rounded-lg border-l-2 border-violet bg-violet-soft px-5 py-4 text-[0.9375rem] text-ink">
          Fixed request path: user → control → primary professional → selector → 0..
          {counts.maxLayer3PerTask} Layer 3 → required references. Task and review consume that
          routing decision; they never re-run the global router.
        </p>
        <p className="mt-6 text-[0.8125rem] text-muted">
          {counts.foundationNonRuntime} further foundation skills are authoring- or dev-only. They
          take part in source and internal validation, and never reach a runtime.
        </p>
        <p className="mt-8">
          <Link href="/skills" className="text-sm text-accent no-underline hover:underline">
            Explore all {counts.sourceTotal} skills →
          </Link>
        </p>
      </Section>

      <Section
        id="evidence"
        tone="surface"
        eyebrow="Evidence"
        title="Every claim carries its own limits."
        lead="Evidence is a result someone else can re-check: current source, an actual tool result, validation that survived the last edit, and a plain statement of what it does not prove."
      >
        <EvidencePillars />
        <dl className="mt-3 grid gap-3 md:grid-cols-3">
          {CHANGE_RULES.map((rule) => (
            <div key={rule.name} className="rounded-xl border border-line bg-surface p-6">
              <dt className="text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em]">
                {rule.name}
              </dt>
              <dd className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted">{rule.blurb}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section
        id="risk"
        eyebrow="Risk and authority"
        title="No level ladder. Five distinctions instead."
        lead="Risk handling turns on real reachability, trust boundaries, authority and material impact — never on a score, a severity ladder or a substitute state machine."
      >
        <RiskDistinctions />
      </Section>

      <Section
        id="build"
        eyebrow="Build"
        title="Authoring source becomes a host-consumable projection."
        lead="Validators and evals produce authoring, regression and release evidence. They are not stages of a user's task."
      >
        <BuildPipeline />
      </Section>

      <Section
        id="hosts"
        tone="surface"
        eyebrow="Hosts"
        title="One engineering model. Several host surfaces."
        lead="Artifact delivery, live invocation and full workflow are three different questions. The table keeps them apart rather than collapsing them into a single claim of support."
      >
        <HostMatrix surfaces={quickstart.surfaces} />
      </Section>
    </>
  );
}
