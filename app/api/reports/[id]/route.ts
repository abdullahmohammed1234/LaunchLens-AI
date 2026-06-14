import { NextResponse } from "next/server";
import { executiveReportToResponse } from "@/lib/ai/serialize-executive-report";
import {
  getExecutiveReportForUser,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@/lib/auth-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const record = await getExecutiveReportForUser(id, session.user.id);

    return NextResponse.json({
      ...executiveReportToResponse(record),
      projectTitle: record.project.title,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    console.error("[GET /api/reports/[id]]", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}
