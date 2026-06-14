"use client";

import { motion } from "framer-motion";
import { MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MentorSuggestionsProps {
  suggestions: readonly string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
  title?: string;
}

export function MentorSuggestions({
  suggestions,
  onSelect,
  disabled,
  title = "Suggested questions",
}: MentorSuggestionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquarePlus className="h-4 w-4 text-muted" />
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {title}
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            disabled={disabled}
            onClick={() => onSelect(suggestion)}
            className={cn(
              "rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground/90",
              "transition-all hover:border-primary/40 hover:bg-primary/5",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
