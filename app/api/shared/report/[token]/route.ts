import { NextResponse } from "next/server";
import { executiveReportToResponse } from "@/lib/ai/serialize-executive-report";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ token: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { token } = await params;

    const share = await prisma.reportShare.findUnique({
      where: { token },
      include: {
        report: {
          include: { project: true },
        },
      },
    });

    if (!share) {
      return NextResponse.json({ error: "Share link not found" }, { status: 404 });
    }

    if (share.expiresAt && share.expiresAt < new Date()) {
      return NextResponse.json({ error: "Share link has expired" }, { status: 403 });
    }

    return NextResponse.json({
      ...executiveReportToResponse(share.report),
      projectTitle: share.report.project.title,
      sharedAt: share.createdAt.toISOString(),
      expiresAt: share.expiresAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("[GET /api/shared/report/[token]]", error);
    return NextResponse.json(
      { error: "Failed to fetch shared report" },
      { status: 500 }
    );
  }
}
