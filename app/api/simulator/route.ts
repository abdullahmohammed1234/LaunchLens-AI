import { NextResponse } from "next/server";
import { simulateFailure } from "@/lib/ai/simulateFailure";
import { GeminiQuotaError, GeminiUnavailableError } from "@/lib/ai/errors";
import { analysisToResponse } from "@/lib/ai/serialize";
import {
  simulationDataToDbFields,
  simulationToResponse,
} from "@/lib/ai/serialize-failure";
import {
  getLatestAnalysisForProject,
  getProjectForUser,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { simulateByProjectIdSchema } from "@/types/failure-simulation";
import { logActivity } from "@/lib/portfolio/activity";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { projectId } = simulateByProjectIdSchema.parse(body);

    const project = await getProjectForUser(projectId, session.user.id);
    const analysisRecord = await getLatestAnalysisForProject(project.id);

    if (!analysisRecord) {
      return NextResponse.json(
        {
          error:
            "Project analysis required. Run analysis before simulating failure scenarios.",
        },
        { status: 400 }
      );
    }

    const analysis = analysisToResponse(analysisRecord);
    const input = {
      title: project.title,
      description: project.description,
      budget: project.budget,
      timeline: project.timeline,
      teamSize: project.teamSize,
      experienceLevel: project.experienceLevel,
    };

    const { simulation, usedFallback, attempts, model } =
      await simulateFailure({ project: input, analysis });

    const record = await prisma.failureSimulation.create({
      data: {
        projectId: project.id,
        ...simulationDataToDbFields(simulation),
      },
    });

    await logActivity({
      userId: session.user.id,
      projectId: project.id,
      type: "simulation_generated",
      title: `Failure simulation for ${project.title}`,
      description: "Failure scenarios and root causes generated",
    });

    return NextResponse.json({
      ...simulationToResponse(record),
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

    console.error("[POST /api/simulator]", error);
    return NextResponse.json(
      { error: "Failed to simulate failure scenarios" },
      { status: 500 }
    );
  }
}
