"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightCardProps {
  insight: string;
  index?: number;
  loading?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export function InsightCard({
  insight,
  index = 0,
  loading = false,
  defaultExpanded = false,
  className,
}: InsightCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || index === 0);

  if (loading) {
    return (
      <div
        className={cn(
          "rounded-lg border border-border bg-surface/50 p-4",
          className
        )}
      >
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-3 w-4/5" />
      </div>
    );
  }

  const title =
    insight.length > 80 ? `${insight.slice(0, 80).trim()}…` : insight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={cn(
        "group rounded-lg border border-border bg-surface/50 transition-all duration-200 hover:border-primary/30 hover:bg-surface/80",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-warning/10">
          <Lightbulb className="h-3.5 w-3.5 text-warning" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            Insight {index + 1}
          </p>
          <p className="mt-0.5 text-xs text-muted">{title}</p>
        </div>
        <ChevronDown
          className={cn(
            "mt-1 h-4 w-4 shrink-0 text-muted transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="border-t border-border/60 px-4 pb-4 pl-[3.25rem] text-sm leading-relaxed text-muted">
              {insight}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
