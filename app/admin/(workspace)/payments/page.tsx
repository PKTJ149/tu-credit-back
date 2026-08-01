"use client";

import { useMemo, useState } from "react";
import { Clock3, PartyPopper } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { TableToolbar, ALL_FILTER_VALUE, type ToolbarFilter } from "@/components/admin/table-toolbar";
import { getPendingPayments } from "@/lib/admin/mock-data";
import type { AdminPayment } from "@/lib/admin/types";
import { paymentMethodLabel } from "@/lib/admin/types";
import {
  formatWaitingLabel,
  getStudentDisplay,
  itemTypeFilterOptions,
  itemTypeLabel,
  matchesPaymentSearch,
  paymentMethodFilterOptions,
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
    truncate: "max-w-[30ch]",
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
    key: "submittedAt",
    header: "วันที่ส่ง",
    cell: (p) => (p.submittedAt ? formatThaiDate(p.submittedAt) : "—"),
    hideOnMobile: true,
    width: "w-28",
  },
  {
    key: "waiting",
    header: "รอมาแล้ว",
    cell: (p) => <span className="font-medium text-[var(--primary)]">{formatWaitingLabel(p)}</span>,
    width: "w-32",
  },
];

/**
 * The queue an officer opens first thing every morning. Every row here is
 * money someone is waiting on, so it stays deliberately narrow in purpose:
 * find the payment, open it, decide.
 *
 * No quick-approve button in the row. Approving means visually checking the
 * slip against the claimed amount — a decision the row cannot show evidence
 * for — so the only fast path is the one that opens the slip: the row link
 * itself. Adding a table-row "approve" button here would invite rubber-
 * stamping without ever looking at the evidence, which is the one mistake
 * this screen exists to prevent.
 */
export default function PaymentsQueuePage() {
  const allPending = useMemo(() => getPendingPayments(), []);
  const [search, setSearch] = useState("");
  const [itemType, setItemType] = useState<string>(ALL_FILTER_VALUE);
  const [method, setMethod] = useState<string>(ALL_FILTER_VALUE);

  const filtered = allPending.filter((p) => {
    if (itemType !== ALL_FILTER_VALUE && p.itemType !== itemType) return false;
    if (method !== ALL_FILTER_VALUE && p.method !== method) return false;
    return matchesPaymentSearch(p, search);
  });

  const isFiltered = search.trim() !== "" || itemType !== ALL_FILTER_VALUE || method !== ALL_FILTER_VALUE;

  const filters: ToolbarFilter[] = [
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
    setItemType(ALL_FILTER_VALUE);
    setMethod(ALL_FILTER_VALUE);
  }

  return (
    <>
      <PageHeader
        title="คิวรออนุมัติการชำระเงิน"
        description="หลักฐานการชำระเงินที่ผู้เรียนส่งเข้ามาและยังไม่ได้ตรวจสอบ เรียงจากรายการที่รอมานานที่สุดก่อน"
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
            resultSummary={
              isFiltered || allPending.length > 0
                ? `แสดง ${filtered.length} จาก ${allPending.length} รายการ`
                : undefined
            }
          />
        </div>
        <div className="p-5 pt-4">
          <DataTable
            columns={columns}
            rows={filtered}
            rowKey={(p) => p.id}
            rowHref={(p) => `/admin/payments/${p.id}`}
            caption="คิวรออนุมัติการชำระเงิน"
            empty={
              isFiltered ? (
                <EmptyState
                  icon={Clock3}
                  title="ไม่พบรายการที่ตรงกับตัวกรอง"
                  description="ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองเพื่อดูรายการทั้งหมดที่รอตรวจสอบ"
                />
              ) : (
                <EmptyState
                  icon={PartyPopper}
                  title="ไม่มีการชำระเงินรอตรวจสอบ"
                  description="เยี่ยมมาก คิวว่างแล้ว รายการใหม่จะปรากฏที่นี่ทันทีที่ผู้เรียนส่งหลักฐานการชำระเงินเข้ามา"
                />
              )
            }
          />
        </div>
      </Panel>
    </>
  );
}
