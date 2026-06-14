import type { TeamPlan as TeamPlanRecord } from "@prisma/client";
import {
  teamPlanDataSchema,
  type StoredTeamPlan,
  type TeamPlan,
} from "@/types/team-plan";

export function teamPlanToResponse(record: TeamPlanRecord): StoredTeamPlan {
  const teamData = teamPlanDataSchema.parse(record.teamData);
  return {
    id: record.id,
    projectId: record.projectId,
    createdAt: record.createdAt.toISOString(),
    recommendedTeamSize: record.recommendedTeamSize,
    ...teamData,
  };
}

export function teamPlanToDbFields(teamPlan: TeamPlan) {
  const { recommendedTeamSize, ...teamData } = teamPlan;
  return {
    recommendedTeamSize,
    teamData,
  };
}
