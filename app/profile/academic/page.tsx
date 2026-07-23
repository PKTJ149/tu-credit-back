import { AcademicProgress } from "@/components/learning/academic-progress";

export default function AcademicPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">ผลการเรียน</h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          ดูผลการเรียนและความก้าวหน้าในการสะสมหน่วยกิตของคุณ
        </p>
      </div>
      <AcademicProgress />
    </div>
  );
}
