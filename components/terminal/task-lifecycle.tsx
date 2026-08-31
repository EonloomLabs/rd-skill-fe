"use client";

import { useEffect, useRef, useState } from "react";

export interface LifecycleLine {
  stage: string;
  value: string;
  note: string;
  tone: "accent" | "violet" | "green" | "amber" | "muted";
}

const TONE_CLASS: Record<LifecycleLine["tone"], string> = {
  accent: "text-[#8aa5ff]",
  violet: "text-[#c1a6f8]",
  green: "text-[#5fce9f]",
  amber: "text-[#e0a94f]",
  muted: "text-terminal-dim",
};

/**
 * Plays one task through the control plane, once. This is the hero's argument:
 * the same request produces an owner, a bounded scope, fresh validation, an
 * independent review and a stated proof limit.
 */
export function TaskLifecycle({
  request,
  lines,
}: {
  request: string;
  lines: LifecycleLine[];
}) {
  const [shown, setShown] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(lines.length);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      if (timer) return;
      timer = setInterval(() => {
        setShown((n) => {
          if (n >= lines.length) {
            if (timer) clearInterval(timer);
            return n;
          }
          return n + 1;
        });
      }, 230);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [lines.length]);

  const done = shown >= lines.length;

  return (
    <div
      ref={containerRef}
      className="min-w-0 overflow-hidden rounded-xl border border-line bg-terminal-bg shadow-card"
    >
      <div className="flex items-center gap-2 border-b border-terminal-line px-4 py-2.5">
        <span className="label text-terminal-dim">engineering-control-plane</span>
        <span aria-hidden="true" className="ml-auto flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-terminal-line" />
          <span className="h-1.5 w-1.5 rounded-full bg-terminal-line" />
          <span className="h-1.5 w-1.5 rounded-full bg-terminal-line" />
        </span>
      </div>

      <div className="overflow-x-auto px-4 py-4 font-mono text-[0.78125rem] leading-[1.85]">
        <p className="text-terminal-dim">
          <span className="select-none text-[#5fce9f]">$ </span>
          <span className="text-terminal-ink">{request}</span>
        </p>

        <ol className="mt-3 flex list-none flex-col gap-0 p-0" aria-live="polite">
          {lines.map((line, index) => {
            const visible = index < shown;
            return (
              <li
                key={line.stage}
                className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4 whitespace-nowrap transition-opacity duration-300"
                style={{ opacity: visible ? 1 : 0 }}
                aria-hidden={visible ? undefined : true}
              >
                <span className="text-terminal-dim">{line.stage}</span>
                <span>
                  <span className={TONE_CLASS[line.tone]}>{line.value}</span>
                  <span className="text-terminal-dim">  {line.note}</span>
                </span>
              </li>
            );
          })}
        </ol>

        <p
          className="mt-3 text-terminal-dim transition-opacity duration-300"
          style={{ opacity: done ? 1 : 0 }}
        >
          <span className="select-none text-[#5fce9f]">$ </span>
          <span className="inline-block h-3.5 w-[0.5ch] translate-y-[2px] bg-terminal-dim" />
        </p>
      </div>
    </div>
  );
}
