import { notFound } from "next/navigation";
import { ClipboardList, ListChecks, Receipt, Repeat2 } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel, DetailList } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge, RegistrationStatusBadge, PaymentStatusBadge, TransferStatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  getPaymentsByStudent,
  getRegistrationsByStudent,
  getStudentById,
  transferCases,
} from "@/lib/admin/mock-data";
import { formatTHB } from "@/lib/finance/payment-state";
import {
  ITEM_TYPE_LABEL,
  STUDENT_STATUS_LABEL,
  WAITLIST_STATUS_LABEL,
  formatThaiDate,
  getWaitlistByStudent,
  studentStatusTone,
  waitlistStatusTone,
} from "@/lib/admin/mock-registrations";
import type { AdminPayment, AdminRegistration, TransferCase, WaitlistEntry } from "@/lib/admin/types";

type StudentDetailPageProps = {
  params: Promise<{ id: string }>;
};

const ACTIVE_PAYMENT_STATES = new Set(["payment-required", "notice-submitted", "pending-verification", "payment-rejected"]);

function buildSummary(
  registrations: AdminRegistration[],
  payments: AdminPayment[],
  credits: number,
): string {
  const activeCount = registrations.filter((r) => r.status === "active").length;
  const outstandingCount = payments.filter((p) => ACTIVE_PAYMENT_STATES.has(p.state)).length;

  const parts = [`สะสมแล้ว ${credits} หน่วยกิต`, `กำลังเรียนอยู่ ${activeCount} รายการ`];
  parts.push(
    outstandingCount > 0
      ? `มีรายการค้างชำระ ${outstandingCount} รายการ`
      : "ไม่มีรายการค้างชำระ",
  );
  return parts.join(" · ");
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params;
  const student = getStudentById(id);
  if (!student) notFound();

  const registrations = getRegistrationsByStudent(student.id);
  const payments = getPaymentsByStudent(student.id);
  const studentTransfers = transferCases.filter((t) => t.studentId === student.id);
  const waitlistEntries = getWaitlistByStudent(student.id);

  const registrationColumns: Column<AdminRegistration>[] = [
    { key: "reference", header: "เลขที่อ้างอิง", cell: (row) => <span className="font-mono text-xs">{row.reference}</span> },
    {
      key: "item",
      truncate: "max-w-[30ch]",
      header: "รายการ",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <span>{row.itemName}</span>
          <Badge variant="outline" className="w-fit text-[var(--ink-muted)]">
            {ITEM_TYPE_LABEL[row.itemType]}
          </Badge>
        </div>
      ),
    },
    { key: "term", header: "ภาคการศึกษา", hideOnMobile: true, cell: (row) => row.term },
    { key: "credits", header: "หน่วยกิต", align: "end", width: "w-20", cell: (row) => <span className="font-mono">{row.credits}</span> },
    { key: "status", header: "สถานะ", cell: (row) => <RegistrationStatusBadge status={row.status} /> },
    { key: "registeredAt", header: "วันที่ลงทะเบียน", hideOnMobile: true, cell: (row) => formatThaiDate(row.registeredAt) },
  ];

  const paymentColumns: Column<AdminPayment>[] = [
    { key: "reference", header: "เลขที่อ้างอิง", cell: (row) => <span className="font-mono text-xs">{row.reference}</span> },
    { key: "item", header: "รายการ", truncate: "max-w-[30ch]", cell: (row) => row.itemName },
    { key: "amount", header: "จำนวนเงิน", align: "end", cell: (row) => <span className="font-mono">{formatTHB(row.amount)}</span> },
    { key: "state", header: "สถานะ", cell: (row) => <PaymentStatusBadge state={row.state} /> },
    { key: "dueDate", header: "ครบกำหนด", hideOnMobile: true, cell: (row) => formatThaiDate(row.dueDate) },
  ];

  const transferColumns: Column<TransferCase>[] = [
    { key: "reference", header: "เลขที่อ้างอิง", cell: (row) => <span className="font-mono text-xs">{row.reference}</span> },
    { key: "type", header: "ประเภท", cell: (row) => (row.type === "in" ? "เทียบโอนเข้า" : "เทียบโอนออก") },
    { key: "institution", header: "สถาบัน", hideOnMobile: true, truncate: "max-w-[24ch]", cell: (row) => row.institution },
    { key: "state", header: "สถานะ", cell: (row) => <TransferStatusBadge state={row.state} /> },
    { key: "dueAt", header: "ครบกำหนด", hideOnMobile: true, cell: (row) => formatThaiDate(row.dueAt) },
  ];

  const waitlistColumns: Column<WaitlistEntry>[] = [
    {
      key: "item",
      header: "รายการ",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <span>{row.itemName}</span>
          <Badge variant="outline" className="w-fit text-[var(--ink-muted)]">
            {ITEM_TYPE_LABEL[row.itemType]}
          </Badge>
        </div>
      ),
    },
    { key: "position", header: "ลำดับคิว", align: "end", width: "w-20", cell: (row) => <span className="font-mono">{row.position}</span> },
    { key: "requestedAt", header: "วันที่ขอ", hideOnMobile: true, cell: (row) => formatThaiDate(row.requestedAt) },
    {
      key: "status",
      header: "สถานะ",
      cell: (row) => <StatusBadge label={WAITLIST_STATUS_LABEL[row.status]} tone={waitlistStatusTone[row.status]} />,
    },
  ];

  return (
    <>
      <PageHeader
        title={student.name}
        description={buildSummary(registrations, payments, student.accumulatedCredits)}
        backHref="/admin/students"
        backLabel="กลับไปรายชื่อผู้เรียน"
      />

      <Panel title="ข้อมูลผู้เรียน">
        <DetailList
          rows={[
            { label: "รหัสผู้เรียน", value: <span className="font-mono">{student.studentCode}</span> },
            {
              label: "สถานะ",
              value: <StatusBadge label={STUDENT_STATUS_LABEL[student.status]} tone={studentStatusTone[student.status]} />,
            },
            { label: "อีเมล", value: student.email },
            { label: "เบอร์โทร", value: student.phone },
            { label: "คณะ", value: student.faculty },
            { label: "ระดับการศึกษา", value: student.educationLevel },
            { label: "วันที่เข้าใช้ระบบ", value: formatThaiDate(student.registeredAt) },
          ]}
        />
      </Panel>

      <Panel title="การลงทะเบียน" description="ประวัติการลงทะเบียนของผู้เรียนคนนี้ทั้งหมด" flush>
        <DataTable
          columns={registrationColumns}
          rows={registrations}
          rowKey={(row) => row.id}
          caption="การลงทะเบียนของผู้เรียน"
          empty={
            <EmptyState
              icon={ClipboardList}
              title="ยังไม่มีการลงทะเบียน"
              description="ผู้เรียนคนนี้ยังไม่เคยลงทะเบียนหลักสูตรหรือรายวิชาใด"
            />
          }
        />
      </Panel>

      <Panel title="การชำระเงิน" description="รายการชำระเงินทั้งหมด อ้างอิงกับการลงทะเบียนข้างต้น" flush>
        <DataTable
          columns={paymentColumns}
          rows={payments}
          rowKey={(row) => row.id}
          rowHref={(row) => `/admin/payments/${row.id}`}
          caption="การชำระเงินของผู้เรียน"
          empty={
            <EmptyState
              icon={Receipt}
              title="ยังไม่มีรายการชำระเงิน"
              description="ผู้เรียนคนนี้ยังไม่มีรายการชำระเงินเกิดขึ้นในระบบ"
            />
          }
        />
      </Panel>

      <Panel title="คำขอเทียบโอนหน่วยกิต" description="คำขอเทียบโอนเข้าและออกของผู้เรียนคนนี้" flush>
        <DataTable
          columns={transferColumns}
          rows={studentTransfers}
          rowKey={(row) => row.id}
          rowHref={(row) => `/admin/transfers/${row.id}`}
          caption="คำขอเทียบโอนหน่วยกิตของผู้เรียน"
          empty={
            <EmptyState
              icon={Repeat2}
              title="ยังไม่มีคำขอเทียบโอน"
              description="ผู้เรียนคนนี้ยังไม่เคยยื่นคำขอเทียบโอนหน่วยกิตเข้าหรือออก"
            />
          }
        />
      </Panel>

      <Panel title="รายชื่อรอที่นั่ง" description="รายวิชาหรือหลักสูตรที่ผู้เรียนคนนี้กำลังรอที่นั่งอยู่" flush>
        <DataTable
          columns={waitlistColumns}
          rows={waitlistEntries}
          rowKey={(row) => row.id}
          caption="รายชื่อรอที่นั่งของผู้เรียน"
          empty={
            <EmptyState
              icon={ListChecks}
              title="ไม่มีรายการรอที่นั่ง"
              description="ผู้เรียนคนนี้ไม่ได้อยู่ในคิวรอที่นั่งของรายวิชาหรือหลักสูตรใด"
            />
          }
        />
      </Panel>
    </>
  );
}
