import { PaymentRejected } from "@/components/finance/payment-rejected";

export default function ProfilePaymentRejectedPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">ต้องดำเนินการแก้ไข</h1>
        <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
          ตรวจสอบเหตุผลที่ไม่ผ่านการตรวจสอบและส่งหลักฐานที่แก้ไขแล้ว
        </p>
      </div>
      <PaymentRejected />
    </div>
  );
}
