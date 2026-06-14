import type { Roadmap as RoadmapRecord } from "@prisma/client";
import {
  roadmapDataSchema,
  type Roadmap,
  type StoredRoadmap,
} from "@/types/roadmap";

export function roadmapToResponse(record: RoadmapRecord): StoredRoadmap {
  const roadmapData = roadmapDataSchema.parse(record.roadmapData);
  return {
    id: record.id,
    projectId: record.projectId,
    createdAt: record.createdAt.toISOString(),
    estimatedDurationMonths: record.estimatedDurationMonths,
    ...roadmapData,
  };
}

export function roadmapToDbFields(roadmap: Roadmap) {
  const { estimatedDurationMonths, ...roadmapData } = roadmap;
  return {
    estimatedDurationMonths,
    roadmapData,
  };
}
