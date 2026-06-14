"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MentorImprovementStep } from "@/types/mentor";

interface MentorImprovementPlanProps {
  steps: MentorImprovementStep[];
}

export function MentorImprovementPlan({ steps }: MentorImprovementPlanProps) {
  if (!steps?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">
          Improvement Plan
        </h4>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * index }}
            className="flex gap-3 rounded-xl border border-border bg-surface/40 p-4"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {step.step}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h5 className="text-sm font-medium text-foreground">
                  {step.title}
                </h5>
                <Badge
                  variant={
                    step.priority === "critical"
                      ? "danger"
                      : step.priority === "high"
                        ? "warning"
                        : "secondary"
                  }
                >
                  {step.priority}
                </Badge>
              </div>
              <p className="mb-2 text-xs leading-relaxed text-muted">
                {step.description}
              </p>
              <p className="text-xs text-primary/80">
                Estimated impact: {step.estimatedImpact}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
