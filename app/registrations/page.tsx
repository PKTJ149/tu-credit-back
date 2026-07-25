import { MemberPageShell } from "@/components/member-page-shell";
import { MyRegistrations } from "@/components/learning/my-registrations";

export default function RegistrationsPage() {
  return (
    <MemberPageShell
      title="รายการลงทะเบียนเรียนของฉัน"
      description="ตรวจสอบรายการลงทะเบียนเรียนที่กำลังดำเนินการและล่าสุดของคุณ"
      currentNav="registrations"
    >
      <MyRegistrations />
    </MemberPageShell>
  );
}
