import { Fragment } from "react";

/**
 * Registry descriptions are authored as markdown and reference agent profiles
 * and skills in backticks. Render those as code, not as stray punctuation.
 */
export function InlineCodeText({ children }: { children: string }) {
  const parts = children.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
          <code
            key={index}
            className="ident rounded border border-line bg-surface-2 px-1 py-px text-[0.9em] text-ink-2"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
