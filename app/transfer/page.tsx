import { MemberPageShell } from "@/components/member-page-shell";
import { TransferHub } from "@/components/credit-transfer/transfer-hub";

export default function TransferPage() {
  return (
    <MemberPageShell
      title="เทียบโอนหน่วยกิต"
      description="เลือกประเภทคำขอเทียบโอนที่ตรงกับความต้องการของคุณ และตรวจสอบสถานะคำขอที่ผ่านมา"
      currentNav="transfer"
    >
      <TransferHub recentRequests={[]} />
    </MemberPageShell>
  );
}
