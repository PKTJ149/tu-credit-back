import { MemberPageShell } from "@/components/member-page-shell";
import { DecisionView } from "@/components/learning/decision-view";

export default function LearningDecisionPage() {
  return (
    <MemberPageShell
      title="พิจารณาตัวเลือกการเรียนนี้"
      description="ตรวจสอบรายละเอียดด้านล่างเพื่อดูว่าตัวเลือกนี้เหมาะกับก้าวถัดไปของคุณหรือไม่"
      currentNav="learning"
    >
      <DecisionView />
    </MemberPageShell>
  );
}
