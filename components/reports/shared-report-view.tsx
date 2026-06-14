"use client";

import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import type { StoredExecutiveReport } from "@/types/executive-report";
import { BoardroomView } from "@/components/reports/boardroom-view";
import { ReadinessScorecard } from "@/components/reports/readiness-scorecard";
import { ExecutiveSummarySection } from "@/components/reports/executive-summary-section";
import { StrengthsWeaknesses } from "@/components/reports/strengths-weaknesses";
import { RiskBriefing } from "@/components/reports/risk-briefing";
import { ActionPlan } from "@/components/reports/action-plan";
import { SuccessFactors } from "@/components/reports/success-factors";
import { ReportLoading } from "@/components/reports/report-loading";
import { Badge } from "@/components/ui/badge";

interface SharedReportViewProps {
  token: string;
}

export function SharedReportView({ token }: SharedReportViewProps) {
  const [report, setReport] = useState<StoredExecutiveReport | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await fetch(`/api/shared/report/${token}`);
        const result = await response.json();

        if (!response.ok) {
          setError(result.error ?? "Failed to load report");
          return;
        }

        setReport(result as StoredExecutiveReport);
        setProjectTitle(result.projectTitle ?? "Project Report");
        setExpiresAt(result.expiresAt ?? null);
      } catch {
        setError("Failed to load shared report");
      } finally {
        setIsLoading(false);
      }
    }

    loadReport();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-12">
        <ReportLoading />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-muted mb-4" />
          <h1 className="text-xl font-semibold text-foreground">
            Report Not Available
          </h1>
          <p className="mt-2 text-sm text-muted">
            {error ?? "This share link may be invalid or expired."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 px-6 py-4 md:px-12">
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-2">
          <div>
            <Badge variant="outline" className="mb-2 text-xs">
              Shared Report · View Only
            </Badge>
            <h1 className="text-lg font-semibold text-foreground">
              {projectTitle}
            </h1>
          </div>
          {expiresAt && (
            <p className="text-xs text-muted">
              Expires {new Date(expiresAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-12">
        <BoardroomView report={report} projectTitle={projectTitle} />
        <ReadinessScorecard report={report} />
        <ExecutiveSummarySection report={report} />
        <StrengthsWeaknesses report={report} />
        <SuccessFactors factors={report.successFactors} />
        <RiskBriefing risks={report.criticalRisks} />
        <ActionPlan steps={report.recommendedNextSteps} />
      </div>
    </div>
  );
}
