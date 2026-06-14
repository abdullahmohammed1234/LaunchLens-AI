import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { executiveReportToResponse } from "@/lib/ai/serialize-executive-report";
import {
  getLatestAnalysisForProject,
  getLatestFailureSimulationForProject,
  getLatestRoadmapForProject,
  getLatestTeamPlanForProject,
  getExecutiveReportsForProject,
  getProjectForUser,
  NotFoundError,
} from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ReportView } from "@/components/reports/report-view";
import { Button } from "@/components/ui/button";

interface ProjectReportsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectReportsPage({
  params,
}: ProjectReportsPageProps) {
  const { id } = await params;
  const session = await auth();

  let project;
  let hasAnalysis = false;
  let hasSimulation = false;
  let hasRoadmap = false;
  let hasTeamPlan = false;
  let initialReport = null;
  let reportHistory: ReturnType<typeof executiveReportToResponse>[] = [];

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
    hasTeamPlan = !!teamPlanRecord;

    const reportRecords = await getExecutiveReportsForProject(project.id);
    reportHistory = reportRecords.map(executiveReportToResponse);
    initialReport = reportHistory[0] ?? null;
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Executive Reports"
        description="Professional project intelligence for decision makers."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.id}`}>View Project</Link>
          </Button>
        }
      />

      <ReportView
        projectId={project.id}
        projectTitle={project.title}
        hasAnalysis={hasAnalysis}
        hasSimulation={hasSimulation}
        hasRoadmap={hasRoadmap}
        hasTeamPlan={hasTeamPlan}
        initialReport={initialReport}
        reportHistory={reportHistory}
      />
    </PageContainer>
  );
}
