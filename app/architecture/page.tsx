import type { Metadata } from "next";
import Link from "next/link";

import { AssuranceLadder } from "@/components/diagram/assurance-ladder";
import { AuthorityChains } from "@/components/diagram/authority-chains";
import { BuildPipeline } from "@/components/diagram/build-pipeline";
import { HostMatrix } from "@/components/diagram/host-matrix";
import { PlaneStack } from "@/components/diagram/plane-stack";
import { RoleRelay } from "@/components/diagram/role-relay";
import { StepsTimeline } from "@/components/diagram/steps-timeline";
import { Section } from "@/components/ui/section";
import { EVIDENCE_DIMENSIONS } from "@/content/model";
import { getCounts } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Architecture",
  description:
    "The six responsibility planes of rd-skills: authority, knowledge, roles, assurance, host adapters and build/QA — plus the two authority chains and the evidence model.",
};

export default function ArchitecturePage() {
  const counts = getCounts();

  return (
    <>
      <section className="rule-grid border-b border-line">
        <div className="wrap py-16 md:py-24">
          <p className="label text-accent">Architecture</p>
          <h1 className="mt-4 max-w-[20ch] text-[2rem] font-semibold leading-[1.08] tracking-[-0.032em] text-balance md:text-[3rem]">
            Six responsibility planes, acting at the same time.
          </h1>
          <p className="mt-6 max-w-[66ch] text-[1.0625rem] leading-relaxed text-muted md:text-lg">
            rd-skills is not a hidden agent runtime and not a fixed pipeline. It is a set of planes
            that constrain the same task concurrently — when the Task Agent edits a file, its
            skills, execution level, evidence obligations and authority all apply at once.
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
        id="authority"
        tone="surface"
        eyebrow="Authority"
        title="Two chains, one classification."
        lead="The path is chosen once. A Direct Task never creates an Engineering Brief; in Analyzed Work the Engineering Brief is the only runtime analysis authority, and later artifacts may project it but never redefine its protected decisions."
      >
        <AuthorityChains />
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
        lead="Classification happens once, and everything downstream consumes that decision instead of re-deriving it."
      >
        <StepsTimeline />
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
        lead="Evidence is not a test result. It is a test result with a scope, a timestamp relative to the final edit, a statement of what it cannot prove, and the risk that remains."
      >
        <dl className="grid gap-3 md:grid-cols-4">
          {EVIDENCE_DIMENSIONS.map((dimension) => (
            <div key={dimension.name} className="rounded-xl border border-line bg-surface p-5">
              <dt className="text-[0.9375rem] font-semibold tracking-[-0.01em]">{dimension.name}</dt>
              <dd className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{dimension.blurb}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8">
          <AssuranceLadder />
        </div>
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
        title="One engineering model. Multiple agent hosts."
        lead="rd-skills projects the control model into each host's available capabilities. Where a capability is absent, the matrix says so."
      >
        <HostMatrix />
      </Section>
    </>
  );
}
