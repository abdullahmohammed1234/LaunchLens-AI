import Link from "next/link";
import { auth } from "@/auth";
import { executiveReportToResponse } from "@/lib/ai/serialize-executive-report";
import {
  getLatestAnalysisForProject,
  getLatestFailureSimulationForProject,
  getLatestRoadmapForProject,
  getLatestTeamPlanForProject,
  getProjectsForUser,
  getExecutiveReportsForProject,
} from "@/lib/auth-utils";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { ReportProjectPicker } from "@/components/reports/report-project-picker";
import { Button } from "@/components/ui/button";

export default async function ReportsPage() {
  const session = await auth();
  const projects = await getProjectsForUser(session!.user.id);

  const projectsWithMeta = await Promise.all(
    projects.map(async (project) => {
      const [
        analysis,
        simulationRecord,
        roadmapRecord,
        teamPlanRecord,
        reportRecords,
      ] = await Promise.all([
        getLatestAnalysisForProject(project.id),
        getLatestFailureSimulationForProject(project.id),
        getLatestRoadmapForProject(project.id),
        getLatestTeamPlanForProject(project.id),
        getExecutiveReportsForProject(project.id),
      ]);

      const reportHistory = reportRecords.map(executiveReportToResponse);
      const latestReport = reportHistory[0] ?? null;

      return {
        id: project.id,
        title: project.title,
        hasAnalysis: !!analysis,
        hasSimulation: !!simulationRecord,
        hasRoadmap: !!roadmapRecord,
        hasTeamPlan: !!teamPlanRecord,
        latestReport,
        reportHistory,
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
        title="Executive Reports"
        description="Professional project intelligence for decision makers."
        action={
          defaultProjectId ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/projects/${defaultProjectId}/reports`}>
                Open Project Reports
              </Link>
            </Button>
          ) : undefined
        }
      />

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <p className="mb-4 text-sm text-muted">
            Create a project and run analysis to generate executive reports.
          </p>
          <Button asChild>
            <Link href="/projects/new">Create Project</Link>
          </Button>
        </div>
      ) : (
        <ReportProjectPicker
          projects={projectsWithMeta}
          defaultProjectId={defaultProjectId}
        />
      )}
    </PageContainer>
  );
}
