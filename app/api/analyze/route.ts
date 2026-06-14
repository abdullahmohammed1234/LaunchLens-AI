import { NextResponse } from "next/server";
import { analyzeProject } from "@/lib/ai/analyzeProject";
import { GeminiQuotaError, GeminiUnavailableError } from "@/lib/ai/errors";
import {
  analysisResultToDbFields,
  analysisToResponse,
} from "@/lib/ai/serialize";
import {
  getProjectForUser,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import {
  analyzeByProjectIdSchema,
  analyzeProjectInputSchema,
} from "@/lib/validations/analysis";
import { logActivity } from "@/lib/portfolio/activity";
import { checkAndNotifyScoreChanges } from "@/lib/portfolio/notifications";
import { syncGoalProgressFromProject } from "@/lib/portfolio/goals";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    let input;
    let projectId: string | null = null;

    if (body.projectId) {
      const { projectId: id } = analyzeByProjectIdSchema.parse(body);
      const project = await getProjectForUser(id, session.user.id);
      projectId = project.id;
      input = {
        title: project.title,
        description: project.description,
        budget: project.budget,
        timeline: project.timeline,
        teamSize: project.teamSize,
        experienceLevel: project.experienceLevel,
      };
    } else {
      input = analyzeProjectInputSchema.parse(body);
    }

    const { analysis, usedFallback, attempts } = await analyzeProject(input);

    if (projectId) {
      const previousAnalysis = await prisma.analysis.findFirst({
        where: { projectId },
        orderBy: { createdAt: "desc" },
      });

      const record = await prisma.analysis.create({
        data: {
          projectId,
          ...analysisResultToDbFields(analysis),
        },
      });

      const project = await getProjectForUser(projectId, session.user.id);

      await logActivity({
        userId: session.user.id,
        projectId,
        type: "project_analyzed",
        title: `Analysis completed for ${project.title}`,
        description: `Success score: ${analysis.successScore}, Risk: ${analysis.riskLevel}`,
        metadata: { successScore: analysis.successScore, riskLevel: analysis.riskLevel },
      });

      await checkAndNotifyScoreChanges({
        userId: session.user.id,
        projectId,
        projectTitle: project.title,
        previousSuccessScore: previousAnalysis?.successScore,
        currentSuccessScore: analysis.successScore,
        previousRiskLevel: previousAnalysis?.riskLevel,
        currentRiskLevel: analysis.riskLevel,
      });

      await syncGoalProgressFromProject(
        session.user.id,
        projectId,
        null,
        analysis.successScore,
        analysis.riskLevel
      );

      return NextResponse.json({
        ...analysisToResponse(record),
        usedFallback,
        attempts,
      });
    }

    return NextResponse.json({
      ...analysis,
      usedFallback,
      attempts,
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
    if (error instanceof Error && error.message === "GEMINI_API_KEY is not configured") {
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 503 }
      );
    }

    console.error("[POST /api/analyze]", error);
    return NextResponse.json(
      { error: "Failed to analyze project" },
      { status: 500 }
    );
  }
}
