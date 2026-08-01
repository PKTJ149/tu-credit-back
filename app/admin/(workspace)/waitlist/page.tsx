"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ListChecks } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { getStudentById, getStudentName, waitlistEntries as initialWaitlistEntries } from "@/lib/admin/mock-data";
import {
  ITEM_TYPE_LABEL,
  WAITLIST_STATUS_LABEL,
  formatThaiDate,
  getWaitlistGroups,
  waitlistStatusTone,
} from "@/lib/admin/mock-registrations";
import type { WaitlistEntry } from "@/lib/admin/types";

/** Seats offered give the student this many days to accept before the offer
 *  lapses back to the next person in the queue. */
const OFFER_WINDOW_DAYS = 3;

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>(initialWaitlistEntries);

  const groups = useMemo(() => getWaitlistGroups(entries), [entries]);
  const waitingCount = entries.filter((e) => e.status === "waiting").length;

  function handleOfferSeat(entry: WaitlistEntry) {
    setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, status: "seat-offered" } : e)));
    toast.success(`เสนอที่นั่งให้ ${getStudentName(entry.studentId)} แล้ว`, {
      description: `${entry.itemName} · ต้องตอบรับภายใน ${OFFER_WINDOW_DAYS} วัน มิฉะนั้นสิทธิ์จะตกไปยังคิวถัดไป`,
    });
  }

  const waitlistColumns: Column<WaitlistEntry>[] = [
    {
      key: "position",
      header: "ลำดับคิว",
      width: "w-20",
      align: "end",
      cell: (row) => <span className="font-mono">{row.position}</span>,
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
      key: "requestedAt",
      header: "วันที่ขอเข้าคิว",
      hideOnMobile: true,
      cell: (row) => formatThaiDate(row.requestedAt),
    },
    {
      key: "status",
      header: "สถานะ",
      cell: (row) => <StatusBadge label={WAITLIST_STATUS_LABEL[row.status]} tone={waitlistStatusTone[row.status]} />,
    },
    {
      key: "actions",
      header: "การดำเนินการ",
      align: "end",
      width: "w-40",
      cell: (row) => {
        if (row.status !== "waiting") {
          return <span className="text-xs text-[var(--ink-subtle)]">—</span>;
        }
        return (
          <ConfirmDialog
            trigger={
              <Button size="sm" variant="outline" className="h-8">
                เสนอที่นั่ง
              </Button>
            }
            title={`เสนอที่นั่งให้ ${getStudentName(row.studentId)}`}
            description={`ระบบจะแจ้งเตือนผู้เรียนทันทีว่ามีที่นั่งว่างสำหรับ "${row.itemName}" และผู้เรียนมีเวลา ${OFFER_WINDOW_DAYS} วันในการตอบรับ หากไม่ตอบรับภายในเวลาที่กำหนด สิทธิ์จะตกไปยังผู้ที่รอคิวถัดไปโดยอัตโนมัติ`}
            confirmLabel="ยืนยันเสนอที่นั่ง"
            onConfirm={() => handleOfferSeat(row)}
          />
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="รายชื่อรอที่นั่ง"
        description={
          waitingCount > 0
            ? `มีผู้เรียน ${waitingCount} คนกำลังรอที่นั่งอยู่ในขณะนี้ จัดกลุ่มตามรายการที่รอ`
            : "ไม่มีผู้เรียนรอที่นั่งในขณะนี้"
        }
      />

      {groups.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="ไม่มีรายการรอที่นั่ง"
          description="เมื่อรายวิชาหรือหลักสูตรใดเต็มที่นั่ง ผู้เรียนที่ลงทะเบียนต่อจะปรากฏในคิวรอที่นี่โดยอัตโนมัติ"
        />
      ) : (
        groups.map((group) => (
          <Panel
            key={group.itemId}
            title={group.itemName}
            description={`${ITEM_TYPE_LABEL[group.itemType]} · มีผู้รอที่นั่ง ${group.entries.length} คน`}
            flush
          >
            <DataTable
              columns={waitlistColumns}
              rows={group.entries}
              rowKey={(row) => row.id}
              caption={`รายชื่อรอที่นั่งสำหรับ ${group.itemName}`}
              empty={
                <EmptyState icon={ListChecks} title="ไม่มีผู้รอที่นั่ง" description="รายการนี้ไม่มีผู้เรียนอยู่ในคิวแล้ว" />
              }
            />
          </Panel>
        ))
      )}
    </>
  );
}
