/**
 * Narrative content for the architecture story, synced with the v24 runtime
 * model (bilingual guide V24 + docs/HOOKLESS_ARCHITECTURE.md + AGENTS.md).
 *
 * Nothing here duplicates registry data — skill names, counts, contracts, host
 * surfaces and install commands are always read from
 * data/skills.generated.json.
 *
 * v24 removed the fixed process hierarchy: there is no execution-level ladder,
 * no mandatory Engineering Brief, and no mandatory independent review. Depth
 * comes from the engineering facts of the task. Keep that framing intact.
 */

export const HERO = {
  eyebrow: "Engineering control plane for AI coding agents",
  headline: "Turn a plain request into a change you can trust.",
  sub: "rd-skills routes each task to the right professional judgment, lets the implementer find the real owner, requires validation after the final edit, and brings in analysis or an independent reviewer only when the engineering facts call for it.",
} as const;

/** The spine, in the repository's own words. */
export const SPINE = [
  "Request",
  "Repository boundary",
  "Professional guidance",
  "The right owner",
  "Verify actual risk",
  "Independent check",
  "Current results",
] as const;

export const TYPICAL_AGENT = {
  title: "Ordinary AI coding",
  flow: ["Request", "Find code", "Edit", "Run a test", "Done"],
  failures: [
    "Edits a caller instead of the owner",
    "Adds an abstraction nothing needs yet",
    "Tests something other than the change",
    "Validates before the last edit",
    "Reviews its own work",
    "Reports a pass it cannot support",
    "Leaves the unknown unstated",
  ],
} as const;

export const CONTROLLED_PATH = {
  title: "rd-skills",
  flow: [
    "Request",
    "Repository boundary",
    "Professional guidance",
    "The right owner",
    "Verify actual risk",
    "Independent check",
    "Current results",
  ],
  guarantees: [
    "Reads the current code before changing it",
    "Finds the owning code and its consumers",
    "Applies guidance suited to the task and its risks",
    "Makes the smallest complete change it can support",
    "Validates after the final edit",
    "A separate reviewer inspects the actual change",
    "Reports files, results, limits and open decisions",
  ],
} as const;

/** Figure 1 in the v24 guide. */
export const CORE_SYSTEMS = [
  {
    id: "implementation-first",
    name: "Implementation first",
    question: "What is the simplest correct path?",
    blurb:
      "The default route for an implementation request is the task agent: inspect, edit, self-check, then fresh targeted validation. No mandatory brief, contract, handoff or review stands in front of it.",
    items: ["Inspect", "Edit", "Self-check", "Fresh validation", "Report"],
  },
  {
    id: "professional-knowledge",
    name: "Professional knowledge",
    question: "Whose judgment does this need?",
    blurb:
      "Each assignment gets exactly one primary professional, then zero to three Layer 3 skills and only the references the current decision actually requires.",
    items: ["Primary Professional", "Foundation", "Domain", "Targeted References"],
  },
  {
    id: "evidence-driven-depth",
    name: "Evidence-driven depth",
    question: "What would justify going deeper?",
    blurb:
      "Analysis, a brief, a dependency plan and independent review are added because a real question or risk demands them — never because of a level, a file count or a fixed state machine.",
    items: ["Analysis", "Brief", "Dependency Plan", "Independent Review"],
  },
] as const;

/** The priority order the runtime resolves conflicts by. */
export const PRIORITIES = [
  "Engineering correctness",
  "Professional routing accuracy",
  "Quality of professional judgment",
  "Context and token cost",
  "Execution time",
] as const;

/** Figure 2: one ordinary implementation task. */
export const STEPS = [
  {
    n: "01",
    title: "Request",
    body: "You describe the result you want, in plain language. You do not need to investigate the repository first.",
  },
  {
    n: "02",
    title: "Pick the professional",
    body: "Main selects one primary professional and zero to three Layer 3 skills. It never reads your business code itself.",
  },
  {
    n: "03",
    title: "Inspect",
    body: "The task agent finds the owner, the tests and the callers by itself. An unknown local file is discovery work, not a reason to escalate.",
  },
  {
    n: "04",
    title: "Edit",
    body: "The smallest complete change that supports the request. Read scope can widen; write scope cannot.",
  },
  {
    n: "05",
    title: "Self-check",
    body: "Behaviour, impact and structure, checked against what the change was supposed to do.",
  },
  {
    n: "06",
    title: "Fresh validation",
    body: "Run after the final material edit. A later edit makes earlier proof stale, so it does not count.",
  },
  {
    n: "07",
    title: "Report",
    body: "Changed files, results, proof limits, and any decision still waiting on you.",
  },
] as const;

/** The two branches that are taken only when the facts require them. */
export const BRANCHES = [
  {
    id: "analysis",
    name: "Analysis",
    tone: "violet",
    when: "A decision that would change the implementation is still unresolved.",
    yes: [
      "Competing owners",
      "Unclear invariant",
      "Shared consumers or contracts",
      "Concurrency, transaction, recovery",
      "Migration, authority, integration",
    ],
    no: [
      "Unknown local file, owner, test or caller",
      "A small question the implementation can answer",
    ],
  },
  {
    id: "review",
    name: "Independent review",
    tone: "green",
    when: "You ask for it, or independent judgment measurably raises confidence.",
    yes: [
      "You requested a review",
      "A material semantic question remains in the current source",
      "An important failure is poorly covered by local tests",
    ],
    no: ["File count", "Task count", "Number of edits", "Finishing, by itself"],
  },
] as const;

export const PLANES = [
  {
    id: "authority",
    name: "Authority",
    tone: "accent",
    blurb: "What the user and the host actually permit.",
    parts: ["User authorization", "Host enforcement", "Write/effect boundaries", "Environment risk calibration"],
  },
  {
    id: "knowledge",
    name: "Knowledge",
    tone: "violet",
    blurb: "Which expertise is in context, and why it was loaded.",
    parts: ["Control", "Professional", "Foundation", "Domain", "Targeted References"],
  },
  {
    id: "role",
    name: "Role",
    tone: "accent",
    blurb: "Fixed tool boundaries — not a fixed order.",
    parts: ["Main", "Analysis", "Task", "Review"],
  },
  {
    id: "coordination",
    name: "Coordination",
    tone: "green",
    blurb: "What gets added, and only when it is needed.",
    parts: ["Implementation-first", "Optional analysis", "Optional brief", "Optional dependency plan", "Optional review"],
  },
  {
    id: "evidence",
    name: "Evidence",
    tone: "amber",
    blurb: "What can be re-checked by whoever reads it next.",
    parts: ["Current source", "Actual tool results", "Post-final-edit validation", "Diff when needed", "Proof limits"],
  },
  {
    id: "delivery",
    name: "Delivery / QA",
    tone: "muted",
    blurb: "How the runtime is built, shipped and proven.",
    parts: ["Host product surfaces", "Build / package / install", "Routing, context and professional validators"],
  },
] as const;

/** Section 4.2: what a non-intercepting control plane is, and is not. */
export const HOOKLESS = {
  has: [
    "A control prompt",
    "Four agent profiles",
    "Three layers of professional knowledge",
    "Optional markdown artifacts",
    "Validation after the final edit",
    "Independent review on demand",
  ],
  hasNot: [
    "Executable hooks",
    "An interception bridge",
    "A second sandbox",
    "A private runtime evidence store",
    "An internal task-state engine",
  ],
  why: "Control rules stay inspectable, host permission boundaries stay explicit, and the agent is never pulled away from the engineering task in order to satisfy an internal protocol.",
} as const;

export const ROLES = [
  {
    id: "main",
    name: "Main",
    role: "main-control-agent",
    summary: "Dispatch only.",
    can: ["Select the expertise", "Dispatch within the authorized scope", "Pass real results through"],
    cannot: ["Read the target source", "Edit", "Execute", "Review"],
  },
  {
    id: "analysis",
    name: "Analysis",
    role: "analysis-agent",
    summary: "Read-only, on demand.",
    can: [
      "Resolve one source-backed engineering question",
      "Read, search and consult external primary sources",
      "Hand an executable observation back to be run",
    ],
    cannot: ["Edit or mutate", "Dispatch", "Issue the independent review"],
  },
  {
    id: "task",
    name: "Task",
    role: "task-agent",
    summary: "The default implementer.",
    can: [
      "Inspect, implement or repair, self-check",
      "Locate the owner, tests and callers itself",
      "Run targeted validation after the final edit",
    ],
    cannot: ["Dispatch or reroute", "Independently review itself"],
  },
  {
    id: "review",
    name: "Review",
    role: "review-agent",
    summary: "Independent, when it earns its place.",
    can: [
      "Read the current diff or artifact",
      "Read every changed file, owner, tests and consumers",
      "Run read-only checks and report findings",
    ],
    cannot: ["Edit or repair", "Dispatch", "Read external sources independently"],
  },
] as const;

/** Section 18: what evidence has to be, in ordinary work. */
export const EVIDENCE_PILLARS = [
  {
    id: "current-source",
    name: "Current source",
    tone: "accent",
    blurb:
      "Conclusions about owner, behaviour and consumers come from reading the code now — not from inheriting a summary or trusting a locator.",
  },
  {
    id: "fresh-validation",
    name: "Fresh validation",
    tone: "green",
    blurb:
      "Affected behaviour is re-verified after the final material edit. A later edit makes the earlier result stale, and stale results are not reported as current.",
  },
  {
    id: "truthful-limits",
    name: "Truthful limits",
    tone: "amber",
    blurb:
      "Skipped, flaky, unavailable and partial results are reported as they are. Nothing is upgraded into a PASS, and unknown stays unknown.",
  },
] as const;

/** Section 12: five distinctions that keep risk handling honest. */
export const RISK_DISTINCTIONS = [
  {
    left: "Possibility",
    right: "Reachability",
    blurb: "Something being conceivable is not the same as a path an actor can actually take.",
  },
  {
    left: "Unknown",
    right: "Unsafe",
    blurb: "A gap in knowledge is a reason to look, not evidence that a risk exists.",
  },
  {
    left: "Mutability",
    right: "Trust boundary",
    blurb: "Code that can change is not automatically code that crosses a privilege line.",
  },
  {
    left: "Capability",
    right: "Authorization",
    blurb: "A host exposing a tool does not authorize destructive, privileged or production effects.",
  },
  {
    left: "Risk category",
    right: "Material risk",
    blurb: "A security-sounding word is not itself a finding. Reachable impact is.",
  },
] as const;

/** Escalation needs all three at once — section 12.1. */
export const ESCALATION_CONDITIONS = [
  "A less-trusted actor, input or writer",
  "A privilege or a sensitive asset",
  "A reachable path to material impact",
] as const;

/** Section 13: the rules that keep a change small and honest. */
export const CHANGE_RULES = [
  {
    name: "Read scope widens, write scope does not",
    blurb:
      "Finding the real owner and affected consumers can take as much reading as it takes. Discovery never expands what may be written, and destructive, production or privileged effects stay with you and the host.",
  },
  {
    name: "Structure needs a reason that exists today",
    blurb:
      "Future reuse, robustness, consistency and safety are not enough on their own to add an abstraction, protocol, validator, factory, adapter or dependency. A current requirement, real variation or an established boundary is.",
  },
  {
    name: "Two failures means change the hypothesis",
    blurb:
      "After the same path fails twice, something material has to change — the hypothesis, the evidence, the gap. Renaming the attempt or repeating the same analysis does not reset the retry.",
  },
] as const;

export const OPEN_SOURCE = [
  { label: "Source", path: "" },
  { label: "Operating model", path: "blob/master/docs/OPERATING_MODEL.md" },
  { label: "Hookless architecture", path: "blob/master/docs/HOOKLESS_ARCHITECTURE.md" },
  { label: "Validation", path: "blob/master/docs/VALIDATION.md" },
  { label: "Skill governance", path: "blob/master/docs/SKILL_CONTENT_GOVERNANCE.md" },
  { label: "Contributing", path: "blob/master/CONTRIBUTING.md" },
  { label: "Governance", path: "blob/master/GOVERNANCE.md" },
  { label: "Security", path: "blob/master/SECURITY.md" },
] as const;

/**
 * The hero demo. `skill` values are registry slugs and are resolved at build
 * time — if upstream renames one, the build fails rather than shipping a name
 * that does not exist.
 */
export const DEMO = {
  request: "Payment callbacks sometimes create the same order twice. Find the cause and fix it.",
  lines: [
    {
      stage: "route",
      value: "backend-change-builder",
      note: "one primary professional, chosen once",
      tone: "accent",
      skill: "backend-change-builder",
    },
    {
      stage: "layer 3",
      value: "idempotency-retry-design",
      note: "+ transaction-consistency, selector-authorised",
      tone: "violet",
      skill: "idempotency-retry-design",
    },
    {
      stage: "inspect",
      value: "owner, tests, callers",
      note: "task agent reads current source itself",
      tone: "muted",
      skill: null,
    },
    {
      stage: "analysis",
      value: "duplicate-effect path",
      note: "on demand: the invariant changes the fix",
      tone: "violet",
      skill: null,
    },
    {
      stage: "edit",
      value: "smallest complete change",
      note: "read scope widened; write scope did not",
      tone: "muted",
      skill: null,
    },
    {
      stage: "validate",
      value: "RED reproduces, then GREEN",
      note: "run after the final material edit",
      tone: "green",
      skill: null,
    },
    {
      stage: "review",
      value: "ai-code-review-refactor",
      note: "on demand: money invariant is hard to cover locally",
      tone: "green",
      skill: "ai-code-review-refactor",
    },
    {
      stage: "report",
      value: "files, results, proof limit",
      note: "production replay behaviour stays unproven",
      tone: "amber",
      skill: null,
    },
  ],
} as const;
