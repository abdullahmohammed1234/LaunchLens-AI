import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { analysisToResponse } from "@/lib/ai/serialize";
import {
  getLatestAnalysisForProject,
  getProjectForUser,
  NotFoundError,
} from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectAnalysisView } from "@/components/projects/project-analysis-view";
import { Button } from "@/components/ui/button";

interface ProjectAnalysisPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectAnalysisPage({
  params,
}: ProjectAnalysisPageProps) {
  const { id } = await params;
  const session = await auth();

  let project;
  let latestAnalysis = null;

  try {
    project = await getProjectForUser(id, session!.user.id);
    const analysisRecord = await getLatestAnalysisForProject(project.id);
    latestAnalysis = analysisRecord
      ? analysisToResponse(analysisRecord)
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
        title="Project Analysis"
        description={`Feasibility dashboard for ${project.title}`}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.id}`}>
              View Project
            </Link>
          </Button>
        }
      />

      <ProjectAnalysisView
        projectId={project.id}
        projectTitle={project.title}
        initialAnalysis={latestAnalysis}
      />
    </PageContainer>
  );
}
