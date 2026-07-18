import { MemberPageShell } from "@/components/member-page-shell";
import { RegistrationReview } from "@/components/learning/registration-review";

export default function RegistrationReviewPage() {
  return (
    <MemberPageShell
      title="ตรวจสอบการลงทะเบียน"
      description="ตรวจสอบรายละเอียดด้านล่างก่อนยืนยันการลงทะเบียน"
      currentNav="learning"
    >
      <RegistrationReview />
    </MemberPageShell>
  );
}
