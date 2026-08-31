/**
 * Reads the installer's own agent/scope tables so the setup wizard on the site
 * can never offer a combination the CLI would reject.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { HostSetup } from "../lib/types";

function block(source: string, name: string): string {
  const start = source.indexOf(`${name} = {`);
  if (start === -1) throw new Error(`installer source: missing ${name}`);
  const end = source.indexOf("\n}", start);
  if (end === -1) throw new Error(`installer source: unterminated ${name}`);
  return source.slice(start, end);
}

/** ("codex", "user"): ... -> [["codex","user"], ...] */
function pairs(source: string, name: string): [string, string][] {
  return [...block(source, name).matchAll(/\("([a-z0-9-]+)",\s*"([a-z0-9-]+)"\)/g)].map(
    (match) => [match[1], match[2]],
  );
}

/** Path.home() / ".claude" / "skills" -> ~/.claude/skills */
function renderPath(expression: string): string {
  const home = /Path\.home\(\)((?:\s*\/\s*"[^"]+")+)/.exec(expression);
  if (home) {
    const parts = [...home[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    return `~/${parts.join("/")}`;
  }
  // Path(".agents") / "skills" -> .agents/skills; Path("/etc/x") -> /etc/x
  const parts = [...expression.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  return parts.join("/").replace(/\/{2,}/g, "/");
}

function targets(source: string, name: string): Map<string, string> {
  const out = new Map<string, string>();
  const body = block(source, name);
  for (const line of body.split("\n")) {
    const match = /\("([a-z0-9-]+)",\s*"([a-z0-9-]+)"\):\s*(.+?),?\s*$/.exec(line);
    if (match) out.set(`${match[1]}:${match[2]}`, renderPath(match[3]));
  }
  return out;
}

function subpaths(source: string, name: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const line of block(source, name).split("\n")) {
    const match = /"([a-z0-9-]+)":\s*(.+?),?\s*$/.exec(line);
    if (match) out.set(match[1], renderPath(match[2]));
  }
  return out;
}

export function readInstallerMatrix(vendorDir: string): {
  agents: string[];
  scopes: string[];
  setup: HostSetup[];
} {
  const installerPath = path.join(vendorDir, "installers/changeforge_install.py");
  const cliPath = path.join(vendorDir, "scripts/quickstart.py");
  for (const file of [installerPath, cliPath]) {
    if (!existsSync(file)) throw new Error(`installer source not found: ${file}`);
  }

  const installer = readFileSync(installerPath, "utf8");
  const cli = readFileSync(cliPath, "utf8");

  const tuple = (name: string): string[] => {
    const match = new RegExp(`^${name} = \\(([^)]*)\\)`, "m").exec(cli);
    if (!match) throw new Error(`quickstart.py: missing ${name}`);
    return [...match[1].matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);
  };

  const agents = tuple("AGENTS");
  const scopes = tuple("SCOPES");

  const skillRoots = pairs(installer, "SOURCE_SKILL_ROOTS");
  const profileRoots = pairs(installer, "SOURCE_PROFILE_ROOTS");
  const defaultTargets = targets(installer, "DEFAULT_SKILL_TARGETS");
  const projectSubpaths = subpaths(installer, "PROJECT_SKILL_SUBPATHS");

  const setup: HostSetup[] = agents.map((agent) => {
    const agentScopes = scopes.filter((scope) =>
      skillRoots.some(([a, s]) => a === agent && s === scope),
    );
    const defaults: Record<string, string> = {};
    for (const scope of agentScopes) {
      const target = defaultTargets.get(`${agent}:${scope}`);
      if (target) defaults[scope] = target;
    }
    return {
      agent,
      scopes: agentScopes,
      agentProfiles: profileRoots.some(([a]) => a === agent),
      projectSubpath: projectSubpaths.get(agent) ?? null,
      defaultTargets: defaults,
      installable: agentScopes.length > 0,
    };
  });

  const installable = setup.filter((host) => host.installable);
  if (installable.length === 0) {
    throw new Error("installer source: no agent/scope pairs found — table format changed");
  }
  return { agents, scopes, setup };
}
