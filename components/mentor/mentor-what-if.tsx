"use client";

import { motion } from "framer-motion";
import { GitCompare } from "lucide-react";
import type { MentorWhatIfComparison } from "@/types/mentor";

interface MentorWhatIfProps {
  comparisons: MentorWhatIfComparison[];
}

export function MentorWhatIf({ comparisons }: MentorWhatIfProps) {
  if (!comparisons?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <GitCompare className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">
          What-If Analysis
        </h4>
      </div>

      <div className="grid gap-3">
        {comparisons.map((comparison, index) => (
          <motion.div
            key={`${comparison.scenario}-${index}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <h5 className="mb-3 text-sm font-medium text-foreground">
              {comparison.scenario}
            </h5>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-surface/40 p-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
                  Current
                </p>
                <p className="text-xs leading-relaxed text-foreground/80">
                  {comparison.currentState}
                </p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">
                  Projected
                </p>
                <p className="text-xs leading-relaxed text-foreground/80">
                  {comparison.projectedState}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-1 border-t border-border pt-3">
              <p className="text-xs text-muted">
                <span className="font-medium text-foreground">Impact: </span>
                {comparison.impact}
              </p>
              <p className="text-xs text-muted">
                <span className="font-medium text-foreground">
                  Recommendation:{" "}
                </span>
                {comparison.recommendation}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
