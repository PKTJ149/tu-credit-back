"use client";

import { useState } from "react";
import { Undo2, Wallet } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TODAY } from "@/lib/admin/mock-data";
import type { AdminPayment } from "@/lib/admin/types";
import { getIssuedRefunds, getRefundEligiblePayments, getStudentDisplay, itemTypeLabel } from "@/lib/admin/mock-payments";
import { formatTHB } from "@/lib/finance/payment-state";
import { formatThaiDate } from "@/lib/admin/format";

/**
 * Two different jobs live on one screen: the ledger of refunds already
 * issued, and the worklist of confirmed payments an officer could still
 * refund. Tabs keep them from blurring into one table an officer has to
 * mentally split by state every time.
 */
export default function RefundsPage() {
  const [eligible, setEligible] = useState<AdminPayment[]>(() => getRefundEligiblePayments());
  const [issued, setIssued] = useState<AdminPayment[]>(() => getIssuedRefunds());

  function handleRefund(payment: AdminPayment, reason?: string) {
    if (!reason) return;
    const refunded: AdminPayment = {
      ...payment,
      state: "payment-refunded",
      refundedAt: TODAY,
      refundReason: reason,
    };
    setEligible((prev) => prev.filter((p) => p.id !== payment.id));
    setIssued((prev) => [refunded, ...prev]);
    toast.success("บันทึกการคืนเงินแล้ว", {
      description: `${payment.reference} · ${formatTHB(payment.amount)}`,
    });
  }

  const eligibleColumns: Column<AdminPayment>[] = [
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
      truncate: "max-w-[26ch]",
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
      key: "reviewedAt",
      header: "วันที่ยืนยันการชำระ",
      cell: (p) => (p.reviewedAt ? formatThaiDate(p.reviewedAt) : "—"),
      hideOnMobile: true,
      width: "w-36",
    },
    {
      key: "action",
      header: "การดำเนินการ",
      width: "w-40",
      cell: (p) => (
        <ConfirmDialog
          trigger={
            <Button size="sm" variant="outline">
              บันทึกการคืนเงิน
            </Button>
          }
          title="บันทึกการคืนเงิน"
          description={`ระบบจะบันทึกว่าคืนเงิน ${formatTHB(p.amount)} ให้กับการชำระเงิน ${p.reference} แล้ว การดำเนินการนี้ย้อนกลับไม่ได้`}
          confirmLabel="ยืนยันการคืนเงิน"
          tone="destructive"
          reason={{
            label: "เหตุผลการคืนเงิน",
            placeholder: "เช่น ผู้เรียนขอยกเลิกก่อนวันเปิดเรียนตามระเบียบคืนเงิน",
            required: true,
            helpText: "เหตุผลนี้จะถูกบันทึกไว้ในประวัติการชำระเงินของผู้เรียน",
          }}
          onConfirm={(reason) => handleRefund(p, reason)}
        />
      ),
    },
  ];

  const issuedColumns: Column<AdminPayment>[] = [
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
      key: "amount",
      header: "จำนวนเงิน",
      cell: (p) => <span className="font-mono">{formatTHB(p.amount)}</span>,
      align: "end",
      width: "w-32",
    },
    {
      key: "refundedAt",
      header: "วันที่คืนเงิน",
      cell: (p) => (p.refundedAt ? formatThaiDate(p.refundedAt) : "—"),
      width: "w-32",
    },
    {
      key: "refundReason",
      header: "เหตุผล",
      cell: (p) => <span className="text-[var(--ink-muted)]">{p.refundReason ?? "—"}</span>,
    },
  ];

  return (
    <>
      <PageHeader
        title="การคืนเงิน"
        description="ติดตามการคืนเงินที่ดำเนินการไปแล้ว และบันทึกการคืนเงินใหม่สำหรับการชำระเงินที่ยืนยันแล้ว"
      />

      <Tabs defaultValue="eligible">
        <TabsList>
          <TabsTrigger value="eligible">รอดำเนินการคืนเงิน ({eligible.length})</TabsTrigger>
          <TabsTrigger value="issued">คืนเงินแล้ว ({issued.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="eligible">
          <Panel flush>
            <div className="p-5">
              <DataTable
                columns={eligibleColumns}
                rows={eligible}
                rowKey={(p) => p.id}
                caption="การชำระเงินที่ยืนยันแล้วและสามารถคืนเงินได้"
                empty={
                  <EmptyState
                    icon={Wallet}
                    title="ไม่มีรายการรอคืนเงิน"
                    description="การชำระเงินที่ยืนยันแล้วและยังไม่ถูกคืนเงินจะปรากฏที่นี่"
                  />
                }
              />
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="issued">
          <Panel flush>
            <div className="p-5">
              <DataTable
                columns={issuedColumns}
                rows={issued}
                rowKey={(p) => p.id}
                caption="ประวัติการคืนเงิน"
                empty={
                  <EmptyState
                    icon={Undo2}
                    title="ยังไม่มีการคืนเงิน"
                    description="เมื่อมีการบันทึกการคืนเงิน รายการจะปรากฏที่นี่พร้อมวันที่และเหตุผล"
                  />
                }
              />
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </>
  );
}
