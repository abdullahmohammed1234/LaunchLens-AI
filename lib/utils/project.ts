import type { Project, ProjectStatus } from "@prisma/client";

export const statusVariant: Record<
  ProjectStatus,
  "success" | "warning" | "secondary"
> = {
  active: "success",
  draft: "secondary",
  archived: "warning",
};

export function formatExperienceLevel(level: Project["experienceLevel"]) {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export type ProjectListItem = Pick<
  Project,
  | "id"
  | "title"
  | "description"
  | "status"
  | "budget"
  | "timeline"
  | "teamSize"
  | "experienceLevel"
  | "updatedAt"
  | "createdAt"
>;
