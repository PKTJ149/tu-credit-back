"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatThaiDate } from "@/lib/admin/format";
import { getStaffName } from "@/lib/admin/mock-data";
import { publishStateLabel, publishStateTone, staticPages as initialStaticPages } from "@/lib/admin/mock-pages";
import type { StaticPage } from "@/lib/admin/types";

export default function ContentPagesPage() {
  // Local copy only so this list stays in sync with edits made on the detail
  // screen for the length of this session — nothing here persists on reload.
  const [pages] = useState<StaticPage[]>(initialStaticPages);

  const columns: Column<StaticPage>[] = [
    {
      key: "title",
      header: "หน้า",
      cell: (row) => row.title,
      truncate: "max-w-[32ch]",
    },
    {
      key: "slug",
      header: "slug",
      hideOnMobile: true,
      cell: (row) => <span className="font-mono text-xs text-[var(--ink-muted)]">/{row.slug}</span>,
    },
    {
      key: "sections",
      header: "จำนวนหัวข้อ",
      align: "end",
      width: "w-28",
      cell: (row) => row.sections.length,
    },
    {
      key: "state",
      header: "สถานะ",
      width: "w-32",
      cell: (row) => <StatusBadge label={publishStateLabel[row.state]} tone={publishStateTone[row.state]} />,
    },
    {
      key: "updatedBy",
      header: "แก้ไขล่าสุดโดย",
      hideOnMobile: true,
      truncate: "max-w-[20ch]",
      cell: (row) => getStaffName(row.updatedByStaffId),
    },
    {
      key: "updatedAt",
      header: "แก้ไขเมื่อ",
      align: "end",
      width: "w-28",
      cell: (row) => formatThaiDate(row.updatedAt),
    },
  ];

  return (
    <>
      <PageHeader
        title="หน้าเนื้อหา"
        description="หน้าข้อความล้วนที่เว็บไซต์แสดงผลจากเนื้อหานี้โดยตรง แทนที่จะฝังไว้ในโค้ด"
      />

      <DataTable
        columns={columns}
        rows={pages}
        rowKey={(row) => row.id}
        rowHref={(row) => `/admin/content/pages/${row.id}`}
        caption="หน้าเนื้อหาทั้งหมด"
        empty={
          <EmptyState
            icon={FileText}
            title="ยังไม่มีหน้าเนื้อหาในระบบ"
            description="หน้าเนื้อหาจะปรากฏที่นี่เมื่อถูกสร้างขึ้น"
          />
        }
      />
    </>
  );
}
