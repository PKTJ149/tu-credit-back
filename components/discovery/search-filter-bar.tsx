"use client";

import { Search } from "lucide-react";

type SearchFilterBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filterOptions?: string[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterLabel?: string;
};

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filterOptions,
  filterValue,
  onFilterChange,
  filterLabel,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
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

      {filterOptions && onFilterChange ? (
        <select
          value={filterValue}
          onChange={(event) => onFilterChange(event.target.value)}
          aria-label={filterLabel ?? "ตัวกรอง"}
          className="ui-input sm:w-56"
        >
          <option value="">ทั้งหมด</option>
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}
