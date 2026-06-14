"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ImprovementInsights } from "@/types/portfolio";
import { PortfolioLoading } from "@/components/portfolio/portfolio-loading";
import { AnimatedMetric } from "@/components/portfolio/animated-metric";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ImprovementInsightsPanelProps {
  projectId: string;
}

export function ImprovementInsightsPanel({
  projectId,
}: ImprovementInsightsPanelProps) {
  const [insights, setInsights] = useState<ImprovementInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch("/api/portfolio/improvement-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });
        if (!res.ok) throw new Error("Failed to load insights");
        const data = await res.json();
        setInsights(data.insights);
      } catch {
        setError("Could not generate improvement insights");
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [projectId]);

  if (loading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-12">
          <PortfolioLoading message="Generating founder insights..." />
        </CardContent>
      </Card>
    );
  }

  if (error || !insights) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-8 text-center text-sm text-muted">
          {error ?? "No insights available"}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <CardTitle className="text-lg">Improvement Insights</CardTitle>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Project Health</p>
              <p className="text-2xl font-bold text-foreground">
                <AnimatedMetric value={insights.projectHealth} suffix="%" />
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div>
            <h4 className="mb-2 text-sm font-medium text-success">Improvements</h4>
            <ul className="space-y-1.5">
              {insights.improvements.map((item, i) => (
                <li key={i} className="text-sm text-foreground/90 flex gap-2">
                  <span className="text-success">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-danger">Regressions</h4>
            {insights.regressions.length > 0 ? (
              <ul className="space-y-1.5">
                {insights.regressions.map((item, i) => (
                  <li key={i} className="text-sm text-foreground/90 flex gap-2">
                    <span className="text-danger">−</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No regressions detected</p>
            )}
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-primary">
              Recommended Actions
            </h4>
            <ul className="space-y-1.5">
              {insights.recommendedActions.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground/90">
                  <Badge variant="outline" className="h-5 w-5 shrink-0 justify-center p-0 text-[10px]">
                    {i + 1}
                  </Badge>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
