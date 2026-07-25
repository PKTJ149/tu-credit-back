import { MemberPageShell } from "@/components/member-page-shell";
import { RegistrationConfirmation } from "@/components/finance/registration-confirmation";

export default function RegistrationConfirmationPage() {
  return (
    <MemberPageShell
      title="ยืนยันการลงทะเบียนเรียน"
      description="ตรวจสอบรายวิชา หน่วยกิต และค่าใช้จ่ายก่อนยืนยันการลงทะเบียนเรียน"
      currentNav="registrations"
    >
      <RegistrationConfirmation />
    </MemberPageShell>
  );
}
