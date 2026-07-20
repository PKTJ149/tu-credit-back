import { MemberPageShell } from "@/components/member-page-shell";
import { AcademicProgress } from "@/components/learning/academic-progress";
import type { AcademicRecord } from "@/lib/learning/registration-status";

const records: AcademicRecord[] = [];

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
