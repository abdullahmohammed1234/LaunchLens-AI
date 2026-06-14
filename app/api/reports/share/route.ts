import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import {
  getExecutiveReportForUser,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { createReportShareSchema } from "@/types/executive-report";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { reportId, expiresInDays } = createReportShareSchema.parse(body);

    await getExecutiveReportForUser(reportId, session.user.id);

    const token = randomBytes(32).toString("hex");
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const share = await prisma.reportShare.create({
      data: {
        reportId,
        token,
        expiresAt,
      },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
      "http://localhost:3000";

    return NextResponse.json({
      id: share.id,
      reportId: share.reportId,
      token: share.token,
      expiresAt: share.expiresAt?.toISOString() ?? null,
      createdAt: share.createdAt.toISOString(),
      shareUrl: `${baseUrl}/shared/report/${share.token}`,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    console.error("[POST /api/reports/share]", error);
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    );
  }
}
