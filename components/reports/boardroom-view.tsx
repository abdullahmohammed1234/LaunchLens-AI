"use client";

import { motion } from "framer-motion";
import { Sparkles, Target, TrendingUp } from "lucide-react";
import type { StoredExecutiveReport } from "@/types/executive-report";
import { ScoreRing } from "@/components/reports/score-ring";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface BoardroomViewProps {
  report: StoredExecutiveReport;
  projectTitle: string;
}

export function BoardroomView({ report, projectTitle }: BoardroomViewProps) {
  const topSteps = [...report.recommendedNextSteps]
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-8 md:p-12"
    >
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
            Executive Intelligence Report
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {projectTitle}
          </h2>
          <p className="mt-2 text-sm text-muted">
            Prepared by LaunchLens AI · Strategic Advisory
          </p>
        </div>
        <ScoreRing
          score={report.investmentReadinessScore}
          label="Investment Readiness"
          size="lg"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <Card className="border-border/60 bg-surface/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {report.projectReadinessScore}
            </p>
            <p className="text-xs text-muted mt-1">Project</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-surface/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {report.executionReadinessScore}
            </p>
            <p className="text-xs text-muted mt-1">Execution</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-surface/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {report.teamReadinessScore}
            </p>
            <p className="text-xs text-muted mt-1">Team</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-surface/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {report.launchReadinessScore}
            </p>
            <p className="text-xs text-muted mt-1">Launch</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Executive Summary</h3>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {report.executiveSummary}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="font-semibold text-foreground">Key Strengths</h3>
          </div>
          <ul className="space-y-2">
            {report.strengths.slice(0, 4).map((s, i) => (
              <li key={i} className="text-sm text-foreground/90 flex gap-2">
                <span className="text-emerald-400">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">Final Recommendation</h3>
        </div>
        <p className="text-sm leading-relaxed text-foreground">
          {report.finalRecommendation}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 font-semibold text-foreground">Priority Actions</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {topSteps.map((step) => (
            <div
              key={step.order}
              className="rounded-lg border border-border/60 bg-surface/30 px-4 py-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-muted">
                  #{step.order}
                </span>
                <Badge variant="outline" className="text-xs">
                  {step.priority}
                </Badge>
              </div>
              <p className="text-sm font-medium text-foreground">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
