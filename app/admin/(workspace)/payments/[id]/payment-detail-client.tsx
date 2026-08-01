"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/page-header";
import { Panel, DetailList } from "@/components/admin/detail-panel";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { PaymentStatusBadge, RegistrationStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { getStaffName, getStudentById, TODAY } from "@/lib/admin/mock-data";
import type { AdminPayment } from "@/lib/admin/types";
import { paymentMethodLabel } from "@/lib/admin/types";
import { getRegistrationForPayment, itemTypeLabel } from "@/lib/admin/mock-payments";
import { formatTHB } from "@/lib/finance/payment-state";
import { useStaffSession } from "@/lib/admin/staff-session";
import { formatThaiDate } from "@/lib/admin/format";

type PaymentDetailClientProps = {
  initialPayment: AdminPayment;
};

export function PaymentDetailClient({ initialPayment }: PaymentDetailClientProps) {
  const { staff } = useStaffSession();
  const [payment, setPayment] = useState(initialPayment);
  const [slipError, setSlipError] = useState(false);

  const student = getStudentById(payment.studentId);
  const registration = getRegistrationForPayment(payment.id);
  const canDecide = payment.state === "pending-verification";
  const hasReviewHistory = Boolean(payment.reviewedByStaffId || payment.refundedAt);

  function handleApprove() {
    setPayment((prev) => ({
      ...prev,
      state: "payment-confirmed",
      reviewedByStaffId: staff?.id,
      reviewedAt: TODAY,
    }));
    toast.success("อนุมัติการชำระเงินแล้ว", {
      description: `${payment.reference} · ${formatTHB(payment.amount)}`,
    });
  }

  function handleReject(reason?: string) {
    if (!reason) return;
    setPayment((prev) => ({
      ...prev,
      state: "payment-rejected",
      reviewedByStaffId: staff?.id,
      reviewedAt: TODAY,
      rejectionReason: reason,
    }));
    toast.error("ปฏิเสธการชำระเงินแล้ว", {
      description: `${payment.reference} — ผู้เรียนจะเห็นเหตุผลที่ระบุ`,
    });
  }

  return (
    <>
      <PageHeader
        title={`การชำระเงิน ${payment.reference}`}
        description={`${itemTypeLabel[payment.itemType]} · ${payment.itemName}`}
        backHref="/admin/payments"
        backLabel="กลับไปยังคิวรออนุมัติ"
        actions={
          canDecide ? (
            <>
              <ConfirmDialog
                trigger={<Button size="sm">อนุมัติ</Button>}
                title="ยืนยันการอนุมัติการชำระเงิน"
                description={`ระบบจะบันทึกว่าอนุมัติการชำระเงิน ${payment.reference} จำนวน ${formatTHB(
                  payment.amount,
                )} ผู้เรียนจะเห็นสถานะนี้ทันที`}
                confirmLabel="อนุมัติ"
                onConfirm={handleApprove}
              />
              <ConfirmDialog
                trigger={
                  <Button size="sm" variant="destructive">
                    ปฏิเสธ
                  </Button>
                }
                title="ปฏิเสธการชำระเงิน"
                description="ระบุเหตุผลที่ปฏิเสธให้ชัดเจน ผู้เรียนจะเห็นข้อความนี้และต้องแก้ไขก่อนส่งหลักฐานใหม่"
                confirmLabel="ปฏิเสธการชำระเงิน"
                tone="destructive"
                reason={{
                  label: "เหตุผลที่ปฏิเสธ",
                  placeholder: "เช่น ยอดเงินในสลิปไม่ตรงกับยอดที่ต้องชำระ",
                  required: true,
                  helpText: "ผู้เรียนจะเห็นข้อความนี้ในหน้าสถานะการชำระเงินของตนเอง",
                }}
                onConfirm={handleReject}
              />
            </>
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Panel
            title="รายละเอียดการชำระเงิน"
            description="ยอดที่ต้องชำระคือยอดอ้างอิงหลัก ตรวจสอบให้ตรงกับตัวเลขที่ปรากฏในสลิปก่อนอนุมัติ"
          >
            <DetailList
              rows={[
                { label: "ยอดที่ต้องชำระ", value: <span className="font-mono text-base font-semibold">{formatTHB(payment.amount)}</span> },
                { label: "สถานะ", value: <PaymentStatusBadge state={payment.state} /> },
                { label: "ช่องทางการชำระเงิน", value: paymentMethodLabel[payment.method] },
                { label: "วันที่ครบกำหนดชำระ", value: formatThaiDate(payment.dueDate) },
                { label: "วันที่ส่งหลักฐาน", value: payment.submittedAt ? formatThaiDate(payment.submittedAt) : "ยังไม่ส่งหลักฐาน" },
                ...(payment.slipNote
                  ? [{ label: "หมายเหตุจากผู้เรียน", value: payment.slipNote, full: true }]
                  : []),
              ]}
            />
          </Panel>

          <Panel title="ข้อมูลผู้เรียน">
            {student ? (
              <DetailList
                rows={[
                  {
                    label: "ชื่อ-นามสกุล",
                    value: (
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="font-medium text-[var(--primary)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      >
                        {student.name}
                      </Link>
                    ),
                  },
                  { label: "รหัสผู้เรียน", value: <span className="font-mono">{student.studentCode}</span> },
                  { label: "คณะ", value: student.faculty },
                  { label: "ระดับการศึกษา", value: student.educationLevel },
                  { label: "อีเมล", value: student.email },
                  { label: "เบอร์โทรศัพท์", value: <span className="font-mono">{student.phone}</span> },
                ]}
              />
            ) : (
              <p className="text-sm text-[var(--ink-muted)]">ไม่พบข้อมูลผู้เรียนรายนี้</p>
            )}
          </Panel>

          {registration ? (
            <Panel title="รายการลงทะเบียนที่เกี่ยวข้อง">
              <DetailList
                rows={[
                  { label: "เลขที่อ้างอิง", value: <span className="font-mono">{registration.reference}</span> },
                  { label: "รายการ", value: `${registration.itemName} (${itemTypeLabel[registration.itemType]})` },
                  { label: "ภาคการศึกษา", value: registration.term },
                  { label: "หน่วยกิต", value: registration.credits },
                  { label: "สถานะการลงทะเบียน", value: <RegistrationStatusBadge status={registration.status} /> },
                ]}
              />
            </Panel>
          ) : null}

          {hasReviewHistory ? (
            <Panel title="ประวัติการตรวจสอบ">
              <DetailList
                rows={[
                  ...(payment.reviewedByStaffId
                    ? [
                        {
                          label: payment.state === "payment-rejected" ? "ปฏิเสธโดย" : "ตรวจสอบโดย",
                          value: getStaffName(payment.reviewedByStaffId),
                        },
                        { label: "วันที่ตัดสิน", value: payment.reviewedAt ? formatThaiDate(payment.reviewedAt) : "—" },
                      ]
                    : []),
                  ...(payment.rejectionReason
                    ? [{ label: "เหตุผลที่ปฏิเสธ", value: payment.rejectionReason, full: true }]
                    : []),
                  ...(payment.refundedAt
                    ? [
                        { label: "วันที่คืนเงิน", value: formatThaiDate(payment.refundedAt) },
                        { label: "เหตุผลการคืนเงิน", value: payment.refundReason ?? "—", full: true },
                      ]
                    : []),
                ]}
              />
            </Panel>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <Panel
            title="สลิปการชำระเงิน"
            description="ภาพหลักฐานที่ผู้เรียนแนบมาพร้อมการชำระเงินนี้"
          >
            {payment.slipUrl && !slipError ? (
              <div
                className="relative w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]"
                style={{ aspectRatio: "9 / 16" }}
              >
                <Image
                  src={payment.slipUrl}
                  alt={`ภาพสลิปการชำระเงิน ${payment.reference}`}
                  fill
                  unoptimized
                  className="object-cover"
                  onError={() => setSlipError(true)}
                />
              </div>
            ) : (
              <div
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 text-center"
                style={{ aspectRatio: "9 / 16" }}
              >
                <ImageOff className="size-6 text-[var(--ink-subtle)]" aria-hidden />
                <p className="text-xs leading-5 text-[var(--ink-subtle)]">
                  ภาพจำลอง — ยังไม่มีไฟล์สลิปตัวอย่างในระบบนี้
                </p>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
