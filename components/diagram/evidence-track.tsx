"use client";

import { useEffect, useRef, useState } from "react";

import { EVIDENCE_STATES } from "@/content/model";

const TONE: Record<string, { dot: string; text: string; ring: string }> = {
  amber: { dot: "bg-amber", text: "text-amber", ring: "border-amber-line bg-amber-soft" },
  accent: { dot: "bg-accent", text: "text-accent", ring: "border-accent-line bg-accent-soft" },
  violet: { dot: "bg-violet", text: "text-violet", ring: "border-violet-line bg-violet-soft" },
  green: { dot: "bg-green", text: "text-green", ring: "border-green-line bg-green-soft" },
};

/** State is encoded three ways — colour, marker shape, and the word itself. */
const MARKER = ["◻", "◧", "◨", "◼"];

export function EvidenceTrack() {
  const [reached, setReached] = useState(0);
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setReached(EVIDENCE_STATES.length);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index ?? 0);
            setReached((current) => Math.max(current, index + 1));
          }
        }
      },
      { threshold: 0.6 },
    );
    for (const child of Array.from(node.children)) observer.observe(child);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-4">
      {EVIDENCE_STATES.map((state, index) => {
        const tone = TONE[state.tone];
        const on = index < reached;
        return (
          <li
            key={state.id}
            data-index={index}
            className={`rounded-xl border p-5 transition-all duration-300 ${
              on ? tone.ring : "border-line bg-surface"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`ident text-sm ${on ? tone.text : "text-muted"}`}
              >
                {MARKER[index]}
              </span>
              <span className={`label ${on ? tone.text : "text-muted"}`}>{state.name}</span>
            </div>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-2">{state.blurb}</p>
          </li>
        );
      })}
    </ol>
  );
}
