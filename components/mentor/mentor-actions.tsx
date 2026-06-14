"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MentorRecommendedAction } from "@/types/mentor";
import { cn } from "@/lib/utils/cn";

const PRIORITY_VARIANTS = {
  critical: "danger",
  high: "warning",
  medium: "secondary",
} as const;

interface MentorActionsProps {
  actions: MentorRecommendedAction[];
}

export function MentorActions({ actions }: MentorActionsProps) {
  if (actions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">
          Recommended Actions
        </h4>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action, index) => (
          <motion.div
            key={`${action.title}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={cn(
              "group rounded-xl border border-border bg-surface/50 p-4",
              "transition-colors hover:border-primary/30 hover:bg-surface"
            )}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h5 className="text-sm font-medium text-foreground">
                {action.title}
              </h5>
              <Badge variant={PRIORITY_VARIANTS[action.priority]}>
                {action.priority}
              </Badge>
            </div>
            <p className="mb-2 text-xs leading-relaxed text-muted">
              {action.description}
            </p>
            <div className="flex items-center gap-1 text-xs text-primary/80">
              <ArrowRight className="h-3 w-3" />
              <span>{action.impact}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
