import { MemberPageShell } from "@/components/member-page-shell";
import { AcademicProgress } from "@/components/learning/academic-progress";
import type { AcademicRecord } from "@/lib/learning/registration-status";

const records: AcademicRecord[] = [
  {
    id: "a1",
    term: "ภาคเรียนที่ 3/2568",
    itemName: "หลักการตลาดดิจิทัล",
    credits: 3,
    grade: "A",
  },
  {
    id: "a2",
    term: "ภาคเรียนที่ 2/2568",
    itemName: "สถิติเบื้องต้นสำหรับนักวิจัย",
    credits: 3,
    grade: "B+",
  },
  {
    id: "a3",
    term: "ภาคเรียนที่ 1/2568",
    itemName: "การสื่อสารภาษาอังกฤษเพื่อการทำงาน",
    credits: 3,
    grade: "B",
  },
];

export default function AcademicProgressPage() {
  return (
    <MemberPageShell
      title="ผลการเรียน"
      description="ตรวจสอบประวัติการเรียนที่เสร็จสิ้น หน่วยกิตสะสม และผลการเรียนของคุณ"
      currentNav="academic"
    >
      <AcademicProgress records={records} />
    </MemberPageShell>
  );
}
