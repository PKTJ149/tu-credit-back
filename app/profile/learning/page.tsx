import { LearningGoals } from "@/components/learning/learning-goals";

export default function LearningPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">เป้าหมายการเรียนรู้</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          กำหนดและติดตามเส้นทางการเรียนรู้ของคุณ
        </p>
      </div>
      <LearningGoals hasGoal={false} />
    </div>
  );
}
