"use client";

import { Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisForm } from "@/components/analyzer/analysis-form";

export default function AnalyzerPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Analyzer"
        description="Analyze your project idea and get structured feasibility insights"
        action={
          <Badge variant="default">
            <Sparkles className="mr-1 h-3 w-3" />
            AI-Powered
          </Badge>
        }
      />

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Quick Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalysisForm redirectToResults />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
