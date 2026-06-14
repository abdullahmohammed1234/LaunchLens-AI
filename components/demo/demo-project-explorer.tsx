"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { DemoProjectFull } from "@/lib/demo/demo-data";
import { AnalysisDashboard } from "@/components/analysis/AnalysisDashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FailureSimulatorView = dynamic(
  () =>
    import("@/components/simulator/failure-simulator-view").then(
      (m) => m.FailureSimulatorView
    ),
  { loading: () => <DemoTabLoading label="simulation" /> }
);

const RoadmapView = dynamic(
  () =>
    import("@/components/roadmap/roadmap-view").then((m) => m.RoadmapView),
  { loading: () => <DemoTabLoading label="roadmap" /> }
);

const TeamView = dynamic(
  () => import("@/components/team/team-view").then((m) => m.TeamView),
  { loading: () => <DemoTabLoading label="team plan" /> }
);

const ReportView = dynamic(
  () =>
    import("@/components/reports/report-view").then((m) => m.ReportView),
  { loading: () => <DemoTabLoading label="report" /> }
);

function DemoTabLoading({ label }: { label: string }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card">
      <p className="text-sm text-muted">Loading {label}...</p>
    </div>
  );
}

interface DemoProjectExplorerProps {
  project: DemoProjectFull;
}

export function DemoProjectExplorer({ project }: DemoProjectExplorerProps) {
  const storedSimulation = {
    ...project.simulation,
    id: `sim-${project.id}`,
    projectId: project.id,
    createdAt: project.createdAt,
  };

  const storedRoadmap = {
    ...project.roadmap,
    id: `roadmap-${project.id}`,
    projectId: project.id,
    createdAt: project.createdAt,
  };

  const storedTeamPlan = {
    ...project.teamPlan,
    id: `team-${project.id}`,
    projectId: project.id,
    createdAt: project.createdAt,
  };

  const storedReport = {
    ...project.report,
    id: `report-${project.id}`,
    projectId: project.id,
    createdAt: project.createdAt,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/demo" aria-label="Back to demo">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">
                {project.title}
              </h1>
              <Badge variant="default">
                <Sparkles className="mr-1 h-3 w-3" />
                Demo
              </Badge>
            </div>
            <p className="text-sm text-muted">{project.tagline}</p>
          </div>
        </div>
        <Button asChild className="glow-primary">
          <Link href="/auth/register">Save to My Account</Link>
        </Button>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="flex w-full flex-wrap h-auto gap-1 bg-surface p-1">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="team">Team Plan</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <AnalysisDashboard
            analysis={project.analysis}
            projectTitle={project.title}
            analyzedAt={project.createdAt}
          />
        </TabsContent>

        <TabsContent value="simulation">
          <FailureSimulatorView
            projectId={project.id}
            projectTitle={project.title}
            hasAnalysis
            initialSimulation={storedSimulation}
            showBackLink={false}
          />
        </TabsContent>

        <TabsContent value="roadmap">
          <RoadmapView
            projectId={project.id}
            projectTitle={project.title}
            projectTimeline={project.timeline}
            hasAnalysis
            hasSimulation
            initialRoadmap={storedRoadmap}
            showBackLink={false}
          />
        </TabsContent>

        <TabsContent value="team">
          <TeamView
            projectId={project.id}
            projectTitle={project.title}
            hasAnalysis
            hasSimulation
            hasRoadmap
            initialTeamPlan={storedTeamPlan}
            showBackLink={false}
          />
        </TabsContent>

        <TabsContent value="report">
          <ReportView
            projectId={project.id}
            projectTitle={project.title}
            hasAnalysis
            hasSimulation
            hasRoadmap
            hasTeamPlan
            initialReport={storedReport}
            reportHistory={[storedReport]}
            showBackLink={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
