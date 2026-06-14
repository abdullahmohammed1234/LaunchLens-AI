import { NextResponse } from "next/server";
import {
  comparePortfolioGroups,
  getPortfolioProjects,
} from "@/lib/portfolio/analyzePortfolio";
import { requireAuth, UnauthorizedError } from "@/lib/auth-utils";
import { portfolioGroupCompareSchema } from "@/types/portfolio";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { groups } = portfolioGroupCompareSchema.parse(body);

    const projects = await getPortfolioProjects(session.user.id);
    const comparison = comparePortfolioGroups(projects, groups);

    return NextResponse.json({ comparison });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    console.error("[POST /api/portfolio/compare-groups]", error);
    return NextResponse.json(
      { error: "Failed to compare portfolio groups" },
      { status: 500 }
    );
  }
}
