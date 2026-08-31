"use client";

import type FuseType from "fuse.js";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { SkillCard } from "@/components/skills/skill-card";
import type { AgentRole, SkillSummary } from "@/lib/types";

export interface ExplorerFacet {
  id: string;
  label: string;
  count: number;
}

export function SkillExplorer({
  skills,
  typeFacets,
  groupFacets,
  roleFacets,
}: {
  skills: SkillSummary[];
  typeFacets: ExplorerFacet[];
  groupFacets: ExplorerFacet[];
  roleFacets: ExplorerFacet[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [type, setType] = useState(params.get("type") ?? "all");
  const [group, setGroup] = useState(params.get("group") ?? "all");
  const [role, setRole] = useState(params.get("role") ?? "all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Keep the URL shareable and back-navigable without a full navigation.
  useEffect(() => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (type !== "all") next.set("type", type);
    if (group !== "all") next.set("group", group);
    if (role !== "all") next.set("role", role);
    const search = next.toString();
    router.replace(search ? `/skills?${search}` : "/skills", { scroll: false });
  }, [query, type, group, role, router]);

  // Fuse is ~12kB. Nobody pays for it until they actually type a query; until
  // it lands, a substring match keeps the input responsive.
  const [fuse, setFuse] = useState<FuseType<SkillSummary> | null>(null);
  useEffect(() => {
    if (!query.trim() || fuse) return;
    let cancelled = false;
    void import("fuse.js").then(({ default: Fuse }) => {
      if (cancelled) return;
      setFuse(
        new Fuse(skills, {
          keys: [
            { name: "slug", weight: 3 },
            { name: "description", weight: 2 },
            { name: "triggerSignals", weight: 1.5 },
            { name: "groupLabel", weight: 1 },
          ],
          threshold: 0.34,
          ignoreLocation: true,
        }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [fuse, query, skills]);

  const results = useMemo(() => {
    const term = query.trim();
    const base = !term
      ? skills
      : fuse
        ? fuse.search(term).map((r) => r.item)
        : skills.filter((skill) =>
            `${skill.slug} ${skill.description} ${skill.triggerSignals.join(" ")}`
              .toLowerCase()
              .includes(term.toLowerCase()),
          );
    return base.filter((skill) => {
      if (type !== "all" && skill.type !== type) return false;
      if (group !== "all" && skill.group !== group) return false;
      if (role !== "all" && !skill.roleSupport.includes(role as AgentRole)) return false;
      return true;
    });
  }, [fuse, group, query, role, skills, type]);

  const visibleGroups = useMemo(() => {
    const allowed = new Set(
      skills.filter((s) => type === "all" || s.type === type).map((s) => s.group),
    );
    return groupFacets.filter((facet) => allowed.has(facet.id));
  }, [groupFacets, skills, type]);

  const reset = useCallback(() => {
    setQuery("");
    setType("all");
    setGroup("all");
    setRole("all");
  }, []);

  const dirty = Boolean(query) || type !== "all" || group !== "all" || role !== "all";

  const facetList = (
    title: string,
    facets: ExplorerFacet[],
    value: string,
    onChange: (next: string) => void,
    allLabel: string,
  ) => (
    <fieldset className="border-0 p-0">
      <legend className="label mb-2 text-muted">{title}</legend>
      <div className="flex flex-col gap-0.5">
        {[{ id: "all", label: allLabel, count: skills.length }, ...facets].map((facet) => {
          const selected = value === facet.id;
          return (
            <button
              key={facet.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(facet.id)}
              className={`flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-[0.8125rem] transition-colors duration-150 ${
                selected ? "bg-accent-soft text-accent" : "text-ink-2 hover:bg-surface-2"
              }`}
            >
              <span>{facet.label}</span>
              <span className="ident text-xs text-muted">{facet.count}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );

  const filters = (
    <div className="flex flex-col gap-6">
      {facetList("Type", typeFacets, type, (next) => {
        setType(next);
        setGroup("all");
      }, "All types")}
      {visibleGroups.length > 1
        ? facetList("Group", visibleGroups, group, setGroup, "All groups")
        : null}
      {facetList("Agent role", roleFacets, role, setRole, "Any role")}
      {dirty ? (
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-1.5 self-start rounded-md border border-line px-2.5 py-1.5 text-[0.8125rem] text-muted hover:text-ink"
        >
          <X size={12} aria-hidden="true" />
          Clear filters
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-10">
      <div>
        <label className="relative block">
          <span className="sr-only">Search skills</span>
          <Search
            size={14}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, trigger, domain"
            className="h-9 w-full rounded-lg border border-line bg-surface pl-8 pr-3 text-[0.8125rem] text-ink outline-none placeholder:text-muted focus:border-accent-line"
          />
        </label>

        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          aria-controls="skill-filters"
          className="mt-3 flex w-full items-center justify-between rounded-lg border border-line bg-surface px-3 py-2 text-[0.8125rem] text-ink-2 lg:hidden"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={13} aria-hidden="true" />
            Filters
          </span>
          <span className="ident text-xs text-muted">{results.length}</span>
        </button>

        <div
          id="skill-filters"
          className={`mt-5 ${filtersOpen ? "block" : "hidden"} lg:block`}
        >
          {filters}
        </div>
      </div>

      <div>
        <p className="mb-4 text-[0.8125rem] text-muted" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "skill" : "skills"}
          {dirty ? " matching your filters" : ""}
        </p>
        {results.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {results.map((skill) => (
              <SkillCard key={skill.slug} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-line bg-surface p-8 text-center">
            <p className="text-[0.9375rem] text-ink">No skill matches those filters.</p>
            <p className="mt-1 text-[0.8125rem] text-muted">
              Try a broader term, or clear the filters to see all {skills.length}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
