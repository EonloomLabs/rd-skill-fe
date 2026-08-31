import type { Metadata } from "next";
import { Suspense } from "react";

import { SkillExplorer, type ExplorerFacet } from "@/components/skills/skill-explorer";
import { PROFESSIONAL_GROUPS } from "@/content/professional-groups";
import { AGENT_ROLE_LABEL, getCounts, getDataset, toSummary } from "@/lib/skills";
import type { SkillType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Every rd-skills skill, organised by decision ownership: 25 professional owners at the host top level, plus the foundation and domain expertise loaded just in time behind them.",
};

const TYPE_ORDER: SkillType[] = ["professional", "foundation", "domain", "control"];

export default function SkillsPage() {
  const { skills } = getDataset();
  const counts = getCounts();
  const summaries = skills.map(toSummary);

  const typeFacets: ExplorerFacet[] = TYPE_ORDER.map((type) => ({
    id: type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
    count: summaries.filter((s) => s.type === type).length,
  }));

  const groupIds = new Map<string, string>();
  for (const group of PROFESSIONAL_GROUPS) groupIds.set(group.id, group.label);
  for (const skill of summaries) {
    if (skill.group && skill.groupLabel && !groupIds.has(skill.group)) {
      groupIds.set(skill.group, skill.groupLabel);
    }
  }
  const groupFacets: ExplorerFacet[] = [...groupIds.entries()]
    .map(([id, label]) => ({
      id,
      label,
      count: summaries.filter((s) => s.group === id).length,
    }))
    .filter((facet) => facet.count > 0);

  const roleFacets: ExplorerFacet[] = Object.entries(AGENT_ROLE_LABEL).map(([id, label]) => ({
    id,
    label,
    count: summaries.filter((s) => s.roleSupport.includes(id as never)).length,
  }));

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-16 md:py-20">
          <p className="label text-accent">Skill explorer</p>
          <h1 className="mt-4 max-w-[20ch] text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-balance md:text-[2.75rem]">
            Engineering judgment, organised by decision ownership.
          </h1>
          <p className="mt-5 max-w-[68ch] text-[1.0625rem] leading-relaxed text-muted">
            {counts.runtimeTopLevel} skills sit at the host top level: {counts.control} control and{" "}
            {counts.professional} professional. The other {counts.jitItems} are foundation and
            domain expertise that only a selected professional can pull in, at most{" "}
            {counts.maxLayer3PerTask} per task.
          </p>
        </div>
      </section>

      <section className="wrap py-12 md:py-16">
        <Suspense fallback={<p className="text-sm text-muted">Loading skills…</p>}>
          <SkillExplorer
            skills={summaries}
            typeFacets={typeFacets}
            groupFacets={groupFacets}
            roleFacets={roleFacets}
          />
        </Suspense>
      </section>
    </>
  );
}
