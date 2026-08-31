import Link from "next/link";

import { Chip, type ChipTone } from "@/components/ui/chip";
import { InlineCodeText } from "@/components/ui/inline-code-text";
import type { SkillSummary, SkillType } from "@/lib/types";

const TYPE_TONE: Record<SkillType, ChipTone> = {
  control: "accent",
  professional: "accent",
  foundation: "violet",
  domain: "violet",
};

export function SkillCard({ skill, showType = true }: { skill: SkillSummary; showType?: boolean }) {
  const jitOnly = skill.type === "foundation" || skill.type === "domain";

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group flex flex-col rounded-xl border border-line bg-surface p-5 no-underline transition-colors duration-150 hover:border-accent-line"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="ident text-[0.8125rem] text-ink group-hover:text-accent">{skill.slug}</span>
        {showType ? (
          <Chip tone={TYPE_TONE[skill.type]}>{skill.type}</Chip>
        ) : null}
        {jitOnly ? <Chip tone="muted">JIT only</Chip> : null}
      </div>

      <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-muted">
        <InlineCodeText>{skill.description}</InlineCodeText>
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line-soft pt-3 text-xs text-muted">
        {skill.groupLabel ? <span>{skill.groupLabel}</span> : null}
        {skill.layer3Count > 0 ? (
          <span className="ident">{skill.layer3Count} Layer 3</span>
        ) : null}
        <span className="ident">{skill.referenceCount} refs</span>
      </div>
    </Link>
  );
}
