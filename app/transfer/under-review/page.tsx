import { MemberPageShell } from "@/components/member-page-shell";
import { UnderReview } from "@/components/credit-transfer/under-review";

export default function TransferUnderReviewPage() {
  return (
    <MemberPageShell
      title="เทียบโอนหน่วยกิต"
      description="ติดตามสถานะคำขอเทียบโอนของคุณระหว่างการตรวจสอบของเจ้าหน้าที่"
      currentNav="transfer"
    >
      <UnderReview />
    </MemberPageShell>
  );
}
