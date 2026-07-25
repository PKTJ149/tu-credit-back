import { PaymentInstructions } from "@/components/finance/payment-instructions";

export default function ProfilePaymentInstructionsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">วิธีการชำระเงิน</h1>
        <p className="mt-1 text-sm leading-7 text-[var(--ink-muted)]">
          ใช้รายละเอียดด้านล่างเพื่อชำระเงิน จากนั้นส่งหลักฐานการชำระเพื่อดำเนินการต่อ
        </p>
      </div>
      <PaymentInstructions />
    </div>
  );
}
