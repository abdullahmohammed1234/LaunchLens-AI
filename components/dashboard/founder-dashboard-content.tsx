"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Briefcase,
  Plus,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { FounderDashboardData } from "@/types/portfolio";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { ActivityFeed } from "@/components/portfolio/activity-feed";
import { GoalsTracker } from "@/components/portfolio/goals-tracker";
import { NotificationCenter } from "@/components/portfolio/notification-center";
import { PortfolioCharts } from "@/components/portfolio/portfolio-charts";
import { WatchlistWidget } from "@/components/portfolio/watchlist-widget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { EMPTY_STATES } from "@/lib/constants/empty-states";

interface FounderDashboardContentProps {
  data: FounderDashboardData;
  projectOptions: { id: string; title: string }[];
}

export function FounderDashboardContent({
  data,
  projectOptions,
}: FounderDashboardContentProps) {
  const { analytics, recentActivity, watchlist, goals, notifications, unreadNotificationCount } =
    data;
  const hasProjects = analytics.totalProjects > 0;

  return (
    <PageContainer>
      <PageHeader
        title="Founder Command Center"
        description="Track portfolio health, progress, and opportunities"
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/portfolio">Portfolio</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/portfolio/boardroom">Boardroom</Link>
            </Button>
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>
        }
      />

      {!hasProjects ? (
        <EmptyState
          icon={EMPTY_STATES.dashboard.icon}
          title={EMPTY_STATES.dashboard.title}
          description={EMPTY_STATES.dashboard.description}
          action={{
            label: EMPTY_STATES.dashboard.actionLabel,
            href: EMPTY_STATES.dashboard.actionHref,
          }}
          secondaryAction={EMPTY_STATES.dashboard.secondaryAction}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard
              label="Total Projects"
              value={analytics.totalProjects}
              icon={Briefcase}
              index={0}
            />
            <StatCard
              label="Avg Success Score"
              value={
                analytics.analyzedProjects > 0
                  ? Math.round(analytics.averageSuccessScore)
                  : "—"
              }
              trend={
                analytics.averageSuccessScore >= 60
                  ? "up"
                  : analytics.averageSuccessScore >= 40
                    ? "neutral"
                    : "down"
              }
              icon={TrendingUp}
              index={1}
            />
            <StatCard
              label="Avg Readiness"
              value={
                analytics.averageReadiness > 0
                  ? Math.round(analytics.averageReadiness)
                  : "—"
              }
              icon={Target}
              index={2}
            />
            <StatCard
              label="Portfolio Health"
              value={`${analytics.portfolioHealthScore}%`}
              trend={
                analytics.portfolioHealthScore >= 65
                  ? "up"
                  : analytics.portfolioHealthScore >= 40
                    ? "neutral"
                    : "down"
              }
              icon={Sparkles}
              index={3}
            />
            <StatCard
              label="Needs Attention"
              value={analytics.projectsRequiringAttention.length}
              trend={
                analytics.projectsRequiringAttention.length > 0 ? "down" : "up"
              }
              icon={AlertTriangle}
              index={4}
            />
            <StatCard
              label="Analyzed"
              value={`${analytics.analyzedProjects}/${analytics.totalProjects}`}
              icon={TrendingDown}
              index={5}
            />
          </div>

          {(analytics.highestPotential || analytics.mostAtRisk) && (
            <div className="grid gap-4 md:grid-cols-2">
              {analytics.highestPotential && (
                <Card className="border-emerald-500/20 bg-emerald-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-emerald-400">
                      Highest Potential
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/projects/${analytics.highestPotential.id}`}
                      className="text-lg font-semibold text-foreground hover:text-primary"
                    >
                      {analytics.highestPotential.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      Success: {analytics.highestPotential.successScore}
                      {analytics.highestPotential.readinessScore !== null &&
                        ` · Readiness: ${analytics.highestPotential.readinessScore}`}
                    </p>
                  </CardContent>
                </Card>
              )}
              {analytics.mostAtRisk && (
                <Card className="border-danger/20 bg-danger/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-danger">
                      Most At-Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/projects/${analytics.mostAtRisk.id}`}
                      className="text-lg font-semibold text-foreground hover:text-primary"
                    >
                      {analytics.mostAtRisk.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      Risk: {analytics.mostAtRisk.riskLevel} · Score:{" "}
                      {analytics.mostAtRisk.successScore}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {analytics.mostImproved && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex items-center gap-4 p-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Most Improved: {analytics.mostImproved.title}
                  </p>
                  <p className="text-xs text-muted">
                    +{analytics.mostImproved.scoreChange} points (now{" "}
                    {analytics.mostImproved.currentScore})
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <SectionHeader
                title="Portfolio Analytics"
                description="Score distributions and readiness trends"
              />
              <PortfolioCharts analytics={analytics} />
              <ActivityFeed activities={recentActivity} />
            </div>
            <div className="space-y-6">
              <WatchlistWidget projects={watchlist} />
              <NotificationCenter
                notifications={notifications}
                unreadCount={unreadNotificationCount}
              />
              <GoalsTracker goals={goals} projectOptions={projectOptions} />
            </div>
          </div>

          {analytics.projectsRequiringAttention.length > 0 && (
            <>
              <SectionHeader
                title="Projects Requiring Attention"
                description="Projects that need your focus"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {analytics.projectsRequiringAttention.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="flex items-center gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4 transition-colors hover:border-warning/50"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {p.title}
                      </p>
                      <p className="text-xs text-muted">{p.reason}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </PageContainer>
  );
}
