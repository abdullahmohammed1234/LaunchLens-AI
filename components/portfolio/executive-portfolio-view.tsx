"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Briefcase, Sparkles, TrendingUp } from "lucide-react";
import type { PortfolioAnalytics, PortfolioProject } from "@/types/portfolio";
import { AnimatedMetric } from "@/components/portfolio/animated-metric";
import { ScoreRing } from "@/components/reports/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ExecutivePortfolioViewProps {
  analytics: PortfolioAnalytics;
  projects: PortfolioProject[];
}

export function ExecutivePortfolioView({
  analytics,
  projects,
}: ExecutivePortfolioViewProps) {
  const bestOpportunities = [...projects]
    .filter((p) => p.successScore !== null)
    .sort((a, b) => (b.successScore ?? 0) - (a.successScore ?? 0))
    .slice(0, 5);

  const criticalRisks = projects
    .filter((p) => p.riskLevel === "high" || p.requiresAttention)
    .slice(0, 5);

  const investmentReady = [...projects]
    .filter((p) => p.readinessScore !== null)
    .sort((a, b) => (b.readinessScore ?? 0) - (a.readinessScore ?? 0))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-8 md:p-12"
    >
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
            Executive Portfolio Intelligence
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Portfolio Boardroom
          </h2>
          <p className="mt-2 text-sm text-muted">
            Strategic overview for accelerators, incubators, and founding teams
          </p>
        </div>
        <ScoreRing
          score={analytics.portfolioHealthScore}
          label="Portfolio Health"
          size="lg"
        />
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Projects", value: analytics.totalProjects },
          { label: "Avg Success", value: Math.round(analytics.averageSuccessScore) },
          { label: "Avg Readiness", value: Math.round(analytics.averageReadiness) },
          { label: "Analyzed", value: analytics.analyzedProjects },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="border-border/60 bg-surface/50">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold tabular-nums text-foreground">
                  <AnimatedMetric value={metric.value} />
                </p>
                <p className="mt-1 text-xs text-muted">{metric.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="font-semibold text-foreground">Best Opportunities</h3>
          </div>
          {bestOpportunities.length > 0 ? (
            <ul className="space-y-2">
              {bestOpportunities.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.id}`}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-surface/30 px-3 py-2 text-sm transition-colors hover:border-primary/30"
                  >
                    <span className="truncate text-foreground">{p.title}</span>
                    <span className="ml-2 shrink-0 font-bold text-emerald-400">
                      {p.successScore}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Run analyses to identify opportunities</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-danger" />
            <h3 className="font-semibold text-foreground">Critical Risks</h3>
          </div>
          {criticalRisks.length > 0 ? (
            <ul className="space-y-2">
              {criticalRisks.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.id}`}
                    className="flex items-center justify-between rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-sm transition-colors hover:border-danger/40"
                  >
                    <span className="truncate text-foreground">{p.title}</span>
                    <Badge variant="danger" className="ml-2 shrink-0 text-[10px]">
                      {p.riskLevel ?? "attention"}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No critical risks flagged</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Investment Readiness</h3>
          </div>
          {investmentReady.length > 0 ? (
            <ul className="space-y-2">
              {investmentReady.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.id}/reports`}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-surface/30 px-3 py-2 text-sm transition-colors hover:border-primary/30"
                  >
                    <span className="truncate text-foreground">{p.title}</span>
                    <span className="ml-2 shrink-0 font-bold text-primary">
                      {p.readinessScore}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Generate executive reports for readiness scores</p>
          )}
        </div>
      </div>

      {analytics.highestPotential && (
        <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Portfolio Summary</h3>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            Your portfolio of {analytics.totalProjects} project
            {analytics.totalProjects !== 1 ? "s" : ""} shows an average success
            score of {Math.round(analytics.averageSuccessScore)} with{" "}
            {analytics.analyzedProjects} analyzed.
            {analytics.highestPotential &&
              ` ${analytics.highestPotential.title} leads with a score of ${analytics.highestPotential.successScore}.`}
            {analytics.mostAtRisk &&
              ` ${analytics.mostAtRisk.title} requires the most risk attention.`}
            {analytics.mostImproved &&
              ` ${analytics.mostImproved.title} improved the most (+${analytics.mostImproved.scoreChange} points).`}
          </p>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/portfolio">Full Portfolio</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Founder Dashboard</Link>
        </Button>
      </div>
    </motion.div>
  );
}
