import { NextResponse } from "next/server";
import { generateExecutiveReport } from "@/lib/ai/generateExecutiveReport";
import { GeminiQuotaError, GeminiUnavailableError } from "@/lib/ai/errors";
import { analysisToResponse } from "@/lib/ai/serialize";
import {
  executiveReportToDbFields,
  executiveReportToResponse,
} from "@/lib/ai/serialize-executive-report";
import {
  getLatestAnalysisForProject,
  getLatestComparisonForProject,
  getLatestFailureSimulationForProject,
  getLatestRoadmapForProject,
  getLatestTeamPlanForProject,
  getProjectForUser,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { failureSimulationSchema } from "@/types/failure-simulation";
import { roadmapSchema } from "@/types/roadmap";
import { teamPlanSchema } from "@/types/team-plan";
import { projectComparisonSchema } from "@/types/project-comparison";
import { generateReportByProjectIdSchema } from "@/types/executive-report";
import { logActivity } from "@/lib/portfolio/activity";
import { checkAndNotifyScoreChanges } from "@/lib/portfolio/notifications";
import { syncGoalProgressFromProject } from "@/lib/portfolio/goals";
import { calculateReadinessScore } from "@/lib/portfolio/utils";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { projectId } = generateReportByProjectIdSchema.parse(body);

    const project = await getProjectForUser(projectId, session.user.id);
    const analysisRecord = await getLatestAnalysisForProject(project.id);

    if (!analysisRecord) {
      return NextResponse.json(
        {
          error:
            "Project analysis required. Run analysis before generating an executive report.",
        },
        { status: 400 }
      );
    }

    const analysis = analysisToResponse(analysisRecord);

    const simulationRecord = await getLatestFailureSimulationForProject(
      project.id
    );
    const simulation = simulationRecord
      ? failureSimulationSchema.parse(simulationRecord.simulationData)
      : null;

    const roadmapRecord = await getLatestRoadmapForProject(project.id);
    const roadmap = roadmapRecord
      ? roadmapSchema.parse({
          estimatedDurationMonths: roadmapRecord.estimatedDurationMonths,
          ...roadmapRecord.roadmapData as object,
        })
      : null;

    const teamPlanRecord = await getLatestTeamPlanForProject(project.id);
    const teamPlan = teamPlanRecord
      ? teamPlanSchema.parse({
          recommendedTeamSize: teamPlanRecord.recommendedTeamSize,
          ...teamPlanRecord.teamData as object,
        })
      : null;

    const comparisonRecord = await getLatestComparisonForProject(
      session.user.id,
      project.id
    );
    const comparison = comparisonRecord
      ? projectComparisonSchema.parse(comparisonRecord.comparisonData)
      : null;

    const input = {
      title: project.title,
      description: project.description,
      budget: project.budget,
      timeline: project.timeline,
      teamSize: project.teamSize,
      experienceLevel: project.experienceLevel,
    };

    const { report, usedFallback, attempts, model } =
      await generateExecutiveReport({
        project: input,
        analysis,
        simulation,
        roadmap,
        teamPlan,
        comparison,
      });

    const record = await prisma.executiveReport.create({
      data: {
        projectId: project.id,
        ...executiveReportToDbFields(report),
      },
    });

    const previousReport = await prisma.executiveReport.findFirst({
      where: { projectId: project.id, id: { not: record.id } },
      orderBy: { createdAt: "desc" },
    });

    const currentReadiness = calculateReadinessScore(report);
    const previousReadiness = previousReport
      ? calculateReadinessScore({
          investmentReadinessScore: previousReport.investmentReadinessScore,
          ...(previousReport.reportData as object),
        })
      : null;

    await logActivity({
      userId: session.user.id,
      projectId: project.id,
      type: "report_generated",
      title: `Executive report for ${project.title}`,
      description: `Investment readiness: ${report.investmentReadinessScore}`,
    });

    await checkAndNotifyScoreChanges({
      userId: session.user.id,
      projectId: project.id,
      projectTitle: project.title,
      previousReadiness,
      currentReadiness,
      currentSuccessScore: analysis.successScore,
      currentRiskLevel: analysis.riskLevel,
    });

    await syncGoalProgressFromProject(
      session.user.id,
      project.id,
      currentReadiness,
      analysis.successScore,
      analysis.riskLevel
    );

    return NextResponse.json({
      ...executiveReportToResponse(record),
      projectTitle: project.title,
      usedFallback,
      attempts,
      model,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    if (error instanceof GeminiQuotaError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    if (error instanceof GeminiUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (
      error instanceof Error &&
      error.message === "GEMINI_API_KEY is not configured"
    ) {
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 503 }
      );
    }

    console.error("[POST /api/reports]", error);
    return NextResponse.json(
      { error: "Failed to generate executive report" },
      { status: 500 }
    );
  }
}
