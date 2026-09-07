"use client";

import { useMemo, useState } from "react";
import { FolderTree, ShieldCheck } from "lucide-react";

import { CommandBlock } from "@/components/terminal/command-block";
import type { HostSetup, HostSurface } from "@/lib/types";

const HOST_LABEL: Record<string, string> = {
  codex: "Codex",
  claude: "Claude",
  copilot: "GitHub Copilot",
  cline: "Cline",
  "openai-api": "OpenAI API",
};

const SCOPE_HINT: Record<string, string> = {
  user: "Available in every repository you open. Start here.",
  project: "Installed inside one checkout, so the team shares it.",
  admin: "Machine-wide. Only with explicit administrative approval.",
};

const PLACEHOLDER = "/absolute/path/to/project";

/**
 * Turns "which agent do I use?" into the exact commands to paste. Every option
 * comes from the installer's own agent/scope tables, so the wizard cannot
 * suggest a combination the CLI would reject.
 */
export function SetupWizard({
  hosts,
  surfaces,
  firstTask,
  repoUrl,
}: {
  hosts: HostSetup[];
  surfaces: HostSurface[];
  firstTask: string;
  repoUrl: string;
}) {
  const [agent, setAgent] = useState(hosts[0]?.agent ?? "codex");
  const [scope, setScope] = useState("user");
  const [projectPath, setProjectPath] = useState("");

  const host = hosts.find((h) => h.agent === agent) ?? hosts[0];
  const effectiveScope = host.scopes.includes(scope) ? scope : (host.scopes[0] ?? "");
  const needsTarget = effectiveScope === "project";
  const target = projectPath.trim() || PLACEHOLDER;

  const commands = useMemo(() => {
    const base = ["python3", "scripts/quickstart.py", "--agent", host.agent];
    if (host.installable) {
      base.push("--scope", effectiveScope);
      if (needsTarget) base.push("--target", target);
    }
    const install = base.join(" ");
    const doctor = [
      "python3",
      "installers/doctor.py",
      "--agent",
      host.agent,
      "--scope",
      effectiveScope,
      ...(needsTarget ? ["--target", target] : []),
    ].join(" ");
    return { preview: `${install} --dry-run`, install, doctor };
  }, [effectiveScope, host, needsTarget, target]);

  const surface = surfaces.find((item) => item.agent === host.agent);
  const invocation = surface?.invocation ?? "";
  const hasInvocation = invocation.includes("engineering-control-plane");
  // The README writes the example for Codex; swap the prefix for other hosts.
  const request = hasInvocation
    ? firstTask.replace(/^[$/]engineering-control-plane/, invocation)
    : firstTask;

  const destination = host.installable
    ? needsTarget
      ? `${target.replace(/\/$/, "")}/${host.projectSubpath ?? ""}`
      : (host.defaultTargets[effectiveScope] ?? "the host's default skill directory")
    : "dist/openai-api/zips/recommended/";

  const choice = (
    label: string,
    options: { value: string; label: string; hint?: string }[],
    value: string,
    onChange: (next: string) => void,
  ) => (
    <fieldset className="border-0 p-0">
      <legend className="label text-muted">{label}</legend>
      <div className="mt-2.5 flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              title={option.hint}
              className={`rounded-lg border px-3 py-1.5 text-[0.8125rem] transition-colors duration-150 ${
                selected
                  ? "border-accent-line bg-accent-soft text-accent"
                  : "border-line bg-surface text-ink-2 hover:border-accent-line hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-6 [&>*]:min-w-0">
      <div className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-6">
        {choice(
          "Which agent do you use?",
          hosts.map((h) => ({ value: h.agent, label: HOST_LABEL[h.agent] ?? h.agent })),
          host.agent,
          setAgent,
        )}

        {host.installable ? (
          <>
            {choice(
              "Where should it be installed?",
              host.scopes.map((s) => ({ value: s, label: s, hint: SCOPE_HINT[s] })),
              effectiveScope,
              setScope,
            )}
            <p className="-mt-3 text-[0.8125rem] leading-relaxed text-muted">
              {SCOPE_HINT[effectiveScope]}
            </p>

            {needsTarget ? (
              <label className="flex flex-col gap-2">
                <span className="label text-muted">Project root</span>
                <input
                  type="text"
                  value={projectPath}
                  onChange={(event) => setProjectPath(event.target.value)}
                  placeholder={PLACEHOLDER}
                  spellCheck={false}
                  className="ident h-9 w-full rounded-lg border border-line bg-ground px-3 text-[0.8125rem] text-ink outline-none placeholder:text-muted focus:border-accent-line"
                />
                <span className="text-xs leading-relaxed text-muted">
                  An absolute path. Project scope requires it.
                </span>
              </label>
            ) : null}
          </>
        ) : (
          <p className="text-[0.8125rem] leading-relaxed text-muted">
            OpenAI API has no installation scope. The commands below build one zip per top-level
            skill; wiring them into your own harness is up to you.
          </p>
        )}

        <dl className="flex flex-col gap-3 border-t border-line-soft pt-5 text-[0.8125rem]">
          <div className="flex gap-2.5">
            <FolderTree size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-muted" />
            <div className="min-w-0">
              <dt className="text-muted">Files land in</dt>
              <dd className="ident mt-0.5 break-all text-ink">{destination}</dd>
            </div>
          </div>
          <div className="flex gap-2.5">
            <ShieldCheck size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-muted" />
            <div className="min-w-0">
              <dt className="text-muted">Agent profiles</dt>
              <dd className="mt-0.5 text-ink">
                {host.agentProfiles
                  ? "Native main, analysis, task and review profiles"
                  : "Skills only — no native profile files for this host"}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <ol className="flex list-none flex-col gap-3 p-0">
        <li>
          <CommandBlock
            step="01"
            label="Get the repository"
            code={`git clone ${repoUrl}.git\ncd rd-skills`}
          />
        </li>
        <li>
          <CommandBlock
            step="02"
            label="Install the Python package (3.11+)"
            code={"python3 --version\npython3 -m pip install ."}
          />
        </li>
        <li>
          <CommandBlock step="03" label="Preview — writes nothing" code={commands.preview} />
        </li>
        <li>
          <CommandBlock
            step="04"
            label={host.installable ? "Build, install, run doctor" : "Build the zip bundles"}
            code={commands.install}
          />
        </li>
        {host.installable ? (
          <li>
            <CommandBlock step="05" label="Re-check any time" code={commands.doctor} />
          </li>
        ) : null}
        <li>
          {hasInvocation ? (
            <CommandBlock
              step={host.installable ? "06" : "05"}
              label={`Ask ${HOST_LABEL[host.agent] ?? host.agent} — invocation is host-specific`}
              code={request}
            />
          ) : (
            <div className="rounded-xl border border-line bg-surface p-5">
              <p className="label text-amber">Live invocation</p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                {surface
                  ? `${surface.host}: ${surface.invocation}. ${surface.limit}.`
                  : "Not established for this surface."}
              </p>
            </div>
          )}
        </li>
      </ol>
    </div>
  );
}
