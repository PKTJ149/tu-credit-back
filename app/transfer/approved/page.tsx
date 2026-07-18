import { MemberPageShell } from "@/components/member-page-shell";
import { Approved } from "@/components/credit-transfer/approved";

export default function TransferApprovedPage() {
  return (
    <MemberPageShell
      title="คำขอเทียบโอนได้รับการอนุมัติแล้ว"
      description="ตรวจสอบผลการอนุมัติและขั้นตอนถัดไปของคุณได้ที่นี่"
      currentNav="transfer"
    >
      <Approved />
    </MemberPageShell>
  );
}
