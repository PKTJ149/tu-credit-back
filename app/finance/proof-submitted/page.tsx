import { MemberPageShell } from "@/components/member-page-shell";
import { ProofSubmitted } from "@/components/finance/proof-submitted";

export default function ProofSubmittedPage() {
  return (
    <MemberPageShell
      title="ส่งหลักฐานการชำระเงินแล้ว"
      description="ตรวจสอบสรุปข้อมูลที่ส่งและขั้นตอนถัดไปก่อนการตรวจสอบจะเริ่มขึ้น"
      currentNav="finance"
    >
      <ProofSubmitted />
    </MemberPageShell>
  );
}
