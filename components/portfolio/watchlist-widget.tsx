"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pin, Star } from "lucide-react";
import type { PortfolioProject } from "@/types/portfolio";
import { toggleProjectPinAction, toggleProjectStarAction } from "@/lib/actions/portfolio";
import { successScoreColor } from "@/lib/utils/analysis";
import { levelToBadgeVariant } from "@/lib/utils/analysis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WatchlistWidgetProps {
  projects: PortfolioProject[];
}

export function WatchlistWidget({ projects }: WatchlistWidgetProps) {
  if (projects.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted">
            Star or pin projects to track them here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Watchlist</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/portfolio">View portfolio</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
          >
            <div className="min-w-0 flex-1">
              <Link
                href={`/projects/${project.id}`}
                className="truncate text-sm font-medium text-foreground hover:text-primary"
              >
                {project.isPinned && (
                  <Pin className="mr-1 inline h-3 w-3 text-primary" />
                )}
                {project.title}
              </Link>
              <div className="mt-1 flex items-center gap-2">
                {project.successScore !== null && (
                  <span
                    className={`text-xs font-medium ${successScoreColor(project.successScore)}`}
                  >
                    {project.successScore}
                  </span>
                )}
                {project.riskLevel && (
                  <Badge
                    variant={levelToBadgeVariant(project.riskLevel)}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {project.riskLevel}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => toggleProjectStarAction(project.id)}
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    project.isStarred
                      ? "fill-warning text-warning"
                      : "text-muted"
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => toggleProjectPinAction(project.id)}
              >
                <Pin
                  className={`h-3.5 w-3.5 ${
                    project.isPinned ? "fill-primary text-primary" : "text-muted"
                  }`}
                />
              </Button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
