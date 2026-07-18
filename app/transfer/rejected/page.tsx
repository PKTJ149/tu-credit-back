import { MemberPageShell } from "@/components/member-page-shell";
import { Rejected } from "@/components/credit-transfer/rejected";

export default function TransferRejectedPage() {
  return (
    <MemberPageShell
      title="คำขอเทียบโอนไม่ได้รับการอนุมัติ"
      description="ผลการตรวจสอบคำขอเทียบโอนหน่วยกิตของคุณ"
      currentNav="transfer"
    >
      <Rejected />
    </MemberPageShell>
  );
}
