"use client";

import { useState } from "react";
import { BellRing, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { useStaffSession } from "@/lib/admin/staff-session";
import { formatThaiDate } from "@/lib/admin/format";
import { notificationTemplates as initialTemplates } from "@/lib/admin/mock-reports";
import type { NotificationTemplate } from "@/lib/admin/types";

export default function NotificationsPage() {
  const { role } = useStaffSession();
  const [templates] = useState<NotificationTemplate[]>(initialTemplates);

  if (role !== "super-admin") {
    return (
      <>
        <PageHeader title="เทมเพลตการแจ้งเตือน" />
        <Panel>
          <EmptyState
            icon={ShieldAlert}
            title="ไม่มีสิทธิ์เข้าถึงหน้านี้"
            description="หน้านี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบสูงสุด หากต้องการแก้ไขเทมเพลตการแจ้งเตือน กรุณาติดต่อผู้ดูแลระบบสูงสุด"
          />
        </Panel>
      </>
    );
  }

  const columns: Column<NotificationTemplate>[] = [
    {
      key: "event",
      header: "เหตุการณ์",
      truncate: "max-w-[28ch]",
      cell: (t) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{t.event}</p>
          <p className="truncate font-mono text-xs text-[var(--ink-subtle)]">{t.key}</p>
        </div>
      ),
    },
    { key: "channels", header: "ช่องทาง", width: "w-40", cell: (t) => t.channels.map((c) => (c === "in-app" ? "แจ้งเตือนในระบบ" : "อีเมล")).join(" · ") },
    { key: "subject", header: "หัวข้อข้อความ", truncate: "max-w-[32ch]", cell: (t) => t.subject, hideOnMobile: true },
    {
      key: "active",
      header: "สถานะ",
      width: "w-28",
      cell: (t) => (t.active ? <StatusBadge label="เปิดใช้งาน" tone="positive" /> : <StatusBadge label="ปิดใช้งาน" tone="neutral" />),
    },
    { key: "updatedAt", header: "แก้ไขล่าสุด", width: "w-28", hideOnMobile: true, cell: (t) => formatThaiDate(t.updatedAt) },
  ];

  return (
    <>
      <PageHeader
        title="เทมเพลตการแจ้งเตือน"
        description="ข้อความเบื้องหลังการแจ้งเตือนอัตโนมัติของระบบ แก้ไขได้โดยไม่ต้องรอปล่อยเวอร์ชันใหม่"
      />

      <DataTable
        columns={columns}
        rows={templates}
        rowKey={(t) => t.id}
        rowHref={(t) => `/admin/notifications/${t.id}`}
        caption="เทมเพลตการแจ้งเตือนทั้งหมด"
        empty={<EmptyState icon={BellRing} title="ยังไม่มีเทมเพลต" description="เทมเพลตการแจ้งเตือนของระบบจะปรากฏที่นี่" />}
      />
    </>
  );
}
