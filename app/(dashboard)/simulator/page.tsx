import Link from "next/link";
import { auth } from "@/auth";
import { simulationToResponse } from "@/lib/ai/serialize-failure";
import {
  getLatestAnalysisForProject,
  getLatestFailureSimulationForProject,
  getProjectsForUser,
} from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { SimulatorProjectPicker } from "@/components/simulator/simulator-project-picker";
import { Button } from "@/components/ui/button";

export default async function SimulatorPage() {
  const session = await auth();
  const projects = await getProjectsForUser(session!.user.id);

  const projectsWithMeta = await Promise.all(
    projects.map(async (project) => {
      const [analysis, simulationRecord] = await Promise.all([
        getLatestAnalysisForProject(project.id),
        getLatestFailureSimulationForProject(project.id),
      ]);
      return {
        id: project.id,
        title: project.title,
        hasAnalysis: !!analysis,
        simulation: simulationRecord
          ? simulationToResponse(simulationRecord)
          : null,
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
        title="Failure Simulation"
        description="Explore potential project failure paths before they happen."
        action={
          defaultProjectId ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/projects/${defaultProjectId}/simulator`}>
                Open Project Simulator
              </Link>
            </Button>
          ) : undefined
        }
      />

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <p className="mb-4 text-sm text-muted">
            Create a project and run analysis to use the failure simulator.
          </p>
          <Button asChild>
            <Link href="/projects/new">Create Project</Link>
          </Button>
        </div>
      ) : (
        <SimulatorProjectPicker
          projects={projectsWithMeta}
          defaultProjectId={defaultProjectId}
        />
      )}
    </PageContainer>
  );
}
