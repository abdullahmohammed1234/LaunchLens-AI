import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  getLatestAnalysisForProject,
  getProjectForUser,
  NotFoundError,
} from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { MentorView } from "@/components/mentor/mentor-view";
import { Button } from "@/components/ui/button";

interface ProjectMentorPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectMentorPage({
  params,
}: ProjectMentorPageProps) {
  const { id } = await params;
  const session = await auth();

  let project;
  let hasAnalysis = false;

  try {
    project = await getProjectForUser(id, session!.user.id);
    const analysis = await getLatestAnalysisForProject(project.id);
    hasAnalysis = !!analysis;
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <PageContainer>
      <PageHeader
        title="AI Mentor"
        description="Ask questions about your project and receive strategic guidance."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.id}`}>View Project</Link>
          </Button>
        }
      />

      <MentorView
        projectId={project.id}
        projectTitle={project.title}
        hasAnalysis={hasAnalysis}
        initialMode="project"
      />
    </PageContainer>
  );
}
