"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  LayoutGrid,
  Play,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import type { StoredExecutiveReport } from "@/types/executive-report";
import { executiveReportSchema } from "@/types/executive-report";
import { ReportLoading } from "@/components/reports/report-loading";
import { ReadinessScorecard } from "@/components/reports/readiness-scorecard";
import { ExecutiveSummarySection } from "@/components/reports/executive-summary-section";
import { StrengthsWeaknesses } from "@/components/reports/strengths-weaknesses";
import { RiskBriefing } from "@/components/reports/risk-briefing";
import { ActionPlan } from "@/components/reports/action-plan";
import { BoardroomView } from "@/components/reports/boardroom-view";
import { SuccessFactors } from "@/components/reports/success-factors";
import {
  ReportHistory,
  buildHistoryFromReports,
} from "@/components/reports/report-history";
import { ReportPdfExport } from "@/components/reports/report-pdf-export";
import { ReportShareDialog } from "@/components/reports/report-share-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/cn";

interface ReportViewProps {
  projectId: string;
  projectTitle: string;
  hasAnalysis: boolean;
  hasSimulation: boolean;
  hasRoadmap: boolean;
  hasTeamPlan: boolean;
  initialReport: StoredExecutiveReport | null;
  reportHistory: StoredExecutiveReport[];
  showBackLink?: boolean;
}

export function ReportView({
  projectId,
  projectTitle,
  hasAnalysis,
  hasSimulation,
  hasRoadmap,
  hasTeamPlan,
  initialReport,
  reportHistory,
  showBackLink = true,
}: ReportViewProps) {
  const router = useRouter();
  const [report, setReport] = useState<StoredExecutiveReport | null>(
    initialReport
  );
  const [history, setHistory] = useState<StoredExecutiveReport[]>(reportHistory);
  const [isLoading, setIsLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [viewMode, setViewMode] = useState<"detailed" | "boardroom">("detailed");

  async function handleGenerate() {
    if (!hasAnalysis) {
      toast.error("Run project analysis before generating a report");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Report generation failed");
      }

      const parsed = executiveReportSchema.safeParse(result);
      if (!parsed.success) {
        throw new Error("Invalid report response");
      }

      const newReport = result as StoredExecutiveReport;
      setReport(newReport);
      setHistory((prev) => [newReport, ...prev]);
      setUsedFallback(result.usedFallback ?? false);
      toast.success("Executive report generated");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate report"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectReport(reportId: string) {
    if (report?.id === reportId) return;

    const cached = history.find((r) => r.id === reportId);
    if (cached) {
      setReport(cached);
      return;
    }

    try {
      const response = await fetch(`/api/reports/${reportId}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to load report");
      }
      setReport(result as StoredExecutiveReport);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load report"
      );
    }
  }

  if (isLoading) {
    return <ReportLoading fullPage />;
  }

  if (!hasAnalysis) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Analysis required"
        description="Run AI analysis on this project first. The executive report synthesizes analysis, simulation, roadmap, and team intelligence."
        action={{
          label: "Go to Analysis",
          onClick: () => router.push(`/projects/${projectId}/analysis`),
        }}
      />
    );
  }

  if (!report) {
    return (
      <EmptyState
        icon={FileText}
        title="No executive report yet"
        description={`Generate a professional executive report for ${projectTitle} — investor-ready intelligence synthesized from all project data.`}
        action={{
          label: "Generate Report",
          onClick: handleGenerate,
        }}
      />
    );
  }

  const intelligenceBadges = [
    { label: "Analysis", active: hasAnalysis },
    { label: "Simulation", active: hasSimulation },
    { label: "Roadmap", active: hasRoadmap },
    { label: "Team Plan", active: hasTeamPlan },
  ];

  return (
    <div className="space-y-6">
      {showBackLink && (
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Link>
        </Button>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {formatDistanceToNow(new Date(report.createdAt), {
              addSuffix: true,
            })}
          </Badge>
          {usedFallback && (
            <Badge variant="outline" className="text-xs text-amber-400">
              Advisory fallback
            </Badge>
          )}
          {intelligenceBadges.map((b) => (
            <Badge
              key={b.label}
              variant="outline"
              className={cn(
                "text-xs",
                b.active
                  ? "border-emerald-500/30 text-emerald-400"
                  : "text-muted"
              )}
            >
              {b.label}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleGenerate}>
            <Play className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <ReportPdfExport report={report} projectTitle={projectTitle} />
          <ReportShareDialog reportId={report.id} />
          <Button
            variant={viewMode === "boardroom" ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setViewMode((m) => (m === "boardroom" ? "detailed" : "boardroom"))
            }
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            {viewMode === "boardroom" ? "Detailed View" : "Boardroom"}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "boardroom" ? (
          <motion.div
            key="boardroom"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <BoardroomView report={report} projectTitle={projectTitle} />
          </motion.div>
        ) : (
          <motion.div
            key="detailed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ReadinessScorecard report={report} />

            <Tabs defaultValue="summary" className="w-full">
              <TabsList>
                <TabsTrigger value="summary">Executive Summary</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="actions">Action Plan</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-6">
                <ExecutiveSummarySection report={report} />
              </TabsContent>

              <TabsContent value="insights" className="mt-6 space-y-6">
                <StrengthsWeaknesses report={report} />
                <SuccessFactors factors={report.successFactors} />
              </TabsContent>

              <TabsContent value="risks" className="mt-6">
                <RiskBriefing risks={report.criticalRisks} />
              </TabsContent>

              <TabsContent value="actions" className="mt-6">
                <ActionPlan steps={report.recommendedNextSteps} />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      {history.length > 1 && (
        <ReportHistory
          history={buildHistoryFromReports(history)}
          activeReportId={report.id}
          onSelectReport={handleSelectReport}
        />
      )}
    </div>
  );
}
