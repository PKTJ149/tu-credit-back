import { PaymentConfirmed } from "@/components/finance/payment-confirmed";

export default function ProfilePaymentConfirmedPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          ยืนยันการชำระเงินแล้ว
        </h1>
        <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
          ตรวจสอบสรุปการชำระเงินและดาวน์โหลดเอกสารทางการเงินของคุณ
        </p>
      </div>
      <PaymentConfirmed />
    </div>
  );
}
