"use client";

import { useMemo, useState } from "react";
import { TrendingUp, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { TableToolbar, ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { useStaffSession } from "@/lib/admin/staff-session";
import { getWorkloadRows, type WorkloadRow } from "@/lib/admin/mock-reports";
import { ReportAccessDenied, ReportExportButton } from "../_components/report-chrome";
import { ReportBarChart, type ReportChartRow, type ReportChartSeries } from "../_components/report-bar-chart";

const SERIES: ReportChartSeries[] = [
  { key: "subjectCount", label: "รายวิชา", color: "var(--chart-1)" },
  { key: "programCount", label: "หลักสูตร", color: "var(--chart-3)" },
];

const CHART_ROW_LIMIT = 12;

const LOAD_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: "ทุกระดับภาระงาน" },
  { value: "high", label: "สูงกว่าค่าเฉลี่ย" },
  { value: "normal", label: "ปกติ" },
];

export default function WorkloadReportPage() {
  const { role } = useStaffSession();
  const [search, setSearch] = useState("");
  const [loadFilter, setLoadFilter] = useState(ALL_FILTER_VALUE);

  const allRows = useMemo(() => getWorkloadRows(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allRows
      .filter((r) => !q || r.name.toLowerCase().includes(q))
      .filter((r) => {
        if (loadFilter === ALL_FILTER_VALUE) return true;
        if (loadFilter === "high") return r.isHighLoad;
        return !r.isHighLoad;
      });
  }, [allRows, search, loadFilter]);

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader title="ภาระงานอาจารย์" />
        <ReportAccessDenied />
      </>
    );
  }

  const highLoadCount = allRows.filter((r) => r.isHighLoad).length;
  const average = allRows.length > 0 ? allRows.reduce((sum, r) => sum + r.total, 0) / allRows.length : 0;

  const chartRows = [...allRows].sort((a, b) => b.total - a.total).slice(0, CHART_ROW_LIMIT);
  const chartData: ReportChartRow[] = chartRows.map((r) => ({
    categoryLabel: r.name,
    subjectCount: r.subjectCount,
    programCount: r.programCount,
  }));

  const columns: Column<WorkloadRow>[] = [
    {
      key: "name",
      header: "อาจารย์",
      truncate: "max-w-[28ch]",
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{r.name}</p>
          {r.title ? <p className="truncate text-xs text-[var(--ink-subtle)]">{r.title}</p> : null}
        </div>
      ),
    },
    {
      key: "programCount",
      header: "หลักสูตร",
      align: "end",
      width: "w-24",
      cell: (r) => <span className="font-mono tabular-nums">{r.programCount}</span>,
    },
    {
      key: "subjectCount",
      header: "รายวิชา",
      align: "end",
      width: "w-24",
      cell: (r) => <span className="font-mono tabular-nums">{r.subjectCount}</span>,
    },
    {
      key: "total",
      header: "รวมภาระงาน",
      align: "end",
      width: "w-28",
      cell: (r) => <span className="font-mono font-semibold tabular-nums">{r.total}</span>,
    },
    {
      key: "learners",
      header: "ผู้เรียนทั้งหมด",
      align: "end",
      width: "w-32",
      cell: (r) => <span className="font-mono tabular-nums">{r.learners} คน</span>,
    },
    {
      key: "load",
      header: "ระดับภาระงาน",
      width: "w-40",
      cell: (r) =>
        r.isHighLoad ? (
          <StatusBadge label="สูงกว่าค่าเฉลี่ย" tone="action" />
        ) : (
          <StatusBadge label="ปกติ" tone="neutral" />
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="ภาระงานอาจารย์"
        description="จำนวนหลักสูตรและรายวิชาที่อาจารย์แต่ละคนรับผิดชอบ พร้อมจำนวนผู้เรียนทั้งหมดที่ดูแล"
        actions={<ReportExportButton />}
      />

      <Panel title="ภาพรวม">
        <p className="text-base leading-7 text-pretty">
          ภาระงานเฉลี่ยของอาจารย์ทั้งหมด {allRows.length} คนอยู่ที่ประมาณ{" "}
          <span className="font-mono font-semibold">{average.toFixed(1)}</span> หลักสูตร/รายวิชาต่อคน — มี{" "}
          <span className="font-mono font-semibold text-[var(--primary)]">{highLoadCount}</span> คนที่รับผิดชอบสูงกว่าค่าเฉลี่ยอย่างชัดเจน
        </p>
      </Panel>

      <Panel
        title="อันดับภาระงานสูงสุด"
        description={
          allRows.length > CHART_ROW_LIMIT
            ? `แสดง ${CHART_ROW_LIMIT} อันดับแรกจากทั้งหมด ${allRows.length} คน เรียงจากภาระงานมากไปน้อย ดูรายชื่อทั้งหมดในตารางด้านล่าง`
            : "เรียงจากภาระงานมากไปน้อย"
        }
      >
        {chartData.length > 0 ? (
          <ReportBarChart data={chartData} series={SERIES} valueFormatter={(v) => `${v} รายการ`} />
        ) : (
          <EmptyState icon={UsersRound} title="ยังไม่มีข้อมูลอาจารย์" description="เมื่อมีการมอบหมายหลักสูตรหรือรายวิชาให้อาจารย์ ข้อมูลจะปรากฏที่นี่" />
        )}
      </Panel>

      <Panel flush>
        <div className="border-b border-[var(--border)] px-5 py-4">
          <TableToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchLabel="ค้นหาอาจารย์"
            searchPlaceholder="ค้นหาชื่ออาจารย์"
            filters={[{ id: "load", label: "ระดับภาระงาน", value: loadFilter, onChange: setLoadFilter, options: LOAD_FILTER_OPTIONS }]}
            resultSummary={`แสดง ${filtered.length} จาก ${allRows.length} คน`}
            onReset={() => {
              setSearch("");
              setLoadFilter(ALL_FILTER_VALUE);
            }}
          />
        </div>
        <div className="p-5 pt-4">
          <DataTable
            columns={columns}
            rows={filtered}
            rowKey={(r) => r.teacherId}
            caption="ภาระงานอาจารย์ทั้งหมด"
            empty={
              <EmptyState icon={TrendingUp} title="ไม่พบอาจารย์ที่ตรงกับตัวกรอง" description="ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง" />
            }
          />
        </div>
      </Panel>
    </>
  );
}
