import { MemberPageShell } from "@/components/member-page-shell";
import { PaymentConfirmed } from "@/components/finance/payment-confirmed";

export default function PaymentConfirmedPage() {
  return (
    <MemberPageShell
      title="ยืนยันการชำระเงินแล้ว"
      description="ตรวจสอบสรุปการชำระเงินและดาวน์โหลดเอกสารทางการเงินของคุณ"
      currentNav="finance"
    >
      <PaymentConfirmed />
    </MemberPageShell>
  );
}
