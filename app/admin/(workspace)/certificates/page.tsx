"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BadgeCheck, MoreHorizontal, ShieldCheck, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE, type ToolbarFilter } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStudentById, getStudentName, TODAY } from "@/lib/admin/mock-data";
import { formatThaiDate } from "@/lib/admin/format";
import { useStaffSession } from "@/lib/admin/staff-session";
import {
  buildCertificateRoster,
  certificateStateLabel,
  certificateStateTone,
  getCertificateGrade,
  getIssuerName,
  itemTypeLabel,
  nextCertificateNo,
} from "@/lib/admin/mock-grades";
import type { Certificate } from "@/lib/admin/types";

export default function CertificatesPage() {
  const { staff } = useStaffSession();
  const [certs, setCerts] = useState<Certificate[]>(() => buildCertificateRoster());
  const [search, setSearch] = useState("");
  const [state, setState] = useState(ALL_FILTER_VALUE);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return certs.filter((cert) => {
      if (state !== ALL_FILTER_VALUE && cert.state !== state) return false;
      if (!q) return true;
      const studentName = getStudentName(cert.studentId).toLowerCase();
      return studentName.includes(q) || cert.itemName.toLowerCase().includes(q) || cert.certificateNo.toLowerCase().includes(q);
    });
  }, [certs, search, state]);

  function handleIssue(cert: Certificate) {
    const certificateNo = nextCertificateNo();
    setCerts((prev) =>
      prev.map((c) =>
        c.id === cert.id
          ? { ...c, state: "issued", certificateNo, issuedAt: TODAY, issuedByStaffId: staff?.id }
          : c,
      ),
    );
    toast.success("ออกใบรับรองแล้ว", {
      description: `${certificateNo} · ${getStudentName(cert.studentId)} — ${cert.itemName}`,
    });
  }

  function handleRevoke(cert: Certificate, reason?: string) {
    if (!reason) return;
    setCerts((prev) => (prev.map((c) => (c.id === cert.id ? { ...c, state: "revoked", revokedReason: reason } : c))));
    toast.error("เพิกถอนใบรับรองแล้ว", {
      description: `${cert.certificateNo} · ${getStudentName(cert.studentId)} — บันทึกเหตุผลการเพิกถอนแล้ว`,
    });
  }

  const columns: Column<Certificate>[] = [
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
      truncate: "max-w-[28ch]",
      cell: (row) => (
        <span className="flex max-w-[28ch] items-center gap-2">
          <span className="truncate">{row.itemName}</span>
          <Badge variant="outline" className="shrink-0 text-[var(--ink-muted)]">
            {itemTypeLabel[row.itemType]}
          </Badge>
        </span>
      ),
    },
    {
      key: "grade",
      header: "เกรด",
      align: "end",
      width: "w-16",
      hideOnMobile: true,
      cell: (row) => <span className="font-mono">{getCertificateGrade(row) ?? "—"}</span>,
    },
    {
      key: "certificateNo",
      header: "เลขที่ใบรับรอง",
      width: "w-40",
      hideOnMobile: true,
      cell: (row) => (
        <span className="font-mono text-xs">{row.certificateNo || "—"}</span>
      ),
    },
    {
      key: "state",
      header: "สถานะ",
      width: "w-36",
      cell: (row) => <StatusBadge label={certificateStateLabel[row.state]} tone={certificateStateTone[row.state]} />,
    },
    {
      key: "issuedAt",
      header: "วันที่ออก",
      width: "w-28",
      hideOnMobile: true,
      cell: (row) => (row.issuedAt ? formatThaiDate(row.issuedAt) : "—"),
    },
    {
      key: "issuedBy",
      header: "ออกโดย",
      width: "w-32",
      hideOnMobile: true,
      truncate: "max-w-[18ch]",
      cell: (row) => getIssuerName(row.issuedByStaffId),
    },
    {
      key: "actions",
      header: <span className="sr-only">การดำเนินการ</span>,
      align: "end",
      width: "w-12",
      stickyEnd: true,
      cell: (row) => {
        if (row.state === "revoked") {
          return <span className="text-xs text-[var(--ink-subtle)]">—</span>;
        }
        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="ghost" aria-label={`การดำเนินการสำหรับ ${getStudentName(row.studentId)}`}>
                  <MoreHorizontal aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {row.state === "eligible" ? (
                  <ConfirmDialog
                    trigger={
                      <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                        <ShieldCheck aria-hidden />
                        ออกใบรับรอง
                      </DropdownMenuItem>
                    }
                    title="ยืนยันการออกใบรับรอง"
                    description={`ระบบจะออกใบรับรองให้ ${getStudentName(row.studentId)} สำหรับ ${row.itemName} พร้อมเลขที่ใบรับรองใหม่ และบันทึกว่าท่านเป็นผู้ออก`}
                    confirmLabel="ออกใบรับรอง"
                    onConfirm={() => handleIssue(row)}
                  />
                ) : (
                  <ConfirmDialog
                    trigger={
                      <DropdownMenuItem variant="destructive" onSelect={(event) => event.preventDefault()}>
                        <Undo2 aria-hidden />
                        เพิกถอนใบรับรอง
                      </DropdownMenuItem>
                    }
                    title={`เพิกถอนใบรับรอง ${row.certificateNo}`}
                    description={`ระบบจะเปลี่ยนสถานะใบรับรองของ ${getStudentName(row.studentId)} เป็นเพิกถอน ระบุเหตุผลให้ชัดเจนเพื่อเก็บไว้เป็นหลักฐาน`}
                    confirmLabel="เพิกถอนใบรับรอง"
                    tone="destructive"
                    reason={{
                      label: "เหตุผลที่เพิกถอน",
                      placeholder: "เช่น ออกใบรับรองซ้ำโดยผิดพลาด",
                      required: true,
                    }}
                    onConfirm={(reason) => handleRevoke(row, reason)}
                  />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const filters: ToolbarFilter[] = [
    {
      id: "state",
      label: "สถานะ",
      value: state,
      onChange: setState,
      options: [
        { value: ALL_FILTER_VALUE, label: "ทุกสถานะ" },
        { value: "eligible", label: certificateStateLabel.eligible },
        { value: "issued", label: certificateStateLabel.issued },
        { value: "revoked", label: certificateStateLabel.revoked },
      ],
    },
  ];

  return (
    <>
      <PageHeader
        title="ใบรับรอง"
        description="ผู้เรียนที่มีสิทธิ์ได้รับใบรับรองจากผลการเรียนที่เผยแพร่แล้วและผ่านเกณฑ์ พร้อมใบรับรองที่ออกแล้วและที่เพิกถอนแล้ว"
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหาใบรับรอง"
        searchPlaceholder="ค้นหาผู้เรียน รายการ หรือเลขที่ใบรับรอง"
        filters={filters}
        onReset={() => {
          setSearch("");
          setState(ALL_FILTER_VALUE);
        }}
        resultSummary={`แสดง ${filtered.length} จาก ${certs.length} รายการ`}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        caption="รายการสิทธิ์และใบรับรองของผู้เรียน"
        empty={
          <EmptyState
            icon={BadgeCheck}
            title="ไม่พบรายการที่ตรงกับตัวกรอง"
            description="ลองปรับคำค้นหาหรือตัวกรองสถานะด้านบน — ใบรับรองจะปรากฏที่นี่เมื่อผู้เรียนมีผลการเรียนที่เผยแพร่แล้วและผ่านเกณฑ์"
          />
        }
      />
    </>
  );
}
