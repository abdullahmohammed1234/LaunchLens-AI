"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import type { PortfolioFilter } from "@/types/portfolio";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PortfolioFiltersProps {
  filter: PortfolioFilter;
  onChange: (filter: PortfolioFilter) => void;
}

export function PortfolioFilters({ filter, onChange }: PortfolioFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          placeholder="Search projects..."
          className="pl-9"
          value={filter.search ?? ""}
          onChange={(e) => onChange({ ...filter, search: e.target.value })}
        />
      </div>

      <Select
        value={filter.status ?? "all"}
        onValueChange={(v) =>
          onChange({
            ...filter,
            status: v as PortfolioFilter["status"],
          })
        }
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filter.riskLevel ?? "all"}
        onValueChange={(v) =>
          onChange({
            ...filter,
            riskLevel: v as PortfolioFilter["riskLevel"],
          })
        }
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Risk" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Risk</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filter.sortBy ?? "updatedAt"}
        onValueChange={(v) =>
          onChange({
            ...filter,
            sortBy: v as PortfolioFilter["sortBy"],
          })
        }
      >
        <SelectTrigger className="w-[150px]">
          <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updatedAt">Last Updated</SelectItem>
          <SelectItem value="createdAt">Created</SelectItem>
          <SelectItem value="successScore">Success Score</SelectItem>
          <SelectItem value="readinessScore">Readiness</SelectItem>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="riskLevel">Risk Level</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filter.sortOrder ?? "desc"}
        onValueChange={(v) =>
          onChange({
            ...filter,
            sortOrder: v as "asc" | "desc",
          })
        }
      >
        <SelectTrigger className="w-[110px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Descending</SelectItem>
          <SelectItem value="asc">Ascending</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant={filter.starredOnly ? "default" : "outline"}
        size="sm"
        onClick={() =>
          onChange({ ...filter, starredOnly: !filter.starredOnly })
        }
      >
        Starred
      </Button>
    </div>
  );
}
