/**
 * Pulls two tables out of the upstream documentation so the site can explain
 * the model in the project's own words instead of a paraphrase that drifts.
 *
 *   docs/HOW_IT_WORKS.md  "Four different questions"  -> mechanisms
 *   docs/USAGE.md         "What to expect"            -> normal vs questionable
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { BehaviorContrast, Explainers, Mechanism } from "../lib/types";

function read(vendorDir: string, file: string): string {
  const full = path.join(vendorDir, "docs", file);
  if (!existsSync(full)) throw new Error(`explainer source missing: docs/${file}`);
  return readFileSync(full, "utf8");
}

/** Returns the rows of the first markdown table inside the named section. */
function tableRows(markdown: string, heading: string, file: string): string[][] {
  const start = markdown.indexOf(heading);
  if (start === -1) throw new Error(`${file}: missing section "${heading}"`);
  const rest = markdown.slice(start + heading.length);
  const end = rest.search(/\n#{2,3} /);
  const section = end === -1 ? rest : rest.slice(0, end);

  const rows = section
    .split("\n")
    .filter((line) => line.trim().startsWith("|"))
    .map((line) =>
      line
        .trim()
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((cell) => cell.trim()),
    )
    .filter((cells) => !cells.every((cell) => /^:?-{2,}:?$/.test(cell)));

  if (rows.length < 2) throw new Error(`${file}: no table under "${heading}"`);
  return rows.slice(1); // drop the header row
}

/** Markdown emphasis and links are noise once the text is already on our page. */
function plain(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`/g, "")
    .trim();
}

export function readExplainers(vendorDir: string): Explainers {
  const howItWorks = read(vendorDir, "HOW_IT_WORKS.md");
  const usage = read(vendorDir, "USAGE.md");

  const mechanisms: Mechanism[] = tableRows(
    howItWorks,
    "## Four different questions",
    "HOW_IT_WORKS.md",
  ).map(([name, question, does]) => ({
    name: plain(name),
    question: plain(question),
    does: plain(does),
  }));

  const behavior: BehaviorContrast[] = tableRows(usage, "## What to expect", "USAGE.md").map(
    ([normal, questionable]) => ({ normal: plain(normal), questionable: plain(questionable) }),
  );

  if (mechanisms.length !== 4) {
    throw new Error(`HOW_IT_WORKS.md: expected 4 mechanisms, found ${mechanisms.length}`);
  }
  if (behavior.length === 0) throw new Error("USAGE.md: empty behavior table");

  return { mechanisms, behavior };
}
