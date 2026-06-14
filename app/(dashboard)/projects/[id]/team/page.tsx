import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { teamPlanToResponse } from "@/lib/ai/serialize-team-plan";
import {
  getLatestAnalysisForProject,
  getLatestFailureSimulationForProject,
  getLatestRoadmapForProject,
  getLatestTeamPlanForProject,
  getProjectForUser,
  NotFoundError,
} from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { TeamView } from "@/components/team/team-view";
import { Button } from "@/components/ui/button";

interface ProjectTeamPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectTeamPage({ params }: ProjectTeamPageProps) {
  const { id } = await params;
  const session = await auth();

  let project;
  let hasAnalysis = false;
  let hasSimulation = false;
  let hasRoadmap = false;
  let initialTeamPlan = null;

  try {
    project = await getProjectForUser(id, session!.user.id);
    const analysisRecord = await getLatestAnalysisForProject(project.id);
    hasAnalysis = !!analysisRecord;

    const simulationRecord = await getLatestFailureSimulationForProject(
      project.id
    );
    hasSimulation = !!simulationRecord;

    const roadmapRecord = await getLatestRoadmapForProject(project.id);
    hasRoadmap = !!roadmapRecord;

    const teamPlanRecord = await getLatestTeamPlanForProject(project.id);
    initialTeamPlan = teamPlanRecord ? teamPlanToResponse(teamPlanRecord) : null;
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Team Builder"
        description="Build the right team before building the product."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.id}`}>View Project</Link>
          </Button>
        }
      />

      <TeamView
        projectId={project.id}
        projectTitle={project.title}
        hasAnalysis={hasAnalysis}
        hasSimulation={hasSimulation}
        hasRoadmap={hasRoadmap}
        initialTeamPlan={initialTeamPlan}
      />
    </PageContainer>
  );
}
