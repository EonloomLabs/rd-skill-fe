export type SkillType = "control" | "professional" | "foundation" | "domain";

export type AgentRole =
  | "main-control-agent"
  | "analysis-agent"
  | "task-agent"
  | "review-agent";

export type DeliveryScope = "product" | "dev-only" | "authoring-only";

export interface SkillReference {
  path: string;
  type: string;
  loadWhen: string;
  doNotLoadWhen: string;
  requiredBy: string[];
  requiredOutput: string[];
}

export interface Skill {
  /** registry identifier, e.g. backend-change-builder */
  name: string;
  slug: string;
  /** display form derived from name; never authored by hand */
  title: string;
  type: SkillType;
  /** one-line purpose, from the SKILL.md frontmatter */
  description: string;
  /** registry group for foundation; curated decision-ownership group for professional */
  group: string | null;
  groupLabel: string | null;
  deliveryScope: DeliveryScope | null;
  routingMode: string | null;
  routingFamily: string | null;
  taskRoutable: boolean | null;
  contentClass: string | null;
  roleSupport: AgentRole[];
  triggerSignals: string[];
  boundarySignals: string[];
  antiTriggerSignals: string[];
  requiredInputs: string[];
  outputContract: string[];
  escalationSignals: string[];
  /** professional -> candidate Layer 3 skills it may pull in */
  layer3Candidates: string[];
  /** foundation/domain -> professionals that may load it */
  usedBy: string[];
  expertiseTags: string[];
  references: SkillReference[];
  sourcePath: string;
  sourceUrl: string;
  /** exposed to the host as a top-level skill (control + professional only) */
  runtimeTopLevel: boolean;
  /** loadable just-in-time behind a professional (product foundation + domain) */
  runtimeJit: boolean;
}

/** The slim shape sent to client islands — no reference bodies, no tags. */
export interface SkillSummary {
  slug: string;
  title: string;
  type: SkillType;
  description: string;
  group: string | null;
  groupLabel: string | null;
  roleSupport: AgentRole[];
  triggerSignals: string[];
  layer3Count: number;
  referenceCount: number;
}

export interface SkillCounts {
  sourceTotal: number;
  control: number;
  professional: number;
  foundation: number;
  foundationProduct: number;
  foundationNonRuntime: number;
  domain: number;
  runtimeTopLevel: number;
  jitItems: number;
  layer3Source: number;
  references: number;
  maxLayer3PerTask: number;
  agentRoles: number;
  knowledgeLayers: number;
  hostAdapters: number;
}

export interface QuickstartBlock {
  /** heading the block was extracted from */
  section: string;
  language: string;
  code: string;
}

/** Derived from the installer's own agent/scope tables. */
export interface HostSetup {
  agent: string;
  /** install scopes this agent actually supports */
  scopes: string[];
  /** receives native agent profile files */
  agentProfiles: boolean;
  /** where a project install lands, relative to the project root */
  projectSubpath: string | null;
  /** scope -> default install path, for scopes that have one */
  defaultTargets: Record<string, string>;
  /** false for hosts that only produce bundles (no runtime install or doctor) */
  installable: boolean;
}

/** One row of the README's host surface table. */
export interface HostSurface {
  /** installer agent id this row describes, when one matches */
  agent: string | null;
  host: string;
  artifacts: string;
  invocation: string;
  workflow: string;
  limit: string;
}

export interface Quickstart {
  /** shell blocks from the upstream README "Start" section, in order */
  install: QuickstartBlock[];
  /** the first-task request template from "Submit A First Task" */
  firstTask: string;
  hosts: string[];
  /** per-host install matrix, read from the installer source */
  setup: HostSetup[];
  /** artifact delivery / invocation / workflow, from the README table */
  surfaces: HostSurface[];
  /** scopes the CLI accepts at all */
  scopes: string[];
  sourceUrl: string;
}

export interface DocHeading {
  id: string;
  text: string;
  depth: number;
}

/** An upstream document rendered for on-site reading. */
export interface DocPage {
  slug: string;
  /** repository-relative path, e.g. docs/OPERATING_MODEL.md */
  file: string;
  title: string;
  summary: string;
  group: string;
  /** "docs" renders at /docs/<slug>; "quickstart" folds into /quickstart */
  route: "docs" | "quickstart";
  html: string;
  headings: DocHeading[];
  words: number;
  url: string;
}

export interface SkillDataset {
  generatedAt: string;
  sourceRepo: string;
  sourceRef: string;
  sourceCommit: string;
  /** true when the build fell back to the committed snapshot */
  degraded: boolean;
  skills: Skill[];
  counts: SkillCounts;
  quickstart: Quickstart;
  docs: DocPage[];
}
