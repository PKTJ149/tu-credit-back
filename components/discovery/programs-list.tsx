"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProgramCard } from "@/components/discovery/program-card";
import { FilterSidebar, type FilterSectionConfig } from "@/components/discovery/filter-sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { programs } from "@/lib/data/programs";

const ITEMS_PER_PAGE = 9;

const levelOptions = Array.from(new Set(programs.map((p) => p.level)));
const facultyOptions = Array.from(new Set(programs.map((p) => p.faculty)));

type ProgramsListProps = {
  showHeading?: boolean;
  detailBasePath?: string;
};

export function ProgramsList({ showHeading = true, detailBasePath = "/programs" }: ProgramsListProps) {
  const [searchValue, setSearchValue] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const activeFilterCount = [levelFilter, facultyFilter, statusFilter, priceFilter].filter(Boolean).length;

  const clearAllFilters = () => {
    setLevelFilter("");
    setFacultyFilter("");
    setStatusFilter("");
    setPriceFilter("");
    setCurrentPage(1);
  };

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const filteredPrograms = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const filtered = programs.filter((program) => {
      const matchesQuery =
        query.length === 0 ||
        program.name.toLowerCase().includes(query) ||
        program.summary.toLowerCase().includes(query);
      const matchesLevel = levelFilter.length === 0 || program.level === levelFilter;
      const matchesFaculty = facultyFilter.length === 0 || program.faculty === facultyFilter;
      const matchesStatus =
        statusFilter.length === 0 ||
        (statusFilter === "เปิดรับ"
          ? program.status === "open" || program.status === undefined
          : program.status === "closed");
      const price = program.totalPrice ?? 0;
      const matchesPrice =
        priceFilter === "" ||
        (priceFilter === "ฟรี" && price === 0) ||
        (priceFilter === "≤ ฿1,500" && price <= 1500) ||
        (priceFilter === "≤ ฿5,000" && price <= 5000) ||
        (priceFilter === "≤ ฿10,000" && price <= 10000);
      return matchesQuery && matchesLevel && matchesFaculty && matchesStatus && matchesPrice;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return (a.totalPrice ?? 0) - (b.totalPrice ?? 0);
      if (sortBy === "price-desc") return (b.totalPrice ?? 0) - (a.totalPrice ?? 0);
      if (sortBy === "newest") return (b.id > a.id ? 1 : -1);
      return 0;
    });
  }, [searchValue, levelFilter, facultyFilter, statusFilter, priceFilter, sortBy]);

  const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const filterSections: FilterSectionConfig[] = [
    { id: "level", label: "ระดับ", options: levelOptions, value: levelFilter, onChange: handleFilterChange(setLevelFilter) },
    { id: "faculty", label: "คณะ", options: facultyOptions, value: facultyFilter, onChange: handleFilterChange(setFacultyFilter) },
    { id: "status", label: "สถานะการรับสมัคร", options: ["เปิดรับ", "ปิดรับ"], value: statusFilter, onChange: handleFilterChange(setStatusFilter) },
    { id: "price", label: "ราคา", options: ["ฟรี", "≤ ฿1,500", "≤ ฿5,000", "≤ ฿10,000"], value: priceFilter, onChange: handleFilterChange(setPriceFilter) },
  ];

  /* page number list: show at most 5, centered on current page */
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return Array.from({ length: 5 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-col gap-6">
      {showHeading && (
        <div className="flex flex-col gap-2">
          <Breadcrumb items={[{ label: "หลักสูตร" }]} />
          <h1 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            หลักสูตรทั้งหมด
          </h1>
          <p className="text-sm leading-6 text-[var(--ink-muted)]">
            สำรวจหลักสูตรที่เปิดสอนและเปรียบเทียบข้อมูลก่อนตัดสินใจ
          </p>
        </div>
      )}

      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            aria-hidden="true"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-subtle)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="ค้นหาหลักสูตร"
            className="ui-input w-full pl-9"
          />
        </div>

        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition lg:hidden ${
            mobileFiltersOpen || activeFilterCount > 0
              ? "border-[color:var(--primary)] text-[color:var(--primary)]"
              : "border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)]"
          }`}
        >
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
          ตัวกรอง
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--primary)] text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter panel */}
      {mobileFiltersOpen && (
        <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-4 lg:hidden">
          <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
            {filterSections.map((section) => (
              <div key={section.id} className="border-b border-[color:var(--border)] py-3 last:border-0 sm:last:border-b">
                <p className="mb-2 text-xs font-semibold text-[var(--foreground)]">{section.label}</p>
                <div className="flex flex-wrap gap-2">
                  {section.options.map((option) => {
                    const selected = section.value === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => section.onChange(selected ? "" : option)}
                        className={`rounded-full px-3 py-1 text-xs transition ${
                          selected
                            ? "bg-[color:var(--primary)] text-white"
                            : "border border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)]"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-3 flex items-center gap-1 text-xs text-[var(--ink-subtle)] hover:text-[var(--foreground)]"
            >
              <X aria-hidden="true" className="h-3 w-3" />
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      )}

      {/* Desktop: sidebar + cards */}
      <div className="flex items-start gap-8">
        {/* Sidebar (desktop only) */}
        <div className="hidden lg:block">
          <FilterSidebar
            sections={filterSections}
            onClearAll={clearAllFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Cards + pagination */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {filteredPrograms.length > 0 ? (
            <>
              {/* Result count + Sort */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm text-[var(--ink-muted)]">
                  {filteredPrograms.length === programs.length
                    ? `หลักสูตรทั้งหมด ${programs.length} หลักสูตร`
                    : `พบ ${filteredPrograms.length} หลักสูตร`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--ink-subtle)] shrink-0">เรียงตาม</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: "recommended", label: "แนะนำ" },
                      { id: "newest", label: "ใหม่ล่าสุด" },
                      { id: "price-asc", label: "ราคา ↑" },
                      { id: "price-desc", label: "ราคา ↓" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => { setSortBy(opt.id); setCurrentPage(1); }}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          sortBy === opt.id
                            ? "bg-[color:var(--primary)] text-white"
                            : "border border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} detailBasePath={detailBasePath} canSave={false} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-3 border-t border-[color:var(--border)] pt-6 sm:flex-row sm:justify-between">
                  {/* Range text */}
                  <p className="text-sm text-[var(--ink-muted)]">
                    แสดง{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredPrograms.length)}
                    </span>{" "}
                    จาก{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {filteredPrograms.length}
                    </span>{" "}
                    หลักสูตร
                  </p>

                  {/* Page controls */}
                  <nav aria-label="การแบ่งหน้า" className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      aria-label="หน้าก่อนหน้า"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-[var(--ink-muted)] transition hover:border-[color:var(--ring)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                    </button>

                    {pageNumbers[0] > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setCurrentPage(1)}
                          className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-[color:var(--border)] px-2 text-sm text-[var(--ink-muted)] transition hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
                        >
                          1
                        </button>
                        {pageNumbers[0] > 2 && (
                          <span className="px-1 text-sm text-[var(--ink-subtle)]">…</span>
                        )}
                      </>
                    )}

                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition ${
                          page === currentPage
                            ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-white"
                            : "border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                      <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                          <span className="px-1 text-sm text-[var(--ink-subtle)]">…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(totalPages)}
                          className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-[color:var(--border)] px-2 text-sm text-[var(--ink-muted)] transition hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      aria-label="หน้าถัดไป"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-[var(--ink-muted)] transition hover:border-[color:var(--ring)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-8 text-center text-sm text-[var(--ink-muted)]">
              ไม่พบหลักสูตรที่ตรงกับการค้นหา ลองปรับคำค้นหาหรือตัวกรอง
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
