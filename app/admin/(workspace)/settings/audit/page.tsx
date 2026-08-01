"use client";

import { useMemo, useState } from "react";
import { History, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE, type ToolbarFilter } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStaffSession } from "@/lib/admin/staff-session";
import { getStaffName } from "@/lib/admin/mock-data";
import { formatThaiDate } from "@/lib/admin/format";
import { AUDIT_CATEGORY_LABEL, auditEntries, classifyAuditAction, type AuditActionCategory } from "@/lib/admin/mock-settings";
import type { AuditEntry } from "@/lib/admin/types";

const CATEGORY_ORDER: AuditActionCategory[] = ["payment", "transfer", "staff", "grade", "content"];

function AuditLogViewer() {
  const [search, setSearch] = useState("");
  const [actorFilter, setActorFilter] = useState(ALL_FILTER_VALUE);
  const [categoryFilter, setCategoryFilter] = useState(ALL_FILTER_VALUE);

  const actorOptions = useMemo(() => {
    const ids = Array.from(new Set(auditEntries.map((e) => e.staffId)));
    return ids
      .map((id) => ({ value: id, label: getStaffName(id) }))
      .sort((a, b) => a.label.localeCompare(b.label, "th"));
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return auditEntries.filter((entry) => {
      if (actorFilter !== ALL_FILTER_VALUE && entry.staffId !== actorFilter) return false;
      if (categoryFilter !== ALL_FILTER_VALUE && classifyAuditAction(entry.action) !== categoryFilter) return false;
      if (!query) return true;
      return entry.target.toLowerCase().includes(query);
    });
  }, [search, actorFilter, categoryFilter]);

  function resetFilters() {
    setSearch("");
    setActorFilter(ALL_FILTER_VALUE);
    setCategoryFilter(ALL_FILTER_VALUE);
  }

  const filters: ToolbarFilter[] = [
    {
      id: "actor",
      label: "ผู้ดำเนินการ",
      value: actorFilter,
      options: [{ value: ALL_FILTER_VALUE, label: "ทุกคน" }, ...actorOptions],
      onChange: setActorFilter,
    },
    {
      id: "category",
      label: "ประเภทการดำเนินการ",
      value: categoryFilter,
      options: [
        { value: ALL_FILTER_VALUE, label: "ทุกประเภท" },
        ...CATEGORY_ORDER.map((c) => ({ value: c, label: AUDIT_CATEGORY_LABEL[c] })),
      ],
      onChange: setCategoryFilter,
    },
  ];

  const columns: Column<AuditEntry>[] = [
    {
      key: "at",
      header: "วันที่",
      width: "w-28",
      cell: (row) => formatThaiDate(row.at),
    },
    {
      key: "staff",
      header: "ผู้ดำเนินการ",
      truncate: "max-w-[20ch]",
      cell: (row) => getStaffName(row.staffId),
    },
    {
      key: "category",
      header: "ประเภท",
      width: "w-40",
      cell: (row) => (
        <Badge variant="outline" className="text-[var(--ink-muted)]">
          {AUDIT_CATEGORY_LABEL[classifyAuditAction(row.action)]}
        </Badge>
      ),
    },
    {
      key: "action",
      header: "การดำเนินการ",
      truncate: "max-w-[28ch]",
      cell: (row) => row.action,
    },
    {
      key: "target",
      header: "เป้าหมาย",
      truncate: "max-w-[26ch]",
      cell: (row) => row.target,
    },
  ];

  return (
    <>
      <PageHeader
        title="บันทึกการใช้งาน"
        description="ประวัติการดำเนินการทั้งหมดของเจ้าหน้าที่ในระบบ เรียงจากล่าสุดไปเก่าสุด หน้านี้เป็นข้อมูลอ่านอย่างเดียว — ไม่มีการแก้ไขหรือลบรายการใดได้ เพราะบันทึกการใช้งานที่แก้ไขได้ย่อมไม่ใช่บันทึกที่น่าเชื่อถืออีกต่อไป"
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหาเป้าหมาย"
        searchPlaceholder="ค้นหาเลขที่อ้างอิงหรือชื่อเป้าหมาย"
        filters={filters}
        onReset={resetFilters}
        resultSummary={`แสดง ${filtered.length} จาก ${auditEntries.length} รายการ`}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        caption="บันทึกการใช้งานทั้งหมด"
        empty={
          <EmptyState
            icon={History}
            title="ไม่พบรายการที่ตรงกับตัวกรองนี้"
            description="ลองล้างตัวกรองหรือค้นหาด้วยคำอื่น"
          />
        }
      />
    </>
  );
}

/** The audit trail covers every account, payment, and content change back
 *  office staff can make — visibility into it is restricted the same way. */
export default function AuditLogPage() {
  const { role } = useStaffSession();

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader title="บันทึกการใช้งาน" />
        <Panel>
          <EmptyState
            icon={ShieldAlert}
            title="ไม่มีสิทธิ์เข้าถึงหน้านี้"
            description="หน้านี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบสูงสุด หากต้องการตรวจสอบบันทึกการใช้งาน กรุณาติดต่อผู้ดูแลระบบสูงสุด"
          />
        </Panel>
      </>
    );
  }

  return <AuditLogViewer />;
}
