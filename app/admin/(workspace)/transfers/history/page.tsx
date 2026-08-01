"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { TransferStatusBadge } from "@/components/admin/status-badge";
import { getStaffName, getStudentName, transferCases } from "@/lib/admin/mock-data";
import { transferStateInfo } from "@/lib/credit-transfer/transfer-state";
import type { TransferCase } from "@/lib/admin/types";
import { formatThaiDate } from "@/lib/admin/mock-transfers";
import { FileClock } from "lucide-react";
import { TransferDirectionBadge, transferDirectionLabel } from "../_components/transfer-direction";

export default function TransferHistoryPage() {
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState(ALL_FILTER_VALUE);
  const [state, setState] = useState(ALL_FILTER_VALUE);
  const [institution, setInstitution] = useState(ALL_FILTER_VALUE);

  const institutionOptions = useMemo(() => {
    const names = Array.from(new Set(transferCases.map((c) => c.institution))).sort((a, b) =>
      a.localeCompare(b, "th"),
    );
    return names.map((name) => ({ value: name, label: name }));
  }, []);

  const sorted = useMemo(
    () => [...transferCases].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sorted.filter((c) => {
      if (direction !== ALL_FILTER_VALUE && c.type !== direction) return false;
      if (state !== ALL_FILTER_VALUE && c.state !== state) return false;
      if (institution !== ALL_FILTER_VALUE && c.institution !== institution) return false;
      if (!q) return true;
      const studentName = getStudentName(c.studentId).toLowerCase();
      return (
        c.reference.toLowerCase().includes(q) ||
        studentName.includes(q) ||
        c.institution.toLowerCase().includes(q)
      );
    });
  }, [sorted, search, direction, state, institution]);

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
      key: "state",
      header: "สถานะ",
      cell: (c) => <TransferStatusBadge state={c.state} />,
      width: "w-40",
    },
    {
      key: "submittedAt",
      header: "วันที่ส่งคำขอ",
      cell: (c) => formatThaiDate(c.submittedAt),
      width: "w-28",
    },
    {
      key: "reviewedBy",
      header: "ผู้ตรวจสอบ",
      cell: (c) => (c.reviewedByStaffId ? getStaffName(c.reviewedByStaffId) : "—"),
      hideOnMobile: true,
    },
    {
      key: "reviewedAt",
      header: "วันที่ตัดสิน",
      cell: (c) => (c.reviewedAt ? formatThaiDate(c.reviewedAt) : "—"),
      width: "w-28",
    },
  ];

  return (
    <>
      <PageHeader
        title="ประวัติคำขอเทียบโอน"
        description="คำขอเทียบโอนหน่วยกิตทั้งหมด รวมคำขอที่อนุมัติ ไม่อนุมัติ และถอนคำขอแล้ว เก็บไว้เพื่อการตรวจสอบย้อนหลัง"
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
              ...(Object.keys(transferStateInfo) as (keyof typeof transferStateInfo)[]).map((s) => ({
                value: s,
                label: transferStateInfo[s].label,
              })),
            ],
          },
          {
            id: "institution",
            label: "สถาบันคู่เทียบ",
            value: institution,
            onChange: setInstitution,
            options: [{ value: ALL_FILTER_VALUE, label: "ทุกสถาบัน" }, ...institutionOptions],
          },
        ]}
        resultSummary={`แสดง ${filtered.length} จาก ${sorted.length} รายการ`}
        onReset={() => {
          setSearch("");
          setDirection(ALL_FILTER_VALUE);
          setState(ALL_FILTER_VALUE);
          setInstitution(ALL_FILTER_VALUE);
        }}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(c) => c.id}
        rowHref={(c) => `/admin/transfers/${c.id}`}
        caption="ประวัติคำขอเทียบโอนหน่วยกิตทั้งหมด"
        empty={
          <EmptyState
            icon={FileClock}
            title="ไม่พบคำขอที่ตรงกับตัวกรอง"
            description="ลองปรับคำค้นหาหรือเงื่อนไขตัวกรองด้านบน"
          />
        }
      />
    </>
  );
}
