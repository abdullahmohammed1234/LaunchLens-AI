import { NextResponse } from "next/server";
import { generateTeamPlan } from "@/lib/ai/generateTeamPlan";
import { GeminiQuotaError, GeminiUnavailableError } from "@/lib/ai/errors";
import { analysisToResponse } from "@/lib/ai/serialize";
import {
  teamPlanToDbFields,
  teamPlanToResponse,
} from "@/lib/ai/serialize-team-plan";
import {
  getLatestAnalysisForProject,
  getLatestFailureSimulationForProject,
  getLatestRoadmapForProject,
  getProjectForUser,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { failureSimulationSchema } from "@/types/failure-simulation";
import { roadmapDataSchema } from "@/types/roadmap";
import { generateTeamPlanByProjectIdSchema } from "@/types/team-plan";
import { logActivity } from "@/lib/portfolio/activity";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { projectId } = generateTeamPlanByProjectIdSchema.parse(body);

    const project = await getProjectForUser(projectId, session.user.id);
    const analysisRecord = await getLatestAnalysisForProject(project.id);

    if (!analysisRecord) {
      return NextResponse.json(
        {
          error:
            "Project analysis required. Run analysis before generating a team plan.",
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
      ? {
          estimatedDurationMonths: roadmapRecord.estimatedDurationMonths,
          ...roadmapDataSchema.parse(roadmapRecord.roadmapData),
        }
      : null;

    const input = {
      title: project.title,
      description: project.description,
      budget: project.budget,
      timeline: project.timeline,
      teamSize: project.teamSize,
      experienceLevel: project.experienceLevel,
    };

    const { teamPlan, usedFallback, attempts, model } = await generateTeamPlan(
      {
        project: input,
        analysis,
        simulation,
        roadmap,
      }
    );

    const record = await prisma.teamPlan.create({
      data: {
        projectId: project.id,
        ...teamPlanToDbFields(teamPlan),
      },
    });

    await logActivity({
      userId: session.user.id,
      projectId: project.id,
      type: "team_plan_created",
      title: `Team plan created for ${project.title}`,
      description: `Recommended team size: ${teamPlan.recommendedTeamSize}`,
    });

    return NextResponse.json({
      ...teamPlanToResponse(record),
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

    console.error("[POST /api/team-plan]", error);
    return NextResponse.json(
      { error: "Failed to generate team plan" },
      { status: 500 }
    );
  }
}
