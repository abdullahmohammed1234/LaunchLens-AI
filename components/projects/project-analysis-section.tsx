"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { BarChart3, Brain, ExternalLink, FileText, FlaskConical, Map, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import type { ProjectAnalysis } from "@/lib/validations/analysis";
import { projectAnalysisSchema } from "@/lib/validations/analysis";
import { AnalysisLoading } from "@/components/analysis/AnalysisLoading";
import { AnalysisPreview } from "@/components/analysis/AnalysisPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type StoredAnalysis = ProjectAnalysis & {
  id: string;
  projectId: string;
  createdAt: string;
};

interface ProjectAnalysisSectionProps {
  projectId: string;
  initialAnalysis: StoredAnalysis | null;
}

export function ProjectAnalysisSection({
  projectId,
  initialAnalysis,
}: ProjectAnalysisSectionProps) {
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
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to analyze project"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Analysis
        </CardTitle>
        <div className="flex items-center gap-2">
          {analysis && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={`/projects/${projectId}/simulator`}>
                  <FlaskConical className="h-4 w-4" />
                  Failure Simulator
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/projects/${projectId}/roadmap`}>
                  <Map className="h-4 w-4" />
                  Roadmap
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/projects/${projectId}/team`}>
                  <Users className="h-4 w-4" />
                  Team Builder
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/projects/${projectId}/reports`}>
                  <FileText className="h-4 w-4" />
                  Reports
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/projects/${projectId}/mentor`}>
                  <Brain className="h-4 w-4" />
                  AI Mentor
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/projects/${projectId}/analysis`}>
                  <ExternalLink className="h-4 w-4" />
                  Full Dashboard
                </Link>
              </Button>
            </>
          )}
          <Button onClick={handleAnalyze} disabled={isLoading} size="sm">
            <BarChart3 className="h-4 w-4" />
            {isLoading ? "Analyzing..." : "Analyze Project"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <AnalysisLoading />
        ) : analysis ? (
          <div>
            {usedFallback && (
              <p className="mb-4 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
                Analysis used a fallback response. Re-run for project-specific
                insights.
              </p>
            )}
            <p className="mb-4 text-xs text-muted">
              Analyzed{" "}
              {formatDistanceToNow(new Date(analysis.createdAt), {
                addSuffix: true,
              })}
            </p>
            <AnalysisPreview analysis={analysis} projectId={projectId} />
          </div>
        ) : (
          <div className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/50 text-center">
            <BarChart3 className="mb-3 h-8 w-8 text-muted/50" />
            <p className="text-sm font-medium text-foreground">
              No analysis yet
            </p>
            <p className="mt-1 max-w-sm text-xs text-muted">
              Run AI analysis to get feasibility scores, risk assessment, and
              MVP recommendations for this project.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
