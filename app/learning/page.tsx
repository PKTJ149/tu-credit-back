import { MemberPageShell } from "@/components/member-page-shell";
import { LearningGoals } from "@/components/learning/learning-goals";

export default function LearningPage() {
  return (
    <MemberPageShell
      title="เป้าหมายการเรียนรู้"
      description="สำรวจแนวทางการเรียนรู้ที่แนะนำ ติดตามความก้าวหน้า และตัดสินใจว่าจะเรียนอะไรต่อไป"
      currentNav="learning"
    >
      <LearningGoals />
    </MemberPageShell>
  );
}
