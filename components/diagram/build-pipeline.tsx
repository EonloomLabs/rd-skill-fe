import { ArrowRight } from "lucide-react";

const STAGES = [
  { name: "src/", note: "authoring source — contracts, skills, registries, profiles" },
  { name: "build preflight", note: "schema, path, projection and ownership checks" },
  { name: "scripts/build.py", note: "compiles Layer 3, selectors and host profiles" },
  { name: "dist/", note: "the runtime artifacts a host actually consumes" },
];

/** Why you install dist/ and never src/. */
export function BuildPipeline() {
  return (
    <div>
      <ol className="grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-[repeat(4,minmax(0,1fr))] md:items-stretch md:gap-0">
        {STAGES.map((stage, index) => (
          <li key={stage.name} className="flex items-stretch gap-0">
            <div className="flex-1 rounded-xl border border-line bg-surface p-5">
              <p className="ident text-[0.8125rem] text-ink">{stage.name}</p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{stage.note}</p>
            </div>
            {index < STAGES.length - 1 ? (
              <span
                aria-hidden="true"
                className="hidden w-8 shrink-0 items-center justify-center text-muted md:flex"
              >
                <ArrowRight size={14} />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-5 max-w-[70ch] rounded-lg border-l-2 border-amber bg-amber-soft px-5 py-4 text-[0.9375rem] text-ink">
        The professional selector is a build-only artifact. Installing <code className="ident">src/</code>{" "}
        would give an agent the authoring source instead of the compiled projection it is meant to
        consume.
      </p>
    </div>
  );
}
