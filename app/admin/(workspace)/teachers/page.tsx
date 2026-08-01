"use client";

import { useMemo, useState } from "react";
import { UserCog } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { teachers } from "@/lib/data/teachers";
import type { Teacher } from "@/lib/discovery/types";
import { getTeacherWorkloads } from "@/lib/admin/mock-academic";

type Row = Teacher & { programCount: number; subjectCount: number; total: number; isHighLoad: boolean };

export default function TeachersListPage() {
  const [search, setSearch] = useState("");

  const rows = useMemo<Row[]>(() => {
    const workloads = getTeacherWorkloads();
    const withWorkload = teachers.map((t) => {
      const w = workloads.find((x) => x.teacherId === t.id);
      return {
        ...t,
        programCount: w?.programCount ?? 0,
        subjectCount: w?.subjectCount ?? 0,
        total: w?.total ?? 0,
        isHighLoad: w?.isHighLoad ?? false,
      };
    });
    // Sort heaviest workload first so a teacher carrying far more than the
    // rest surfaces at the top of the table, not buried in alphabetical order.
    return withWorkload.sort((a, b) => b.total - a.total);
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((t) => t.name.toLowerCase().includes(term));
  }, [rows, search]);

  const columns: Column<Row>[] = [
    { key: "name", header: "ชื่ออาจารย์", cell: (t) => <span className="font-medium">{t.name}</span> },
    { key: "title", header: "ตำแหน่ง/ความเชี่ยวชาญ", cell: (t) => t.title ?? "—", hideOnMobile: true },
    {
      key: "programs",
      header: "หลักสูตร",
      align: "end",
      cell: (t) => <span className="font-mono tabular-nums">{t.programCount}</span>,
      hideOnMobile: true,
    },
    {
      key: "subjects",
      header: "รายวิชา",
      align: "end",
      cell: (t) => <span className="font-mono tabular-nums">{t.subjectCount}</span>,
      hideOnMobile: true,
    },
    {
      key: "workload",
      header: "ภาระงานรวม",
      align: "end",
      cell: (t) => (
        <span className="inline-flex items-center justify-end gap-2">
          <span className="font-mono tabular-nums">{t.total}</span>
          {t.isHighLoad ? <StatusBadge label="ภาระงานสูง" tone="action" /> : null}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="อาจารย์"
        description="อาจารย์ทั้งหมดในระบบ พร้อมภาระงาน — จำนวนหลักสูตรและรายวิชาที่แต่ละคนรับผิดชอบ เรียงจากภาระงานมากไปน้อย"
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหาอาจารย์"
        searchPlaceholder="ค้นหาจากชื่ออาจารย์"
        resultSummary={`แสดง ${filtered.length} จาก ${teachers.length} คน`}
        onReset={search.trim() !== "" ? () => setSearch("") : undefined}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(t) => t.id}
        rowHref={(t) => `/admin/teachers/${t.id}`}
        caption="รายการอาจารย์"
        empty={
          <EmptyState
            icon={UserCog}
            title="ไม่พบอาจารย์ที่ตรงกับคำค้นหา"
            description="ลองค้นหาด้วยชื่ออื่น หรือล้างคำค้นหาเพื่อดูอาจารย์ทั้งหมด"
          />
        }
      />
    </>
  );
}
