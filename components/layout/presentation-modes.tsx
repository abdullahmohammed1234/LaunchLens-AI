"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Camera,
  MonitorPlay,
  Sparkles,
  X,
} from "lucide-react";
import { usePresentationStore } from "@/stores/presentation-store";
import { Button } from "@/components/ui/button";

const VIDEO_DEMO_STEPS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analyzer", href: "/analyzer" },
  { label: "Simulator", href: "/simulator" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Team Builder", href: "/team" },
  { label: "Reports", href: "/reports" },
];

export function PresentationModes() {
  const router = useRouter();
  const {
    screenshotMode,
    videoDemoMode,
    videoDemoStep,
    stopVideoDemo,
    setVideoDemoStep,
  } = usePresentationStore();

  useEffect(() => {
    document.body.classList.toggle("screenshot-mode", screenshotMode);
    return () => document.body.classList.remove("screenshot-mode");
  }, [screenshotMode]);

  useEffect(() => {
    if (!videoDemoMode) return;

    const step = VIDEO_DEMO_STEPS[videoDemoStep];
    if (step) {
      router.push(step.href);
    }

    const timer = setTimeout(() => {
      if (videoDemoStep < VIDEO_DEMO_STEPS.length - 1) {
        setVideoDemoStep(videoDemoStep + 1);
      } else {
        stopVideoDemo();
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [
    videoDemoMode,
    videoDemoStep,
    router,
    setVideoDemoStep,
    stopVideoDemo,
  ]);

  if (!screenshotMode && !videoDemoMode) return null;

  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      className="fixed left-1/2 top-4 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full border border-primary/30 bg-card/95 px-4 py-2 shadow-lg backdrop-blur-xl"
    >
      <Camera className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium text-foreground">
        {videoDemoMode ? "Video Demo Mode" : "Screenshot Mode"}
      </span>
      {videoDemoMode && (
        <span className="text-xs text-muted">
          {VIDEO_DEMO_STEPS[videoDemoStep]?.label} ({videoDemoStep + 1}/
          {VIDEO_DEMO_STEPS.length})
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={stopVideoDemo}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </motion.div>
  );
}

export function PresentationControls() {
  const { toggleScreenshotMode, startVideoDemo, screenshotMode } =
    usePresentationStore();

  return (
    <div className="flex items-center gap-1" data-screenshot-hide>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={toggleScreenshotMode}
        title="Screenshot mode"
        aria-label="Toggle screenshot mode"
      >
        <Camera
          className={`h-4 w-4 ${screenshotMode ? "text-primary" : ""}`}
        />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={startVideoDemo}
        title="Start product demo"
        aria-label="Start video demo"
      >
        <MonitorPlay className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function DemoModeBadge() {
  const { demoMode } = usePresentationStore();
  if (!demoMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
    >
      <Sparkles className="h-3 w-3" />
      Demo Mode
    </motion.div>
  );
}
