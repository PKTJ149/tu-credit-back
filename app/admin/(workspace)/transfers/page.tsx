"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Repeat2 } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { TransferStatusBadge } from "@/components/admin/status-badge";
import { getOpenTransferCases, getStudentName, TODAY } from "@/lib/admin/mock-data";
import { transferStateInfo, type TransferState } from "@/lib/credit-transfer/transfer-state";
import type { TransferCase } from "@/lib/admin/types";
import { formatThaiDate, getDueSignal } from "@/lib/admin/mock-transfers";
import { cn } from "@/lib/utils";
import { TransferDirectionBadge, transferDirectionLabel } from "./_components/transfer-direction";

const OPEN_STATES: TransferState[] = ["submitted", "under-review", "changes-requested"];

export default function TransfersQueuePage() {
  const cases = useMemo(() => getOpenTransferCases(), []);

  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState(ALL_FILTER_VALUE);
  const [state, setState] = useState(ALL_FILTER_VALUE);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cases.filter((c) => {
      if (direction !== ALL_FILTER_VALUE && c.type !== direction) return false;
      if (state !== ALL_FILTER_VALUE && c.state !== state) return false;
      if (!q) return true;
      const studentName = getStudentName(c.studentId).toLowerCase();
      return (
        c.reference.toLowerCase().includes(q) ||
        studentName.includes(q) ||
        c.institution.toLowerCase().includes(q)
      );
    });
  }, [cases, search, direction, state]);

  const columns: Column<TransferCase>[] = [
    {
      key: "reference",
      header: "เลขที่คำขอ",
      cell: (c) => <span className="font-mono text-sm">{c.reference}</span>,
      width: "w-36",
    },
    {
      key: "student",
      header: "ผู้เรียน",
      cell: (c) => getStudentName(c.studentId),
    },
    {
      key: "direction",
      header: "ทิศทาง",
      cell: (c) => <TransferDirectionBadge type={c.type} />,
      width: "w-28",
    },
    {
      key: "institution",
      truncate: "max-w-[24ch]",
      header: "สถาบันคู่เทียบ",
      cell: (c) => c.institution,
      hideOnMobile: true,
    },
    {
      key: "subjects",
      header: "รายวิชา",
      cell: (c) => `${c.subjects.length} วิชา`,
      align: "end",
      width: "w-24",
      hideOnMobile: true,
    },
    {
      key: "credits",
      header: "หน่วยกิตที่ขอ",
      cell: (c) => c.subjects.reduce((sum, s) => sum + s.externalCredits, 0),
      align: "end",
      width: "w-28",
    },
    {
      key: "state",
      header: "สถานะ",
      cell: (c) => <TransferStatusBadge state={c.state} />,
      width: "w-40",
    },
    {
      key: "submittedAt",
      header: "วันที่ส่งคำขอ",
      cell: (c) => formatThaiDate(c.submittedAt),
      hideOnMobile: true,
      width: "w-28",
    },
    {
      key: "dueAt",
      header: "กำหนดพิจารณา",
      cell: (c) => {
        const signal = getDueSignal(c.dueAt, TODAY);
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              signal.overdue
                ? "text-[var(--destructive)]"
                : signal.dueSoon
                  ? "text-[var(--primary)]"
                  : "text-[var(--ink-muted)]",
            )}
          >
            {signal.overdue ? <AlertTriangle className="size-3.5 shrink-0" aria-hidden /> : null}
            {signal.label}
          </span>
        );
      },
      width: "w-36",
    },
  ];

  return (
    <>
      <PageHeader
        title="คำขอรอตรวจสอบ"
        description="คำขอเทียบโอนหน่วยกิตที่ยังรอผลการพิจารณา เรียงจากวันที่ส่งคำขอเก่าที่สุดก่อน"
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหาคำขอ"
        searchPlaceholder="ค้นหาด้วยเลขที่คำขอ ชื่อผู้เรียน หรือสถาบัน"
        filters={[
          {
            id: "direction",
            label: "ทิศทาง",
            value: direction,
            onChange: setDirection,
            options: [
              { value: ALL_FILTER_VALUE, label: "ทุกทิศทาง" },
              { value: "in", label: transferDirectionLabel.in },
              { value: "out", label: transferDirectionLabel.out },
            ],
          },
          {
            id: "state",
            label: "สถานะ",
            value: state,
            onChange: setState,
            options: [
              { value: ALL_FILTER_VALUE, label: "ทุกสถานะ" },
              ...OPEN_STATES.map((s) => ({ value: s, label: transferStateInfo[s].label })),
            ],
          },
        ]}
        resultSummary={`แสดง ${filtered.length} จาก ${cases.length} รายการ`}
        onReset={() => {
          setSearch("");
          setDirection(ALL_FILTER_VALUE);
          setState(ALL_FILTER_VALUE);
        }}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(c) => c.id}
        rowHref={(c) => `/admin/transfers/${c.id}`}
        caption="รายการคำขอเทียบโอนหน่วยกิตที่รอตรวจสอบ"
        empty={
          cases.length === 0 ? (
            <EmptyState
              icon={Repeat2}
              title="ไม่มีคำขอค้างตรวจสอบ"
              description="เมื่อผู้เรียนส่งคำขอเทียบโอนหน่วยกิต หรือส่งคำขอที่แก้ไขแล้วกลับเข้ามา รายการจะปรากฏที่นี่ให้ตรวจสอบ"
            />
          ) : (
            <EmptyState
              icon={Repeat2}
              title="ไม่พบคำขอที่ตรงกับตัวกรอง"
              description="ลองปรับคำค้นหาหรือเงื่อนไขตัวกรองด้านบน"
            />
          )
        }
      />
    </>
  );
}
