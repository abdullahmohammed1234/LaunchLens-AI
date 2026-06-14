"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { RecommendedStep } from "@/types/executive-report";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface ActionPlanProps {
  steps: RecommendedStep[];
}

function priorityColor(priority: string) {
  switch (priority) {
    case "critical":
      return "border-red-500/30 bg-red-500/10 text-red-400";
    case "high":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    default:
      return "border-blue-500/30 bg-blue-500/10 text-blue-400";
  }
}

export function ActionPlan({ steps }: ActionPlanProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  function toggleStep(order: number) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(order)) {
        next.delete(order);
      } else {
        next.add(order);
      }
      return next;
    });
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Action Plan</CardTitle>
        <p className="text-sm text-muted">
          Prioritized next steps with execution order and impact
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((step, i) => {
          const isDone = completed.has(step.order);
          return (
            <motion.div
              key={step.order}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 transition-colors",
                isDone
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-border bg-surface/50"
              )}
            >
              <button
                type="button"
                onClick={() => toggleStep(step.order)}
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
                  isDone
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-border hover:border-primary/50"
                )}
                aria-label={`Mark step ${step.order} as ${isDone ? "incomplete" : "complete"}`}
              >
                {isDone && <Check className="h-3.5 w-3.5" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted">
                    Step {step.order}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", priorityColor(step.priority))}
                  >
                    {step.priority}
                  </Badge>
                </div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isDone ? "text-muted line-through" : "text-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p className="mt-1 text-xs text-muted">{step.impact}</p>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
