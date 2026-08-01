"use client";

import { useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { programs } from "@/lib/data/programs";
import type { Program } from "@/lib/discovery/types";
import { formatTHB } from "@/lib/finance/payment-state";
import {
  catalogueStatusLabel,
  catalogueStatusTone,
  facultyOptions,
  isAtCapacity,
  programLevelOptions,
} from "@/lib/admin/mock-academic";

export default function ProgramsListPage() {
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState(ALL_FILTER_VALUE);
  const [level, setLevel] = useState(ALL_FILTER_VALUE);
  const [status, setStatus] = useState(ALL_FILTER_VALUE);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return programs.filter((p) => {
      if (term && !p.name.toLowerCase().includes(term) && !p.slug.toLowerCase().includes(term)) return false;
      if (faculty !== ALL_FILTER_VALUE && p.faculty !== faculty) return false;
      if (level !== ALL_FILTER_VALUE && p.level !== level) return false;
      if (status !== ALL_FILTER_VALUE && (p.status ?? "open") !== status) return false;
      return true;
    });
  }, [search, faculty, level, status]);

  const isFiltered = search.trim() !== "" || faculty !== ALL_FILTER_VALUE || level !== ALL_FILTER_VALUE || status !== ALL_FILTER_VALUE;

  const columns: Column<Program>[] = [
    { key: "name", header: "ชื่อหลักสูตร", truncate: "max-w-[34ch]", cell: (p) => <span className="font-medium">{p.name}</span> },
    { key: "level", header: "ระดับ", cell: (p) => p.level, hideOnMobile: true },
    { key: "faculty", header: "คณะ", cell: (p) => p.faculty, hideOnMobile: true, truncate: "max-w-[20ch]" },
    {
      key: "credits",
      header: "หน่วยกิต",
      cell: (p) => <span className="font-mono tabular-nums">{p.credits}</span>,
      align: "end",
      hideOnMobile: true,
    },
    {
      key: "subjects",
      header: "จำนวนวิชา",
      cell: (p) => <span className="font-mono tabular-nums">{p.subjectIds?.length ?? 0}</span>,
      align: "end",
      hideOnMobile: true,
    },
    {
      key: "seats",
      header: "ที่นั่ง",
      align: "end",
      cell: (p) => {
        const atCapacity = isAtCapacity(p.seats, p.enrolledCount);
        return (
          <span className="inline-flex items-center gap-2 justify-end">
            <span className="font-mono tabular-nums whitespace-nowrap">
              {p.enrolledCount ?? 0} / {p.seats ?? "—"}
            </span>
            {atCapacity ? <StatusBadge label="เต็มแล้ว" tone="action" /> : null}
          </span>
        );
      },
    },
    {
      key: "price",
      header: "ราคา",
      align: "end",
      cell: (p) => <span className="font-mono tabular-nums">{typeof p.totalPrice === "number" ? formatTHB(p.totalPrice) : "—"}</span>,
    },
    {
      key: "status",
      header: "สถานะ",
      cell: (p) => {
        const s = p.status ?? "open";
        return <StatusBadge label={catalogueStatusLabel[s]} tone={catalogueStatusTone[s]} />;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="หลักสูตร"
        description="หลักสูตรทั้งหมดในระบบ Credit Bank — ค้นหา กรอง และเปิดดูรายละเอียดเพื่อแก้ไขข้อมูล ที่นั่ง และผู้สอน"
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหาหลักสูตร"
        searchPlaceholder="ค้นหาจากชื่อหลักสูตรหรือ slug"
        filters={[
          {
            id: "faculty",
            label: "คณะ",
            value: faculty,
            onChange: setFaculty,
            options: [{ value: ALL_FILTER_VALUE, label: "ทุกคณะ" }, ...facultyOptions.map((f) => ({ value: f, label: f }))],
          },
          {
            id: "level",
            label: "ระดับ",
            value: level,
            onChange: setLevel,
            options: [{ value: ALL_FILTER_VALUE, label: "ทุกระดับ" }, ...programLevelOptions.map((l) => ({ value: l, label: l }))],
          },
          {
            id: "status",
            label: "สถานะ",
            value: status,
            onChange: setStatus,
            options: [
              { value: ALL_FILTER_VALUE, label: "ทุกสถานะ" },
              { value: "open", label: catalogueStatusLabel.open },
              { value: "closed", label: catalogueStatusLabel.closed },
            ],
          },
        ]}
        resultSummary={`แสดง ${filtered.length} จาก ${programs.length} หลักสูตร`}
        onReset={
          isFiltered
            ? () => {
                setSearch("");
                setFaculty(ALL_FILTER_VALUE);
                setLevel(ALL_FILTER_VALUE);
                setStatus(ALL_FILTER_VALUE);
              }
            : undefined
        }
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(p) => p.id}
        rowHref={(p) => `/admin/programs/${p.id}`}
        caption="รายการหลักสูตร"
        empty={
          <EmptyState
            icon={GraduationCap}
            title="ไม่พบหลักสูตรที่ตรงกับตัวกรอง"
            description="ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองเพื่อดูหลักสูตรทั้งหมด"
          />
        }
      />
    </>
  );
}
