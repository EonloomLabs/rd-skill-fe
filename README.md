# rd-skills website

The product website for [rd-skills](https://github.com/machenjie/rd-skills), an engineering
control plane for AI coding agents.

Built from [`prd-v1.md`](prd-v1.md) and the bilingual beginner guide. The design and
implementation plan is [`website-design-plan-v1.html`](website-design-plan-v1.html).

## Run it

```bash
git submodule update --init
pnpm install
pnpm dev
```

The dev server runs on port 4311. `pnpm dev` and `pnpm build` both run the sync step first.

Do not run `pnpm build` while `pnpm dev` is running — they share `.next` and the dev server
will start returning 500s.

## Where the data comes from

Every skill name, count, trigger, contract and reference on this site is generated at build
time from the upstream registry. Nothing is hand-maintained here.

```
vendor/rd-skills/src/registry/*.yaml            git submodule, authoritative
vendor/rd-skills/**/SKILL.md                    one-line descriptions (frontmatter)
vendor/rd-skills/README.md                      quickstart commands, host list
vendor/rd-skills/docs/*.md                      rendered to HTML for on-site reading
vendor/rd-skills/installers/changeforge_install.py   agent/scope install matrix
vendor/rd-skills/scripts/quickstart.py          accepted agents and scopes
          |
          v  scripts/sync-rd-skills.ts
          |     + scripts/render-docs.ts     markdown -> HTML, links rewritten
          |     + scripts/read-installer.ts  which agent supports which scope
          |
data/skills.generated.json             build artifact, gitignored
data/skills.snapshot.json              last-known-good, committed
```

`lib/skills.ts` is the only module that reads the generated file. If a component contains a
hand-written skill name, description or count, that is a bug.

The sync script fails the build when the repository contradicts the site: a professional
skill with no group assignment, a Layer 3 candidate that does not exist, a skill with no
description, a documentation page pointing at a missing file, a README host the installer
does not accept, or an install command carrying a flag the project no longer supports. If
the submodule is missing entirely it falls back to the committed snapshot, marks the dataset
`degraded`, and the footer says so.

The setup wizard on `/quickstart` reads the installer's own `SOURCE_SKILL_ROOTS` and
`DEFAULT_SKILL_TARGETS` tables, so it can only offer agent/scope combinations the CLI
accepts, and the install path it shows is the path the installer would use.

`content/professional-groups.ts` holds the only curated classification on the site — which of
the five decision-ownership groups each professional skill belongs to. It carries no skill
facts.

## Layout

```
app/                    routes: /, /architecture, /skills, /skills/[slug],
                        /quickstart, /docs, /docs/[slug]
components/diagram/     the five reusable diagram languages
components/terminal/    task lifecycle player, copyable command blocks
components/quickstart/  the agent/scope setup wizard
components/skills/      skill card, explorer island
content/                narrative copy and the curated grouping
lib/                    data access, site config
scripts/                sync-rd-skills.ts, render-docs.ts, read-installer.ts
```

## Commands

| command | what it does |
| --- | --- |
| `pnpm dev` | sync, then start the dev server on 4311 |
| `pnpm sync` | regenerate `data/skills.generated.json` from the submodule |
| `pnpm build` | sync, then produce the static build |
| `pnpm typecheck` | `tsc --noEmit` |

To pin a different upstream ref: `RD_SKILLS_REF=<branch> pnpm sync`.
