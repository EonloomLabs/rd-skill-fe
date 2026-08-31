/**
 * Narrative content for the architecture story. Facts here come from the
 * upstream docs (AGENTS.md, docs/OPERATING_MODEL.md) and the v22 bilingual
 * guide. Nothing here duplicates registry data — skill names, counts and
 * contracts are always read from data/skills.generated.json.
 */

export const HERO = {
  eyebrow: "Engineering control plane for AI coding agents",
  headline: "Make coding agents work like an engineering system.",
  sub: "rd-skills routes every task to the right professional judgment, loads deep expertise only when needed, separates implementation from review, and requires current evidence before completion.",
} as const;

/** The single spine the whole site is organised around. */
export const SPINE = [
  "Intent",
  "Boundary",
  "Owner",
  "JIT expertise",
  "Execution",
  "Validation",
  "Review",
  "Evidence",
  "Closure",
] as const;

export const TYPICAL_AGENT = {
  title: "A typical coding agent",
  flow: ["Prompt", "Search", "Edit", "Test", "Done"],
  failures: [
    "Unclear ownership",
    "Scope drift",
    "Premature abstraction",
    "Insufficient validation",
    "Self-review bias",
    "Stale evidence",
    "Unverified completion",
  ],
} as const;

export const CONTROLLED_PATH = {
  title: "rd-skills",
  flow: [
    "Intent",
    "Decision boundary",
    "Professional owner",
    "Targeted expertise",
    "Bounded implementation",
    "Validation",
    "Independent review",
    "Evidence-backed closure",
  ],
  guarantees: [
    "Exactly one owner per task",
    "Scope fixed by contract",
    "Abstraction needs a proven consumer",
    "Validation after the final edit",
    "Review cannot be self-issued",
    "Evidence invalidated by later edits",
    "Closure requires covered claims",
  ],
} as const;

export const CORE_SYSTEMS = [
  {
    id: "boundary",
    name: "Decision Boundary",
    question: "What may change?",
    blurb:
      "Compiles user intent into an explicit path, authority, scope, acceptance, task contract and stop conditions.",
    items: ["Path", "Authority", "Scope", "Acceptance", "Task Contract", "Stop Conditions"],
  },
  {
    id: "expertise",
    name: "Expertise Injection",
    question: "How is it done professionally?",
    blurb:
      "Selects exactly one Primary Professional, then adds only the Layer 3 expertise the current evidence justifies.",
    items: ["Primary Professional", "Foundation", "Domain", "Targeted References"],
  },
  {
    id: "assurance",
    name: "Assurance Controller",
    question: "Why should anyone believe it is done?",
    blurb:
      "Sets assurance strength, requires fresh validation, keeps an evidence ledger, and gates closure on independent review.",
    items: ["Execution Level", "Validation", "Evidence Freshness", "Review Boundary", "Closure"],
  },
] as const;

export const STEPS = [
  {
    n: "01",
    title: "Request",
    body: "The user states a goal. Nothing is assumed about scope yet.",
  },
  {
    n: "02",
    title: "Classify once",
    body: "One classification decides the path: Direct Task when the facts and boundary are already established, Analyzed Work when owner, placement, verification or material risk is unknown.",
  },
  {
    n: "03",
    title: "Authority",
    body: "Direct Task produces a Direct Task Contract. Analyzed Work produces an Engineering Brief — the single runtime analysis authority that later artifacts may project but never redefine.",
  },
  {
    n: "04",
    title: "Professional owner",
    body: "Every task gets exactly one Primary Professional. Ownership is by engineering decision, not by language or framework.",
  },
  {
    n: "05",
    title: "JIT expertise",
    body: "A selector adds at most three Layer 3 skills, plus the references whose load conditions actually fire.",
  },
  {
    n: "06",
    title: "Execute and validate",
    body: "The Task Agent changes code inside the contract, then runs targeted validation after the final edit.",
  },
  {
    n: "07",
    title: "Independent review",
    body: "A Review Agent reads the exact change, the changed files and the current validation. It cannot repair what it finds.",
  },
  {
    n: "08",
    title: "Evidence-backed closure",
    body: "Completed is allowed only when current evidence covers the completion claim.",
  },
] as const;

export const PLANES = [
  {
    id: "authority",
    name: "Authority Plane",
    tone: "accent",
    blurb: "What is allowed to change, and who decided.",
    parts: ["Core Contract", "Direct Task Contract", "Engineering Brief", "Task Contract", "Completion"],
  },
  {
    id: "knowledge",
    name: "Knowledge Plane",
    tone: "violet",
    blurb: "Which expertise is in context, and why it was loaded.",
    parts: ["Control", "Professional", "Foundation", "Domain", "Targeted References"],
  },
  {
    id: "role",
    name: "Role Plane",
    tone: "accent",
    blurb: "Who may read, write, review and close.",
    parts: ["Main", "Analysis", "Task", "Review"],
  },
  {
    id: "assurance",
    name: "Assurance Plane",
    tone: "green",
    blurb: "How strong the proof must be before a claim stands.",
    parts: ["Execution Level", "Validation", "Evidence Ledger", "Review Boundary", "Scoped Freshness"],
  },
  {
    id: "host",
    name: "Host Adapter Plane",
    tone: "amber",
    blurb: "How the model projects onto each agent host's real capabilities.",
    parts: ["Codex", "Claude", "Copilot", "Cline", "OpenAI API"],
  },
  {
    id: "build",
    name: "Build / QA Plane",
    tone: "muted",
    blurb: "How the runtime is compiled and proven before release.",
    parts: ["Registry", "build.py", "Validation", "Routing evals", "Professional evals", "Release evidence"],
  },
] as const;

export const ROLES = [
  {
    id: "main",
    name: "Main Control Agent",
    role: "main-control-agent",
    can: ["Classify the request", "Assign path and profile", "Compute execution level", "Route review, repair and closure"],
    cannot: ["Read target source", "Implement", "Review"],
  },
  {
    id: "analysis",
    name: "Analysis Agent",
    role: "analysis-agent",
    can: ["Read source, tests and external evidence", "Resolve ambiguity", "Produce the Engineering Brief"],
    cannot: ["Edit code", "Issue the final review"],
  },
  {
    id: "task",
    name: "Task Agent",
    role: "task-agent",
    can: ["Implement or repair one bounded task", "Run targeted validation after the final edit"],
    cannot: ["Reroute itself", "Review its own change"],
  },
  {
    id: "review",
    name: "Review Agent",
    role: "review-agent",
    can: ["Read the exact diff and changed files", "Read current validation", "Report findings"],
    cannot: ["Edit or repair", "Export the diff on the Task Agent's behalf"],
  },
] as const;

export const EVIDENCE_STATES = [
  {
    id: "unverified",
    name: "Unverified",
    tone: "amber",
    blurb: "A change exists. Nothing yet proves it behaves as claimed.",
  },
  {
    id: "validated",
    name: "Validated",
    tone: "accent",
    blurb: "Targeted validation ran after the final edit, with a recorded scope.",
  },
  {
    id: "reviewed",
    name: "Reviewed",
    tone: "violet",
    blurb: "An independent agent read the actual diff and the current evidence.",
  },
  {
    id: "completed",
    name: "Completed",
    tone: "green",
    blurb: "Current evidence covers the completion claim, with proof limits stated.",
  },
] as const;

export const EVIDENCE_DIMENSIONS = [
  { name: "Scope", blurb: "What this evidence actually covers — and what it never touched." },
  { name: "Freshness", blurb: "Whether it was produced after the final edit. A later edit invalidates it." },
  { name: "Proof limit", blurb: "What this evidence cannot establish, stated rather than implied." },
  { name: "Residual risk", blurb: "What remains reachable after the controls that are in place." },
] as const;

export const LEVELS = [
  { id: "L1", name: "Strict minimal", blurb: "Must satisfy both L1 and L2 eligibility. Non-bypassable controls still apply." },
  { id: "L2", name: "Bounded and reversible", blurb: "One bounded owner, local scope, reversible forward fix, known non-production verification, no material unknown." },
  { id: "L3", name: "Default executable task", blurb: "The standard source-backed executable task. This is the default, not an escalation." },
  { id: "L4", name: "Reachable residual risk", blurb: "Material residual impact remains reachable after existing controls, or an explicit policy floor applies." },
  { id: "L5", name: "Extra assurance", blurb: "Confirmed critical L4 where additional assurance materially reduces uncertainty." },
] as const;

export type HostSupport = "native" | "prompt" | "supplied" | "unsupported";

export const HOST_CAPABILITIES = ["Profile", "Skill loading", "Subagent", "Review diff", "Validation"] as const;

export const HOSTS: {
  id: string;
  name: string;
  support: Record<(typeof HOST_CAPABILITIES)[number], HostSupport>;
  note: string;
}[] = [
  {
    id: "codex",
    name: "Codex",
    support: { Profile: "native", "Skill loading": "prompt", Subagent: "native", "Review diff": "native", Validation: "native" },
    note: "Strongest native diff and read-only validation path. Fine-grained tool allowlists are still prompt-enforced.",
  },
  {
    id: "claude",
    name: "Claude",
    support: { Profile: "native", "Skill loading": "native", Subagent: "native", "Review diff": "supplied", Validation: "supplied" },
    note: "Skill loading and subagents are native. Review consumes a supplied diff because there is no verified read-only shell for it.",
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    support: { Profile: "native", "Skill loading": "prompt", Subagent: "native", "Review diff": "supplied", Validation: "supplied" },
    note: "Review has read and search but no execute, so exact supplied diff delivery matters most here.",
  },
  {
    id: "cline",
    name: "Cline",
    support: { Profile: "unsupported", "Skill loading": "unsupported", Subagent: "unsupported", "Review diff": "unsupported", Validation: "unsupported" },
    note: "The control model is projected through prompts only; none of these capabilities are host-native.",
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    support: { Profile: "unsupported", "Skill loading": "unsupported", Subagent: "unsupported", "Review diff": "unsupported", Validation: "unsupported" },
    note: "Ships as generated top-level skill bundles; the harness around them is yours to build.",
  },
];

export const HOST_SUPPORT_LABEL: Record<HostSupport, string> = {
  native: "Native",
  prompt: "Prompt-enforced",
  supplied: "Supplied artifact",
  unsupported: "Not supported",
};

/**
 * The hero demo. `skill` values are registry slugs and are resolved at build
 * time — if upstream renames one, the build fails rather than shipping a name
 * that does not exist.
 */
export const DEMO = {
  request:
    "Add retry support to payment settlement without changing its public API.",
  lines: [
    {
      stage: "classify",
      value: "analyzed work",
      note: "owner, duplicate-effect path and proof are unknown",
      tone: "amber",
      skill: null,
    },
    {
      stage: "authority",
      value: "Engineering Brief",
      note: "the single runtime analysis authority",
      tone: "accent",
      skill: null,
    },
    {
      stage: "owner",
      value: "backend-change-builder",
      note: "exactly one primary professional",
      tone: "accent",
      skill: "backend-change-builder",
    },
    {
      stage: "layer 3",
      value: "idempotency-retry-design",
      note: "+ transaction-consistency",
      tone: "violet",
      skill: "idempotency-retry-design",
    },
    {
      stage: "execute",
      value: "services/settlement/**",
      note: "inside the task contract",
      tone: "muted",
      skill: null,
    },
    {
      stage: "validate",
      value: "targeted tests",
      note: "run after the final edit",
      tone: "green",
      skill: null,
    },
    {
      stage: "review",
      value: "ai-code-review-refactor",
      note: "independent; reads the exact diff",
      tone: "violet",
      skill: "ai-code-review-refactor",
    },
    {
      stage: "evidence",
      value: "fresh",
      note: "covers the duplicate-delivery claim",
      tone: "green",
      skill: null,
    },
    {
      stage: "closure",
      value: "completed",
      note: "proof limit recorded",
      tone: "green",
      skill: null,
    },
  ],
} as const;

export const OPEN_SOURCE = [
  { label: "Source", path: "" },
  { label: "Operating model", path: "blob/master/docs/OPERATING_MODEL.md" },
  { label: "Validation", path: "blob/master/docs/VALIDATION.md" },
  { label: "Skill governance", path: "blob/master/docs/SKILL_CONTENT_GOVERNANCE.md" },
  { label: "Contributing", path: "blob/master/CONTRIBUTING.md" },
  { label: "Governance", path: "blob/master/GOVERNANCE.md" },
  { label: "Security", path: "blob/master/SECURITY.md" },
] as const;
