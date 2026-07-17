import { MemberPageShell } from "@/components/member-page-shell";
import { SubmitProofForm } from "@/components/finance/submit-proof-form";

export default function SubmitProofPage() {
  return (
    <MemberPageShell
      title="ส่งหลักฐานการชำระเงิน"
      description="แนบหลักฐานการชำระเงินและกรอกรายละเอียดที่จำเป็นด้านล่าง"
      currentNav="finance"
    >
      <SubmitProofForm />
    </MemberPageShell>
  );
}
