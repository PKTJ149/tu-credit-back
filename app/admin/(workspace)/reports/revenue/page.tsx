"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CircleDollarSign } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStaffSession } from "@/lib/admin/staff-session";
import { formatThaiDate } from "@/lib/admin/format";
import { getStudentName } from "@/lib/admin/mock-data";
import { formatTHB } from "@/lib/finance/payment-state";
import {
  enrollmentTermOptions,
  getOverduePayments,
  getRevenueBreakdown,
  getRevenueTotals,
  itemTypeLabel,
  revenueBucketLabel,
  type OverduePayment,
  type RevenueBreakdownRow,
} from "@/lib/admin/mock-reports";
import { ReportAccessDenied, ReportExportButton } from "../_components/report-chrome";
import { ReportBarChart, type ReportChartRow, type ReportChartSeries } from "../_components/report-bar-chart";

type Dimension = "program" | "term";

const DIMENSION_LABEL: Record<Dimension, string> = { program: "ตามหลักสูตร", term: "ตามภาคการศึกษา" };

const SERIES: ReportChartSeries[] = [
  { key: "confirmed", label: revenueBucketLabel.confirmed, color: "var(--chart-1)" },
  { key: "outstanding", label: revenueBucketLabel.outstanding, color: "var(--chart-3)" },
  { key: "refunded", label: revenueBucketLabel.refunded, color: "var(--chart-4)" },
];

const CHART_ROW_LIMIT = 12;

export default function RevenueReportPage() {
  const { role } = useStaffSession();
  const [dimension, setDimension] = useState<Dimension>("program");
  const [term, setTerm] = useState<string>(ALL_FILTER_VALUE);

  const totals = useMemo(() => getRevenueTotals(), []);
  const overdue = useMemo(() => getOverduePayments(), []);

  const rows = useMemo(
    () => getRevenueBreakdown(dimension, term === ALL_FILTER_VALUE ? undefined : term),
    [dimension, term],
  );

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader title="รายได้" />
        <ReportAccessDenied />
      </>
    );
  }

  const confirmedShare = totals.total > 0 ? Math.round((totals.confirmed / totals.total) * 100) : 0;
  const overdueTotal = overdue.reduce((sum, p) => sum + p.amount, 0);

  const chartData: ReportChartRow[] = rows.slice(0, CHART_ROW_LIMIT).map((r) => ({
    categoryLabel: r.label,
    confirmed: r.confirmed,
    outstanding: r.outstanding,
    refunded: r.refunded,
  }));

  const columns: Column<RevenueBreakdownRow>[] = [
    { key: "label", header: dimension === "program" ? "หลักสูตร" : "ภาคการศึกษา", truncate: "max-w-[32ch]", cell: (r) => r.label },
    {
      key: "confirmed",
      header: revenueBucketLabel.confirmed,
      align: "end",
      width: "w-36",
      cell: (r) => <span className="font-mono tabular-nums">{formatTHB(r.confirmed)}</span>,
    },
    {
      key: "outstanding",
      header: revenueBucketLabel.outstanding,
      align: "end",
      width: "w-36",
      cell: (r) => (
        <span className={r.outstanding > 0 ? "font-mono font-medium tabular-nums text-[var(--primary)]" : "font-mono tabular-nums text-[var(--ink-subtle)]"}>
          {formatTHB(r.outstanding)}
        </span>
      ),
    },
    {
      key: "refunded",
      header: revenueBucketLabel.refunded,
      align: "end",
      width: "w-32",
      hideOnMobile: true,
      cell: (r) => <span className="font-mono tabular-nums text-[var(--ink-muted)]">{formatTHB(r.refunded)}</span>,
    },
    {
      key: "total",
      header: "รวม",
      align: "end",
      width: "w-36",
      cell: (r) => <span className="font-mono font-semibold tabular-nums">{formatTHB(r.total)}</span>,
    },
  ];

  const overdueColumns: Column<OverduePayment>[] = [
    { key: "reference", header: "เลขที่อ้างอิง", width: "w-40", cell: (p) => <span className="font-mono text-sm">{p.reference}</span> },
    { key: "student", header: "ผู้เรียน", cell: (p) => getStudentName(p.studentId) },
    {
      key: "item",
      header: "รายการ",
      truncate: "max-w-[28ch]",
      cell: (p) => (
        <div className="min-w-0">
          <p className="truncate">{p.itemName}</p>
          <p className="text-xs text-[var(--ink-subtle)]">{itemTypeLabel[p.itemType]}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "จำนวนเงิน",
      align: "end",
      width: "w-32",
      cell: (p) => <span className="font-mono tabular-nums">{formatTHB(p.amount)}</span>,
    },
    { key: "dueDate", header: "ครบกำหนด", width: "w-28", hideOnMobile: true, cell: (p) => formatThaiDate(p.dueDate) },
    {
      key: "daysOverdue",
      header: "เกินกำหนดมาแล้ว",
      align: "end",
      width: "w-32",
      cell: (p) => (
        <span className="inline-flex items-center justify-end gap-1 font-mono font-medium tabular-nums text-[var(--destructive)]">
          <AlertTriangle className="size-3.5 shrink-0" aria-hidden />
          {p.daysOverdue} วัน
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="รายได้" description="ยอดรับชำระที่ยืนยันแล้ว ค้างชำระ และคืนเงิน แยกตามหลักสูตรและภาคการศึกษา" actions={<ReportExportButton />} />

      <Panel title="ภาพรวม">
        <p className="text-base leading-7 text-pretty">
          ยืนยันแล้ว <span className="font-mono font-semibold">{formatTHB(totals.confirmed)}</span> จากยอดที่เกี่ยวข้องทั้งหมด{" "}
          <span className="font-mono font-semibold">{formatTHB(totals.total)}</span> ({confirmedShare}%) — ยังมีเงินค้างชำระ{" "}
          <span className="font-mono font-semibold text-[var(--primary)]">{formatTHB(totals.outstanding)}</span>
          {overdue.length > 0 ? (
            <>
              {" "}โดย <span className="font-mono font-semibold text-[var(--destructive)]">{formatTHB(overdueTotal)}</span> ใน{" "}
              {overdue.length} รายการเลยกำหนดชำระแล้ว
            </>
          ) : (
            " และไม่มีรายการใดเลยกำหนดชำระ"
          )}
        </p>
      </Panel>

      <Panel
        title="แยกตามมุมมอง"
        actions={
          dimension === "program" ? (
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
          ) : undefined
        }
      >
        <Tabs value={dimension} onValueChange={(v) => setDimension(v as Dimension)}>
          <div className="overflow-x-auto">
            <TabsList>
              {(["program", "term"] as Dimension[]).map((d) => (
                <TabsTrigger key={d} value={d} className="shrink-0">
                  {DIMENSION_LABEL[d]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="mt-4">
          {chartData.length > 0 ? (
            <ReportBarChart data={chartData} series={SERIES} valueFormatter={(v) => formatTHB(v)} />
          ) : (
            <EmptyState icon={CircleDollarSign} title="ไม่มีข้อมูลในเงื่อนไขนี้" description="ลองเปลี่ยนมุมมองที่เลือกด้านบน" />
          )}
        </div>
      </Panel>

      <Panel title="ตารางแยกตามมุมมอง" flush>
        <div className="p-5">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => r.key}
            caption={`รายได้${DIMENSION_LABEL[dimension]}`}
            empty={<EmptyState icon={CircleDollarSign} title="ไม่มีข้อมูลในเงื่อนไขนี้" description="ลองเปลี่ยนมุมมองที่เลือกด้านบน" />}
          />
        </div>
      </Panel>

      <Panel
        title="รายการเลยกำหนดชำระ"
        description="ยอดที่ยังไม่ยืนยันและเลยวันครบกำหนดชำระไปแล้ว เรียงจากเกินกำหนดมานานที่สุดก่อน"
        flush
      >
        <div className="p-5">
          <DataTable
            columns={overdueColumns}
            rows={overdue}
            rowKey={(p) => p.id}
            rowHref={(p) => `/admin/payments/${p.id}`}
            caption="รายการชำระเงินที่เลยกำหนด"
            empty={
              <EmptyState
                icon={CircleDollarSign}
                title="ไม่มีรายการเลยกำหนดชำระ"
                description="ทุกรายการที่ยังไม่ยืนยันอยู่ในช่วงเวลาที่กำหนดไว้"
              />
            }
          />
        </div>
      </Panel>
    </>
  );
}
