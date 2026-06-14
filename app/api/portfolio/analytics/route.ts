import { NextResponse } from "next/server";
import { requireAuth, UnauthorizedError } from "@/lib/auth-utils";
import { analyzePortfolio } from "@/lib/portfolio/analyzePortfolio";

export async function GET() {
  try {
    const session = await requireAuth();
    const analytics = await analyzePortfolio(session.user.id);
    return NextResponse.json(analytics);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[GET /api/portfolio/analytics]", error);
    return NextResponse.json(
      { error: "Failed to analyze portfolio" },
      { status: 500 }
    );
  }
}
