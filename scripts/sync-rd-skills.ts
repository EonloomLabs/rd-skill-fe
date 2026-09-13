/**
 * Build-time sync: upstream rd-skills registry -> data/skills.generated.json
 *
 * Source priority (PRD §18):
 *   P0  vendor/rd-skills/src/registry/*.yaml   (git submodule, authoritative)
 *   P1  SKILL.md frontmatter for one-line descriptions
 *   P2  data/skills.snapshot.json              (last-known-good, committed)
 *
 * The website reads data/skills.generated.json and nothing else. If the
 * submodule is missing or a registry fails validation, we fall back to the
 * snapshot, mark the dataset degraded and let the build succeed.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

import {
  FOUNDATION_GROUP_LABELS,
  PROFESSIONAL_GROUPS,
  PROFESSIONAL_GROUP_BY_SKILL,
} from "../content/professional-groups";
import { readExplainers } from "./read-explainers";
import { readInstallerMatrix } from "./read-installer";
import { renderDocs } from "./render-docs";
import type {
  AgentRole,
  HostSurface,
  Quickstart,
  QuickstartBlock,
  Skill,
  SkillCounts,
  SkillDataset,
  SkillReference,
  SkillType,
} from "../lib/types";

const ROOT = path.resolve(__dirname, "..");
const VENDOR = path.join(ROOT, "vendor/rd-skills");
const REGISTRY = path.join(VENDOR, "src/registry");
const OUT = path.join(ROOT, "data/skills.generated.json");
const SNAPSHOT = path.join(ROOT, "data/skills.snapshot.json");

const REPO = "https://github.com/machenjie/rd-skills";
const REF = process.env.RD_SKILLS_REF ?? "master";

const ACRONYMS: Record<string, string> = {
  ai: "AI",
  api: "API",
  dag: "DAG",
  sdk: "SDK",
  ios: "iOS",
  ipados: "iPadOS",
  os: "OS",
  iot: "IoT",
  ui: "UI",
  ux: "UX",
  macos: "macOS",
  bigdata: "Big Data",
  web3: "Web3",
};

function titleFromName(name: string): string {
  return name
    .split("-")
    .map((part) => ACRONYMS[part] ?? part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function readDescription(skillPath: string): string {
  const file = path.join(VENDOR, skillPath, "SKILL.md");
  if (!existsSync(file)) return "";
  const raw = readFileSync(file, "utf8");
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!fm) return "";
  const line = /^description:\s*(.*)$/m.exec(fm[1]);
  if (!line) return "";
  return line[1].trim().replace(/^["']/, "").replace(/["']$/, "");
}

function normalizeReferences(value: unknown): SkillReference[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): SkillReference[] => {
    if (typeof entry !== "object" || entry === null) return [];
    const e = entry as Record<string, unknown>;
    if (typeof e.path !== "string") return [];
    return [
      {
        path: e.path,
        type: typeof e.type === "string" ? e.type : "targeted",
        loadWhen: typeof e.load_when === "string" ? e.load_when : "",
        doNotLoadWhen: typeof e.do_not_load_when === "string" ? e.do_not_load_when : "",
        requiredBy: asStringArray(e.required_by),
        requiredOutput: asStringArray(e.required_output),
      },
    ];
  });
}

function loadRegistry(file: string, key: string): Record<string, unknown>[] {
  const full = path.join(REGISTRY, file);
  if (!existsSync(full)) throw new Error(`registry not found: ${full}`);
  const doc = parseYaml(readFileSync(full, "utf8")) as Record<string, unknown>;
  const list = doc?.[key];
  if (!Array.isArray(list)) throw new Error(`${file}: missing "${key}" list`);
  return list as Record<string, unknown>[];
}

function submoduleCommit(): string {
  try {
    return execFileSync("git", ["-C", VENDOR, "rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim();
  } catch {
    return REF;
  }
}

function normalize(entry: Record<string, unknown>, type: SkillType, commit: string): Skill {
  const name = String(entry.name);
  const sourcePath = String(entry.path);
  const deliveryScope =
    typeof entry.delivery_scope === "string"
      ? (entry.delivery_scope as Skill["deliveryScope"])
      : null;

  const registryGroup = typeof entry.group === "string" ? entry.group : null;
  const group =
    type === "professional" ? (PROFESSIONAL_GROUP_BY_SKILL[name] ?? null) : registryGroup;
  const groupLabel =
    type === "professional"
      ? (PROFESSIONAL_GROUPS.find((g) => g.id === group)?.label ?? null)
      : group
        ? (FOUNDATION_GROUP_LABELS[group] ?? titleFromName(group))
        : null;

  return {
    name,
    slug: name,
    title: titleFromName(name),
    type,
    description: readDescription(sourcePath),
    group,
    groupLabel,
    deliveryScope,
    routingMode: typeof entry.routing_mode === "string" ? entry.routing_mode : null,
    routingFamily: typeof entry.routing_family === "string" ? entry.routing_family : null,
    taskRoutable: typeof entry.task_routable === "boolean" ? entry.task_routable : null,
    contentClass: typeof entry.content_class === "string" ? entry.content_class : null,
    roleSupport: asStringArray(entry.role_support) as AgentRole[],
    triggerSignals: asStringArray(entry.trigger_signals),
    boundarySignals: asStringArray(entry.boundary_signals),
    antiTriggerSignals: asStringArray(entry.anti_trigger_signals),
    requiredInputs: asStringArray(entry.required_inputs),
    outputContract: asStringArray(entry.output_contract),
    escalationSignals: asStringArray(entry.escalation_signals),
    layer3Candidates: asStringArray(entry.layer3_candidates),
    usedBy: asStringArray(entry.used_by),
    expertiseTags: asStringArray(entry.required_expertise_tags),
    references: normalizeReferences(entry.reference_index),
    sourcePath,
    sourceUrl: `${REPO}/blob/${commit}/${sourcePath}/SKILL.md`,
    runtimeTopLevel: type === "control" || type === "professional",
    runtimeJit: type === "domain" || (type === "foundation" && deliveryScope === "product"),
  };
}

function countOf(skills: Skill[], type: SkillType) {
  return skills.filter((s) => s.type === type).length;
}

function buildCounts(skills: Skill[], hostAdapters: number): SkillCounts {
  const foundation = skills.filter((s) => s.type === "foundation");
  return {
    sourceTotal: skills.length,
    control: countOf(skills, "control"),
    professional: countOf(skills, "professional"),
    foundation: foundation.length,
    foundationProduct: foundation.filter((s) => s.deliveryScope === "product").length,
    foundationNonRuntime: foundation.filter((s) => s.deliveryScope !== "product").length,
    domain: countOf(skills, "domain"),
    runtimeTopLevel: skills.filter((s) => s.runtimeTopLevel).length,
    jitItems: skills.filter((s) => s.runtimeJit).length,
    layer3Source: skills.filter((s) => s.type === "foundation" || s.type === "domain").length,
    references: skills.reduce((sum, s) => sum + s.references.length, 0),
    maxLayer3PerTask: 3,
    agentRoles: 4,
    knowledgeLayers: 3,
    hostAdapters,
  };
}

/** Assertions that must hold, or the dataset is not publishable. */
function validate(skills: Skill[], counts: SkillCounts): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const skill of skills) {
    if (seen.has(skill.slug)) problems.push(`duplicate slug: ${skill.slug}`);
    seen.add(skill.slug);
    if (!skill.description) problems.push(`${skill.slug}: no description in SKILL.md frontmatter`);
    if (skill.type === "professional") {
      if (!skill.group) problems.push(`${skill.slug}: not assigned a group in content/professional-groups.ts`);
      if (skill.triggerSignals.length === 0) problems.push(`${skill.slug}: no trigger signals`);
      if (skill.outputContract.length === 0) problems.push(`${skill.slug}: no output contract`);
    }
  }

  const layer3Names = new Set(
    skills.filter((s) => s.type === "foundation" || s.type === "domain").map((s) => s.slug),
  );
  for (const skill of skills) {
    for (const candidate of skill.layer3Candidates) {
      if (!layer3Names.has(candidate)) {
        problems.push(`${skill.slug}: layer3 candidate "${candidate}" is not a known Layer 3 skill`);
      }
    }
  }

  if (counts.control !== 1) problems.push(`expected exactly 1 control skill, got ${counts.control}`);
  if (counts.runtimeTopLevel !== counts.control + counts.professional) {
    problems.push("runtime top-level count does not equal control + professional");
  }
  return problems;
}

/**
 * Quickstart facts are extracted from the upstream README, never authored here.
 * The README is rewritten between releases, so every assumption below is an
 * assertion: if a section disappears or a command grows a flag the runtime no
 * longer accepts, the sync fails and the site falls back to the snapshot rather
 * than publishing instructions that do not work.
 */
function loadQuickstart(commit: string): Quickstart {
  const file = path.join(VENDOR, "README.md");
  if (!existsSync(file)) throw new Error(`README not found: ${file}`);
  const readme = readFileSync(file, "utf8");

  const sectionOf = (heading: string): string => {
    const start = readme.indexOf(`## ${heading}`);
    if (start === -1) throw new Error(`README: missing "## ${heading}" section`);
    const rest = readme.slice(start + 3);
    const end = rest.indexOf("\n## ");
    return end === -1 ? rest : rest.slice(0, end);
  };

  const blocksIn = (section: string, heading: string): QuickstartBlock[] => {
    const out: QuickstartBlock[] = [];
    const fence = /```([a-z]*)\n([\s\S]*?)```/g;
    let match: RegExpExecArray | null;
    while ((match = fence.exec(section)) !== null) {
      out.push({ section: heading, language: match[1] || "text", code: match[2].trim() });
    }
    return out;
  };

  const installSection = sectionOf("Install");
  const install = blocksIn(installSection, "Install").filter((b) => b.language === "bash");
  const firstTask = blocksIn(sectionOf("First task"), "First task")[0]?.code ?? "";

  const hostSection = sectionOf("Supported hosts");
  const hostSentence = /Supported hosts are ([^.]+)\./.exec(hostSection);
  const hosts = hostSentence
    ? [...hostSentence[1].matchAll(/`([a-z0-9-]+)`/g)].map((m) => m[1])
    : [];
  if (hosts.length === 0) throw new Error("README: could not read the supported host list");

  // | Host or surface | Artifact delivery | Live Skill invocation | Full workflow | Limit |
  const matrix = readInstallerMatrix(VENDOR);

  /** "Claude Code" -> claude, "Copilot CLI" -> copilot, "OpenAI API" -> openai-api */
  const agentFor = (host: string): string | null => {
    const normalized = host.toLowerCase().replace(/\s+/g, "-");
    return (
      matrix.agents.find((agent) => normalized === agent) ??
      matrix.agents.find((agent) => normalized.startsWith(`${agent}-`)) ??
      matrix.agents.find((agent) => normalized.replace(/-/g, "") === agent.replace(/-/g, "")) ??
      null
    );
  };

  const surfaces: HostSurface[] = hostSection
    .split("\n")
    .filter((line) => line.trim().startsWith("|"))
    .map((line) =>
      line
        .trim()
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((cell) => cell.trim().replace(/`/g, "")),
    )
    .filter((cells) => cells.length === 5 && !/^-+$/.test(cells[0]) && cells[0] !== "Host or surface")
    .map(([host, artifacts, invocation, workflow, limit]) => ({
      agent: agentFor(host),
      host,
      artifacts,
      invocation,
      workflow,
      limit,
    }));
  if (surfaces.length === 0) throw new Error("README: could not read the host surface table");

  if (install.length === 0) throw new Error("README: no bash block under Install");
  for (const block of install) {
    for (const line of block.code.split("\n")) {
      if (line.trim() && !line.trim().startsWith("python3")) {
        throw new Error(`README: unexpected install command "${line.trim()}"`);
      }
    }
    if (block.code.includes("--profile")) {
      throw new Error("README: install command still carries --profile; update the site copy");
    }
  }
  if (!firstTask.includes("engineering-control-plane")) {
    throw new Error("README: first-task block does not invoke engineering-control-plane");
  }

  const unmapped = surfaces.filter((surface) => !surface.agent).map((surface) => surface.host);
  if (unmapped.length > 0) {
    throw new Error(`README host surface rows do not map to an installer agent: ${unmapped.join(", ")}`);
  }

  const missing = hosts.filter((host) => !matrix.agents.includes(host));
  if (missing.length > 0) {
    throw new Error(`README lists hosts the installer does not accept: ${missing.join(", ")}`);
  }

  return {
    install,
    firstTask,
    hosts,
    setup: matrix.setup,
    surfaces,
    scopes: matrix.scopes,
    sourceUrl: `${REPO}/blob/${commit}/README.md`,
  };
}

function loadSnapshot(): SkillDataset | null {
  if (!existsSync(SNAPSHOT)) return null;
  try {
    return JSON.parse(readFileSync(SNAPSHOT, "utf8")) as SkillDataset;
  } catch {
    return null;
  }
}

function summarizeDiff(next: Skill[], prev: SkillDataset | null) {
  if (!prev) return;
  const before = new Map(prev.skills.map((s) => [s.slug, s]));
  const after = new Map(next.map((s) => [s.slug, s]));
  const added = [...after.keys()].filter((k) => !before.has(k));
  const removed = [...before.keys()].filter((k) => !after.has(k));
  const changed = [...after.entries()].filter(
    ([slug, skill]) => before.has(slug) && before.get(slug)!.description !== skill.description,
  );
  if (added.length) console.log(`  + added:       ${added.join(", ")}`);
  if (removed.length) console.log(`  - removed:     ${removed.join(", ")}`);
  if (changed.length) console.log(`  ~ description: ${changed.map(([s]) => s).join(", ")}`);
  if (!added.length && !removed.length && !changed.length) console.log("  = no inventory change");
}

function write(dataset: SkillDataset, alsoSnapshot: boolean) {
  mkdirSync(path.dirname(OUT), { recursive: true });
  const json = `${JSON.stringify(dataset, null, 2)}\n`;
  writeFileSync(OUT, json);
  if (alsoSnapshot) writeFileSync(SNAPSHOT, json);
}

function main() {
  const snapshot = loadSnapshot();
  console.log("sync-rd-skills");

  try {
    const commit = submoduleCommit();
    const skills: Skill[] = [
      ...loadRegistry("control-skills.yaml", "control_skills").map((e) => normalize(e, "control", commit)),
      ...loadRegistry("professional-skills.yaml", "professional_skills").map((e) => normalize(e, "professional", commit)),
      ...loadRegistry("foundation-skills.yaml", "foundation_skills").map((e) => normalize(e, "foundation", commit)),
      ...loadRegistry("domain-skills.yaml", "domain_skills").map((e) => normalize(e, "domain", commit)),
    ];

    const quickstart = loadQuickstart(commit);
    const counts = buildCounts(skills, quickstart.hosts.length);
    const problems = validate(skills, counts);
    if (problems.length) {
      throw new Error(`registry validation failed:\n  - ${problems.join("\n  - ")}`);
    }

    const dataset: SkillDataset = {
      generatedAt: new Date().toISOString(),
      sourceRepo: REPO,
      sourceRef: REF,
      sourceCommit: commit,
      degraded: false,
      skills,
      counts,
      quickstart,
      docs: renderDocs(VENDOR, REPO, commit),
      explainers: readExplainers(VENDOR),
    };

    summarizeDiff(skills, snapshot);
    write(dataset, true);
    console.log(
      `  ok  ${counts.sourceTotal} source skills · ${counts.runtimeTopLevel} runtime top-level · ` +
        `${counts.jitItems} JIT · ${counts.references} references · ${commit.slice(0, 8)}`,
    );
  } catch (error) {
    console.warn(`  !! upstream sync failed: ${(error as Error).message}`);
    if (!snapshot) {
      console.error("  !! no snapshot to fall back to — run `git submodule update --init` first");
      process.exit(1);
    }
    write({ ...snapshot, degraded: true }, false);
    console.warn(`  -> using snapshot from ${snapshot.generatedAt} (dataset marked degraded)`);
  }
}

main();
