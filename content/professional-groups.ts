/**
 * Decision-ownership grouping for the 25 Professional Skills.
 *
 * This is the ONLY curated classification in the site. It carries no skill
 * facts — every trigger, contract, input and reference still comes from the
 * upstream registry. It exists because the registry has no `group` field for
 * professional skills, and the site groups them by *who owns which decision*
 * rather than by technology, per the product model.
 *
 * The sync script fails the build if a professional skill in the registry is
 * missing here, so upstream additions can never be silently dropped.
 */

export const PROFESSIONAL_GROUPS = [
  {
    id: "intake-planning",
    label: "Intake, analysis and planning",
    blurb: "Turn a request into bounded, source-backed engineering intent.",
  },
  {
    id: "impact-architecture",
    label: "Impact, domain and architecture",
    blurb: "Decide what the change really touches, and who owns the rule.",
  },
  {
    id: "implementation-owner",
    label: "Implementation owners",
    blurb: "Exactly one of these owns any given implementation task.",
  },
  {
    id: "assurance-gate",
    label: "Quality, security, reliability and delivery gates",
    blurb: "Decide what must be proven before the work can be called done.",
  },
  {
    id: "review-governance",
    label: "Independent review, incident and routing governance",
    blurb: "Look at the actual change, not at the story about the change.",
  },
] as const;

export type ProfessionalGroupId = (typeof PROFESSIONAL_GROUPS)[number]["id"];

export const PROFESSIONAL_GROUP_BY_SKILL: Record<string, ProfessionalGroupId> = {
  "change-intake-compiler": "intake-planning",
  "engineering-change-analysis": "intake-planning",
  "acceptance-criteria-builder": "intake-planning",
  "task-dag-planner": "intake-planning",

  "experience-impact-modeler": "impact-architecture",
  "domain-impact-modeler": "impact-architecture",
  "architecture-impact-reviewer": "impact-architecture",
  "high-risk-design-review": "impact-architecture",
  "engineering-artifact-review": "impact-architecture",

  "frontend-change-builder": "implementation-owner",
  "backend-change-builder": "implementation-owner",
  "data-api-contract-changer": "implementation-owner",
  "data-middleware-change-builder": "implementation-owner",
  "integration-change-builder": "implementation-owner",
  "installed-client-change-builder": "implementation-owner",
  "platform-infrastructure-change-builder": "implementation-owner",
  "repository-tooling-change-builder": "implementation-owner",

  "quality-test-gate": "assurance-gate",
  "security-privacy-gate": "assurance-gate",
  "reliability-observability-gate": "assurance-gate",
  "logging-design-gate": "assurance-gate",
  "delivery-release-gate": "assurance-gate",
  "change-documentation-gate": "assurance-gate",

  "ai-code-review-refactor": "review-governance",
  "incident-response-coordinator": "review-governance",
  "routing-quality-review": "review-governance",
};

/** Registry group ids for foundation skills get readable labels here only. */
export const FOUNDATION_GROUP_LABELS: Record<string, string> = {
  "architecture-design": "Architecture & design",
  "backend-engineering": "Backend engineering",
  "cross-cutting-safety": "Cross-cutting safety",
  "data-api-contracts": "Data & API contracts",
  "data-middleware": "Data & middleware",
  "delivery-platform": "Delivery & platform",
  "domain-engineering": "Domain engineering",
  "domain-modeling": "Domain modeling",
  "engineering-workflow": "Engineering workflow",
  "experience-design": "Experience design",
  "frontend-engineering": "Frontend engineering",
  "intake-requirements": "Intake & requirements",
  "interface-contracts": "Interface contracts",
  "language-professional-usage": "Language usage",
  "quality-testing": "Quality & testing",
  "reliability-operations": "Reliability & operations",
  "repository-intelligence": "Repository intelligence",
  "security-privacy": "Security & privacy",
  "technology-selection": "Technology selection",
};
