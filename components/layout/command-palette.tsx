"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  FileText,
  FlaskConical,
  FolderKanban,
  GitCompare,
  LayoutDashboard,
  Map,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { SIDEBAR_NAV_ITEMS } from "@/lib/constants/navigation";
import { usePresentationStore } from "@/stores/presentation-store";
import { cn } from "@/lib/utils/cn";

const ICON_MAP: Record<string, typeof LayoutDashboard> = {
  Dashboard: LayoutDashboard,
  Portfolio: Briefcase,
  Projects: FolderKanban,
  Analyzer: BarChart3,
  Simulator: FlaskConical,
  Roadmap: Map,
  "Team Builder": Users,
  Compare: GitCompare,
  Reports: FileText,
  Settings: Settings,
};

interface SearchResult {
  id: string;
  label: string;
  description?: string;
  href: string;
  category: "page" | "project" | "action";
  icon: typeof LayoutDashboard;
}

interface CommandPaletteProps {
  projects?: { id: string; title: string }[];
}

export function CommandPalette({ projects = [] }: CommandPaletteProps) {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = usePresentationStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const pageResults: SearchResult[] = SIDEBAR_NAV_ITEMS.map((item) => ({
    id: item.href,
    label: item.label,
    description: item.description,
    href: item.href,
    category: "page" as const,
    icon: ICON_MAP[item.label] ?? LayoutDashboard,
  }));

  const projectResults: SearchResult[] = projects.map((p) => ({
    id: p.id,
    label: p.title,
    description: "Project",
    href: `/projects/${p.id}`,
    category: "project" as const,
    icon: FolderKanban,
  }));

  const actionResults: SearchResult[] = [
    {
      id: "demo",
      label: "Explore Demo",
      description: "View demo projects",
      href: "/demo",
      category: "action",
      icon: Sparkles,
    },
    {
      id: "new-project",
      label: "New Project",
      description: "Create a new project",
      href: "/projects/new",
      category: "action",
      icon: FolderKanban,
    },
  ];

  const allResults = [...actionResults, ...pageResults, ...projectResults];

  const filtered = query.trim()
    ? allResults.filter(
        (r) =>
          r.label.toLowerCase().includes(query.toLowerCase()) ||
          r.description?.toLowerCase().includes(query.toLowerCase())
      )
    : allResults;

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setCommandPaletteOpen(false);
      setQuery("");
      router.push(result.href);
    },
    [router, setCommandPaletteOpen]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (!commandPaletteOpen) return;

      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    commandPaletteOpen,
    filtered,
    selectedIndex,
    handleSelect,
    setCommandPaletteOpen,
  ]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            role="dialog"
            aria-label="Command palette"
            aria-modal="true"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, pages, actions..."
                className="flex-1 bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted"
                aria-label="Search"
              />
              <kbd className="hidden rounded border border-border bg-surface px-1.5 py-0.5 text-xs text-muted sm:inline">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted">
                  No results found
                </p>
              ) : (
                filtered.map((result, index) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        index === selectedIndex
                          ? "bg-primary/10 text-foreground"
                          : "text-muted hover:bg-surface hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{result.label}</p>
                        {result.description && (
                          <p className="text-xs text-muted truncate">
                            {result.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs capitalize text-muted/60">
                        {result.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted">
              <span>Navigate with ↑↓</span>
              <span>
                <kbd className="rounded border border-border bg-surface px-1">↵</kbd>{" "}
                to select
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
