import { MemberPageShell } from "@/components/member-page-shell";
import { MyRegistrations } from "@/components/learning/my-registrations";
import type { Registration } from "@/lib/learning/registration-status";

const registrations: Registration[] = [
  {
    id: "r1",
    itemName: "การเขียนโปรแกรมเบื้องต้น",
    itemType: "subject",
    term: "ภาคเรียนที่ 1/2569",
    status: "awaiting-payment",
  },
  {
    id: "r2",
    itemName: "สถิติเบื้องต้นสำหรับนักวิจัย",
    itemType: "subject",
    term: "ภาคเรียนที่ 2/2568",
    status: "active",
  },
  {
    id: "r3",
    itemName: "หลักการตลาดดิจิทัล",
    itemType: "subject",
    term: "ภาคเรียนที่ 3/2568",
    status: "completed",
  },
];

export default function RegistrationsPage() {
  return (
    <MemberPageShell
      title="การลงทะเบียนของฉัน"
      description="ตรวจสอบการลงทะเบียนที่กำลังดำเนินการและล่าสุดของคุณ"
      currentNav="registrations"
    >
      <MyRegistrations registrations={registrations} />
    </MemberPageShell>
  );
}
