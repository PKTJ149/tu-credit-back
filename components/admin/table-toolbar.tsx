"use client";

import { Search, X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type ToolbarFilter = {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

type TableToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchLabel?: string;
  filters?: ToolbarFilter[];
  /** Rendered at the end of the row — export buttons, bulk actions. */
  trailing?: ReactNode;
  /** "แสดง 8 จาก 12 รายการ". Always shown when a filter is narrowing results,
   *  so nobody reads a filtered table as the whole truth. */
  resultSummary?: string;
  onReset?: () => void;
  className?: string;
};

const ALL_VALUE = "all";

export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "ค้นหา",
  searchLabel = "ค้นหาในตาราง",
  filters = [],
  trailing,
  resultSummary,
  onReset,
  className,
}: TableToolbarProps) {
  const isFiltered = searchValue.trim() !== "" || filters.some((f) => f.value !== ALL_VALUE);

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex flex-wrap items-end gap-2.5">
        <div className="min-w-56 flex-1 space-y-1.5">
          <Label htmlFor="table-search" className="text-xs text-[var(--ink-subtle)]">
            {searchLabel}
          </Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[var(--ink-subtle)]"
              aria-hidden
            />
            <Input
              id="table-search"
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 ps-9"
            />
          </div>
        </div>

        {filters.map((filter) => (
          <div key={filter.id} className="min-w-44 space-y-1.5">
            <Label htmlFor={`filter-${filter.id}`} className="text-xs text-[var(--ink-subtle)]">
              {filter.label}
            </Label>
            <Select value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger id={`filter-${filter.id}`} className="h-9 w-full" size="sm">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {isFiltered && onReset ? (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-9">
            <X className="size-4" aria-hidden />
            ล้างตัวกรอง
          </Button>
        ) : null}

        {trailing ? <div className="ms-auto flex items-center gap-2">{trailing}</div> : null}
      </div>

      {resultSummary ? (
        <p aria-live="polite" className="text-xs text-[var(--ink-muted)]">
          {resultSummary}
        </p>
      ) : null}
    </div>
  );
}

export const ALL_FILTER_VALUE = ALL_VALUE;
