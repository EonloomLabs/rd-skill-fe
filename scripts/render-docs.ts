/**
 * Renders the upstream documentation to HTML at build time so it can be read
 * on this site instead of sending every reader to GitHub.
 *
 * Only the docs listed in DOC_PAGES are rendered. Anything else stays a link:
 * MARKETPLACE_CATALOG.md, for instance, is a 160kB generated inventory that
 * belongs in the repository, not in a reading view.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import { Marked } from "marked";

import type { DocPage, DocHeading } from "../lib/types";

export interface DocSpec {
  file: string;
  slug: string;
  group: string;
  /** rendered on its own route, or folded into another page */
  route: "docs" | "quickstart";
}

export const DOC_PAGES: DocSpec[] = [
  { file: "QUICKSTART.md", slug: "quickstart", group: "Get started", route: "quickstart" },
  { file: "INSTALLATION.md", slug: "installation", group: "Get started", route: "docs" },
  { file: "USAGE.md", slug: "usage", group: "Get started", route: "docs" },
  { file: "OPERATING_MODEL.md", slug: "operating-model", group: "Operating model", route: "docs" },
  { file: "SUBAGENT_MODEL.md", slug: "subagent-model", group: "Operating model", route: "docs" },
  { file: "AI_CONTROL_BOUNDARIES.md", slug: "control-boundaries", group: "Operating model", route: "docs" },
  { file: "HOOKLESS_ARCHITECTURE.md", slug: "hookless-architecture", group: "Operating model", route: "docs" },
  { file: "SKILL_CONTENT_GOVERNANCE.md", slug: "skill-governance", group: "Authoring skills", route: "docs" },
  { file: "QUALITY_MODEL.md", slug: "quality-model", group: "Authoring skills", route: "docs" },
  { file: "MARKETPLACE.md", slug: "marketplace", group: "Authoring skills", route: "docs" },
  { file: "VALIDATION.md", slug: "validation", group: "Assurance", route: "docs" },
  { file: "BENCHMARKS.md", slug: "benchmarks", group: "Assurance", route: "docs" },
  { file: "SCORECARD.md", slug: "scorecard", group: "Assurance", route: "docs" },
  { file: "RELEASE.md", slug: "release", group: "Assurance", route: "docs" },
];

const SLUG_BY_FILE = new Map(DOC_PAGES.map((doc) => [doc.file, doc]));

function internalHref(target: string): string | null {
  const [file, hash] = target.split("#");
  const doc = SLUG_BY_FILE.get(file);
  if (!doc) return null;
  const base = doc.route === "quickstart" ? "/quickstart" : `/docs/${doc.slug}`;
  return hash ? `${base}#${hash}` : base;
}

export function renderDocs(vendorDir: string, repo: string, commit: string): DocPage[] {
  return DOC_PAGES.map((spec) => {
    const full = path.join(vendorDir, "docs", spec.file);
    if (!existsSync(full)) {
      throw new Error(`documentation page points at a missing file: docs/${spec.file}`);
    }

    const raw = readFileSync(full, "utf8");
    const slugger = new GithubSlugger();
    const headings: DocHeading[] = [];

    const marked = new Marked({ gfm: true, breaks: false });
    marked.use({
      renderer: {
        heading({ tokens, depth }) {
          const text = this.parser.parseInline(tokens);
          const plain = text.replace(/<[^>]+>/g, "").trim();
          const id = slugger.slug(plain);
          if (depth === 2 || depth === 3) headings.push({ id, text: plain, depth });
          return `<h${depth} id="${id}">${text}</h${depth}>\n`;
        },
        link({ href, title, tokens }) {
          const text = this.parser.parseInline(tokens);
          const titleAttr = title ? ` title="${title}"` : "";

          if (href.startsWith("#")) return `<a href="${href}"${titleAttr}>${text}</a>`;
          if (/^https?:/.test(href)) {
            return `<a href="${href}"${titleAttr} target="_blank" rel="noreferrer">${text}</a>`;
          }

          const internal = internalHref(href);
          if (internal) return `<a href="${internal}"${titleAttr}>${text}</a>`;

          // Anything else lives in the repository: resolve it against docs/.
          const resolved = path
            .posix
            .normalize(path.posix.join("docs", href.split("#")[0]))
            .replace(/^\.\//, "");
          const hash = href.includes("#") ? `#${href.split("#")[1]}` : "";
          return `<a href="${repo}/blob/${commit}/${resolved}${hash}"${titleAttr} target="_blank" rel="noreferrer">${text}</a>`;
        },
        table(token) {
          const header = `<tr>${token.header
            .map((cell) => `<th>${this.parser.parseInline(cell.tokens)}</th>`)
            .join("")}</tr>`;
          const body = token.rows
            .map(
              (row) =>
                `<tr>${row.map((cell) => `<td>${this.parser.parseInline(cell.tokens)}</td>`).join("")}</tr>`,
            )
            .join("");
          return `<div class="doc-table"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>\n`;
        },
        code({ text, lang }) {
          const escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
          const label = lang ? ` data-lang="${lang}"` : "";
          return `<pre${label}><code>${escaped}</code></pre>\n`;
        },
      },
    });

    const title = /^#\s+(.+)$/m.exec(raw)?.[1]?.trim() ?? spec.file.replace(/\.md$/, "");
    const summary =
      raw
        .split("\n")
        .map((line) => line.trim())
        .find((line) => line.length > 0 && !line.startsWith("#") && !line.startsWith("|"))
        ?.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[`*]/g, "") ?? "";

    // Drop the H1: the page renders its own title.
    const body = raw.replace(/^#\s+.+$/m, "");
    const html = marked.parse(body) as string;

    return {
      slug: spec.slug,
      file: `docs/${spec.file}`,
      title,
      summary: summary.slice(0, 200),
      group: spec.group,
      route: spec.route,
      html,
      headings,
      words: body.split(/\s+/).filter(Boolean).length,
      url: `${repo}/blob/${commit}/docs/${spec.file}`,
    };
  });
}
