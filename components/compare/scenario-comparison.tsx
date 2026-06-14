"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { ScenarioComparisonEntry } from "@/types/project-comparison";
import {
  getProjectTitle,
  levelAccentClass,
  levelToBadgeVariant,
} from "@/lib/utils/project-comparison";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScenarioComparisonProps {
  scenarios: ScenarioComparisonEntry[];
  projectTitles: Record<string, string>;
}

export function ScenarioComparison({
  scenarios,
  projectTitles,
}: ScenarioComparisonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
    >
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Failure Scenario Comparison
          </CardTitle>
          <p className="text-xs text-muted">
            Most likely failure path for each project based on simulation data
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.projectId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
                className={cn(
                  "rounded-xl border border-border bg-surface/30 p-5 transition-colors hover:border-primary/20"
                )}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {getProjectTitle(scenario.projectId, projectTitles)}
                </p>
                <h4 className="mt-2 text-sm font-semibold leading-snug text-foreground">
                  {scenario.mostLikelyFailure}
                </h4>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant={levelToBadgeVariant(scenario.severity)}>
                    {scenario.severity} severity
                  </Badge>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      levelAccentClass(scenario.severity)
                    )}
                  >
                    {scenario.probability}% probability
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  {scenario.summary}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
