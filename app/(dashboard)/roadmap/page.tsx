import Link from "next/link";
import { auth } from "@/auth";
import { roadmapToResponse } from "@/lib/ai/serialize-roadmap";
import {
  getLatestAnalysisForProject,
  getLatestFailureSimulationForProject,
  getLatestRoadmapForProject,
  getProjectsForUser,
} from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { RoadmapProjectPicker } from "@/components/roadmap/roadmap-project-picker";
import { Button } from "@/components/ui/button";

export default async function RoadmapPage() {
  const session = await auth();
  const projects = await getProjectsForUser(session!.user.id);

  const projectsWithMeta = await Promise.all(
    projects.map(async (project) => {
      const [analysis, simulationRecord, roadmapRecord] = await Promise.all([
        getLatestAnalysisForProject(project.id),
        getLatestFailureSimulationForProject(project.id),
        getLatestRoadmapForProject(project.id),
      ]);
      return {
        id: project.id,
        title: project.title,
        timeline: project.timeline,
        hasAnalysis: !!analysis,
        hasSimulation: !!simulationRecord,
        roadmap: roadmapRecord ? roadmapToResponse(roadmapRecord) : null,
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
        title="Execution Roadmap"
        description="Your AI-generated path from idea to launch."
        action={
          defaultProjectId ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/projects/${defaultProjectId}/roadmap`}>
                Open Project Roadmap
              </Link>
            </Button>
          ) : undefined
        }
      />

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <p className="mb-4 text-sm text-muted">
            Create a project and run analysis to generate an execution roadmap.
          </p>
          <Button asChild>
            <Link href="/projects/new">Create Project</Link>
          </Button>
        </div>
      ) : (
        <RoadmapProjectPicker
          projects={projectsWithMeta}
          defaultProjectId={defaultProjectId}
        />
      )}
    </PageContainer>
  );
}
