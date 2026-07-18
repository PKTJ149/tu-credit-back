import { MemberPageShell } from "@/components/member-page-shell";
import { SubmissionConfirmation } from "@/components/credit-transfer/submission-confirmation";

export default function TransferConfirmationPage() {
  return (
    <MemberPageShell
      title="ส่งคำขอเทียบโอนเรียบร้อยแล้ว"
      description="ตรวจสอบสรุปข้อมูลคำขอและขั้นตอนถัดไปก่อนการตรวจสอบจะเริ่มขึ้น"
      currentNav="transfer"
    >
      <SubmissionConfirmation />
    </MemberPageShell>
  );
}
