"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, BarChart3, RefreshCw } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { AnalysisDashboard } from "@/components/analysis/AnalysisDashboard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  loadAnalysisResult,
  type StoredAnalysisResult,
} from "@/lib/utils/analysis-storage";

export default function AnalyzerResultsPage() {
  const [result, setResult] = useState<StoredAnalysisResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setResult(loadAnalysisResult());
  }, []);

  if (!mounted) {
    return null;
  }

  if (!result) {
    return (
      <PageContainer>
        <PageHeader
          title="Analysis Results"
          description="View your project feasibility dashboard"
        />
        <EmptyState
          icon={BarChart3}
          title="No analysis results"
          description="Run an analysis from the analyzer to see your feasibility dashboard here."
          action={{
            label: "Go to Analyzer",
            href: "/analyzer",
          }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Analysis Results"
        description="AI-powered feasibility insights for your project"
        action={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/analyzer">
                <ArrowLeft className="h-4 w-4" />
                New Analysis
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/analyzer">
                <RefreshCw className="h-4 w-4" />
                Re-run
              </Link>
            </Button>
          </div>
        }
      />

      <AnalysisDashboard
        analysis={result.analysis}
        usedFallback={result.usedFallback}
        projectTitle={result.projectTitle}
        analyzedAt={`Analyzed ${formatDistanceToNow(new Date(result.timestamp), { addSuffix: true })}`}
      />
    </PageContainer>
  );
}
