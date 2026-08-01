"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, Info, Layers } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge, type StatusTone } from "@/components/admin/status-badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ITEM_TYPE_LABEL } from "@/lib/admin/mock-registrations";
import {
  capacityLevel,
  getCapacityItems,
  type CapacityItem,
  type CapacityLevel,
} from "@/lib/admin/mock-schedule";
import { SeatCell } from "./seat-cell";

const LEVEL_LABEL: Record<CapacityLevel, string> = {
  over: "เกินที่นั่ง",
  "near-full": "ใกล้เต็ม",
  healthy: "ปกติ",
};

const LEVEL_TONE: Record<CapacityLevel, StatusTone> = {
  over: "critical",
  "near-full": "pending",
  healthy: "neutral",
};

const LEVEL_FILL: Record<CapacityLevel, string> = {
  over: "var(--destructive)",
  "near-full": "var(--secondary)",
  healthy: "var(--ink-subtle)",
};

const LEVEL_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: "ทุกระดับ" },
  { value: "over", label: LEVEL_LABEL.over },
  { value: "near-full", label: LEVEL_LABEL["near-full"] },
  { value: "healthy", label: LEVEL_LABEL.healthy },
];

const TYPE_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: "ทุกประเภท" },
  { value: "program", label: ITEM_TYPE_LABEL.program },
  { value: "subject", label: ITEM_TYPE_LABEL.subject },
];

const LEVEL_RANK: Record<CapacityLevel, number> = { over: 0, "near-full": 1, healthy: 2 };

function utilizationPercent(seats: number, enrolled: number): number {
  if (seats <= 0) return enrolled > 0 ? 100 : 0;
  return Math.round((enrolled / seats) * 100);
}

export default function CapacityPage() {
  const [items, setItems] = useState<CapacityItem[]>(() => getCapacityItems());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(ALL_FILTER_VALUE);
  const [levelFilter, setLevelFilter] = useState(ALL_FILTER_VALUE);

  const overCount = useMemo(() => items.filter((i) => capacityLevel(i.seats, i.enrolled) === "over").length, [items]);
  const nearFullCount = useMemo(
    () => items.filter((i) => capacityLevel(i.seats, i.enrolled) === "near-full").length,
    [items],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items
      .filter((i) => typeFilter === ALL_FILTER_VALUE || i.type === typeFilter)
      .filter((i) => levelFilter === ALL_FILTER_VALUE || capacityLevel(i.seats, i.enrolled) === levelFilter)
      .filter((i) => !q || [i.name, i.code].some((v) => v?.toLowerCase().includes(q)))
      .sort((a, b) => {
        const rankDiff = LEVEL_RANK[capacityLevel(a.seats, a.enrolled)] - LEVEL_RANK[capacityLevel(b.seats, b.enrolled)];
        if (rankDiff !== 0) return rankDiff;
        const utilDiff = utilizationPercent(b.seats, b.enrolled) - utilizationPercent(a.seats, a.enrolled);
        if (utilDiff !== 0) return utilDiff;
        return a.name.localeCompare(b.name, "th");
      });
  }, [items, search, typeFilter, levelFilter]);

  const isFiltered = search.trim() !== "" || typeFilter !== ALL_FILTER_VALUE || levelFilter !== ALL_FILTER_VALUE;

  function handleSaveSeats(item: CapacityItem, newSeats: number) {
    setItems((prev) => prev.map((i) => (i.id === item.id && i.type === item.type ? { ...i, seats: newSeats } : i)));
    if (newSeats < item.enrolled) {
      toast.warning(`ลดที่นั่งของ "${item.name}" เหลือ ${newSeats} ที่แล้ว`, {
        description: `ยังมีผู้ลงทะเบียนอยู่ ${item.enrolled} คน ระบบจะไม่รับผู้ลงทะเบียนใหม่จนกว่าจำนวนจะลดลง`,
      });
    } else {
      toast.success(`อัปเดตจำนวนที่นั่งของ "${item.name}" เป็น ${newSeats} ที่แล้ว`);
    }
  }

  const columns: Column<CapacityItem>[] = [
    {
      key: "type",
      header: "ประเภท",
      width: "w-24",
      cell: (row) => (
        <span className="inline-flex w-fit items-center rounded-full border border-[var(--border)] px-2 py-0.5 text-xs font-medium text-[var(--ink-muted)]">
          {ITEM_TYPE_LABEL[row.type]}
        </span>
      ),
    },
    {
      key: "name",
      truncate: "max-w-[30ch]",
      header: "รายการ",
      cell: (row) => (
        <Link
          href={row.href}
          className="-mx-1 inline-flex flex-col rounded px-1 py-0.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span className="font-medium hover:underline">{row.name}</span>
          {row.code ? <span className="text-xs text-[var(--ink-subtle)]">{row.code}</span> : null}
        </Link>
      ),
    },
    {
      key: "seats",
      header: "ที่นั่งทั้งหมด",
      width: "w-40",
      cell: (row) => <SeatCell item={row} onSave={(next) => handleSaveSeats(row, next)} />,
    },
    {
      key: "enrolled",
      header: "ลงทะเบียนแล้ว",
      align: "end",
      width: "w-32",
      cell: (row) => (
        <span className="inline-flex items-center justify-end gap-1 font-mono tabular-nums">
          {row.enrolled}
          {row.enrolledIsDerived ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="inline-flex text-[var(--ink-subtle)]">
                  <Info className="size-3.5" aria-hidden />
                  <span className="sr-only">คำนวณจากการลงทะเบียน ไม่ใช่ตัวเลขที่บันทึกไว้โดยตรง</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64 text-pretty">
                รายวิชานี้ไม่มีจำนวนผู้ลงทะเบียนบันทึกไว้โดยตรง ตัวเลขนี้คำนวณจากรายการลงทะเบียนจริงที่มีอยู่ในระบบแทน
              </TooltipContent>
            </Tooltip>
          ) : null}
        </span>
      ),
    },
    {
      key: "remaining",
      header: "คงเหลือ",
      align: "end",
      width: "w-24",
      cell: (row) => {
        const remaining = row.seats - row.enrolled;
        return (
          <span
            className={
              remaining < 0
                ? "font-mono font-semibold tabular-nums text-[var(--destructive)]"
                : "font-mono tabular-nums text-[var(--ink-muted)]"
            }
          >
            {remaining}
          </span>
        );
      },
    },
    {
      key: "utilization",
      header: "การใช้ที่นั่ง",
      width: "w-44",
      cell: (row) => {
        const level = capacityLevel(row.seats, row.enrolled);
        const pct = utilizationPercent(row.seats, row.enrolled);
        return (
          <div className="space-y-1.5">
            <StatusBadge label={`${LEVEL_LABEL[level]} · ${pct}%`} tone={LEVEL_TONE[level]} />
            <div
              role="progressbar"
              aria-valuenow={Math.min(pct, 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`การใช้ที่นั่งของ ${row.name}`}
              className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-strong)]"
            >
              <div
                className="h-full rounded-full transition-[width] duration-200"
                style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: LEVEL_FILL[level] }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "waitlist",
      header: "คิวรอที่นั่ง",
      hideOnMobile: true,
      width: "w-32",
      cell: (row) => (
        <Link
          href="/admin/waitlist"
          className="inline-flex items-center gap-1 rounded text-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {row.waitlistCount > 0 ? (
            <>
              <span className="font-medium text-[var(--primary)]">รอ {row.waitlistCount} คน</span>
              <ArrowRight className="size-3.5 text-[var(--primary)]" aria-hidden />
            </>
          ) : (
            <span className="text-[var(--ink-subtle)]">ไม่มีคิวรอ</span>
          )}
        </Link>
      ),
    },
  ];

  return (
    <TooltipProvider>
      <PageHeader
        title="ที่นั่งและความจุ"
        description={
          overCount > 0
            ? `มี ${overCount} รายการเกินจำนวนที่นั่งแล้ว และอีก ${nearFullCount} รายการใกล้เต็ม จัดเรียงไว้บนสุด`
            : nearFullCount > 0
              ? `ไม่มีรายการใดเกินที่นั่ง แต่มี ${nearFullCount} รายการใกล้เต็มที่ควรติดตาม`
              : "ทุกรายการยังมีที่นั่งเพียงพอ"
        }
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="ค้นหาชื่อหรือรหัสวิชา"
        filters={[
          { id: "type", label: "ประเภท", value: typeFilter, onChange: setTypeFilter, options: TYPE_FILTER_OPTIONS },
          { id: "level", label: "ระดับที่นั่ง", value: levelFilter, onChange: setLevelFilter, options: LEVEL_FILTER_OPTIONS },
        ]}
        resultSummary={`แสดง ${filtered.length} จาก ${items.length} รายการ`}
        onReset={
          isFiltered
            ? () => {
                setSearch("");
                setTypeFilter(ALL_FILTER_VALUE);
                setLevelFilter(ALL_FILTER_VALUE);
              }
            : undefined
        }
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => `${row.type}-${row.id}`}
        caption="ที่นั่งและความจุของหลักสูตรและรายวิชาทั้งหมด"
        empty={
          <EmptyState
            icon={Layers}
            title="ไม่พบรายการที่ตรงกับตัวกรอง"
            description="ลองล้างตัวกรองหรือค้นหาด้วยคำอื่น"
          />
        }
      />
    </TooltipProvider>
  );
}
