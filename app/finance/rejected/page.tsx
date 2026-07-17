import { MemberPageShell } from "@/components/member-page-shell";
import { PaymentRejected } from "@/components/finance/payment-rejected";

export default function PaymentRejectedPage() {
  return (
    <MemberPageShell
      title="ต้องดำเนินการแก้ไข"
      description="ตรวจสอบเหตุผลที่ไม่ผ่านการตรวจสอบและส่งหลักฐานที่แก้ไขแล้ว"
      currentNav="finance"
    >
      <PaymentRejected />
    </MemberPageShell>
  );
}
