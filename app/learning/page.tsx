import { MemberPageShell } from "@/components/member-page-shell";
import { LearningGoals } from "@/components/learning/learning-goals";

export default function LearningPage() {
  return (
    <MemberPageShell
      title="เป้าหมายการเรียนรู้"
      description="ติดตามความคืบหน้าตามหลักสูตรเป้าหมาย ดูช่องว่างหน่วยกิต และวางแผนรายวิชาถัดไป"
      currentNav="learning"
    >
      <LearningGoals />
    </MemberPageShell>
  );
}
