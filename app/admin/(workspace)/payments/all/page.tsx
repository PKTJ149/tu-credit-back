"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { TableToolbar, ALL_FILTER_VALUE, type ToolbarFilter } from "@/components/admin/table-toolbar";
import { PaymentStatusBadge } from "@/components/admin/status-badge";
import { payments } from "@/lib/admin/mock-data";
import type { AdminPayment } from "@/lib/admin/types";
import { paymentMethodLabel } from "@/lib/admin/types";
import {
  getStudentDisplay,
  itemTypeFilterOptions,
  itemTypeLabel,
  matchesPaymentSearch,
  paymentMethodFilterOptions,
  paymentStateFilterOptions,
} from "@/lib/admin/mock-payments";
import { formatTHB } from "@/lib/finance/payment-state";
import { formatThaiDate } from "@/lib/admin/format";

const columns: Column<AdminPayment>[] = [
  {
    key: "reference",
    header: "เลขที่อ้างอิง",
    cell: (p) => <span className="font-mono text-sm">{p.reference}</span>,
    width: "w-40",
  },
  {
    key: "student",
    header: "ผู้เรียน",
    cell: (p) => {
      const { name, code } = getStudentDisplay(p.studentId);
      return (
        <div className="min-w-0">
          <p className="truncate font-medium">{name}</p>
          <p className="font-mono text-xs text-[var(--ink-subtle)]">{code}</p>
        </div>
      );
    },
  },
  {
    key: "item",
    truncate: "max-w-[28ch]",
    header: "รายการ",
    cell: (p) => (
      <div className="min-w-0">
        <p className="truncate">{p.itemName}</p>
        <p className="text-xs text-[var(--ink-subtle)]">{itemTypeLabel[p.itemType]}</p>
      </div>
    ),
    hideOnMobile: true,
  },
  {
    key: "amount",
    header: "จำนวนเงิน",
    cell: (p) => <span className="font-mono">{formatTHB(p.amount)}</span>,
    align: "end",
    width: "w-32",
  },
  {
    key: "method",
    header: "ช่องทาง",
    cell: (p) => paymentMethodLabel[p.method],
    hideOnMobile: true,
    width: "w-36",
  },
  {
    key: "dueDate",
    header: "ครบกำหนด",
    cell: (p) => formatThaiDate(p.dueDate),
    hideOnMobile: true,
    width: "w-28",
  },
  {
    key: "state",
    header: "สถานะ",
    cell: (p) => <PaymentStatusBadge state={p.state} />,
    width: "w-40",
  },
];

/** The full ledger — every payment record regardless of state. Where the
 *  queue is a to-do list, this screen is the record of everything that has
 *  ever happened to a payment. */
export default function AllPaymentsPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState<string>(ALL_FILTER_VALUE);
  const [itemType, setItemType] = useState<string>(ALL_FILTER_VALUE);
  const [method, setMethod] = useState<string>(ALL_FILTER_VALUE);

  const filtered = payments.filter((p) => {
    if (state !== ALL_FILTER_VALUE && p.state !== state) return false;
    if (itemType !== ALL_FILTER_VALUE && p.itemType !== itemType) return false;
    if (method !== ALL_FILTER_VALUE && p.method !== method) return false;
    return matchesPaymentSearch(p, search);
  });

  const filters: ToolbarFilter[] = [
    {
      id: "state",
      label: "สถานะ",
      value: state,
      onChange: setState,
      options: [{ value: ALL_FILTER_VALUE, label: "ทุกสถานะ" }, ...paymentStateFilterOptions],
    },
    {
      id: "item-type",
      label: "ประเภทรายการ",
      value: itemType,
      onChange: setItemType,
      options: [{ value: ALL_FILTER_VALUE, label: "ทุกประเภท" }, ...itemTypeFilterOptions],
    },
    {
      id: "method",
      label: "ช่องทางชำระเงิน",
      value: method,
      onChange: setMethod,
      options: [{ value: ALL_FILTER_VALUE, label: "ทุกช่องทาง" }, ...paymentMethodFilterOptions],
    },
  ];

  function resetFilters() {
    setSearch("");
    setState(ALL_FILTER_VALUE);
    setItemType(ALL_FILTER_VALUE);
    setMethod(ALL_FILTER_VALUE);
  }

  return (
    <>
      <PageHeader
        title="รายการชำระเงินทั้งหมด"
        description="ประวัติการชำระเงินทุกสถานะของทุกรายการ ใช้ค้นหาและกรองเพื่อตรวจสอบย้อนหลัง"
      />

      <Panel flush>
        <div className="border-b border-[var(--border)] px-5 py-4">
          <TableToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchLabel="ค้นหาการชำระเงิน"
            searchPlaceholder="ค้นหาเลขที่อ้างอิง ชื่อผู้เรียน หรือรายการ"
            filters={filters}
            onReset={resetFilters}
            resultSummary={`แสดง ${filtered.length} จาก ${payments.length} รายการ`}
          />
        </div>
        <div className="p-5 pt-4">
          <DataTable
            columns={columns}
            rows={filtered}
            rowKey={(p) => p.id}
            rowHref={(p) => `/admin/payments/${p.id}`}
            caption="รายการชำระเงินทั้งหมด"
            empty={
              <EmptyState
                icon={Receipt}
                title="ไม่พบรายการที่ตรงกับตัวกรอง"
                description="ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองเพื่อดูรายการชำระเงินทั้งหมด"
              />
            }
          />
        </div>
      </Panel>
    </>
  );
}
