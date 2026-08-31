"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CommandBlock({
  code,
  label,
  step,
}: {
  code: string;
  label?: string;
  step?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard can be blocked; the command stays selectable */
    }
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-line bg-terminal-bg">
      {label ? (
        <div className="flex items-center gap-3 border-b border-terminal-line px-4 py-2.5">
          {step ? <span className="ident text-xs text-terminal-dim">{step}</span> : null}
          <span className="label text-terminal-dim">{label}</span>
          <button
            type="button"
            onClick={copy}
            className="ml-auto flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.6875rem] text-terminal-dim transition-colors duration-150 hover:bg-terminal-line hover:text-terminal-ink"
          >
            {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : null}
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[0.78125rem] leading-[1.75] text-terminal-ink">
        <code>{code}</code>
      </pre>
    </div>
  );
}
