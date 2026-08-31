import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  tone = "ground",
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  tone?: "ground" | "surface";
}) {
  return (
    <section
      id={id}
      className={`border-t border-line py-20 md:py-28 ${
        tone === "surface" ? "bg-surface" : "bg-ground"
      }`}
    >
      <div className="wrap">
        <p className="label text-accent">{eyebrow}</p>
        <h2 className="mt-3 max-w-[22ch] text-[1.75rem] font-semibold leading-[1.14] tracking-[-0.028em] text-balance md:text-[2.4rem]">
          {title}
        </h2>
        {lead ? <p className="mt-5 max-w-[64ch] text-[1.0625rem] leading-[1.65] text-muted">{lead}</p> : null}
        <div className="mt-12 md:mt-14">{children}</div>
      </div>
    </section>
  );
}
