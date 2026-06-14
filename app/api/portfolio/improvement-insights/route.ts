import { NextResponse } from "next/server";
import { generateImprovementInsights } from "@/lib/ai/generateImprovementInsights";
import { GeminiQuotaError, GeminiUnavailableError } from "@/lib/ai/errors";
import {
  getProjectForUser,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@/lib/auth-utils";
import { getProjectEvolution } from "@/lib/portfolio/evolution";
import { z } from "zod";

const bodySchema = z.object({
  projectId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { projectId } = bodySchema.parse(body);

    await getProjectForUser(projectId, session.user.id);
    const evolution = await getProjectEvolution(session.user.id, projectId);
    const { insights, usedFallback, attempts } =
      await generateImprovementInsights(evolution);

    return NextResponse.json({ insights, usedFallback, attempts });
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
    console.error("[POST /api/portfolio/improvement-insights]", error);
    return NextResponse.json(
      { error: "Failed to generate improvement insights" },
      { status: 500 }
    );
  }
}
