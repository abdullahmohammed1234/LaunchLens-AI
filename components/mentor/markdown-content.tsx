"use client";

import { cn } from "@/lib/utils/cn";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-surface px-1.5 py-0.5 text-xs text-primary"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const blocks = content.split("\n\n");

  return (
    <div className={cn("space-y-3 text-sm leading-relaxed text-foreground/90", className)}>
      {blocks.map((block, blockIndex) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={blockIndex} className="text-sm font-semibold text-foreground">
              {renderInline(trimmed.slice(4))}
            </h4>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={blockIndex} className="text-base font-semibold text-foreground">
              {renderInline(trimmed.slice(3))}
            </h3>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={blockIndex} className="text-lg font-semibold text-foreground">
              {renderInline(trimmed.slice(2))}
            </h2>
          );
        }

        const lines = trimmed.split("\n");
        const isList = lines.every(
          (line) => line.startsWith("- ") || line.startsWith("* ") || line.startsWith("1. ")
        );

        if (isList) {
          return (
            <ul key={blockIndex} className="ml-1 space-y-1.5">
              {lines.map((line, lineIndex) => {
                const bulletMatch = line.match(/^[-*]\s+(.*)/);
                const numberedMatch = line.match(/^\d+\.\s+(.*)/);
                const text = bulletMatch?.[1] ?? numberedMatch?.[1] ?? line;
                return (
                  <li key={lineIndex} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>{renderInline(text)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={blockIndex}>{renderInline(trimmed.replace(/\n/g, " "))}</p>
        );
      })}
    </div>
  );
}
