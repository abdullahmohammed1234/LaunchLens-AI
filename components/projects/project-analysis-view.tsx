"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, BarChart3, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { projectAnalysisSchema } from "@/lib/validations/analysis";
import { AnalysisDashboard } from "@/components/analysis/AnalysisDashboard";
import { AnalysisLoading } from "@/components/analysis/AnalysisLoading";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { StoredAnalysis } from "@/components/projects/project-analysis-section";

interface ProjectAnalysisViewProps {
  projectId: string;
  projectTitle: string;
  initialAnalysis: StoredAnalysis | null;
}

export function ProjectAnalysisView({
  projectId,
  projectTitle,
  initialAnalysis,
}: ProjectAnalysisViewProps) {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<StoredAnalysis | null>(
    initialAnalysis
  );
  const [isLoading, setIsLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  async function handleAnalyze() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Analysis failed");
      }

      const parsed = projectAnalysisSchema.safeParse(result);
      if (!parsed.success) {
        throw new Error("Invalid analysis response");
      }

      setAnalysis(result as StoredAnalysis);
      setUsedFallback(result.usedFallback ?? false);
      toast.success("Project analysis complete");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to analyze project"
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <AnalysisLoading fullPage />;
  }

  if (!analysis) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No analysis yet"
        description="Run AI analysis to get feasibility scores, risk assessment, and MVP recommendations for this project."
        action={{
          label: "Analyze Project",
          onClick: handleAnalyze,
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Project
          </Link>
        </Button>
        <Button onClick={handleAnalyze} size="sm">
          <BarChart3 className="h-4 w-4" />
          Re-analyze
        </Button>
      </div>

      <AnalysisDashboard
        analysis={analysis}
        usedFallback={usedFallback}
        projectTitle={projectTitle}
        analyzedAt={`Analyzed ${formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}`}
      />
    </div>
  );
}
