"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMenu } from "@/components/layout/user-menu";
import {
  DemoModeBadge,
  PresentationControls,
} from "@/components/layout/presentation-modes";
import { useUIStore } from "@/stores/ui-store";
import { usePresentationStore } from "@/stores/presentation-store";
import type { NotificationEntry } from "@/types/portfolio";

interface NavbarClientProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  title?: string;
  unreadCount?: number;
  notifications?: NotificationEntry[];
}

export function NavbarClient({
  user,
  title,
  unreadCount = 0,
}: NavbarClientProps) {
  const { setMobileMenuOpen } = useUIStore();
  const { setCommandPaletteOpen, setNotificationDrawerOpen } =
    usePresentationStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {title && (
        <h2 className="truncate text-lg font-semibold text-foreground md:hidden">
          {title}
        </h2>
      )}

      <div className="hidden max-w-md flex-1 md:flex">
        <button
          type="button"
          className="relative w-full"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Open command palette"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted pointer-events-none" />
          <Input
            readOnly
            placeholder="Search projects, pages..."
            className="cursor-pointer bg-surface pl-9"
            aria-hidden="true"
            tabIndex={-1}
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-card px-1.5 py-0.5 text-xs text-muted sm:inline">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex flex-1 items-center justify-end gap-1 md:gap-2">
        <DemoModeBadge />
        <PresentationControls />
        <Button
          variant="ghost"
          size="icon"
          className="relative md:hidden"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setNotificationDrawerOpen(true)}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-2 w-2 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          )}
        </Button>
        <UserMenu name={user.name} email={user.email} />
      </div>
    </header>
  );
}
