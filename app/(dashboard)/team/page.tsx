import Link from "next/link";
import { auth } from "@/auth";
import { teamPlanToResponse } from "@/lib/ai/serialize-team-plan";
import {
  getLatestAnalysisForProject,
  getLatestFailureSimulationForProject,
  getLatestRoadmapForProject,
  getLatestTeamPlanForProject,
  getProjectsForUser,
} from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { TeamProjectPicker } from "@/components/team/team-project-picker";
import { Button } from "@/components/ui/button";

export default async function TeamPage() {
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
        teamPlan: teamPlanRecord ? teamPlanToResponse(teamPlanRecord) : null,
      };
    })
  );

  const defaultProjectId =
    projectsWithMeta.find((p) => p.hasAnalysis)?.id ??
    projectsWithMeta[0]?.id ??
    "";

  return (
    <PageContainer>
      <PageHeader
        title="Team Builder"
        description="Build the right team before building the product."
        action={
          defaultProjectId ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/projects/${defaultProjectId}/team`}>
                Open Project Team Plan
              </Link>
            </Button>
          ) : undefined
        }
      />

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <p className="mb-4 text-sm text-muted">
            Create a project and run analysis to generate a team plan.
          </p>
          <Button asChild>
            <Link href="/projects/new">Create Project</Link>
          </Button>
        </div>
      ) : (
        <TeamProjectPicker
          projects={projectsWithMeta}
          defaultProjectId={defaultProjectId}
        />
      )}
    </PageContainer>
  );
}
