import { MemberPageShell } from "@/components/member-page-shell";
import { RegistrationConfirmation } from "@/components/finance/registration-confirmation";

export default function RegistrationConfirmationPage() {
  return (
    <MemberPageShell
      title="ยืนยันการลงทะเบียน"
      description="ตรวจสอบผลการลงทะเบียนและขั้นตอนถัดไปของคุณ"
      currentNav="registrations"
    >
      <RegistrationConfirmation
        paymentRequired={true}
        registeredItem={{
          name: "รายวิชา: การเขียนโปรแกรมเบื้องต้น (ภาคเรียนที่ 1/2569)",
          amount: 3500,
        }}
      />
    </MemberPageShell>
  );
}
