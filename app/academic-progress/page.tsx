import { MemberPageShell } from "@/components/member-page-shell";
import { AcademicProgress } from "@/components/learning/academic-progress";

export default function AcademicProgressPage() {
  return (
    <MemberPageShell
      title="ผลการเรียน"
      description="ตรวจสอบประวัติการเรียนที่เสร็จสิ้น หน่วยกิตสะสม และผลการเรียนของคุณ"
      currentNav="academic"
    >
      <AcademicProgress />
    </MemberPageShell>
  );
}
