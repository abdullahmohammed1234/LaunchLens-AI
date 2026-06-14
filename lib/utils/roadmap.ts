import type { Roadmap, RoadmapPhase } from "@/types/roadmap";

export function countMilestones(roadmap: Roadmap): number {
  return roadmap.phases.reduce(
    (sum, phase) => sum + phase.milestones.length,
    0
  );
}

export function countTasks(roadmap: Roadmap): number {
  return roadmap.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
}

export function countTotalHours(roadmap: Roadmap): number {
  return roadmap.phases.reduce(
    (sum, phase) =>
      sum + phase.tasks.reduce((taskSum, task) => taskSum + task.estimatedHours, 0),
    0
  );
}

export function getPhaseStatus(
  phaseIndex: number,
  totalPhases: number
): "completed" | "current" | "upcoming" {
  if (phaseIndex === 0) return "current";
  if (phaseIndex < Math.ceil(totalPhases * 0.2)) return "current";
  return "upcoming";
}

export function flattenMilestones(
  phases: RoadmapPhase[]
): Array<{
  title: string;
  description: string;
  phaseTitle: string;
  phaseIndex: number;
  milestoneIndex: number;
  status: "completed" | "in_progress" | "upcoming";
}> {
  return phases.flatMap((phase, phaseIndex) =>
    phase.milestones.map((milestone, milestoneIndex) => {
      let status: "completed" | "in_progress" | "upcoming" = "upcoming";
      if (phaseIndex === 0 && milestoneIndex === 0) {
        status = "in_progress";
      } else if (phaseIndex === 0 && milestoneIndex > 0) {
        status = "upcoming";
      }

      return {
        ...milestone,
        phaseTitle: phase.title,
        phaseIndex,
        milestoneIndex,
        status,
      };
    })
  );
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "text-danger";
    case "medium":
      return "text-warning";
    default:
      return "text-muted";
  }
}

export function priorityBadgeVariant(
  priority: string
): "danger" | "warning" | "secondary" {
  switch (priority) {
    case "high":
      return "danger";
    case "medium":
      return "warning";
    default:
      return "secondary";
  }
}
