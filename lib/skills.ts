import { readFileSync } from "node:fs";
import path from "node:path";

import { PROFESSIONAL_GROUPS } from "@/content/professional-groups";
import type { Skill, SkillDataset, SkillSummary, SkillType } from "@/lib/types";

let cached: SkillDataset | null = null;

/**
 * The single read path for skill data. Nothing else in the app may hold skill
 * facts — see the plan, §3.
 */
export function getDataset(): SkillDataset {
  if (cached) return cached;
  const file = path.join(process.cwd(), "data/skills.generated.json");
  cached = JSON.parse(readFileSync(file, "utf8")) as SkillDataset;
  return cached;
}

export function getCounts() {
  return getDataset().counts;
}

export function getSkills(type?: SkillType): Skill[] {
  const { skills } = getDataset();
  return type ? skills.filter((s) => s.type === type) : skills;
}

export function getSkill(slug: string): Skill | undefined {
  return getDataset().skills.find((s) => s.slug === slug);
}

export function getProfessionals(): Skill[] {
  return getSkills("professional");
}

/** Professionals bucketed into the five decision-ownership groups, in order. */
export function getProfessionalsByGroup() {
  const professionals = getProfessionals();
  return PROFESSIONAL_GROUPS.map((group) => ({
    ...group,
    skills: professionals.filter((s) => s.group === group.id),
  }));
}

/** Layer 3 skills a given professional may pull in, resolved to full records. */
export function resolveLayer3(skill: Skill): Skill[] {
  const byName = new Map(getDataset().skills.map((s) => [s.slug, s]));
  return skill.layer3Candidates
    .map((name) => byName.get(name))
    .filter((s): s is Skill => Boolean(s));
}

/** Professionals that may load a given Layer 3 skill. */
export function resolveConsumers(skill: Skill): Skill[] {
  const byName = new Map(getDataset().skills.map((s) => [s.slug, s]));
  const declared = skill.usedBy
    .map((name) => byName.get(name))
    .filter((s): s is Skill => Boolean(s));
  if (declared.length > 0) return declared;
  return getProfessionals().filter((p) => p.layer3Candidates.includes(skill.slug));
}

export function getDocs() {
  return getDataset().docs;
}

/** Docs that render on their own /docs/<slug> route. */
export function getDocPages() {
  return getDocs().filter((doc) => doc.route === "docs");
}

export function getDoc(slug: string) {
  return getDocs().find((doc) => doc.slug === slug);
}

export function toSummary(skill: Skill): SkillSummary {
  return {
    slug: skill.slug,
    title: skill.title,
    type: skill.type,
    description: skill.description,
    group: skill.group,
    groupLabel: skill.groupLabel,
    roleSupport: skill.roleSupport,
    triggerSignals: skill.triggerSignals,
    layer3Count: skill.layer3Candidates.length,
    referenceCount: skill.references.length,
  };
}

export function githubBlobUrl(relativePath: string): string {
  const { sourceRepo, sourceCommit } = getDataset();
  return `${sourceRepo}/blob/${sourceCommit}/${relativePath}`;
}

export const SKILL_TYPE_LABEL: Record<SkillType, string> = {
  control: "Control",
  professional: "Professional",
  foundation: "Foundation",
  domain: "Domain",
};

export const AGENT_ROLE_LABEL: Record<string, string> = {
  "main-control-agent": "Main",
  "analysis-agent": "Analysis",
  "task-agent": "Task",
  "review-agent": "Review",
};
