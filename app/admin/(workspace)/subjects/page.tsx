"use client";

import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { subjects } from "@/lib/data/subjects";
import type { Subject } from "@/lib/discovery/types";
import { formatTHB } from "@/lib/finance/payment-state";
import {
  catalogueStatusLabel,
  catalogueStatusTone,
  facultyOptions,
  isAtCapacity,
  studyModeLabel,
  subjectCategoryOptions,
  subjectEnrolment,
} from "@/lib/admin/mock-academic";

export default function SubjectsListPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_FILTER_VALUE);
  const [studyMode, setStudyMode] = useState(ALL_FILTER_VALUE);
  const [faculty, setFaculty] = useState(ALL_FILTER_VALUE);
  const [status, setStatus] = useState(ALL_FILTER_VALUE);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return subjects.filter((s) => {
      if (term && !s.name.toLowerCase().includes(term) && !(s.code ?? "").toLowerCase().includes(term)) return false;
      if (category !== ALL_FILTER_VALUE && s.category !== category) return false;
      if (studyMode !== ALL_FILTER_VALUE && s.studyMode !== studyMode) return false;
      if (faculty !== ALL_FILTER_VALUE && s.faculty !== faculty) return false;
      if (status !== ALL_FILTER_VALUE && (s.status ?? "open") !== status) return false;
      return true;
    });
  }, [search, category, studyMode, faculty, status]);

  const isFiltered =
    search.trim() !== "" ||
    category !== ALL_FILTER_VALUE ||
    studyMode !== ALL_FILTER_VALUE ||
    faculty !== ALL_FILTER_VALUE ||
    status !== ALL_FILTER_VALUE;

  const columns: Column<Subject>[] = [
    {
      key: "code",
      header: "รหัสวิชา",
      cell: (s) => (
        <span className="font-mono">
          {s.code ?? "—"}
          {/* The first column becomes the row link; a screen reader announcing
              just the code loses the one thing that identifies the subject. */}
          <span className="sr-only"> {s.name}</span>
        </span>
      ),
      width: "w-24",
    },
    { key: "name", header: "ชื่อวิชา", truncate: "max-w-[24ch]", cell: (s) => <span className="font-medium">{s.name}</span> },
    { key: "category", header: "หมวดวิชา", cell: (s) => s.category ?? "—", hideOnMobile: true },
    {
      key: "credits",
      header: "หน่วยกิต",
      cell: (s) => <span className="font-mono tabular-nums">{s.credits}</span>,
      align: "end",
      hideOnMobile: true,
    },
    { key: "faculty", header: "คณะ", cell: (s) => s.faculty, hideOnMobile: true, truncate: "max-w-[16ch]" },
    {
      key: "studyMode",
      header: "รูปแบบการเรียน",
      cell: (s) => (s.studyMode ? studyModeLabel[s.studyMode] : "—"),
      hideOnMobile: true,
    },
    {
      key: "seats",
      header: "ที่นั่ง",
      align: "end",
      cell: (s) => {
        // Goes through the shared derivation so this column and the capacity
        // screen never report different numbers for the same subject.
        const { enrolled, isDerived } = subjectEnrolment(s);
        const atCapacity = isAtCapacity(s.seats, enrolled);
        return (
          <span className="inline-flex items-center justify-end gap-2">
            <span
              className="font-mono tabular-nums whitespace-nowrap"
              title={isDerived ? "นับจากรายการลงทะเบียนที่ยังใช้งานอยู่ (คลังรายวิชาไม่ได้บันทึกจำนวนผู้ลงทะเบียนไว้)" : undefined}
            >
              {enrolled} / {s.seats ?? "—"}
              {isDerived ? <span className="text-[var(--ink-subtle)]">*</span> : null}
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
      cell: (s) => <span className="font-mono tabular-nums">{typeof s.price === "number" ? formatTHB(s.price) : "—"}</span>,
    },
    {
      key: "status",
      header: "สถานะ",
      cell: (s) => {
        const st = s.status ?? "open";
        return <StatusBadge label={catalogueStatusLabel[st]} tone={catalogueStatusTone[st]} />;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="รายวิชา"
        description="รายวิชาทั้งหมดในระบบ Credit Bank — ค้นหา กรอง และเปิดดูรายละเอียดเพื่อแก้ไขข้อมูล ตารางเรียน และผู้สอน"
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหารายวิชา"
        searchPlaceholder="ค้นหาจากชื่อวิชาหรือรหัสวิชา"
        filters={[
          {
            id: "category",
            label: "หมวดวิชา",
            value: category,
            onChange: setCategory,
            options: [{ value: ALL_FILTER_VALUE, label: "ทุกหมวด" }, ...subjectCategoryOptions.map((c) => ({ value: c, label: c }))],
          },
          {
            id: "study-mode",
            label: "รูปแบบการเรียน",
            value: studyMode,
            onChange: setStudyMode,
            options: [
              { value: ALL_FILTER_VALUE, label: "ทุกรูปแบบ" },
              { value: "online", label: studyModeLabel.online },
              { value: "onsite", label: studyModeLabel.onsite },
              { value: "hybrid", label: studyModeLabel.hybrid },
            ],
          },
          {
            id: "faculty",
            label: "คณะ",
            value: faculty,
            onChange: setFaculty,
            options: [{ value: ALL_FILTER_VALUE, label: "ทุกคณะ" }, ...facultyOptions.map((f) => ({ value: f, label: f }))],
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
        resultSummary={`แสดง ${filtered.length} จาก ${subjects.length} รายวิชา`}
        onReset={
          isFiltered
            ? () => {
                setSearch("");
                setCategory(ALL_FILTER_VALUE);
                setStudyMode(ALL_FILTER_VALUE);
                setFaculty(ALL_FILTER_VALUE);
                setStatus(ALL_FILTER_VALUE);
              }
            : undefined
        }
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(s) => s.id}
        rowHref={(s) => `/admin/subjects/${s.id}`}
        caption="รายการรายวิชา"
        empty={
          <EmptyState
            icon={BookOpen}
            title="ไม่พบรายวิชาที่ตรงกับตัวกรอง"
            description="ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองเพื่อดูรายวิชาทั้งหมด"
          />
        }
      />
    </>
  );
}
