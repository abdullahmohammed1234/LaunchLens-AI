import { NextResponse } from "next/server";
import { generateRoadmap } from "@/lib/ai/generateRoadmap";
import { GeminiQuotaError, GeminiUnavailableError } from "@/lib/ai/errors";
import { analysisToResponse } from "@/lib/ai/serialize";
import {
  roadmapToDbFields,
  roadmapToResponse,
} from "@/lib/ai/serialize-roadmap";
import {
  getLatestAnalysisForProject,
  getLatestFailureSimulationForProject,
  getProjectForUser,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { failureSimulationSchema } from "@/types/failure-simulation";
import { generateRoadmapByProjectIdSchema } from "@/types/roadmap";
import { logActivity } from "@/lib/portfolio/activity";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { projectId } = generateRoadmapByProjectIdSchema.parse(body);

    const project = await getProjectForUser(projectId, session.user.id);
    const analysisRecord = await getLatestAnalysisForProject(project.id);

    if (!analysisRecord) {
      return NextResponse.json(
        {
          error:
            "Project analysis required. Run analysis before generating a roadmap.",
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

    const input = {
      title: project.title,
      description: project.description,
      budget: project.budget,
      timeline: project.timeline,
      teamSize: project.teamSize,
      experienceLevel: project.experienceLevel,
    };

    const { roadmap, usedFallback, attempts, model } = await generateRoadmap({
      project: input,
      analysis,
      simulation,
    });

    const record = await prisma.roadmap.create({
      data: {
        projectId: project.id,
        ...roadmapToDbFields(roadmap),
      },
    });

    await logActivity({
      userId: session.user.id,
      projectId: project.id,
      type: "roadmap_updated",
      title: `Roadmap updated for ${project.title}`,
      description: `Estimated duration: ${roadmap.estimatedDurationMonths} months`,
    });

    return NextResponse.json({
      ...roadmapToResponse(record),
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

    console.error("[POST /api/roadmap]", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}
