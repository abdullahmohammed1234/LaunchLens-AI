"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Layers,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";
import type { ProjectAnalysis } from "@/lib/validations/analysis";
import {
  formatTimeline,
  levelToBadgeVariant,
  sortBlockersBySeverity,
} from "@/lib/utils/analysis";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuccessScoreCard } from "./SuccessScoreCard";
import { RiskCard } from "./RiskCard";
import { SkillGapChart } from "./SkillGapChart";
import { TimelineBar } from "./TimelineBar";
import { InsightCard } from "./InsightCard";
import { MVPChecklist } from "./MVPChecklist";

interface AnalysisDashboardProps {
  analysis: ProjectAnalysis;
  usedFallback?: boolean;
  projectTitle?: string;
  analyzedAt?: string;
  className?: string;
}

export function AnalysisDashboard({
  analysis,
  usedFallback,
  projectTitle,
  analyzedAt,
  className,
}: AnalysisDashboardProps) {
  const sortedBlockers = sortBlockersBySeverity(analysis.blockers);

  return (
    <motion.div
      className={cn("space-y-6", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {(projectTitle || analyzedAt) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          {projectTitle && (
            <h2 className="text-lg font-semibold text-foreground">
              {projectTitle}
            </h2>
          )}
          {analyzedAt && (
            <p className="text-xs text-muted">{analyzedAt}</p>
          )}
        </div>
      )}

      {usedFallback && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning"
        >
          Analysis used a fallback response. Consider retrying for
          project-specific insights.
        </motion.div>
      )}

      {/* Hero Metrics */}
      <section aria-label="Key metrics">
        <div className="grid gap-4 lg:grid-cols-4">
          <SuccessScoreCard score={analysis.successScore} index={0} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="grid gap-4 sm:grid-cols-2 lg:col-span-2"
          >
            <Card className="group border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <ShieldAlert className="mb-3 h-5 w-5 text-warning" />
                <Badge
                  variant={levelToBadgeVariant(analysis.riskLevel)}
                  className="text-sm capitalize"
                >
                  {analysis.riskLevel} risk
                </Badge>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">
                  Risk Level
                </p>
              </CardContent>
            </Card>

            <Card className="group border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Layers className="mb-3 h-5 w-5 text-primary" />
                <Badge
                  variant={levelToBadgeVariant(analysis.complexity)}
                  className="text-sm capitalize"
                >
                  {analysis.complexity} complexity
                </Badge>
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">
                  Complexity
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <Card className="group border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {formatTimeline(analysis)}
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted">
                Est. Timeline
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Timeline Visualization */}
      <TimelineBar timeline={analysis.estimatedTimeline} index={1} />

      {/* Risk + Skill Gaps */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-danger" />
              Risk Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedBlockers.map((blocker, i) => (
              <RiskCard key={blocker.title} blocker={blocker} index={i} />
            ))}
          </CardContent>
        </Card>

        <SkillGapChart skillGaps={analysis.skillGaps} index={2} />
      </div>

      {/* Recommendations + MVP */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4 text-warning" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.recommendations.map((rec, i) => (
              <InsightCard key={i} insight={rec} index={i} />
            ))}
          </CardContent>
        </Card>

        <MVPChecklist items={analysis.mvpScope} index={3} />
      </div>
    </motion.div>
  );
}
