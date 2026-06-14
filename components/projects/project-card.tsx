"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FolderKanban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import type { ProjectListItem } from "@/lib/utils/project";

interface ProjectCardProps {
  project: ProjectListItem;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <Link href={`/projects/${project.id}`}>
        <Card className="group h-full border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          <CardContent className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
              <ProjectStatusBadge status={project.status} />
            </div>
            <h3 className="mb-1 font-semibold text-foreground transition-colors group-hover:text-primary">
              {project.title}
            </h3>
            <p className="mb-4 line-clamp-2 text-sm text-muted">
              {project.description}
            </p>
            <div className="flex items-center justify-between text-xs text-muted">
              <span>
                Updated{" "}
                {formatDistanceToNow(new Date(project.updatedAt), {
                  addSuffix: true,
                })}
              </span>
              <span>{project.teamSize} members</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
