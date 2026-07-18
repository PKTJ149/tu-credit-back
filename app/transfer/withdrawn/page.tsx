import { MemberPageShell } from "@/components/member-page-shell";
import { Withdrawn } from "@/components/credit-transfer/withdrawn";

export default function TransferWithdrawnPage() {
  return (
    <MemberPageShell
      title="คำขอเทียบโอนถูกถอนแล้ว"
      description="คำขอเทียบโอนนี้ถูกถอนออกก่อนการพิจารณาเสร็จสิ้น"
      currentNav="transfer"
    >
      <Withdrawn />
    </MemberPageShell>
  );
}
