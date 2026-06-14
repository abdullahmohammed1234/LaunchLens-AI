import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { roadmapToResponse } from "@/lib/ai/serialize-roadmap";
import {
  getLatestAnalysisForProject,
  getLatestFailureSimulationForProject,
  getLatestRoadmapForProject,
  getProjectForUser,
  NotFoundError,
} from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { RoadmapView } from "@/components/roadmap/roadmap-view";
import { Button } from "@/components/ui/button";

interface ProjectRoadmapPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectRoadmapPage({
  params,
}: ProjectRoadmapPageProps) {
  const { id } = await params;
  const session = await auth();

  let project;
  let hasAnalysis = false;
  let hasSimulation = false;
  let initialRoadmap = null;

  try {
    project = await getProjectForUser(id, session!.user.id);
    const analysisRecord = await getLatestAnalysisForProject(project.id);
    hasAnalysis = !!analysisRecord;

    const simulationRecord = await getLatestFailureSimulationForProject(
      project.id
    );
    hasSimulation = !!simulationRecord;

    const roadmapRecord = await getLatestRoadmapForProject(project.id);
    initialRoadmap = roadmapRecord ? roadmapToResponse(roadmapRecord) : null;
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Execution Roadmap"
        description="Your AI-generated path from idea to launch."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.id}`}>View Project</Link>
          </Button>
        }
      />

      <RoadmapView
        projectId={project.id}
        projectTitle={project.title}
        projectTimeline={project.timeline}
        hasAnalysis={hasAnalysis}
        hasSimulation={hasSimulation}
        initialRoadmap={initialRoadmap}
      />
    </PageContainer>
  );
}
