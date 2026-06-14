"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import { CommandPalette } from "@/components/layout/command-palette";
import { NotificationDrawer } from "@/components/layout/notification-drawer";
import {
  PresentationModes,
} from "@/components/layout/presentation-modes";
import { ProductTour, TourTrigger } from "@/components/onboarding/product-tour";
import type { NotificationEntry } from "@/types/portfolio";

interface PlatformFeaturesProps {
  children: React.ReactNode;
  projects?: { id: string; title: string }[];
  notifications?: NotificationEntry[];
  unreadCount?: number;
}

export function PlatformFeatures({
  children,
  projects = [],
  notifications = [],
  unreadCount = 0,
}: PlatformFeaturesProps) {
  return (
    <ErrorBoundary>
      {children}
      <CommandPalette projects={projects} />
      <NotificationDrawer
        notifications={notifications}
        unreadCount={unreadCount}
      />
      <PresentationModes />
      <ProductTour />
      <TourTrigger />
    </ErrorBoundary>
  );
}
