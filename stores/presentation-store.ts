"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PresentationState {
  demoMode: boolean;
  screenshotMode: boolean;
  videoDemoMode: boolean;
  videoDemoStep: number;
  commandPaletteOpen: boolean;
  notificationDrawerOpen: boolean;
  setDemoMode: (enabled: boolean) => void;
  toggleDemoMode: () => void;
  setScreenshotMode: (enabled: boolean) => void;
  toggleScreenshotMode: () => void;
  setVideoDemoMode: (enabled: boolean) => void;
  setVideoDemoStep: (step: number) => void;
  startVideoDemo: () => void;
  stopVideoDemo: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationDrawerOpen: (open: boolean) => void;
}

export const usePresentationStore = create<PresentationState>()(
  persist(
    (set) => ({
      demoMode: false,
      screenshotMode: false,
      videoDemoMode: false,
      videoDemoStep: 0,
      commandPaletteOpen: false,
      notificationDrawerOpen: false,
      setDemoMode: (enabled) => set({ demoMode: enabled }),
      toggleDemoMode: () => set((s) => ({ demoMode: !s.demoMode })),
      setScreenshotMode: (enabled) => set({ screenshotMode: enabled }),
      toggleScreenshotMode: () =>
        set((s) => ({ screenshotMode: !s.screenshotMode })),
      setVideoDemoMode: (enabled) => set({ videoDemoMode: enabled }),
      setVideoDemoStep: (step) => set({ videoDemoStep: step }),
      startVideoDemo: () =>
        set({ videoDemoMode: true, videoDemoStep: 0, screenshotMode: true }),
      stopVideoDemo: () =>
        set({ videoDemoMode: false, videoDemoStep: 0, screenshotMode: false }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      setNotificationDrawerOpen: (open) =>
        set({ notificationDrawerOpen: open }),
    }),
    {
      name: "launchlens-presentation",
      partialize: (state) => ({
        demoMode: state.demoMode,
      }),
    }
  )
);
