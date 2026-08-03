import { History, ListChecks, PartyPopper, Receipt, Repeat2, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { formatThaiDate } from "@/lib/admin/format";
import { getOfficerWorklist, getStaffRecentActions, type OfficerTask, type OfficerTaskKind } from "@/lib/admin/mock-dashboard";
import type { AuditEntry, StaffUser } from "@/lib/admin/types";
import { Reveal } from "@/components/admin/motion";

const KIND_ICON: Record<OfficerTaskKind, LucideIcon> = {
  payment: Wallet,
  transfer: Repeat2,
  registration: Receipt,
  waitlist: ListChecks,
};

/**
 * The officer view: a to-do list, not a report. Every row in the worklist
 * below is a real record from `lib/admin/mock-dashboard.ts`'s
 * `getOfficerWorklist`, already ranked so the officer never has to decide
 * what to look at first — overdue transfer cases and overdue registrations
 * outrank everything else, then the longest-waiting payments, then open
 * (not yet overdue) transfer cases, then seats that could be offered.
 */
export function OfficerDashboard({ staff }: { staff: StaffUser }) {
  const worklist = getOfficerWorklist();
  const myActions = getStaffRecentActions(staff.id);
  const urgentCount = worklist.filter((t) => t.urgent).length;

  const headline =
    worklist.length === 0
      ? "ไม่มีงานค้างในวันนี้"
      : `${worklist.length} รายการรอดำเนินการ${urgentCount > 0 ? ` · เร่งด่วน ${urgentCount} รายการ` : ""}`;

  const worklistColumns: Column<OfficerTask>[] = [
    {
      key: "kind",
      header: "ประเภท",
      width: "w-40",
      cell: (t) => {
        const Icon = KIND_ICON[t.kind];
        return (
          <span className="inline-flex items-center gap-1.5 text-[var(--ink-muted)]">
            <Icon className="size-3.5 shrink-0" aria-hidden />
            {t.kindLabel}
          </span>
        );
      },
    },
    {
      key: "title",
      header: "รายการ",
      truncate: "max-w-[22ch]",
      cell: (t) => <span className="font-medium">{t.title}</span>,
    },
    {
      key: "detail",
      header: "รายละเอียด",
      truncate: "max-w-[26ch]",
      hideOnMobile: true,
      cell: (t) => t.detail,
    },
    {
      key: "signal",
      header: "สถานะ",
      align: "end",
      width: "w-40",
      cell: (t) => (
        <span className={t.urgent ? "font-medium text-[var(--destructive)]" : "font-medium text-[var(--primary)]"}>
          {t.signal}
        </span>
      ),
    },
  ];

  const auditColumns: Column<AuditEntry>[] = [
    { key: "action", header: "การดำเนินการ", cell: (a) => a.action },
    { key: "target", header: "รายการ", truncate: "max-w-[24ch]", cell: (a) => a.target },
    { key: "at", header: "วันที่", align: "end", width: "w-28", cell: (a) => formatThaiDate(a.at) },
  ];

  return (
    <>
      <PageHeader title="งานของคุณวันนี้" description={headline} />

      <Reveal index={0}>
      <Panel title="งานที่ต้องทำวันนี้" description="เรียงจากเร่งด่วนที่สุดไปหาน้อยที่สุด" flush>
        <DataTable
          columns={worklistColumns}
          rows={worklist}
          rowKey={(t) => t.id}
          rowHref={(t) => t.href}
          caption="งานที่ต้องดำเนินการวันนี้ เรียงตามลำดับความสำคัญ"
          empty={
            <EmptyState
              icon={PartyPopper}
              title="ไม่มีงานค้างวันนี้"
              description="ไม่มีการชำระเงิน คำขอเทียบโอน หรือคิวรอที่นั่งที่ต้องดำเนินการในตอนนี้"
            />
          }
        />
      </Panel>
      </Reveal>

      <Reveal index={1}>
      <Panel title="การดำเนินการล่าสุดของคุณ" description="สิ่งที่คุณดำเนินการล่าสุดในระบบ" flush>
        <DataTable
          columns={auditColumns}
          rows={myActions}
          rowKey={(a) => a.id}
          caption="การดำเนินการล่าสุดของเจ้าหน้าที่คนนี้"
          empty={
            <EmptyState
              icon={History}
              title="ยังไม่มีการดำเนินการที่บันทึกไว้"
              description="ประวัติการดำเนินการของคุณจะปรากฏที่นี่เมื่อคุณเริ่มดำเนินการ"
            />
          }
        />
      </Panel>
      </Reveal>
    </>
  );
}
