"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  placement?: "top" | "bottom" | "left" | "right";
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "dashboard",
    target: '[data-tour="nav-dashboard"]',
    title: "Founder Command Center",
    description:
      "Your portfolio health at a glance — success scores, readiness metrics, goals, and activity.",
    placement: "right",
  },
  {
    id: "analyzer",
    target: '[data-tour="nav-analyzer"]',
    title: "AI Project Analyzer",
    description:
      "Describe any idea and get instant feasibility analysis with success scores and risk detection.",
    placement: "right",
  },
  {
    id: "simulator",
    target: '[data-tour="nav-simulator"]',
    title: "Failure Simulator",
    description:
      "Model how projects could fail before they do — scenarios, timelines, and prevention strategies.",
    placement: "right",
  },
  {
    id: "roadmap",
    target: '[data-tour="nav-roadmap"]',
    title: "Execution Roadmap",
    description:
      "AI-generated phased roadmaps with milestones, tasks, and launch checklists.",
    placement: "right",
  },
  {
    id: "team",
    target: '[data-tour="nav-team"]',
    title: "Team Builder",
    description:
      "Identify skill gaps, hiring priorities, and team scenarios for your venture.",
    placement: "right",
  },
  {
    id: "reports",
    target: '[data-tour="nav-reports"]',
    title: "Executive Reports",
    description:
      "Investor-ready intelligence reports with readiness scores and strategic recommendations.",
    placement: "right",
  },
];

interface OnboardingState {
  tourActive: boolean;
  currentStep: number;
  tourCompleted: boolean;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  restartTour: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      tourActive: false,
      currentStep: 0,
      tourCompleted: false,
      startTour: () => set({ tourActive: true, currentStep: 0 }),
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep >= TOUR_STEPS.length - 1) {
          set({ tourActive: false, tourCompleted: true });
        } else {
          set({ currentStep: currentStep + 1 });
        }
      },
      prevStep: () =>
        set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
      skipTour: () => set({ tourActive: false, tourCompleted: true }),
      completeTour: () => set({ tourActive: false, tourCompleted: true }),
      restartTour: () =>
        set({ tourActive: true, currentStep: 0, tourCompleted: false }),
    }),
    { name: "launchlens-onboarding" }
  )
);
