"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

export type FilterSectionConfig = {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

function FilterSection({ section }: { section: FilterSectionConfig }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-b border-[color:var(--border)] py-4 last:border-0">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-2 text-sm font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--ink-muted)]"
      >
        {section.label}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-[var(--ink-subtle)] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {section.options.map((option) => {
            const selected = section.value === option;
            return (
              <li key={option}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => section.onChange(selected ? "" : option)}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-[var(--surface)]"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      selected
                        ? "border-[color:var(--primary)] bg-[color:var(--primary)]"
                        : "border-[color:var(--border)] bg-[var(--background)]"
                    }`}
                  >
                    {selected && (
                      <svg
                        viewBox="0 0 12 9"
                        fill="none"
                        aria-hidden="true"
                        className="h-2.5 w-2.5"
                      >
                        <path
                          d="M1 4.5L4.5 8L11 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-sm ${
                      selected
                        ? "font-medium text-[var(--foreground)]"
                        : "text-[var(--ink-muted)]"
                    }`}
                  >
                    {option}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

type FilterSidebarProps = {
  sections: FilterSectionConfig[];
  onClearAll: () => void;
  activeFilterCount: number;
};

export function FilterSidebar({
  sections,
  onClearAll,
  activeFilterCount,
}: FilterSidebarProps) {
  return (
    <div className="w-56 shrink-0">
      <div className="mb-1 flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-[var(--ink-subtle)]" />
          <span className="text-sm font-semibold text-[var(--foreground)]">ตัวกรอง</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--primary)] px-1.5 text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-[var(--ink-subtle)] transition-colors hover:text-[var(--foreground)]"
          >
            <X aria-hidden="true" className="h-3 w-3" />
            ล้างทั้งหมด
          </button>
        )}
      </div>

      <div>
        {sections.map((section) => (
          <FilterSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
