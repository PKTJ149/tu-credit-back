"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStaffSession } from "@/lib/admin/staff-session";
import {
  enrollmentDimensionLabel,
  enrollmentTermOptions,
  getEnrollmentBreakdown,
  type EnrollmentBreakdownRow,
  type EnrollmentDimension,
} from "@/lib/admin/mock-reports";
import { ReportAccessDenied, ReportExportButton } from "../_components/report-chrome";
import { ReportBarChart, type ReportChartRow, type ReportChartSeries } from "../_components/report-bar-chart";

const DIMENSIONS: EnrollmentDimension[] = ["program", "subject", "term", "faculty"];

const SERIES: ReportChartSeries[] = [
  { key: "active", label: "กำลังเรียน", color: "var(--chart-1)" },
  { key: "awaitingPayment", label: "รอชำระเงิน", color: "var(--chart-3)" },
  { key: "closed", label: "เสร็จสิ้น/ยกเลิก", color: "var(--chart-4)" },
];

const CHART_ROW_LIMIT = 12;

export default function EnrollmentReportPage() {
  const { role } = useStaffSession();
  const [dimension, setDimension] = useState<EnrollmentDimension>("program");
  const [term, setTerm] = useState<string>(ALL_FILTER_VALUE);

  const rows = useMemo(
    () => getEnrollmentBreakdown(dimension, term === ALL_FILTER_VALUE ? undefined : term),
    [dimension, term],
  );

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader title="ยอดลงทะเบียน" />
        <ReportAccessDenied />
      </>
    );
  }

  const totalRegistrations = rows.reduce((sum, r) => sum + r.total, 0);
  const totalUnpaid = rows.reduce((sum, r) => sum + r.awaitingPayment, 0);
  const unpaidShare = totalRegistrations > 0 ? Math.round((totalUnpaid / totalRegistrations) * 100) : 0;

  const chartData: ReportChartRow[] = rows.slice(0, CHART_ROW_LIMIT).map((r) => ({
    categoryLabel: r.label,
    active: r.active,
    awaitingPayment: r.awaitingPayment,
    closed: r.closed,
  }));

  const columns: Column<EnrollmentBreakdownRow>[] = [
    {
      key: "label",
      header: dimension === "program" || dimension === "subject" ? "รายการ" : enrollmentDimensionLabel[dimension].replace("ตาม", ""),
      truncate: "max-w-[30ch]",
      cell: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{r.label}</p>
          {r.sublabel ? <p className="truncate text-xs text-[var(--ink-subtle)]">{r.sublabel}</p> : null}
        </div>
      ),
    },
    {
      key: "total",
      header: "ลงทะเบียนทั้งหมด",
      align: "end",
      width: "w-32",
      cell: (r) => <span className="font-mono tabular-nums">{r.total}</span>,
    },
    {
      key: "active",
      header: "กำลังเรียน",
      align: "end",
      width: "w-28",
      hideOnMobile: true,
      cell: (r) => <span className="font-mono tabular-nums">{r.active}</span>,
    },
    {
      key: "awaitingPayment",
      header: "รอชำระเงิน",
      align: "end",
      width: "w-28",
      cell: (r) => (
        <span className={r.awaitingPayment > 0 ? "font-mono font-medium tabular-nums text-[var(--primary)]" : "font-mono tabular-nums text-[var(--ink-subtle)]"}>
          {r.awaitingPayment}
        </span>
      ),
    },
    {
      key: "completed",
      header: "เสร็จสิ้น",
      align: "end",
      width: "w-24",
      hideOnMobile: true,
      cell: (r) => <span className="font-mono tabular-nums text-[var(--ink-muted)]">{r.completed}</span>,
    },
    {
      key: "cancelled",
      header: "ยกเลิก",
      align: "end",
      width: "w-24",
      hideOnMobile: true,
      cell: (r) => <span className="font-mono tabular-nums text-[var(--ink-muted)]">{r.cancelled}</span>,
    },
    {
      key: "credits",
      header: "หน่วยกิตรวม",
      align: "end",
      width: "w-28",
      cell: (r) => <span className="font-mono tabular-nums">{r.credits}</span>,
    },
  ];

  return (
    <>
      <PageHeader
        title="ยอดลงทะเบียน"
        description="จำนวนการลงทะเบียนแยกตามมุมมองที่เลือก พร้อมสัดส่วนสถานะการชำระเงิน — ตัวเลข “ลงทะเบียนแล้ว” อย่างเดียวไม่บอกว่าใครจ่ายเงินแล้วบ้าง"
        actions={<ReportExportButton />}
      />

      <Panel
        title="ตัวกรอง"
        actions={
          <div className="flex items-center gap-2">
            <Label htmlFor="term-filter" className="text-xs text-[var(--ink-subtle)]">
              ภาคการศึกษา
            </Label>
            <Select value={term} onValueChange={setTerm}>
              <SelectTrigger id="term-filter" className="h-9 w-48" size="sm">
                <SelectValue placeholder="ทุกภาคการศึกษา" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_FILTER_VALUE}>ทุกภาคการศึกษา</SelectItem>
                {enrollmentTermOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        <Tabs value={dimension} onValueChange={(v) => setDimension(v as EnrollmentDimension)}>
          <div className="overflow-x-auto">
            <TabsList>
              {DIMENSIONS.map((d) => (
                <TabsTrigger key={d} value={d} className="shrink-0">
                  {enrollmentDimensionLabel[d]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
        <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)] text-pretty">
          รวม {totalRegistrations} รายการลงทะเบียน{term !== ALL_FILTER_VALUE ? ` ในภาค ${term}` : ""} — {unpaidShare}%
          ({totalUnpaid} รายการ) ยังรอการชำระเงิน
        </p>
      </Panel>

      <Panel
        title={`ยอดลงทะเบียน${enrollmentDimensionLabel[dimension]}`}
        description={
          rows.length > CHART_ROW_LIMIT
            ? `แสดง ${CHART_ROW_LIMIT} อันดับแรกจากทั้งหมด ${rows.length} รายการ เรียงจากยอดลงทะเบียนมากไปน้อย ดูรายการทั้งหมดในตารางด้านล่าง`
            : "เรียงจากยอดลงทะเบียนมากไปน้อย"
        }
      >
        {chartData.length > 0 ? (
          <ReportBarChart data={chartData} series={SERIES} valueFormatter={(v) => `${v} คน`} />
        ) : (
          <EmptyState icon={ClipboardList} title="ไม่มีข้อมูลในเงื่อนไขนี้" description="ลองเปลี่ยนภาคการศึกษาหรือมุมมองที่เลือก" />
        )}
      </Panel>

      <Panel title="รายละเอียดทั้งหมด" flush>
        <div className="p-5">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => r.key}
            caption={`ยอดลงทะเบียน${enrollmentDimensionLabel[dimension]}`}
            empty={
              <EmptyState
                icon={ClipboardList}
                title="ไม่มีข้อมูลในเงื่อนไขนี้"
                description="ลองเปลี่ยนภาคการศึกษาหรือมุมมองที่เลือกด้านบน"
              />
            }
          />
        </div>
      </Panel>
    </>
  );
}
