"use client";

import Link from "next/link";
import { ArrowRight, Layers, ShieldAlert } from "lucide-react";
import type { ProjectAnalysis } from "@/lib/validations/analysis";
import { formatTimeline, levelToBadgeVariant } from "@/lib/utils/analysis";
import { SuccessScoreCard } from "@/components/analysis/SuccessScoreCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AnalysisPreviewProps {
  analysis: ProjectAnalysis;
  projectId: string;
}

export function AnalysisPreview({ analysis, projectId }: AnalysisPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SuccessScoreCard score={analysis.successScore} />

        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <ShieldAlert className="mb-2 h-5 w-5 text-warning" />
            <Badge variant={levelToBadgeVariant(analysis.riskLevel)} className="capitalize">
              {analysis.riskLevel} risk
            </Badge>
            <p className="mt-2 text-xs text-muted">Risk Level</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Layers className="mb-2 h-5 w-5 text-primary" />
            <Badge variant={levelToBadgeVariant(analysis.complexity)} className="capitalize">
              {analysis.complexity} complexity
            </Badge>
            <p className="mt-2 text-xs text-muted">Complexity</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-xl font-bold text-foreground">
              {formatTimeline(analysis)}
            </p>
            <p className="mt-2 text-xs text-muted">Est. Timeline</p>
          </CardContent>
        </Card>
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link href={`/projects/${projectId}/analysis`}>
          View Full Analysis Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
