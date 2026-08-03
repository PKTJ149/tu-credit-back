import Link from "next/link";
import { AlertTriangle, ArrowRight, History, Repeat2, Wallet } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { formatTHB } from "@/lib/finance/payment-state";
import { formatThaiDate } from "@/lib/admin/format";
import { getPendingPayments, getOpenTransferCases, getStaffName, TODAY } from "@/lib/admin/mock-data";
import { getStudentDisplay, formatWaitingLabel } from "@/lib/admin/mock-payments";
import { getDueSignal } from "@/lib/admin/mock-transfers";
import {
  getCapacitySummary,
  getPaymentsQueueSummary,
  getRecentAuditEntries,
  getRegistrationWindowSummary,
  getRevenueSummary,
  getTransferQueueSummary,
} from "@/lib/admin/mock-dashboard";
import type { AdminPayment, AuditEntry, StaffUser, TransferCase } from "@/lib/admin/types";
import { cn } from "@/lib/utils";
import { ProportionBar, Reveal } from "@/components/admin/motion";

const linkClass =
  "inline-flex w-fit items-center gap-1 rounded text-sm font-medium text-[var(--primary)] transition-colors hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

function PanelLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className={linkClass}>
      {children}
      <ArrowRight className="size-3.5" aria-hidden />
    </Link>
  );
}

/**
 * The super-admin view: is money moving, is anything stuck, is anything
 * about to break. Every figure below is read straight from the mock world
 * through `lib/admin/mock-dashboard.ts` — nothing is invented for the sake
 * of a number, which is also why some panels are one plain sentence: there
 * is nothing more true to say about a healthy queue than that it is healthy.
 */
export function SuperAdminDashboard({ staff }: { staff: StaffUser }) {
  const paymentsSummary = getPaymentsQueueSummary();
  const transferSummary = getTransferQueueSummary();
  const revenue = getRevenueSummary();
  const capacity = getCapacitySummary();
  const registrationWindow = getRegistrationWindowSummary();
  const recentEntries = getRecentAuditEntries();

  const headline =
    paymentsSummary.count === 0 && transferSummary.openCount === 0 && capacity.overCount === 0
      ? "ไม่มีรายการค้างตรวจสอบหรือเกินที่นั่งในขณะนี้"
      : [
          paymentsSummary.count > 0 ? `การชำระเงินรอตรวจสอบ ${paymentsSummary.count} รายการ` : null,
          transferSummary.openCount > 0
            ? `คำขอเทียบโอนเปิดอยู่ ${transferSummary.openCount} รายการ${
                transferSummary.overdueCount > 0 ? ` (เลยกำหนด ${transferSummary.overdueCount})` : ""
              }`
            : null,
          capacity.overCount > 0 ? `เกินที่นั่ง ${capacity.overCount} รายการ` : null,
        ]
          .filter(Boolean)
          .join(" · ");

  const topPayments = getPendingPayments().slice(0, 3);

  const topTransfers = [...getOpenTransferCases()]
    .sort((a, b) => {
      const sa = getDueSignal(a.dueAt, TODAY);
      const sb = getDueSignal(b.dueAt, TODAY);
      if (sa.overdue !== sb.overdue) return sa.overdue ? -1 : 1;
      return a.dueAt.localeCompare(b.dueAt);
    })
    .slice(0, 3);

  const revenueTotal = revenue.confirmedAmount + revenue.outstandingAmount;
  const confirmedPct = revenueTotal > 0 ? Math.round((revenue.confirmedAmount / revenueTotal) * 100) : 0;

  const paymentColumns: Column<AdminPayment>[] = [
    { key: "reference", header: "เลขที่อ้างอิง", width: "w-32", cell: (p) => <span className="font-mono text-xs">{p.reference}</span> },
    {
      key: "student",
      header: "ผู้เรียน",
      truncate: "max-w-[22ch]",
      cell: (p) => getStudentDisplay(p.studentId).name,
    },
    {
      key: "waiting",
      header: "รอมาแล้ว",
      align: "end",
      width: "w-28",
      cell: (p) => <span className="font-medium text-[var(--primary)]">{formatWaitingLabel(p)}</span>,
    },
  ];

  const transferColumns: Column<TransferCase>[] = [
    { key: "reference", header: "เลขที่คำขอ", width: "w-32", cell: (c) => <span className="font-mono text-xs">{c.reference}</span> },
    { key: "institution", header: "สถาบัน", truncate: "max-w-[22ch]", cell: (c) => c.institution },
    {
      key: "due",
      header: "กำหนดพิจารณา",
      align: "end",
      width: "w-32",
      cell: (c) => {
        const signal = getDueSignal(c.dueAt, TODAY);
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              signal.overdue ? "text-[var(--destructive)]" : "text-[var(--ink-muted)]",
            )}
          >
            {signal.overdue ? <AlertTriangle className="size-3.5 shrink-0" aria-hidden /> : null}
            {signal.label}
          </span>
        );
      },
    },
  ];

  const auditColumns: Column<AuditEntry>[] = [
    { key: "staff", header: "เจ้าหน้าที่", width: "w-40", cell: (a) => getStaffName(a.staffId) },
    { key: "action", header: "การดำเนินการ", cell: (a) => a.action },
    { key: "target", header: "รายการ", truncate: "max-w-[22ch]", hideOnMobile: true, cell: (a) => a.target },
    { key: "at", header: "วันที่", align: "end", width: "w-28", cell: (a) => formatThaiDate(a.at) },
  ];

  return (
    <>
      <PageHeader title={`สวัสดี ${staff.name}`} description={headline} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal index={0} className="min-w-0">
        <Panel
          className="min-w-0"
          title="การชำระเงินรอตรวจสอบ"
          description={
            paymentsSummary.count > 0
              ? `${paymentsSummary.count} รายการรอตรวจสอบ · รอนานสุด ${paymentsSummary.oldestWaitingLabel}`
              : undefined
          }
          flush
        >
          <DataTable
            columns={paymentColumns}
            rows={topPayments}
            rowKey={(p) => p.id}
            rowHref={(p) => `/admin/payments/${p.id}`}
            caption="การชำระเงินที่รอตรวจสอบล่าสุด"
            empty={
              <EmptyState icon={Wallet} title="ไม่มีรายการค้างตรวจสอบ" description="คิวการชำระเงินว่างอยู่ในขณะนี้" />
            }
          />
          <div className="border-t border-[var(--border)] px-5 py-3">
            <PanelLink href="/admin/payments">ไปที่คิวรออนุมัติการชำระเงิน</PanelLink>
          </div>
        </Panel>
        </Reveal>

        <Reveal index={1} className="min-w-0">
        <Panel
          className="min-w-0"
          title="คำขอเทียบโอนหน่วยกิต"
          description={
            transferSummary.openCount > 0
              ? `${transferSummary.openCount} คำขอเปิดอยู่${transferSummary.overdueCount > 0 ? ` · เลยกำหนดแล้ว ${transferSummary.overdueCount} คำขอ` : ""}`
              : undefined
          }
          flush
        >
          <DataTable
            columns={transferColumns}
            rows={topTransfers}
            rowKey={(c) => c.id}
            rowHref={(c) => `/admin/transfers/${c.id}`}
            caption="คำขอเทียบโอนหน่วยกิตที่เปิดอยู่"
            empty={
              <EmptyState icon={Repeat2} title="ไม่มีคำขอเทียบโอนค้างพิจารณา" description="ทุกคำขอได้รับการพิจารณาแล้ว" />
            }
          />
          <div className="border-t border-[var(--border)] px-5 py-3">
            <PanelLink href="/admin/transfers">ไปที่คำขอรอตรวจสอบ</PanelLink>
          </div>
        </Panel>
        </Reveal>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Reveal index={2}>
        <Panel title="รายได้">
          <div className="space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-xs text-[var(--ink-subtle)]">ยืนยันแล้ว</p>
                <p className="font-mono text-base font-semibold">{formatTHB(revenue.confirmedAmount)}</p>
              </div>
              <div className="text-end">
                <p className="text-xs text-[var(--ink-subtle)]">ค้างรับ</p>
                <p className="font-mono text-base font-semibold text-[var(--primary)]">
                  {formatTHB(revenue.outstandingAmount)}
                </p>
              </div>
            </div>
            <ProportionBar
              percent={confirmedPct}
              label="สัดส่วนรายได้ที่ยืนยันแล้วเทียบกับค้างรับ"
            />
            <p className="text-xs text-[var(--ink-muted)]">
              ยืนยันแล้ว {revenue.confirmedCount} รายการ · ค้างรับ {revenue.outstandingCount} รายการ
            </p>
            <PanelLink href="/admin/payments/all">ดูรายการชำระเงินทั้งหมด</PanelLink>
          </div>
        </Panel>
        </Reveal>

        <Reveal index={3}>
        <Panel title="ที่นั่งและความจุ">
          <div className="space-y-3">
            <p className="text-sm leading-6 text-pretty">
              {capacity.overCount > 0
                ? `มี ${capacity.overCount} รายการเกินที่นั่งแล้ว${
                    capacity.worstItem ? ` รายการที่หนักสุดคือ "${capacity.worstItem.name}"` : ""
                  }`
                : capacity.nearFullCount > 0
                  ? `ไม่มีรายการเกินที่นั่ง แต่มี ${capacity.nearFullCount} รายการใกล้เต็มที่ควรติดตาม`
                  : "ทุกหลักสูตรและรายวิชายังมีที่นั่งเพียงพอ"}
            </p>
            <PanelLink href={capacity.worstItem ? capacity.worstItem.href : "/admin/capacity"}>
              ไปที่หน้าที่นั่งและความจุ
            </PanelLink>
          </div>
        </Panel>
        </Reveal>

        <Reveal index={4}>
        <Panel title="ภาคการศึกษาปัจจุบัน">
          <div className="space-y-3">
            <p className="text-sm leading-6 text-pretty">
              {registrationWindow.isOpen
                ? `เปิดรับลงทะเบียนอยู่ · อีก ${registrationWindow.daysRemaining} วันจะปิดรับ (${formatThaiDate(registrationWindow.closesAt)})`
                : `ปิดรับลงทะเบียนแล้ว ตั้งแต่ ${formatThaiDate(registrationWindow.closesAt)}`}
            </p>
            <PanelLink href="/admin/terms">ไปที่หน้าภาคการศึกษา</PanelLink>
          </div>
        </Panel>
        </Reveal>
      </div>

      <Reveal index={5}>
      <Panel title="กิจกรรมล่าสุดของเจ้าหน้าที่" description="การดำเนินการล่าสุดของเจ้าหน้าที่ทุกคนในระบบ" flush>
        <DataTable
          columns={auditColumns}
          rows={recentEntries}
          rowKey={(a) => a.id}
          caption="บันทึกการใช้งานล่าสุด"
          empty={
            <EmptyState icon={History} title="ยังไม่มีการดำเนินการที่บันทึกไว้" description="ประวัติจะปรากฏที่นี่เมื่อเจ้าหน้าที่เริ่มดำเนินการ" />
          }
        />
        <div className="border-t border-[var(--border)] px-5 py-3">
          <PanelLink href="/admin/settings/audit">ดูบันทึกการใช้งานทั้งหมด</PanelLink>
        </div>
      </Panel>
      </Reveal>
    </>
  );
}
