"use client";

import { Search } from "lucide-react";

export type FilterConfig = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

type SearchFilterBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters?: FilterConfig[];
  filterOptions?: string[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterLabel?: string;
};

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  filterOptions,
  filterValue,
  onFilterChange,
  filterLabel,
}: SearchFilterBarProps) {
  const resolvedFilters: FilterConfig[] =
    filters ??
    (filterOptions && onFilterChange
      ? [{ label: filterLabel ?? "ตัวกรอง", options: filterOptions, value: filterValue ?? "", onChange: onFilterChange }]
      : []);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-4 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-0">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-subtle)]"
        />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="ui-input pl-9"
        />
      </div>

      {resolvedFilters.map((filter) => (
        <select
          key={filter.label}
          value={filter.value}
          onChange={(event) => filter.onChange(event.target.value)}
          aria-label={filter.label}
          className="ui-input sm:w-52 shrink-0"
        >
          <option value="">{filter.label}: ทั้งหมด</option>
          {filter.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
