import { MemberPageShell } from "@/components/member-page-shell";
import { ReviewRequest } from "@/components/credit-transfer/review-request";

export default function TransferReviewPage() {
  return (
    <MemberPageShell
      title="ตรวจทานคำขอเทียบโอน"
      description="ตรวจสอบรายละเอียดทั้งหมดก่อนส่งคำขอเทียบโอน"
      currentNav="transfer"
    >
      <ReviewRequest />
    </MemberPageShell>
  );
}
