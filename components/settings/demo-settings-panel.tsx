"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Camera,
  Database,
  MonitorPlay,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  seedDemoDataAction,
  resetDemoDataAction,
} from "@/lib/demo/seed-demo";
import { usePresentationStore } from "@/stores/presentation-store";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DemoSettingsPanel() {
  const [isPending, startTransition] = useTransition();
  const { demoMode, setDemoMode, toggleScreenshotMode, startVideoDemo } =
    usePresentationStore();
  const { restartTour, tourCompleted } = useOnboardingStore();

  function handleSeed() {
    startTransition(async () => {
      const result = await seedDemoDataAction();
      if (result.success) {
        toast.success(result.message);
        setDemoMode(true);
      }
    });
  }

  function handleReset() {
    startTransition(async () => {
      const result = await resetDemoDataAction();
      if (result.success) {
        toast.success(result.message);
        setDemoMode(false);
      }
    });
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Demo & Presentation
        </CardTitle>
        <CardDescription>
          Load sample data, restart tours, and configure presentation modes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h4 className="mb-1 text-sm font-medium text-foreground">
            Demo Mode
          </h4>
          <p className="mb-3 text-xs text-muted">
            Load 4 fully-populated demo projects: LaunchLens AI, StudySync,
            FitTrack, and EcoRoute.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSeed} disabled={isPending} size="sm">
              <Database className="h-4 w-4" />
              Load Demo Data
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isPending}
              size="sm"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Demo Data
            </Button>
            <Button variant="ghost" asChild size="sm">
              <Link href="/demo">View Public Demo</Link>
            </Button>
          </div>
          {demoMode && (
            <p className="mt-2 text-xs text-primary">Demo mode is active</p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <h4 className="mb-1 text-sm font-medium text-foreground">
            Product Tour
          </h4>
          <p className="mb-3 text-xs text-muted">
            {tourCompleted
              ? "Tour completed. Restart anytime."
              : "Tour will show on first login."}
          </p>
          <Button variant="outline" size="sm" onClick={restartTour}>
            Restart Tour
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <h4 className="mb-1 text-sm font-medium text-foreground">
            Presentation Modes
          </h4>
          <p className="mb-3 text-xs text-muted">
            Optimize layouts for screenshots, pitch decks, and video demos.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={toggleScreenshotMode}>
              <Camera className="h-4 w-4" />
              Screenshot Mode
            </Button>
            <Button variant="outline" size="sm" onClick={startVideoDemo}>
              <MonitorPlay className="h-4 w-4" />
              Start Video Demo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
