import { NextResponse } from "next/server";
import { compareProjects } from "@/lib/ai/compareProjects";
import { GeminiQuotaError, GeminiUnavailableError } from "@/lib/ai/errors";
import { analysisToResponse } from "@/lib/ai/serialize";
import {
  comparisonToDbFields,
  comparisonToResponse,
} from "@/lib/ai/serialize-project-comparison";
import {
  getLatestAnalysisForProject,
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
import { compareProjectsRequestSchema } from "@/types/project-comparison";
import { roadmapDataSchema } from "@/types/roadmap";
import { teamPlanDataSchema } from "@/types/team-plan";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { projectIds, whatIf } = compareProjectsRequestSchema.parse(body);

    const uniqueIds = [...new Set(projectIds)];
    if (uniqueIds.length !== projectIds.length) {
      return NextResponse.json(
        { error: "Duplicate project IDs are not allowed" },
        { status: 400 }
      );
    }

    const projectContexts = await Promise.all(
      uniqueIds.map(async (projectId) => {
        const project = await getProjectForUser(projectId, session.user.id);
        const analysisRecord = await getLatestAnalysisForProject(project.id);

        if (!analysisRecord) {
          return {
            projectId,
            title: project.title,
            missingAnalysis: true as const,
          };
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
          ? {
              estimatedDurationMonths: roadmapRecord.estimatedDurationMonths,
              ...roadmapDataSchema.parse(roadmapRecord.roadmapData),
            }
          : null;

        const teamPlanRecord = await getLatestTeamPlanForProject(project.id);
        const teamPlan = teamPlanRecord
          ? {
              recommendedTeamSize: teamPlanRecord.recommendedTeamSize,
              ...teamPlanDataSchema.parse(teamPlanRecord.teamData),
            }
          : null;

        return {
          projectId: project.id,
          missingAnalysis: false as const,
          project: {
            title: project.title,
            description: project.description,
            budget: project.budget,
            timeline: project.timeline,
            teamSize: project.teamSize,
            experienceLevel: project.experienceLevel,
          },
          analysis,
          simulation,
          roadmap,
          teamPlan,
        };
      })
    );

    const missingAnalysis = projectContexts.filter((p) => p.missingAnalysis);
    if (missingAnalysis.length > 0) {
      return NextResponse.json(
        {
          error: `Analysis required for all projects. Missing: ${missingAnalysis.map((p) => p.title ?? p.projectId).join(", ")}`,
        },
        { status: 400 }
      );
    }

    const validContexts = projectContexts.filter((p) => !p.missingAnalysis);

    const { comparison, usedFallback, attempts, model } = await compareProjects({
      projects: validContexts.map((ctx) => ({
        projectId: ctx.projectId,
        project: ctx.project,
        analysis: ctx.analysis,
        simulation: ctx.simulation,
        roadmap: ctx.roadmap,
        teamPlan: ctx.teamPlan,
      })),
      whatIf,
    });

    const record = await prisma.projectComparison.create({
      data: comparisonToDbFields(
        session.user.id,
        uniqueIds,
        comparison
      ),
    });

    return NextResponse.json({
      ...comparisonToResponse(record),
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

    console.error("[POST /api/compare-projects]", error);
    return NextResponse.json(
      { error: "Failed to compare projects" },
      { status: 500 }
    );
  }
}
