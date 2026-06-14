"use client";

import { AnalysisDashboard } from "@/components/analysis/AnalysisDashboard";
import type { ProjectAnalysis } from "@/lib/validations/analysis";

interface AnalysisResultsProps {
  analysis: ProjectAnalysis;
  usedFallback?: boolean;
  projectTitle?: string;
  analyzedAt?: string;
  className?: string;
}

export function AnalysisResults({
  analysis,
  usedFallback,
  projectTitle,
  analyzedAt,
  className,
}: AnalysisResultsProps) {
  return (
    <AnalysisDashboard
      analysis={analysis}
      usedFallback={usedFallback}
      projectTitle={projectTitle}
      analyzedAt={analyzedAt}
      className={className}
    />
  );
}
