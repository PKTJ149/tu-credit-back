import { MemberPageShell } from "@/components/member-page-shell";
import { PaymentInstructions } from "@/components/finance/payment-instructions";

export default function PaymentInstructionsPage() {
  return (
    <MemberPageShell
      title="วิธีการชำระเงิน"
      description="ใช้รายละเอียดด้านล่างเพื่อชำระเงิน จากนั้นส่งหลักฐานการชำระเพื่อดำเนินการต่อ"
      currentNav="finance"
    >
      <PaymentInstructions />
    </MemberPageShell>
  );
}
