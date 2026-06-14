"use client";

import type { StoredExecutiveReport } from "@/types/executive-report";
import { ScoreRing } from "@/components/reports/score-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReadinessScorecardProps {
  report: StoredExecutiveReport;
}

const SCORES = [
  { key: "investmentReadinessScore", label: "Investment Readiness" },
  { key: "projectReadinessScore", label: "Project Readiness" },
  { key: "executionReadinessScore", label: "Execution Readiness" },
  { key: "teamReadinessScore", label: "Team Readiness" },
  { key: "launchReadinessScore", label: "Launch Readiness" },
] as const;

export function ReadinessScorecard({ report }: ReadinessScorecardProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Readiness Scorecard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {SCORES.map((item, i) => (
            <ScoreRing
              key={item.key}
              score={report[item.key]}
              label={item.label}
              size={i === 0 ? "lg" : "md"}
              delay={i * 0.1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
