"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Briefcase } from "lucide-react";
import type { TeamRole } from "@/types/team-plan";
import {
  priorityAccentClass,
  priorityToBadgeVariant,
  sortRolesByPriority,
} from "@/lib/utils/team-plan";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RoleRecommendationsProps {
  roles: TeamRole[];
}

export function RoleRecommendations({ roles }: RoleRecommendationsProps) {
  const sorted = sortRolesByPriority(roles);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Role Recommendations
      </h2>
      <div className="space-y-3">
        {sorted.map((role, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -1 }}
            >
              <Card
                className={cn(
                  "cursor-pointer border-border bg-card transition-all",
                  isExpanded && "border-primary/30 ring-1 ring-primary/20"
                )}
                onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{role.title}</CardTitle>
                      <p className="mt-0.5 text-xs text-muted line-clamp-1">
                        {role.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={priorityToBadgeVariant(role.priority)}>
                      <span className={priorityAccentClass(role.priority)}>
                        {role.priority}
                      </span>
                    </Badge>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 text-muted" />
                    </motion.div>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <CardContent className="space-y-4 border-t border-border pt-4">
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                            Responsibilities
                          </p>
                          <ul className="space-y-1.5">
                            {role.responsibilities.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 text-sm text-foreground"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                            Skills
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {role.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-foreground"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
