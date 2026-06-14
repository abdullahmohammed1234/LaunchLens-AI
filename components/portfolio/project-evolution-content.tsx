"use client";

import Link from "next/link";
import { Camera, ArrowLeft } from "lucide-react";
import type { ProjectEvolution, StoredSnapshot } from "@/types/portfolio";
import { createSnapshotAction } from "@/lib/actions/portfolio";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { EvolutionTimeline } from "@/components/portfolio/evolution-timeline";
import { ImprovementInsightsPanel } from "@/components/portfolio/improvement-insights-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { levelToBadgeVariant, successScoreColor } from "@/lib/utils/analysis";

interface ProjectEvolutionContentProps {
  evolution: ProjectEvolution;
  snapshots: StoredSnapshot[];
}

export function ProjectEvolutionContent({
  evolution,
  snapshots,
}: ProjectEvolutionContentProps) {
  return (
    <PageContainer>
      <PageHeader
        title={`${evolution.projectTitle} — Evolution`}
        description="Track how your project has changed over time"
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/portfolio">
                <ArrowLeft className="h-4 w-4" />
                Portfolio
              </Link>
            </Button>
            <Button
              onClick={() =>
                createSnapshotAction(evolution.projectId)
              }
            >
              <Camera className="h-4 w-4" />
              Save Snapshot
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm text-muted">Current Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {evolution.currentAnalysis ? (
              <div className="flex items-center gap-4">
                <span
                  className={`text-3xl font-bold ${successScoreColor(evolution.currentAnalysis.successScore)}`}
                >
                  {evolution.currentAnalysis.successScore}
                </span>
                <div className="flex gap-2">
                  <Badge variant={levelToBadgeVariant(evolution.currentAnalysis.riskLevel)}>
                    {evolution.currentAnalysis.riskLevel} risk
                  </Badge>
                  <Badge variant="secondary">
                    {evolution.currentAnalysis.complexity} complexity
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">No analysis yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm text-muted">Previous Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {evolution.previousAnalysis ? (
              <div className="flex items-center gap-4">
                <span
                  className={`text-3xl font-bold ${successScoreColor(evolution.previousAnalysis.successScore)}`}
                >
                  {evolution.previousAnalysis.successScore}
                </span>
                <Badge variant={levelToBadgeVariant(evolution.previousAnalysis.riskLevel)}>
                  {evolution.previousAnalysis.riskLevel} risk
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted">No previous analysis to compare</p>
            )}
          </CardContent>
        </Card>
      </div>

      {(evolution.scoreImprovements.length > 0 ||
        evolution.scoreDeclines.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {evolution.scoreImprovements.length > 0 && (
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="text-sm text-emerald-400">
                  Score Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {evolution.scoreImprovements.map((s, i) => (
                    <li key={i} className="text-sm text-foreground/90">
                      + {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {evolution.scoreDeclines.length > 0 && (
            <Card className="border-danger/20 bg-danger/5">
              <CardHeader>
                <CardTitle className="text-sm text-danger">
                  Score Declines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {evolution.scoreDeclines.map((s, i) => (
                    <li key={i} className="text-sm text-foreground/90">
                      − {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <ImprovementInsightsPanel projectId={evolution.projectId} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Evolution Timeline
          </h3>
          <EvolutionTimeline events={evolution.events} />
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Snapshots
          </h3>
          {snapshots.length === 0 ? (
            <Card className="border-border bg-card">
              <CardContent className="py-8 text-center text-sm text-muted">
                No snapshots saved yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {snapshots.map((snapshot) => (
                <Card key={snapshot.id} className="border-border bg-card">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-foreground">
                      {snapshot.label}
                    </p>
                    <p className="text-xs text-muted">
                      {new Date(snapshot.createdAt).toLocaleDateString()}
                    </p>
                    {snapshot.snapshotData.riskProfile && (
                      <div className="mt-2 flex gap-2 text-xs">
                        {snapshot.snapshotData.riskProfile.successScore !==
                          null && (
                          <span>
                            Score:{" "}
                            {snapshot.snapshotData.riskProfile.successScore}
                          </span>
                        )}
                        {snapshot.snapshotData.riskProfile.readinessScore !==
                          null && (
                          <span>
                            Ready:{" "}
                            {snapshot.snapshotData.riskProfile.readinessScore}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
