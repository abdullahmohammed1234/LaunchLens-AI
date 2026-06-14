"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, FlaskConical, Play, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { StoredFailureSimulation } from "@/types/failure-simulation";
import { failureSimulationSchema } from "@/types/failure-simulation";
import { ScenarioCard } from "@/components/simulator/scenario-card";
import { FailureTimeline } from "@/components/simulator/failure-timeline";
import { RootCauseAnalysis } from "@/components/simulator/root-cause-analysis";
import { PreventionCenter } from "@/components/simulator/prevention-center";
import { SimulationMetrics } from "@/components/simulator/simulation-metrics";
import { SimulationLoading } from "@/components/simulator/simulation-loading";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FailureSimulatorViewProps {
  projectId: string;
  projectTitle: string;
  hasAnalysis: boolean;
  initialSimulation: StoredFailureSimulation | null;
  showBackLink?: boolean;
}

export function FailureSimulatorView({
  projectId,
  projectTitle,
  hasAnalysis,
  initialSimulation,
  showBackLink = true,
}: FailureSimulatorViewProps) {
  const router = useRouter();
  const [simulation, setSimulation] = useState<StoredFailureSimulation | null>(
    initialSimulation
  );
  const [isLoading, setIsLoading] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);

  async function handleSimulate() {
    if (!hasAnalysis) {
      toast.error("Run project analysis before simulating failure scenarios");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Simulation failed");
      }

      const parsed = failureSimulationSchema.safeParse(result);
      if (!parsed.success) {
        throw new Error("Invalid simulation response");
      }

      setSimulation(result as StoredFailureSimulation);
      setUsedFallback(result.usedFallback ?? false);
      setActiveScenario(0);
      toast.success("Failure simulation complete");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to run simulation"
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <SimulationLoading fullPage />;
  }

  if (!hasAnalysis) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Analysis required"
        description="Run AI analysis on this project first. The failure simulator uses your analysis to model realistic failure paths."
        action={{
          label: "Go to Analysis",
          onClick: () => router.push(`/projects/${projectId}/analysis`),
        }}
      />
    );
  }

  if (!simulation) {
    return (
      <EmptyState
        icon={FlaskConical}
        title="No simulation yet"
        description={`Explore how ${projectTitle} could fail — and how to prevent it — before problems emerge.`}
        action={{
          label: "Run Failure Simulation",
          onClick: handleSimulate,
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {showBackLink && (
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${projectId}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Project
            </Link>
          </Button>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {usedFallback && (
            <Badge variant="warning">Fallback data used</Badge>
          )}
          <span className="text-xs text-muted">
            Simulated{" "}
            {formatDistanceToNow(new Date(simulation.createdAt), {
              addSuffix: true,
            })}
          </span>
          <Button onClick={handleSimulate} size="sm">
            <Play className="h-4 w-4" />
            Re-run Simulation
          </Button>
        </div>
      </div>

      <SimulationMetrics simulation={simulation} />

      <div className="grid gap-4 sm:grid-cols-3">
        {simulation.scenarios.map((s, index) => (
          <ScenarioCard
            key={s.title}
            scenario={s}
            index={index}
            selected={activeScenario === index}
            onClick={() => setActiveScenario(index)}
          />
        ))}
      </div>

      <Tabs
        value={String(activeScenario)}
        onValueChange={(value) => setActiveScenario(Number(value))}
      >
        <TabsList className="w-full justify-start">
          {simulation.scenarios.map((s, index) => (
            <TabsTrigger key={s.title} value={String(index)}>
              Scenario {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>

        {simulation.scenarios.map((s, index) => (
          <TabsContent key={s.title} value={String(index)} className="mt-6">
            <AnimatePresence mode="wait">
              {activeScenario === index && (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="rounded-xl border border-border bg-surface/30 p-5">
                    <h2 className="text-lg font-semibold text-foreground">
                      {s.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {s.summary}
                    </p>
                  </div>

                  <FailureTimeline scenario={s} />

                  <div className="grid gap-6 lg:grid-cols-2">
                    <RootCauseAnalysis rootCauses={s.rootCauses} />
                    <PreventionCenter strategies={s.preventionStrategies} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
