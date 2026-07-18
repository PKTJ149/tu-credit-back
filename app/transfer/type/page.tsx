import { MemberPageShell } from "@/components/member-page-shell";
import { TransferTypeSelection } from "@/components/credit-transfer/transfer-type-selection";

export default function TransferTypePage() {
  return (
    <MemberPageShell
      title="เลือกประเภทการเทียบโอน"
      description="ยืนยันทิศทางคำขอให้ถูกต้องก่อนกรอกรายละเอียด"
      currentNav="transfer"
    >
      <TransferTypeSelection />
    </MemberPageShell>
  );
}
