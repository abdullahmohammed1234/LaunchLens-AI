import Link from "next/link";
import { auth } from "@/auth";
import {
  getLatestAnalysisForProject,
  getLatestFailureSimulationForProject,
  getLatestRoadmapForProject,
  getLatestTeamPlanForProject,
  getProjectsForUser,
} from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { CompareView } from "@/components/compare/compare-view";
import { Button } from "@/components/ui/button";

export default async function ComparePage() {
  const session = await auth();
  const projects = await getProjectsForUser(session!.user.id);

  const projectsWithMeta = await Promise.all(
    projects.map(async (project) => {
      const [analysis, simulationRecord, roadmapRecord, teamPlanRecord] =
        await Promise.all([
          getLatestAnalysisForProject(project.id),
          getLatestFailureSimulationForProject(project.id),
          getLatestRoadmapForProject(project.id),
          getLatestTeamPlanForProject(project.id),
        ]);

      return {
        id: project.id,
        title: project.title,
        hasAnalysis: !!analysis,
        hasSimulation: !!simulationRecord,
        hasRoadmap: !!roadmapRecord,
        hasTeamPlan: !!teamPlanRecord,
        successScore: analysis?.successScore ?? null,
      };
    })
  );

  return (
    <PageContainer>
      <PageHeader
        title="Project Comparison"
        description="Find the strongest idea before you invest months building it."
        action={
          projects.length > 0 ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/projects">Manage Projects</Link>
            </Button>
          ) : undefined
        }
      />

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <p className="mb-4 text-sm text-muted">
            Create at least two projects and run analysis to compare them.
          </p>
          <Button asChild>
            <Link href="/projects/new">Create Project</Link>
          </Button>
        </div>
      ) : (
        <CompareView projects={projectsWithMeta} />
      )}
    </PageContainer>
  );
}
