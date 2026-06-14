"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  TOUR_STEPS,
  useOnboardingStore,
} from "@/stores/onboarding-store";
import { Button } from "@/components/ui/button";

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function ProductTour() {
  const {
    tourActive,
    currentStep,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
  } = useOnboardingStore();
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const step = TOUR_STEPS[currentStep];

  useEffect(() => {
    if (!tourActive || !step) return;

    const updatePosition = () => {
      const el = document.querySelector(step.target);
      if (!el) {
        setSpotlight(null);
        return;
      }

      const rect = el.getBoundingClientRect();
      const padding = 8;
      setSpotlight({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      const placement = step.placement ?? "right";
      let top = rect.top;
      let left = rect.right + 16;

      if (placement === "bottom") {
        top = rect.bottom + 16;
        left = rect.left;
      } else if (placement === "left") {
        top = rect.top;
        left = rect.left - 340;
      } else if (placement === "top") {
        top = rect.top - 200;
        left = rect.left;
      }

      setTooltipPos({
        top: Math.max(16, Math.min(top, window.innerHeight - 220)),
        left: Math.max(16, Math.min(left, window.innerWidth - 340)),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    const interval = setInterval(updatePosition, 500);
    return () => {
      window.removeEventListener("resize", updatePosition);
      clearInterval(interval);
    };
  }, [tourActive, step, currentStep]);

  if (!tourActive || !step) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-label="Product tour">
      <div className="absolute inset-0 bg-black/70" onClick={skipTour} />

      {spotlight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-transparent"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)",
          }}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-[101] w-80 rounded-xl border border-border bg-card p-5 shadow-2xl"
          style={{ top: tooltipPos.top, left: tooltipPos.left }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-primary">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={skipTour}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Skip tour</span>
            </Button>
          </div>

          <h3 className="mb-2 text-base font-semibold text-foreground">
            {step.title}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-muted">
            {step.description}
          </p>

          <div className="mb-4 flex gap-1">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="text-muted"
            >
              Skip tour
            </Button>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <Button
                size="sm"
                onClick={
                  currentStep >= TOUR_STEPS.length - 1 ? completeTour : nextStep
                }
              >
                {currentStep >= TOUR_STEPS.length - 1 ? "Finish" : "Next"}
                {currentStep < TOUR_STEPS.length - 1 && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function TourTrigger() {
  const { tourCompleted, startTour } = useOnboardingStore();

  useEffect(() => {
    if (!tourCompleted) {
      const timer = setTimeout(() => startTour(), 1200);
      return () => clearTimeout(timer);
    }
  }, [tourCompleted, startTour]);

  return null;
}
