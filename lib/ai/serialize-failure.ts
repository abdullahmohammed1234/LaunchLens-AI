import type { FailureSimulation } from "@prisma/client";
import {
  failureSimulationSchema,
  type FailureSimulation as FailureSimulationData,
  type StoredFailureSimulation,
} from "@/types/failure-simulation";

export function simulationToResponse(
  record: FailureSimulation
): StoredFailureSimulation {
  const simulationData = failureSimulationSchema.parse(record.simulationData);
  return {
    id: record.id,
    projectId: record.projectId,
    createdAt: record.createdAt.toISOString(),
    ...simulationData,
  };
}

export function simulationDataToDbFields(simulation: FailureSimulationData) {
  return {
    simulationData: simulation,
  };
}
