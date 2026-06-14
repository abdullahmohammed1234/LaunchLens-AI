"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  FolderKanban,
  Pin,
  Star,
  TrendingUp,
} from "lucide-react";
import type { PortfolioProject } from "@/types/portfolio";
import {
  toggleProjectPinAction,
  toggleProjectStarAction,
} from "@/lib/actions/portfolio";
import { levelToBadgeVariant, successScoreColor } from "@/lib/utils/analysis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";

interface PortfolioProjectCardProps {
  project: PortfolioProject;
  index?: number;
}

export function PortfolioProjectCard({
  project,
  index = 0,
}: PortfolioProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ y: -2 }}
    >
      <Card
        className={`group h-full border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${
          project.requiresAttention ? "border-warning/30" : ""
        }`}
      >
        <CardContent className="p-5">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-1">
              {project.isPinned && (
                <Pin className="h-3.5 w-3.5 fill-primary text-primary" />
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault();
                  toggleProjectStarAction(project.id);
                }}
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
                className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault();
                  toggleProjectPinAction(project.id);
                }}
              >
                <Pin
                  className={`h-3.5 w-3.5 ${
                    project.isPinned ? "fill-primary text-primary" : "text-muted"
                  }`}
                />
              </Button>
              <ProjectStatusBadge status={project.status} />
            </div>
          </div>

          <Link href={`/projects/${project.id}`}>
            <h3 className="mb-1 font-semibold text-foreground transition-colors group-hover:text-primary">
              {project.title}
            </h3>
          </Link>
          <p className="mb-4 line-clamp-2 text-sm text-muted">
            {project.description}
          </p>

          <div className="mb-3 grid grid-cols-3 gap-2">
            <div className="rounded-md bg-surface px-2 py-1.5 text-center">
              <p className="text-[10px] uppercase tracking-wide text-muted">
                Success
              </p>
              <p
                className={`text-sm font-bold tabular-nums ${
                  project.successScore !== null
                    ? successScoreColor(project.successScore)
                    : "text-muted"
                }`}
              >
                {project.successScore ?? "—"}
              </p>
            </div>
            <div className="rounded-md bg-surface px-2 py-1.5 text-center">
              <p className="text-[10px] uppercase tracking-wide text-muted">
                Risk
              </p>
              {project.riskLevel ? (
                <Badge
                  variant={levelToBadgeVariant(project.riskLevel)}
                  className="mt-0.5 text-[10px]"
                >
                  {project.riskLevel}
                </Badge>
              ) : (
                <p className="text-sm text-muted">—</p>
              )}
            </div>
            <div className="rounded-md bg-surface px-2 py-1.5 text-center">
              <p className="text-[10px] uppercase tracking-wide text-muted">
                Ready
              </p>
              <p className="text-sm font-bold tabular-nums text-foreground">
                {project.readinessScore ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              Updated{" "}
              {formatDistanceToNow(new Date(project.updatedAt), {
                addSuffix: true,
              })}
            </span>
            <div className="flex items-center gap-2">
              {project.scoreChange !== null && project.scoreChange !== 0 && (
                <span
                  className={`flex items-center gap-0.5 font-medium ${
                    project.scoreChange > 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {project.scoreChange > 0 ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {Math.abs(project.scoreChange)}
                </span>
              )}
              {project.requiresAttention && (
                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
              )}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/portfolio/${project.id}/evolution`}>
                <TrendingUp className="h-3.5 w-3.5" />
                Evolution
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="flex-1" asChild>
              <Link href={`/projects/${project.id}`}>View</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
