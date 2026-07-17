import { MemberPageShell } from "@/components/member-page-shell";
import { PendingVerification } from "@/components/finance/pending-verification";

export default function PendingVerificationPage() {
  return (
    <MemberPageShell
      title="รอการตรวจสอบ"
      description="ตรวจสอบสถานะหลักฐานการชำระเงินที่คุณส่งไปล่าสุด"
      currentNav="finance"
    >
      <PendingVerification />
    </MemberPageShell>
  );
}
