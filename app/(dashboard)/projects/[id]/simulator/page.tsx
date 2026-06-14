import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { simulationToResponse } from "@/lib/ai/serialize-failure";
import {
  getLatestAnalysisForProject,
  getLatestFailureSimulationForProject,
  getProjectForUser,
  NotFoundError,
} from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { FailureSimulatorView } from "@/components/simulator/failure-simulator-view";
import { Button } from "@/components/ui/button";

interface ProjectSimulatorPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectSimulatorPage({
  params,
}: ProjectSimulatorPageProps) {
  const { id } = await params;
  const session = await auth();

  let project;
  let hasAnalysis = false;
  let initialSimulation = null;

  try {
    project = await getProjectForUser(id, session!.user.id);
    const analysisRecord = await getLatestAnalysisForProject(project.id);
    hasAnalysis = !!analysisRecord;

    const simulationRecord = await getLatestFailureSimulationForProject(
      project.id
    );
    initialSimulation = simulationRecord
      ? simulationToResponse(simulationRecord)
      : null;
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Failure Simulation"
        description="Explore potential project failure paths before they happen."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.id}`}>View Project</Link>
          </Button>
        }
      />

      <FailureSimulatorView
        projectId={project.id}
        projectTitle={project.title}
        hasAnalysis={hasAnalysis}
        initialSimulation={initialSimulation}
      />
    </PageContainer>
  );
}
