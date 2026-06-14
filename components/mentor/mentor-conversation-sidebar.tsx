"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { History, MessageSquare, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import type { StoredMentorConversation, MentorTopic } from "@/types/mentor";

interface MentorConversationSidebarProps {
  projectId?: string;
  activeConversationId?: string | null;
  onSelectConversation: (conversation: StoredMentorConversation) => void;
  onNewConversation: () => void;
  className?: string;
}

export function MentorConversationSidebar({
  projectId,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  className,
}: MentorConversationSidebarProps) {
  const [conversations, setConversations] = useState<
    StoredMentorConversation[]
  >([]);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<MentorTopic | "all">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (projectId) params.set("projectId", projectId);
      if (query) params.set("query", query);
      if (topic !== "all") params.set("topic", topic);

      const response = await fetch(
        `/api/mentor/conversations?${params.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  }, [projectId, query, topic]);

  useEffect(() => {
    const debounce = setTimeout(fetchConversations, 300);
    return () => clearTimeout(debounce);
  }, [fetchConversations]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">History</h3>
          </div>
          <button
            type="button"
            onClick={onNewConversation}
            className="text-xs font-medium text-primary hover:underline"
          >
            New chat
          </button>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations..."
              className="h-9 pl-8 text-xs"
            />
          </div>
          <Select
            value={topic}
            onValueChange={(v) => setTopic(v as MentorTopic | "all")}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Filter by topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="what_if">What-if</SelectItem>
              <SelectItem value="execution">Execution</SelectItem>
              <SelectItem value="strategy">Strategy</SelectItem>
              <SelectItem value="portfolio">Portfolio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <p className="p-4 text-center text-xs text-muted">Loading...</p>
        ) : conversations.length === 0 ? (
          <p className="p-4 text-center text-xs text-muted">
            No conversations yet
          </p>
        ) : (
          <AnimatePresence>
            {conversations.map((conversation) => (
              <motion.button
                key={conversation.id}
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  onSelectConversation(conversation);
                  setIsOpen(false);
                }}
                className={cn(
                  "mb-1 w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                  activeConversationId === conversation.id
                    ? "bg-primary/10 text-foreground"
                    : "hover:bg-surface text-foreground/80"
                )}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">
                      {conversation.title}
                    </p>
                    {conversation.projectTitle && (
                      <p className="truncate text-[10px] text-muted">
                        {conversation.projectTitle}
                      </p>
                    )}
                    <p className="text-[10px] text-muted">
                      {formatDistanceToNow(new Date(conversation.updatedAt), {
                        addSuffix: true,
                      })}
                      {conversation.messageCount
                        ? ` · ${conversation.messageCount} messages`
                        : ""}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-lg lg:hidden"
        aria-label="Open conversation history"
      >
        <History className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 z-50 h-full w-80 border-l border-border bg-background lg:hidden"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-3 rounded-lg p-1 hover:bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "hidden w-72 shrink-0 overflow-hidden rounded-xl border border-border bg-card lg:block",
          className
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
