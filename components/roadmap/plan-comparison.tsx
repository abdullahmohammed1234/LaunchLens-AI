"use client";

import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  Clock,
  Layers,
  Shield,
} from "lucide-react";
import type { PlanComparison } from "@/types/roadmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlanComparisonSectionProps {
  comparison: PlanComparison;
  currentDurationLabel?: string;
  optimizedDurationMonths: number;
}

export function PlanComparisonSection({
  comparison,
  currentDurationLabel,
  optimizedDurationMonths,
}: PlanComparisonSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ArrowRightLeft className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Roadmap Comparison
        </h2>
      </div>

      <Tabs defaultValue="comparison">
        <TabsList>
          <TabsTrigger value="comparison">Side by Side</TabsTrigger>
          <TabsTrigger value="current">Current Plan</TabsTrigger>
          <TabsTrigger value="optimized">Optimized Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="h-full border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted" />
                    Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted">
                    {comparison.durationDifference}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted">
                      Current: {currentDurationLabel ?? "As stated"}
                    </span>
                    <span className="font-medium text-primary">
                      Optimized: {optimizedDurationMonths}mo
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="h-full border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Layers className="h-4 w-4 text-muted" />
                    Scope Changes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {comparison.scopeChanges.map((change) => (
                      <li
                        key={change}
                        className="flex items-start gap-2 text-sm text-muted"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted" />
                    Risk Mitigations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {comparison.riskMitigations.map((mitigation) => (
                      <li
                        key={mitigation}
                        className="flex items-start gap-2 text-sm text-muted"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                        {mitigation}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="current" className="mt-4">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <p className="text-sm leading-relaxed text-muted">
                {comparison.currentPlanSummary}
              </p>
              {currentDurationLabel && (
                <p className="mt-4 text-sm font-medium text-foreground">
                  Stated timeline: {currentDurationLabel}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimized" className="mt-4">
          <Card className="border-primary/20 bg-card">
            <CardContent className="p-6">
              <p className="text-sm leading-relaxed text-muted">
                {comparison.optimizedPlanSummary}
              </p>
              <p className="mt-4 text-sm font-medium text-primary">
                Recommended duration: {optimizedDurationMonths} months
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
