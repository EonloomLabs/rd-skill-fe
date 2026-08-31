import type { ReactNode } from "react";

const TONES = {
  accent: "bg-accent-soft text-accent border-accent-line",
  violet: "bg-violet-soft text-violet border-violet-line",
  green: "bg-green-soft text-green border-green-line",
  amber: "bg-amber-soft text-amber border-amber-line",
  red: "bg-red-soft text-red border-red-line",
  muted: "bg-surface-2 text-muted border-line",
} as const;

export type ChipTone = keyof typeof TONES;

export function Chip({
  tone = "muted",
  children,
  className = "",
}: {
  tone?: ChipTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`label inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
