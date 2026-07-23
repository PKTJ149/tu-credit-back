import { MemberPageShell } from "@/components/member-page-shell";
import { RegistrationConfirmation } from "@/components/finance/registration-confirmation";

export default function RegistrationConfirmationPage() {
  return (
    <MemberPageShell
      title="ยืนยันการลงทะเบียน"
      description="ตรวจสอบผลการลงทะเบียนและขั้นตอนถัดไปของคุณ"
      currentNav="registrations"
    >
      <RegistrationConfirmation />
    </MemberPageShell>
  );
}
