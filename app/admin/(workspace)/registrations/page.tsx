"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Ban, CheckCircle2, MoreHorizontal, ClipboardList } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE, type ToolbarFilter } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { RegistrationStatusBadge, PaymentStatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPaymentById, getStudentById, getStudentName, registrations as allRegistrations } from "@/lib/admin/mock-data";
import { registrationStatusInfo, type RegistrationStatus } from "@/lib/learning/registration-status";
import { ITEM_TYPE_LABEL, formatThaiDate } from "@/lib/admin/mock-registrations";
import type { AdminRegistration } from "@/lib/admin/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_OPTIONS = (Object.keys(registrationStatusInfo) as RegistrationStatus[]).map((status) => ({
  value: status,
  label: registrationStatusInfo[status].label,
}));

const ITEM_TYPE_OPTIONS = [
  { value: "program", label: ITEM_TYPE_LABEL.program },
  { value: "subject", label: ITEM_TYPE_LABEL.subject },
];

const TERM_OPTIONS = Array.from(new Set(allRegistrations.map((r) => r.term))).map((term) => ({
  value: term,
  label: term,
}));

/** A row can still be cancelled while it is either awaiting payment or
 *  already active; only an active registration can be marked completed. */
function canCancel(status: RegistrationStatus): boolean {
  return status === "awaiting-payment" || status === "active";
}

export default function RegistrationsPage() {
  const [rows, setRows] = useState<AdminRegistration[]>(allRegistrations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const [termFilter, setTermFilter] = useState(ALL_FILTER_VALUE);
  const [itemTypeFilter, setItemTypeFilter] = useState(ALL_FILTER_VALUE);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== ALL_FILTER_VALUE && row.status !== statusFilter) return false;
      if (termFilter !== ALL_FILTER_VALUE && row.term !== termFilter) return false;
      if (itemTypeFilter !== ALL_FILTER_VALUE && row.itemType !== itemTypeFilter) return false;
      if (!query) return true;
      const studentName = getStudentName(row.studentId).toLowerCase();
      const studentCode = getStudentById(row.studentId)?.studentCode.toLowerCase() ?? "";
      return (
        row.reference.toLowerCase().includes(query) ||
        studentName.includes(query) ||
        studentCode.includes(query) ||
        row.itemName.toLowerCase().includes(query)
      );
    });
  }, [rows, search, statusFilter, termFilter, itemTypeFilter]);

  const filters: ToolbarFilter[] = [
    {
      id: "status",
      label: "สถานะ",
      value: statusFilter,
      options: [{ value: ALL_FILTER_VALUE, label: "ทุกสถานะ" }, ...STATUS_OPTIONS],
      onChange: setStatusFilter,
    },
    {
      id: "term",
      label: "ภาคการศึกษา",
      value: termFilter,
      options: [{ value: ALL_FILTER_VALUE, label: "ทุกภาคการศึกษา" }, ...TERM_OPTIONS],
      onChange: setTermFilter,
    },
    {
      id: "item-type",
      label: "ประเภทรายการ",
      value: itemTypeFilter,
      options: [{ value: ALL_FILTER_VALUE, label: "ทุกประเภท" }, ...ITEM_TYPE_OPTIONS],
      onChange: setItemTypeFilter,
    },
  ];

  function resetFilters() {
    setSearch("");
    setStatusFilter(ALL_FILTER_VALUE);
    setTermFilter(ALL_FILTER_VALUE);
    setItemTypeFilter(ALL_FILTER_VALUE);
  }

  function handleCancel(row: AdminRegistration, reason?: string) {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: "cancelled" } : r)));
    toast.success(`ยกเลิกการลงทะเบียน ${row.reference} แล้ว`, {
      description: `${getStudentName(row.studentId)} · เหตุผล: ${reason}`,
    });
  }

  function handleComplete(row: AdminRegistration) {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: "completed" } : r)));
    toast.success(`บันทึกว่าเรียนจบแล้วสำหรับ ${row.reference}`, {
      description: `${getStudentName(row.studentId)} · ${row.itemName}`,
    });
  }

  const columns: Column<AdminRegistration>[] = [
    {
      key: "reference",
      header: "เลขที่อ้างอิง",
      width: "w-36",
      cell: (row) => <span className="font-mono text-xs">{row.reference}</span>,
    },
    {
      key: "student",
      header: "ผู้เรียน",
      cell: (row) => (
        <Link
          href={`/admin/students/${row.studentId}`}
          className="-mx-1 inline-flex flex-col rounded px-1 py-0.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span className="font-medium hover:underline">{getStudentName(row.studentId)}</span>
          <span className="text-xs text-[var(--ink-subtle)]">{getStudentById(row.studentId)?.studentCode}</span>
        </Link>
      ),
    },
    {
      key: "item",
      header: "รายการ",
      /* Name and type sit on one line rather than stacked: stacking added 21px
         to every row, and the type is one short word. The name truncates, the
         type never does — losing which kind of thing this is would be worse
         than losing the tail of its name. */
      cell: (row) => (
        <span className="flex max-w-[30ch] items-center gap-2">
          <span className="truncate">{row.itemName}</span>
          <Badge variant="outline" className="shrink-0 text-[var(--ink-muted)]">
            {ITEM_TYPE_LABEL[row.itemType]}
          </Badge>
        </span>
      ),
    },
    {
      key: "term",
      header: "ภาคการศึกษา",
      hideOnMobile: true,
      cell: (row) => row.term,
    },
    {
      key: "credits",
      header: "หน่วยกิต",
      align: "end",
      width: "w-20",
      cell: (row) => <span className="font-mono">{row.credits}</span>,
    },
    {
      key: "status",
      header: "สถานะ",
      cell: (row) => <RegistrationStatusBadge status={row.status} />,
    },
    {
      key: "registeredAt",
      header: "วันที่ลงทะเบียน",
      hideOnMobile: true,
      cell: (row) => formatThaiDate(row.registeredAt),
    },
    {
      key: "payment",
      header: "การชำระเงิน",
      hideOnMobile: true,
      cell: (row) => {
        const payment = row.paymentId ? getPaymentById(row.paymentId) : undefined;
        if (!payment) return <span className="text-xs text-[var(--ink-subtle)]">ไม่มีรายการชำระ</span>;
        return (
          <Link
            href={`/admin/payments/${payment.id}`}
            className="rounded focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <PaymentStatusBadge state={payment.state} />
          </Link>
        );
      },
    },
    {
      key: "actions",
      header: <span className="sr-only">การดำเนินการ</span>,
      align: "end",
      width: "w-12",
      stickyEnd: true,
      /**
       * Two labelled buttons per row cost 257px, which pushed this column —
       * the only place an officer can act — off the right edge at 1280px. A
       * single menu trigger is 32px and keeps the actions on screen, which
       * matters more here than saving one click.
       */
      cell: (row) => {
        if (!canCancel(row.status)) {
          return <span className="text-xs text-[var(--ink-subtle)]">—</span>;
        }
        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`การดำเนินการสำหรับ ${row.reference}`}
                >
                  <MoreHorizontal aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {row.status === "active" ? (
                  <DropdownMenuItem onSelect={() => handleComplete(row)}>
                    <CheckCircle2 aria-hidden />
                    บันทึกว่าเรียนจบ
                  </DropdownMenuItem>
                ) : null}
                <ConfirmDialog
                  trigger={
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={(event) => event.preventDefault()}
                    >
                      <Ban aria-hidden />
                      ยกเลิกการลงทะเบียน
                    </DropdownMenuItem>
                  }
                  title={`ยกเลิกการลงทะเบียน ${row.reference}`}
                  description={`ระบบจะเปลี่ยนสถานะการลงทะเบียนของ ${getStudentName(row.studentId)} เป็นยกเลิก และผู้เรียนจะเห็นเหตุผลนี้ในประวัติของตนเอง`}
                  confirmLabel="ยืนยันการยกเลิก"
                  tone="destructive"
                  reason={{
                    label: "เหตุผลที่ยกเลิก",
                    placeholder: "เช่น ผู้เรียนแจ้งขอถอนรายวิชาก่อนเปิดเรียน",
                    required: true,
                  }}
                  onConfirm={(reason) => handleCancel(row, reason)}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="รายการลงทะเบียน"
        description="ทุกการลงทะเบียนของผู้เรียนในระบบ พร้อมสถานะการชำระเงินที่เชื่อมโยงกัน"
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหาการลงทะเบียน"
        searchPlaceholder="ค้นหาเลขที่อ้างอิง ผู้เรียน หรือรายการ"
        filters={filters}
        onReset={resetFilters}
        resultSummary={`แสดง ${filtered.length} จาก ${rows.length} รายการ`}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        caption="รายการลงทะเบียนทั้งหมด"
        empty={
          <EmptyState
            icon={ClipboardList}
            title="ไม่พบรายการลงทะเบียน"
            description="ไม่มีรายการที่ตรงกับตัวกรองนี้ ลองล้างตัวกรองหรือค้นหาด้วยคำอื่น"
          />
        }
      />
    </>
  );
}
