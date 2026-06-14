"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FolderKanban, Plus, FileText, Activity } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { EMPTY_STATES } from "@/lib/constants/empty-states";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { Project } from "@prisma/client";

interface DashboardContentProps {
  stats: {
    total: number;
    active: number;
    draft: number;
  };
  recentProjects: Project[];
}

export function DashboardContent({
  stats,
  recentProjects,
}: DashboardContentProps) {
  const hasProjects = stats.total > 0;

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your projects and insights"
        action={
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Projects"
          value={stats.total}
          icon={FolderKanban}
          index={0}
        />
        <StatCard
          label="Active Projects"
          value={stats.active}
          icon={Activity}
          index={1}
        />
        <StatCard
          label="Draft Projects"
          value={stats.draft}
          icon={FileText}
          index={2}
        />
      </div>

      {!hasProjects ? (
        <EmptyState
          icon={EMPTY_STATES.dashboard.icon}
          title="Your command center awaits"
          description="Analyze your first project idea and discover its success potential with AI-powered intelligence."
          action={{
            label: EMPTY_STATES.projects.actionLabel,
            href: EMPTY_STATES.projects.actionHref,
          }}
          secondaryAction={EMPTY_STATES.projects.secondaryAction}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Projects</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/projects">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {project.title}
                    </p>
                    <p className="text-xs text-muted">
                      Updated{" "}
                      {formatDistanceToNow(new Date(project.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <ProjectStatusBadge status={project.status} />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: "New Project",
                  href: "/projects/new",
                  icon: Plus,
                  desc: "Add a project idea",
                },
                {
                  label: "View Projects",
                  href: "/projects",
                  icon: FolderKanban,
                  desc: "Manage all projects",
                },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="group flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <Icon className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {action.label}
                      </p>
                      <p className="text-xs text-muted">{action.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {hasProjects && (
        <>
          <SectionHeader
            title="Activity Overview"
            description="Your project activity will appear here in future phases"
          />
          <Card className="border-border bg-card">
            <CardContent className="flex h-48 items-center justify-center p-6">
              <div className="text-center">
                <FolderKanban className="mx-auto mb-3 h-10 w-10 text-muted/50" />
                <p className="text-sm text-muted">
                  Run AI analysis on your projects from the Analyzer or project detail page
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
