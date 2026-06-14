"use client";

import { motion } from "framer-motion";
import { Lightbulb, Sparkles, Scale, Trophy } from "lucide-react";
import type { DecisionEngine } from "@/types/project-comparison";
import { getProjectTitle } from "@/lib/utils/project-comparison";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComparisonDecisionProps {
  decision: DecisionEngine;
  projectTitles: Record<string, string>;
  comparisonSummary: string;
  recommendations: string[];
}

export function ComparisonDecision({
  decision,
  projectTitles,
  comparisonSummary,
  recommendations,
}: ComparisonDecisionProps) {
  const recommendedTitle = getProjectTitle(
    decision.recommendedProjectId,
    projectTitles
  );

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
          <CardContent className="p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="success">Recommended</Badge>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                  {recommendedTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {comparisonSummary}
                </p>
              </div>

              <div className="lg:max-w-md lg:text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Why it wins
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {decision.whyItWins}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="h-full border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Scale className="h-4 w-4 text-warning" />
                Tradeoffs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {decision.tradeoffs.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-muted before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-warning"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="h-full border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lightbulb className="h-4 w-4 text-primary" />
                Strategic Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted">
                {decision.strategicAdvice}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="h-full border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.slice(0, 4).map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-muted before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-primary"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
